// integrations/openpets/plugin/core/clock.js
var SimulationClock = class {
  constructor(timestamp = 0) {
    assertFiniteNonNegative(timestamp, "timestamp");
    this.timestamp = timestamp;
  }
  now() {
    return this.timestamp;
  }
  advance(seconds) {
    assertFiniteNonNegative(seconds, "seconds");
    this.timestamp += seconds;
    return this.timestamp;
  }
  set(timestamp) {
    assertFiniteNonNegative(timestamp, "timestamp");
    this.timestamp = timestamp;
    return this.timestamp;
  }
};
function assertFiniteNonNegative(value, name) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name} must be a finite non-negative number.`);
  }
}

// integrations/openpets/plugin/core/seeded-rng.js
var SeededRng = class {
  constructor(seed = 1) {
    this.state = normalizeSeed(seed);
  }
  next() {
    let t = this.state += 1831565813;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
  nextRange(min, max) {
    return min + (max - min) * this.next();
  }
  getState() {
    return this.state >>> 0;
  }
  setState(state) {
    this.state = normalizeSeed(state);
    return this;
  }
};
function normalizeSeed(seed) {
  if (typeof seed === "string") {
    let hash = 2166136261;
    for (const character of seed) {
      hash ^= character.codePointAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0 || 1;
  }
  if (!Number.isFinite(seed)) {
    throw new TypeError("Seed must be a finite number or string.");
  }
  return Math.trunc(seed) >>> 0 || 1;
}

// integrations/openpets/plugin/core/models.js
var DRIVE_NAMES = ["energy", "social", "curiosity", "stimulation"];
var PERSONALITY_TRAITS = [
  "curiosity",
  "sociability",
  "playfulness",
  "boldness",
  "independence",
  "sleepiness"
];
function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}
function createInitialDrives() {
  return {
    energy: 0.2,
    social: 0.25,
    curiosity: 0.35,
    stimulation: 0.25
  };
}
function createPersonality(seed) {
  const rng = new SeededRng(seed);
  return Object.fromEntries(
    PERSONALITY_TRAITS.map((trait) => [trait, Number((0.2 + rng.next() * 0.6).toFixed(6))])
  );
}
function createEnvironment({
  localTime = 12,
  userPresent = false,
  userIdleDuration = 0,
  novelty = 0,
  interactionPressure = 0
} = {}) {
  if (!Number.isFinite(localTime) || localTime < 0 || localTime >= 24) {
    throw new RangeError("localTime must be in the range 0 <= localTime < 24.");
  }
  return {
    localTime,
    userPresent: Boolean(userPresent),
    userIdleDuration: nonNegative(userIdleDuration, "userIdleDuration"),
    novelty: clamp01(novelty),
    interactionPressure: clamp01(interactionPressure)
  };
}
function validateDrives(drives) {
  for (const name of DRIVE_NAMES) {
    if (!Number.isFinite(drives?.[name])) {
      throw new TypeError(`Missing normalized drive: ${name}`);
    }
  }
  return Object.fromEntries(DRIVE_NAMES.map((name) => [name, clamp01(drives[name])]));
}
function validatePersonality(personality) {
  for (const trait of PERSONALITY_TRAITS) {
    if (!Number.isFinite(personality?.[trait])) {
      throw new TypeError(`Missing personality trait: ${trait}`);
    }
  }
  return Object.fromEntries(
    PERSONALITY_TRAITS.map((trait) => [trait, clamp01(personality[trait])])
  );
}
function nonNegative(value, name) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name} must be a finite non-negative number.`);
  }
  return value;
}

