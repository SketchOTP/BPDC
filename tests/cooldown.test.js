import assert from "node:assert/strict";
import test from "node:test";

import { CreatureCore, createEnvironment } from "../src/creature-core/index.js";

const ACTIVE = createEnvironment({ localTime: 12, userPresent: true, userIdleDuration: 0, novelty: 0.2 });
const ABSENT = createEnvironment({ localTime: 12, userPresent: false, userIdleDuration: 3_600, novelty: 0.2 });

test("natural behavior exit suppresses immediate repetition without changing its score", () => {
  const core = CreatureCore.create({ seed: 1501 });
  core.currentBehavior = controlledBehavior("AVOID", 10);

  const events = core.advance(10.001, ACTIVE);
  const avoid = core.evaluate(ACTIVE).candidates.find((candidate) => candidate.action === "AVOID");

  assert.notEqual(events.at(-1)?.action, "AVOID");
  assert.equal(avoid.cooldownEligible, false);
  assert.equal(avoid.cooldownUntil, 100);
  assert.equal(avoid.cooldownRemaining, 89.999);
  assert.equal(avoid.score, core.scorer.score("AVOID", {
    drives: core.drives,
    personality: core.personality,
    environment: ACTIVE,
    relationship: core.relationshipForScoring(),
    habit: core.habitForScoring(ACTIVE),
    learnedPreference: core.learnedPlayPreferenceForScoring(),
    developmentalSocialization: core.developmentalSocializationForScoring(),
  }).score);
});

test("cooldown eligibility changes exactly at expiry", () => {
  const core = CreatureCore.create({ seed: 1502 });
  core.behaviorCooldowns.WANDER = 100;

  core.clock.set(100 - 1e-6);
  assert.equal(candidate(core, "WANDER", ACTIVE).cooldownEligible, false);
  core.clock.set(100);
  assert.equal(candidate(core, "WANDER", ACTIVE).cooldownEligible, true);
  core.clock.set(100 + 1e-6);
  assert.equal(candidate(core, "WANDER", ACTIVE).cooldownEligible, true);
});

test("multiple behavior cooldowns coexist as independent ledger entries", () => {
  const core = CreatureCore.create({ seed: 1503 });
  core.startBehaviorCooldown("FOLLOW_CURSOR", 20);
  core.startBehaviorCooldown("OBSERVE", 40);

  assert.deepEqual(core.behaviorCooldowns, { FOLLOW_CURSOR: 200, OBSERVE: 70 });
  assert.equal(candidate(core, "FOLLOW_CURSOR", ACTIVE).cooldownRemaining, 200);
  assert.equal(candidate(core, "OBSERVE", ACTIVE).cooldownRemaining, 70);
});

test("midpoint abandonment starts the old behavior cooldown at the switch time", () => {
  const core = CreatureCore.create({ seed: 1504 });
  core.currentBehavior = controlledBehavior("FOLLOW_CURSOR", 100);

  const events = core.advance(60, (timestamp) => timestamp < 50 ? ACTIVE : ABSENT);

  assert.equal(events.length, 1);
  assert.equal(events[0].time, 50);
  assert.equal(events[0].scoreBreakdown.reconsideration.previousAction, "FOLLOW_CURSOR");
  assert.equal(core.behaviorCooldowns.FOLLOW_CURSOR, 230);
});

test("stable midpoint reconsideration does not create a cooldown", () => {
  const core = CreatureCore.create({ seed: 1505 });
  core.currentBehavior = controlledBehavior("OBSERVE", 100);
  const before = structuredClone(core.behaviorCooldowns);

  core.advance(60, ACTIVE);

  assert.deepEqual(core.behaviorCooldowns, before);
});

test("transient contact and reunion overlays do not alter cooldown state", () => {
  const core = CreatureCore.create({ seed: 1506 });
  core.currentBehavior = controlledBehavior("PLAY", 100);
  core.startBehaviorCooldown("OBSERVE", 300);
  const before = structuredClone(core.behaviorCooldowns);

  core.selectInteractionResponse();
  core.selectReunionResponse({ absenceSeconds: 7_200, previousState: "IDLE" });

  assert.deepEqual(core.behaviorCooldowns, before);
  assert.equal(core.currentBehavior.action, "PLAY");
});

