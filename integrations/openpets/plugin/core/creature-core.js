import { SimulationClock } from "./clock.js";
import {
  clamp01,
  createEnvironment,
  createInitialDrives,
  createPersonality,
  validateDrives,
  validatePersonality,
} from "./models.js";
import { BEHAVIOR_DEFINITIONS, BehaviorScorer, BehaviorSelector } from "./behavior.js";
import { SeededRng, normalizeSeed } from "./seeded-rng.js";
import { deserializeSnapshot, SNAPSHOT_SCHEMA_VERSION, serializeSnapshot } from "./persistence.js";
import { BehaviorIntent, InteractionResponseIntent } from "./intent.js";
import { normalizeInteractionEvent } from "./interaction.js";
import {
  decayHabit as decayTimeHabit,
  reinforceAttentionHabit,
  timeHabitForScoring,
  validateHabit,
} from "./habit.js";
import {
  BOND_LEARNING_RATE,
  createInitialRelationship,
  decayRelationship,
  relationshipForScoring,
  validateRelationship,
} from "./relationship.js";

export class CreatureCore {
  constructor({
    creatureId,
    createdAt = 0,
    simulationTimestamp = createdAt,
    personality,
    drives = createInitialDrives(),
    rngState,
    currentBehavior = null,
    relationship,
    habit,
    selector = new BehaviorSelector(),
    scorer = new BehaviorScorer(),
  }) {
    this.creatureId = String(creatureId);
    this.createdAt = assertNonNegative(createdAt, "createdAt");
    this.clock = new SimulationClock(assertNonNegative(simulationTimestamp, "simulationTimestamp"));
    this.personality = validatePersonality(personality);
    this.drives = validateDrives(drives);
    this.rng = new SeededRng(rngState ?? 1);
    this.currentBehavior = currentBehavior ? clone(currentBehavior) : null;
    this.relationship = validateRelationship(relationship, this.clock.now());
    this.habit = validateHabit(habit, this.clock.now());
    this.selector = selector;
    this.scorer = scorer;
    this.lastEnvironment = createEnvironment();
  }

  static create({ seed = 1, creatureId, createdAt = 0 } = {}) {
    const normalizedSeed = normalizeSeed(seed);
    return new CreatureCore({
      creatureId: creatureId ?? `creature-${normalizedSeed.toString(16).padStart(8, "0")}`,
      createdAt,
      simulationTimestamp: createdAt,
      personality: createPersonality(normalizedSeed),
      rngState: normalizedSeed ^ 0xa5a5a5a5,
    });
  }

  advance(seconds, environmentInput = this.lastEnvironment, { collectIntents = true } = {}) {
    assertNonNegative(seconds, "seconds");
    this.decayRelationship();
    this.decayHabit();
    const events = [];
    let remaining = seconds;

    if (!this.currentBehavior) {
      const environment = resolveEnvironment(environmentInput, this.clock.now());
      this.lastEnvironment = environment;
      const intent = this.commitBehavior(environment);
      if (collectIntents) events.push(intent);
    }

    while (remaining > 0) {
      const now = this.clock.now();
      const environment = resolveEnvironment(environmentInput, now);
      this.lastEnvironment = environment;
      const end = this.currentBehavior?.endsAt ?? now;
      const segment = Math.min(remaining, Math.max(0, end - now));

      if (segment > 0) {
        this.evolveDrives(segment, environment);
        this.clock.advance(segment);
        this.decayRelationship();
        this.decayHabit();
        remaining -= segment;
      }

      if (this.currentBehavior && this.clock.now() >= this.currentBehavior.endsAt - 1e-9) {
        this.currentBehavior = null;
        if (remaining > 0) {
          const nextEnvironment = resolveEnvironment(environmentInput, this.clock.now());
          const intent = this.commitBehavior(nextEnvironment);
          if (collectIntents) events.push(intent);
        }
      } else if (segment === 0) {
        throw new Error("CreatureCore could not advance; behavior timing is invalid.");
      }
    }

    return events;
  }

  reconcileElapsed(seconds, environmentInput = this.lastEnvironment) {
    return this.advance(seconds, environmentInput, { collectIntents: false });
  }

  currentIntent() {
    if (!this.currentBehavior) return null;
    return new BehaviorIntent({
      time: this.clock.now(),
      action: this.currentBehavior.action,
      duration: Math.max(0, this.currentBehavior.endsAt - this.clock.now()),
      reason: this.currentBehavior.reason,
      score: this.currentBehavior.score,
      scoreBreakdown: clone(this.currentBehavior.scoreBreakdown),
      interruptible: this.currentBehavior.interruptible,
    });
  }