// integrations/openpets/plugin/core/behavior.js
var ACTIONS = [
  "IDLE",
  "OBSERVE",
  "WANDER",
  "PLAY",
  "SEEK_ATTENTION",
  "AVOID",
  "SLEEP"
];
var BEHAVIOR_DEFINITIONS = {
  IDLE: { minDuration: 45, maxDuration: 150, interruptible: true, cooldown: 0 },
  OBSERVE: { minDuration: 45, maxDuration: 180, interruptible: true, cooldown: 30 },
  WANDER: { minDuration: 90, maxDuration: 300, interruptible: true, cooldown: 60 },
  PLAY: { minDuration: 60, maxDuration: 240, interruptible: true, cooldown: 120 },
  SEEK_ATTENTION: { minDuration: 45, maxDuration: 180, interruptible: true, cooldown: 120 },
  AVOID: { minDuration: 30, maxDuration: 90, interruptible: false, cooldown: 90 },
  SLEEP: { minDuration: 600, maxDuration: 1800, interruptible: false, cooldown: 300 }
};
var BehaviorScorer = class {
  scoreAll({ drives, personality, environment }) {
    return ACTIONS.map((action) => this.score(action, { drives, personality, environment }));
  }
  score(action, { drives, personality, environment }) {
    const night = environment.localTime >= 22 || environment.localTime < 7 ? 1 : 0;
    const activeUser = environment.userPresent && environment.userIdleDuration < 300 ? 1 : 0;
    const scores = {
      IDLE: {
        baseline: 0.25,
        lowPressure: (1 - drives.energy) * 0.15,
        calm: (1 - environment.novelty) * 0.12
      },
      OBSERVE: {
        curiosity: drives.curiosity * 1.35,
        novelty: environment.novelty * 0.95,
        boldness: personality.boldness * 0.35,
        fatiguePenalty: -drives.energy * 0.45
      },
      WANDER: {
        curiosity: drives.curiosity * 0.65,
        stimulation: drives.stimulation * 0.7,
        independence: personality.independence * 0.55,
        boldness: personality.boldness * 0.35,
        fatiguePenalty: -drives.energy * 0.45
      },
      PLAY: {
        stimulation: drives.stimulation * 1.45,
        playfulness: personality.playfulness * 0.9,
        novelty: environment.novelty * 0.3,
        fatiguePenalty: -drives.energy * 0.35
      },
      SEEK_ATTENTION: {
        socialPressure: drives.social * 1.55,
        sociability: personality.sociability * 0.95,
        userPresent: activeUser * 0.35,
        interaction: environment.interactionPressure * 0.25,
        independencePenalty: -personality.independence * 0.35,
        fatiguePenalty: -drives.energy * 0.35
      },
      AVOID: {
        interactionPressure: environment.interactionPressure * 1.25,
        lowBoldness: (1 - personality.boldness) * 0.75,
        socialPressure: drives.social * 0.2,
        novelty: environment.novelty * 0.2
      },
      SLEEP: {
        fatiguePressure: drives.energy * 2.2,
        sleepiness: personality.sleepiness * 0.85,
        nightBias: night * 0.5,
        noveltyPenalty: -environment.novelty * 0.35,
        userPenalty: -activeUser * 0.15
      }
    };
    if (!scores[action]) {
      throw new RangeError(`Unknown behavior action: ${action}`);
    }
    const contributors = scores[action];
    const score = Object.values(contributors).reduce((sum, value) => sum + value, 0);
    return { action, score, contributors: { ...contributors } };
  }
};
var BehaviorSelector = class {
  constructor({ scorer = new BehaviorScorer(), noiseAmplitude = 0.025 } = {}) {
    this.scorer = scorer;
    this.noiseAmplitude = noiseAmplitude;
  }
  select({ drives, personality, environment, rng }) {
    const candidates = this.scorer.scoreAll({ drives, personality, environment }).map((candidate) => {
      const noise = rng.nextRange(-this.noiseAmplitude, this.noiseAmplitude);
      return {
        ...candidate,
        noise,
        score: candidate.score + noise,
        contributors: { ...candidate.contributors, noise }
      };
    });
    candidates.sort((left, right) => right.score - left.score || left.action.localeCompare(right.action));
    return { selected: candidates[0], candidates };
  }
};

// integrations/openpets/plugin/core/persistence.js
var SNAPSHOT_SCHEMA_VERSION = 1;
function serializeSnapshot(snapshot) {
  return JSON.stringify(snapshot, null, 2);
}
function deserializeSnapshot(serialized) {
  const snapshot = typeof serialized === "string" ? JSON.parse(serialized) : serialized;
  if (snapshot?.schemaVersion !== SNAPSHOT_SCHEMA_VERSION) {
    throw new Error(`Unsupported CreatureSnapshot schema: ${snapshot?.schemaVersion}`);
  }
  return snapshot;
}

// integrations/openpets/plugin/core/intent.js
var BehaviorIntent = class {
  constructor({ action, time, duration, reason, score, scoreBreakdown, interruptible }) {
    this.action = action;
    this.time = time;
    this.duration = duration;
    this.reason = reason;
    this.score = score;
    this.scoreBreakdown = scoreBreakdown;
    this.interruptible = interruptible;
  }
};