test("cooldowns survive save/reload with deterministic eligibility", () => {
  const core = CreatureCore.create({ seed: 1507 });
  core.currentBehavior = controlledBehavior("WANDER", 10);
  core.advance(10.001, ACTIVE);
  core.startBehaviorCooldown("OBSERVE", core.clock.now());
  const restored = CreatureCore.fromSnapshot(JSON.parse(core.serialize()));

  assert.deepEqual(restored.behaviorCooldowns, core.behaviorCooldowns);
  assert.deepEqual(restored.evaluate(ACTIVE).candidates, core.evaluate(ACTIVE).candidates);
  assert.equal(restored.toSnapshot().schemaVersion, 7);
});

test("offline reconciliation expires cooldowns using simulation time and emits no intents", () => {
  const core = CreatureCore.create({ seed: 1508 });
  core.behaviorCooldowns.WANDER = 100;
  const events = core.reconcileElapsed(100, ABSENT);

  assert.deepEqual(events, []);
  assert.equal(core.clock.now(), 100);
  assert.equal(candidate(core, "WANDER", ABSENT).cooldownEligible, true);
});

test("normal selector keeps one RNG draw per action when cooldown blocks a candidate", () => {
  const first = CreatureCore.create({ seed: 1509 });
  const second = CreatureCore.create({ seed: 1509 });
  const calls = [];
  const rng = { nextRange(min, max) { calls.push([min, max]); return 0; } };
  const baseline = first.selector.select({
    ...selectionInputs(first, ACTIVE),
    rng,
  });
  const baselineCalls = calls.length;
  calls.length = 0;
  second.behaviorCooldowns.WANDER = 60;
  const blocked = second.selector.select({
    ...selectionInputs(second, ACTIVE),
    rng,
  });

  assert.equal(baselineCalls, 8);
  assert.equal(calls.length, 8);
  assert.equal(baseline.candidates.length, blocked.candidates.length);
  assert.equal(blocked.candidates.find((candidate) => candidate.action === "WANDER").cooldownEligible, false);
});

test("declared SLEEP and AVOID cooldowns enforce without exceptions", () => {
  const sleepy = CreatureCore.create({ seed: 1510 });
  sleepy.currentBehavior = controlledBehavior("SLEEP", 10);
  sleepy.advance(10.001, ABSENT);
  assert.equal(sleepy.behaviorCooldowns.SLEEP, 310);
  assert.equal(candidate(sleepy, "SLEEP", ABSENT).cooldownEligible, false);

  const avoidant = CreatureCore.create({ seed: 1511 });
  avoidant.currentBehavior = controlledBehavior("AVOID", 10);
  avoidant.advance(10.001, ACTIVE);
  assert.equal(avoidant.behaviorCooldowns.AVOID, 100);
  assert.equal(candidate(avoidant, "AVOID", ACTIVE).cooldownEligible, false);
});

test("IDLE remains the all-action fallback when every other action is cooling", () => {
  const core = CreatureCore.create({ seed: 1512 });
  for (const action of ["OBSERVE", "WANDER", "PLAY", "SEEK_ATTENTION", "AVOID", "FOLLOW_CURSOR", "SLEEP"]) {
    core.behaviorCooldowns[action] = 100;
  }
  core.currentBehavior = null;

  const intent = core.advance(0, ACTIVE)[0];

  assert.equal(intent.action, "IDLE");
  assert.equal(candidate(core, "IDLE", ACTIVE).eligible, true);
});

test("schema 6 migrates to schema 7 with no invented cooldown history", () => {
  const core = CreatureCore.create({ seed: 1513 });
  const schema6 = { ...core.toSnapshot(), schemaVersion: 6 };
  delete schema6.behaviorCooldowns;
  const migrated = CreatureCore.fromSnapshot(schema6);

  assert.equal(migrated.toSnapshot().schemaVersion, 7);
  assert.deepEqual(migrated.behaviorCooldowns, {});
});

function candidate(core, action, environment) {
  return core.evaluate(environment).candidates.find((entry) => entry.action === action);
}

function selectionInputs(core, environment) {
  return {
    drives: core.drives,
    personality: core.personality,
    environment,
    relationship: core.relationshipForScoring(),
    habit: core.habitForScoring(environment),
    learnedPreference: core.learnedPlayPreferenceForScoring(),
    developmentalSocialization: core.developmentalSocializationForScoring(),
    behaviorCooldowns: core.behaviorCooldowns,
    simulationTime: core.clock.now(),
  };
}

function controlledBehavior(action, duration) {
  return {
    action,
    startedAt: 0,
    endsAt: duration,
    duration,
    interruptible: !["SLEEP", "AVOID"].includes(action),
    cooldown: 0,
    reason: "controlled cooldown experiment",
    score: 0,
    scoreBreakdown: { source: "CONTROLLED_COOLDOWN_EXPERIMENT" },
  };
}