  evaluate(environmentInput = this.lastEnvironment) {
    const environment = resolveEnvironment(environmentInput, this.clock.now());
    this.lastEnvironment = environment;
    const candidates = this.scorer.scoreAll({
      drives: this.drives,
      personality: this.personality,
      environment,
      relationship: this.relationshipForScoring(),
      habit: this.habitForScoring(environment),
    });
    return {
      simulationTime: this.clock.now(),
      candidates,
      selectedAction: this.currentBehavior?.action ?? null,
    };
  }

  diagnosticSnapshot(environmentInput = this.lastEnvironment) {
    const environment = resolveEnvironment(environmentInput, this.clock.now());
    const evaluation = this.evaluate(environment);
    return {
      creatureId: this.creatureId,
      simulationTime: this.clock.now(),
      personality: clone(this.personality),
      drives: clone(this.drives),
      currentBehavior: clone(this.currentBehavior),
      behaviorDurationRemaining: this.currentBehavior
        ? Math.max(0, this.currentBehavior.endsAt - this.clock.now())
        : 0,
      candidates: evaluation.candidates,
      relationship: this.relationshipSnapshot(),
      habit: this.habitSnapshot(environment),
      rngState: this.rng.getState(),
    };
  }

  toSnapshot() {
    const behaviorTiming = this.currentBehavior
      ? {
          startedAt: this.currentBehavior.startedAt,
          endsAt: this.currentBehavior.endsAt,
          duration: this.currentBehavior.duration,
          durationRemaining: Math.max(0, this.currentBehavior.endsAt - this.clock.now()),
        }
      : null;

    return {
      schemaVersion: SNAPSHOT_SCHEMA_VERSION,
      creatureId: this.creatureId,
      createdAt: this.createdAt,
      simulationTimestamp: this.clock.now(),
      rngState: this.rng.getState(),
      personality: clone(this.personality),
      internalState: clone(this.drives),
      relationship: this.relationshipSnapshot(),
      habit: this.habitStateSnapshot(),
      currentBehavior: clone(this.currentBehavior),
      behaviorTiming,
    };
  }

  serialize() {
    return serializeSnapshot(this.toSnapshot());
  }

  static fromSnapshot(snapshotOrSerialized) {
    const snapshot = deserializeSnapshot(snapshotOrSerialized);
    return new CreatureCore({
      creatureId: snapshot.creatureId,
      createdAt: snapshot.createdAt,
      simulationTimestamp: snapshot.simulationTimestamp,
      personality: snapshot.personality,
      drives: snapshot.internalState,
      rngState: snapshot.rngState,
      currentBehavior: snapshot.currentBehavior,
      relationship: snapshot.relationship,
      habit: snapshot.habit,
    });
  }

  commitBehavior(environment) {
    const selection = this.selector.select({
      drives: this.drives,
      personality: this.personality,
      environment,
      relationship: this.relationshipForScoring(),
      habit: this.habitForScoring(environment),
      rng: this.rng,
    });
    const definition = BEHAVIOR_DEFINITIONS[selection.selected.action];
    const duration = this.rng.nextRange(definition.minDuration, definition.maxDuration);
    const startedAt = this.clock.now();
    const currentBehavior = {
      action: selection.selected.action,
      startedAt,
      endsAt: startedAt + duration,
      duration,
      interruptible: definition.interruptible,
      cooldown: definition.cooldown,
      reason: summarizeReason(selection.selected.contributors),
      score: selection.selected.score,
      scoreBreakdown: {
        selected: selection.selected,
        candidates: selection.candidates,
      },
    };
    this.currentBehavior = currentBehavior;
    return new BehaviorIntent({
      time: startedAt,
      action: currentBehavior.action,
      duration: currentBehavior.duration,
      reason: currentBehavior.reason,
      score: currentBehavior.score,
      scoreBreakdown: clone(currentBehavior.scoreBreakdown),
      interruptible: currentBehavior.interruptible,
    });
  }

  recordInteraction(event, environmentInput = this.lastEnvironment) {
    this.decayRelationship();
    this.decayHabit();
    const environment = resolveEnvironment(environmentInput, this.clock.now());
    this.lastEnvironment = environment;
    const interaction = normalizeInteractionEvent(event, this.clock.now());
    const bounded = {
      timestamp: this.clock.now(),
      kind: interaction.kind,
      valence: interaction.valence,
      intensity: interaction.intensity,
    };
    this.relationship.events.push(bounded);
    this.relationship.events = this.relationship.events.slice(-8);
    const direction = interaction.valence >= 0 ? 1 - this.relationship.bond : this.relationship.bond;
    this.relationship.bond = clamp01(
      this.relationship.bond + interaction.valence * interaction.intensity * BOND_LEARNING_RATE * direction,
    );
    this.relationship.lastUpdatedAt = this.clock.now();
    if (interaction.valence > 0) {
      reinforceAttentionHabit(this.habit, environment.localTime, interaction.intensity, this.clock.now());
    }
    return clone(bounded);
  }