// integrations/openpets/plugin/core/creature-core.js
var CreatureCore = class _CreatureCore {
  constructor({
    creatureId,
    createdAt = 0,
    simulationTimestamp = createdAt,
    personality,
    drives = createInitialDrives(),
    rngState,
    currentBehavior = null,
    selector = new BehaviorSelector(),
    scorer = new BehaviorScorer()
  }) {
    this.creatureId = String(creatureId);
    this.createdAt = assertNonNegative(createdAt, "createdAt");
    this.clock = new SimulationClock(assertNonNegative(simulationTimestamp, "simulationTimestamp"));
    this.personality = validatePersonality(personality);
    this.drives = validateDrives(drives);
    this.rng = new SeededRng(rngState ?? 1);
    this.currentBehavior = currentBehavior ? clone(currentBehavior) : null;
    this.selector = selector;
    this.scorer = scorer;
    this.lastEnvironment = createEnvironment();
  }
  static create({ seed = 1, creatureId, createdAt = 0 } = {}) {
    const normalizedSeed = normalizeSeed(seed);
    return new _CreatureCore({
      creatureId: creatureId ?? `creature-${normalizedSeed.toString(16).padStart(8, "0")}`,
      createdAt,
      simulationTimestamp: createdAt,
      personality: createPersonality(normalizedSeed),
      rngState: normalizedSeed ^ 2779096485
    });
  }
  advance(seconds, environmentInput = this.lastEnvironment) {
    assertNonNegative(seconds, "seconds");
    const events = [];
    let remaining = seconds;
    if (!this.currentBehavior) {
      const environment = resolveEnvironment(environmentInput, this.clock.now());
      events.push(this.commitBehavior(environment));
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
        remaining -= segment;
      }
      if (this.currentBehavior && this.clock.now() >= this.currentBehavior.endsAt - 1e-9) {
        this.currentBehavior = null;
        if (remaining > 0) {
          const nextEnvironment = resolveEnvironment(environmentInput, this.clock.now());
          events.push(this.commitBehavior(nextEnvironment));
        }
      } else if (segment === 0) {
        throw new Error("CreatureCore could not advance; behavior timing is invalid.");
      }
    }
    return events;
  }
  evaluate(environmentInput = this.lastEnvironment) {
    const environment = resolveEnvironment(environmentInput, this.clock.now());
    const candidates = this.scorer.scoreAll({
      drives: this.drives,
      personality: this.personality,
      environment
    });
    return {
      simulationTime: this.clock.now(),
      candidates,
      selectedAction: this.currentBehavior?.action ?? null
    };
  }
  diagnosticSnapshot(environmentInput = this.lastEnvironment) {
    const evaluation = this.evaluate(environmentInput);
    return {
      creatureId: this.creatureId,
      simulationTime: this.clock.now(),
      personality: clone(this.personality),
      drives: clone(this.drives),
      currentBehavior: clone(this.currentBehavior),
      behaviorDurationRemaining: this.currentBehavior ? Math.max(0, this.currentBehavior.endsAt - this.clock.now()) : 0,
      candidates: evaluation.candidates,
      rngState: this.rng.getState()
    };
  }
  toSnapshot() {
    const behaviorTiming = this.currentBehavior ? {
      startedAt: this.currentBehavior.startedAt,
      endsAt: this.currentBehavior.endsAt,
      duration: this.currentBehavior.duration,
      durationRemaining: Math.max(0, this.currentBehavior.endsAt - this.clock.now())
    } : null;
    return {
      schemaVersion: SNAPSHOT_SCHEMA_VERSION,
      creatureId: this.creatureId,
      createdAt: this.createdAt,
      simulationTimestamp: this.clock.now(),
      rngState: this.rng.getState(),
      personality: clone(this.personality),
      internalState: clone(this.drives),
      currentBehavior: clone(this.currentBehavior),
      behaviorTiming
    };
  }
  serialize() {
    return serializeSnapshot(this.toSnapshot());
  }
  static fromSnapshot(snapshotOrSerialized) {
    const snapshot = deserializeSnapshot(snapshotOrSerialized);
    return new _CreatureCore({
      creatureId: snapshot.creatureId,
      createdAt: snapshot.createdAt,
      simulationTimestamp: snapshot.simulationTimestamp,
      personality: snapshot.personality,
      drives: snapshot.internalState,
      rngState: snapshot.rngState,
      currentBehavior: snapshot.currentBehavior
    });
  }
  commitBehavior(environment) {
    const selection = this.selector.select({
      drives: this.drives,
      personality: this.personality,
      environment,
      rng: this.rng
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
        candidates: selection.candidates
      }
    };
    this.currentBehavior = currentBehavior;
    return new BehaviorIntent({
      time: startedAt,
      action: currentBehavior.action,
      duration: currentBehavior.duration,
      reason: currentBehavior.reason,
      score: currentBehavior.score,
      scoreBreakdown: clone(currentBehavior.scoreBreakdown),
      interruptible: currentBehavior.interruptible
    });
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
      this.drives.social + ((environment.userPresent ? -9e-3 : 0.018) - userRelief) * hours
    );
    this.drives.curiosity = clamp01(
      this.drives.curiosity + (observing ? -0.045 : 8e-3 + environment.novelty * 0.01) * hours
    );
    this.drives.stimulation = clamp01(
      this.drives.stimulation + (playing ? -0.1 : observing ? -0.02 : 0.016 + environment.novelty * 0.01) * hours
    );
    if (environment.interactionPressure > 0 && action === "SEEK_ATTENTION") {
      this.drives.social = clamp01(this.drives.social - environment.interactionPressure * 0.06 * hours);
    }
  }
};
function resolveEnvironment(environmentInput, timestamp) {
  const value = typeof environmentInput === "function" ? environmentInput(timestamp) : environmentInput;
  return createEnvironment(value);
}
function summarizeReason(contributors) {
  return Object.entries(contributors).filter(([, value]) => Math.abs(value) >= 0.08).sort((left, right) => Math.abs(right[1]) - Math.abs(left[1])).slice(0, 3).map(([name, value]) => `${name}=${value.toFixed(3)}`).join(", ");
}
function clone(value) {
  return value === null || value === void 0 ? value : JSON.parse(JSON.stringify(value));
}
function assertNonNegative(value, name) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name} must be a finite non-negative number.`);
  }
  return value;
}

// integrations/openpets/plugin/openpets-adapter.js
var ACTIONS2 = /* @__PURE__ */ new Set([
  "IDLE",
  "OBSERVE",
  "WANDER",
  "PLAY",
  "SEEK_ATTENTION",
  "AVOID",
  "SLEEP"
]);
var REACTION_BY_ACTION = {
  IDLE: "idle",
  OBSERVE: "thinking",
  PLAY: "celebrating",
  SEEK_ATTENTION: "waving",
  AVOID: "failed",
  SLEEP: "waiting"
};
function clampDurationMs(seconds) {
  return Math.max(250, Math.min(1500, Math.round(seconds * 1e3)));
}
var OpenPetsAdapter = class {
  constructor(ctx, { log: log2 = () => {
  } } = {}) {
    this.ctx = ctx;
    this.log = log2;
  }
  async execute(intent) {
    if (!intent || !ACTIONS2.has(intent.action)) {
      throw new TypeError(`Unsupported BehaviorIntent action: ${intent?.action}`);
    }
    const durationMs = clampDurationMs(intent.duration ?? 1);
    const startedAt = (/* @__PURE__ */ new Date()).toISOString();
    this.log("ADAPT", startedAt, intent, "pending");
    await this.ctx.pet.physics({ gravity: false, bounce: 0 });
    let command;
    if (intent.action === "WANDER") {
      await this.ctx.pet.wander({ distance: 110, durationMs });
      command = "pet.wander(distance=110)";
    } else {
      const reaction = REACTION_BY_ACTION[intent.action] ?? "idle";
      await this.ctx.pet.react(reaction, { showMessage: false });
      command = `pet.react(${reaction})`;
    }
    const hostState = await this.getExecutionState();
    this.log("HOST", (/* @__PURE__ */ new Date()).toISOString(), intent, `${command} result=accepted`, hostState);
    return { command, hostState };
  }
  async getExecutionState() {
    return this.ctx.pet.getState();
  }
  async shutdown() {
    await this.ctx.pet.physics({ gravity: false, bounce: 0 });
  }
};

// integrations/openpets/plugin/index.src.js
var SNAPSHOT_KEY = "bpdc.creature.snapshot";
var LOG_PREFIX = "BPDC";
var activeRuntime = null;
function log(ctx, stage, timestamp, message, details = void 0) {
  void ctx.log.info(LOG_PREFIX, { stage, timestamp, message, ...details ? { details } : {} });
}
function environmentNow() {
  const date = /* @__PURE__ */ new Date();
  return createEnvironment({
    localTime: date.getHours() + date.getMinutes() / 60,
    userPresent: false,
    userIdleDuration: 0,
    novelty: 0.1,
    interactionPressure: 0
  });
}
function forcedIntent(action) {
  return new BehaviorIntent({
    action,
    time: 0,
    duration: 2,
    reason: "forced mapping validation",
    score: null,
    scoreBreakdown: { source: "FORCED_MAPPING_VALIDATION" },
    interruptible: true
  });
}
function register(OpenPetsPlugin) {
  OpenPetsPlugin.register({
    async start(ctx) {
      const adapter = new OpenPetsAdapter(ctx, {
        log: (stage, timestamp, intent, message, details) => log(ctx, stage, timestamp, message, {
          action: intent.action,
          utility: intent.score,
          durationSeconds: intent.duration,
          ...details ? { hostState: details } : {}
        })
      });
      await ctx.pet.show();
      await ctx.pet.physics({ gravity: false, bounce: 0 });
      const saved = await ctx.storage.get(SNAPSHOT_KEY);
      const core = saved ? CreatureCore.fromSnapshot(saved) : CreatureCore.create({ seed: 1112556611 });
      log(ctx, "CORE", (/* @__PURE__ */ new Date()).toISOString(), saved ? "snapshot restored" : "new individual created", {
        creatureId: core.creatureId,
        snapshot: Boolean(saved)
      });
      let saveChain = Promise.resolve();
      let lastPersistAt = 0;
      const persist = (force = false) => {
        const now = Date.now();
        if (!force && now - lastPersistAt < 1e3) return saveChain;
        lastPersistAt = now;
        const snapshot = core.serialize();
        saveChain = saveChain.then(() => ctx.storage.set(SNAPSHOT_KEY, snapshot));
        return saveChain;
      };
      const executeIntent = async (intent, source = "AUTONOMOUS") => {
        log(ctx, "CORE", (/* @__PURE__ */ new Date()).toISOString(), `${source} selected ${intent.action}`, {
          creatureId: core.creatureId,
          utility: intent.score,
          durationSeconds: intent.duration,
          reason: intent.reason,
          scoreBreakdown: intent.scoreBreakdown
        });
        await adapter.execute(intent);
        await persist(true);
      };
      await persist(true);
      for (const intent of core.advance(0, environmentNow())) await executeIntent(intent);
      const runtime = {
        adapter,
        unsubscribe: () => {
        },
        tickChain: Promise.resolve(),
        persist
      };
      runtime.unsubscribe = ctx.pet.onTick((dtMs) => {
        runtime.tickChain = runtime.tickChain.then(async () => {
          const seconds = Math.max(0, Math.min(5, dtMs / 1e3));
          for (const intent of core.advance(seconds, environmentNow())) await executeIntent(intent);
          await persist(false);
        }).catch((error) => log(ctx, "ERROR", (/* @__PURE__ */ new Date()).toISOString(), "autonomous tick failed", { message: String(error?.message ?? error) }));
      });
      const registerForced = (id, action, title) => ctx.commands.register({ id, title, placement: "top" }, async () => {
        log(ctx, "FORCED", (/* @__PURE__ */ new Date()).toISOString(), `${action} mapping validation requested`, { source: "FORCED_MAPPING_VALIDATION" });
        await adapter.execute(forcedIntent(action));
      });
      await registerForced("bpdc-probe-wander", "WANDER", "BPDC probe: wander");
      await registerForced("bpdc-probe-sleep", "SLEEP", "BPDC probe: sleep");
      await registerForced("bpdc-probe-attention", "SEEK_ATTENTION", "BPDC probe: attention");
      await ctx.commands.register({ id: "bpdc-status", title: "BPDC status", placement: "top" }, async () => {
        const hostState = await adapter.getExecutionState();
        log(ctx, "STATUS", (/* @__PURE__ */ new Date()).toISOString(), "diagnostic snapshot", { diagnostic: core.diagnosticSnapshot(environmentNow()), hostState });
      });
      activeRuntime = runtime;
      log(ctx, "HOST", (/* @__PURE__ */ new Date()).toISOString(), "OpenPets host authority configured", {
        nativeGravity: false,
        hostBehaviorSelection: "none observed; host tick only"
      });
    },
    async stop() {
      const runtime = activeRuntime;
      activeRuntime = null;
      if (!runtime) return;
      runtime.unsubscribe();
      await runtime.tickChain;
      await runtime.persist(true);
      await runtime.adapter.shutdown();
    }
  });
}
export {
  register
};