  selectInteractionResponse() {
    const relationship = this.relationshipForScoring();
    const currentBehavior = this.currentBehavior?.action ?? "NONE";
    const currentBehaviorContribution = interactionResponseBehaviorContribution(currentBehavior);
    const contributors = {
      bond: relationship.bond * 0.5,
      sociability: this.personality.sociability * 0.35,
      independence: (1 - this.personality.independence) * 0.15,
      currentBehavior: currentBehaviorContribution,
    };
    const affinity = Object.values(contributors).reduce((sum, value) => sum + value, 0);
    const kind = affinity >= 0.64
      ? "ENJOY_CONTACT"
      : affinity <= 0.32
        ? "WITHDRAW_CONTACT"
        : "ACKNOWLEDGE_CONTACT";
    const duration = currentBehavior === "SLEEP"
      ? 0.45
      : kind === "ENJOY_CONTACT"
        ? 0.9
        : kind === "WITHDRAW_CONTACT"
          ? 0.75
          : 0.65;

    return new InteractionResponseIntent({
      kind,
      duration,
      diagnostics: {
        contributors,
        affinity,
        thresholds: { withdrawAtOrBelow: 0.32, enjoyAtOrAbove: 0.64 },
        currentBehavior,
      },
    });
  }

  relationshipSnapshot() {
    this.decayRelationship();
    return {
      ...clone(this.relationship),
      recentInfluence: this.relationshipForScoring().recentInfluence,
    };
  }

  relationshipForScoring() {
    return relationshipForScoring(this.relationship, this.clock.now());
  }

  decayRelationship() {
    decayRelationship(this.relationship, this.clock.now());
  }

  decayHabit() {
    decayTimeHabit(this.habit, this.clock.now());
  }

  habitForScoring(environment = this.lastEnvironment) {
    return {
      timeHabit: timeHabitForScoring(this.habit, environment.localTime, this.clock.now()),
    };
  }

  habitSnapshot(environment = this.lastEnvironment) {
    this.decayHabit();
    return {
      schemaVersion: this.habit.schemaVersion,
      attentionByHour: clone(this.habit.attentionByHour),
      lastUpdatedAt: this.habit.lastUpdatedAt,
      currentHour: Math.floor(environment.localTime),
      habitStrength: this.habit.attentionByHour[Math.floor(environment.localTime)],
      timeHabit: this.habitForScoring(environment).timeHabit,
    };
  }

  habitStateSnapshot() {
    this.decayHabit();
    return {
      schemaVersion: this.habit.schemaVersion,
      attentionByHour: clone(this.habit.attentionByHour),
      lastUpdatedAt: this.habit.lastUpdatedAt,
    };
  }

  evolveDrives(seconds, environment) {
    const hours = seconds / 3600;
    const action = this.currentBehavior?.action;
    const sleeping = action === "SLEEP";
    const playing = action === "PLAY";
    const observing = action === "OBSERVE" || action === "WANDER";
    const userRelief = environment.userPresent ? 0.012 : 0;

    this.drives.energy = clamp01(this.drives.energy + (sleeping ? -0.09 : 0.022) * hours);
    this.drives.social = clamp01(
      this.drives.social + ((environment.userPresent ? -0.009 : 0.018) - userRelief) * hours,
    );
    this.drives.curiosity = clamp01(
      this.drives.curiosity + (observing ? -0.045 : 0.008 + environment.novelty * 0.01) * hours,
    );
    this.drives.stimulation = clamp01(
      this.drives.stimulation +
        (playing ? -0.1 : observing ? -0.02 : 0.016 + environment.novelty * 0.01) * hours,
    );

    if (environment.interactionPressure > 0 && action === "SEEK_ATTENTION") {
      this.drives.social = clamp01(this.drives.social - environment.interactionPressure * 0.06 * hours);
    }
  }
}

function resolveEnvironment(environmentInput, timestamp) {
  const value = typeof environmentInput === "function" ? environmentInput(timestamp) : environmentInput;
  return createEnvironment(value);
}

function summarizeReason(contributors) {
  return Object.entries(contributors)
    .filter(([, value]) => Math.abs(value) >= 0.08)
    .sort((left, right) => Math.abs(right[1]) - Math.abs(left[1]))
    .slice(0, 3)
    .map(([name, value]) => `${name}=${value.toFixed(3)}`)
    .join(", ");
}

function interactionResponseBehaviorContribution(action) {
  if (action === "SLEEP") return -0.4;
  if (action === "AVOID") return -0.2;
  if (action === "SEEK_ATTENTION") return 0.04;
  return 0;
}

function clone(value) {
  return value === null || value === undefined ? value : JSON.parse(JSON.stringify(value));
}

function assertNonNegative(value, name) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name} must be a finite non-negative number.`);
  }
  return value;
}
