import test from "node:test";
import assert from "node:assert/strict";
import { BehaviorIntent, CreatureCore, createEnvironment } from "../src/creature-core/index.js";

const SHARED_ENVIRONMENT = () =>
  createEnvironment({
    localTime: 12,
    userPresent: true,
    userIdleDuration: 60,
    novelty: 0.45,
    interactionPressure: 0.1,
  });

function runHours(core, hours, environment = SHARED_ENVIRONMENT) {
  const events = [];
  for (let remaining = hours * 3600; remaining > 0; remaining -= 300) {
    events.push(...core.advance(Math.min(300, remaining), environment));
  }
  return events;
}

function behaviorCounts(events) {
  return Object.fromEntries(
    ["IDLE", "OBSERVE", "WANDER", "PLAY", "SEEK_ATTENTION", "AVOID", "SLEEP"].map((action) => [
      action,
      events.filter((event) => event.action === action).length,
    ]),
  );
}

test("seven behaviors and machine-readable score diagnostics are exposed", () => {
  const core = CreatureCore.create({ seed: 1234 });
  const events = core.advance(0, SHARED_ENVIRONMENT);
  const diagnostic = core.diagnosticSnapshot(SHARED_ENVIRONMENT);

  assert.equal(events.length, 1);
  assert.ok(events[0] instanceof BehaviorIntent);
  assert.deepEqual(
    diagnostic.candidates.map((candidate) => candidate.action),
    ["IDLE", "OBSERVE", "WANDER", "PLAY", "SEEK_ATTENTION", "AVOID", "SLEEP"],
  );
  assert.ok(Object.keys(events[0].scoreBreakdown.selected.contributors).length > 0);
  assert.equal(events[0].scoreBreakdown.candidates.length, 7);
});

test("same seed and inputs produce identical replay", () => {
  const first = CreatureCore.create({ seed: 1234 });
  const second = CreatureCore.create({ seed: 1234 });
  assert.deepEqual(runHours(first, 24), runHours(second, 24));
  assert.deepEqual(first.toSnapshot(), second.toSnapshot());
});

test("ten personality seeds produce differentiated 24-hour distributions", () => {
  const results = [];
  for (let seed = 1; seed <= 10; seed += 1) {
    const core = CreatureCore.create({ seed });
    results.push({ seed, personality: core.personality, counts: behaviorCounts(runHours(core, 24)) });
  }

  const signatures = new Set(results.map(({ counts }) => JSON.stringify(counts)));
  assert.ok(signatures.size >= 3, `expected at least three distributions, got ${signatures.size}`);

  const mostSociable = results.reduce((best, result) =>
    result.personality.sociability > best.personality.sociability ? result : best,
  );
  const leastSociable = results.reduce((best, result) =>
    result.personality.sociability < best.personality.sociability ? result : best,
  );
  assert.ok(mostSociable.counts.SEEK_ATTENTION >= leastSociable.counts.SEEK_ATTENTION);
});

test("extreme drives causally select sleep, attention, and play", () => {
  const sleepy = CreatureCore.create({ seed: 21 });
  sleepy.drives = { energy: 1, social: 0.05, curiosity: 0.05, stimulation: 0.05 };
  assert.equal(sleepy.advance(0, createEnvironment({ localTime: 2 }))[0].action, "SLEEP");

  const attention = CreatureCore.create({ seed: 22 });
  attention.drives = { energy: 0.05, social: 1, curiosity: 0.05, stimulation: 0.05 };
  attention.personality = {
    curiosity: 0.2, sociability: 1, playfulness: 0.2, boldness: 0.2, independence: 0.1, sleepiness: 0.2,
  };
  assert.equal(
    attention.advance(0, createEnvironment({ localTime: 12, userPresent: true }))[0].action,
    "SEEK_ATTENTION",
  );

  const playful = CreatureCore.create({ seed: 23 });
  playful.drives = { energy: 0.05, social: 0.05, curiosity: 0.2, stimulation: 1 };
  playful.personality = {
    curiosity: 0.3, sociability: 0.2, playfulness: 1, boldness: 0.5, independence: 0.5, sleepiness: 0.1,
  };
  assert.equal(playful.advance(0, SHARED_ENVIRONMENT)[0].action, "PLAY");
});

test("save and reload preserve identity, timing, and continuation", () => {
  const uninterrupted = CreatureCore.create({ seed: 77, createdAt: 100 });
  const split = CreatureCore.create({ seed: 77, createdAt: 100 });
  const firstTrace = runHours(uninterrupted, 12, timedEnvironment);
  assert.deepEqual(runHours(split, 12, timedEnvironment), firstTrace);

  const reloaded = CreatureCore.fromSnapshot(JSON.parse(split.serialize()));
  const uninterruptedSecond = runHours(uninterrupted, 12, timedEnvironment);
  const reloadedSecond = runHours(reloaded, 12, timedEnvironment);

  assert.deepEqual(reloadedSecond, uninterruptedSecond);
  assert.deepEqual(reloaded.toSnapshot(), uninterrupted.toSnapshot());
  assert.equal(reloaded.personality.sociability, split.personality.sociability);
});

test("accelerated 24-hour run emits enough structured trace for inspection", () => {
  const core = CreatureCore.create({ seed: 9001 });
  const trace = runHours(core, 24, timedEnvironment);
  assert.ok(trace.length >= 10);
  assert.ok(trace.every((event) => Number.isFinite(event.time)));
  assert.ok(trace.every((event) => event.scoreBreakdown.candidates.length === 7));
  assert.equal(core.toSnapshot().simulationTimestamp, 24 * 3600);
});

test("relationship history changes existing SEEK_ATTENTION and AVOID utility", () => {
  const environment = createEnvironment({ localTime: 12, userPresent: true, userIdleDuration: 60, interactionPressure: 0.3 });
  const positive = CreatureCore.create({ seed: 501 });
  const negative = CreatureCore.create({ seed: 501 });
  for (let index = 0; index < 4; index += 1) {
    positive.recordInteraction({ kind: "POSITIVE_CONTACT", intensity: 0.8 });
    negative.recordInteraction({ kind: "NEGATIVE_CONTACT", intensity: 0.8 });
  }

  const score = (core, action) => core.evaluate(environment).candidates.find((candidate) => candidate.action === action);
  assert.ok(score(positive, "SEEK_ATTENTION").contributors.bond > 0);
  assert.ok(score(negative, "SEEK_ATTENTION").contributors.bond < 0);
  assert.ok(score(positive, "AVOID").score < score(negative, "AVOID").score);
  assert.ok(score(positive, "SEEK_ATTENTION").score > score(negative, "SEEK_ATTENTION").score);
});

test("interaction memory is bounded and save/reload preserves deterministic continuation", () => {
  const uninterrupted = CreatureCore.create({ seed: 502 });
  const split = CreatureCore.create({ seed: 502 });
  for (let index = 0; index < 12; index += 1) {
    uninterrupted.recordInteraction({ kind: index % 2 ? "POSITIVE_CONTACT" : "NEGATIVE_CONTACT", intensity: 0.5 });
    split.recordInteraction({ kind: index % 2 ? "POSITIVE_CONTACT" : "NEGATIVE_CONTACT", intensity: 0.5 });
  }
  assert.equal(split.relationship.events.length, 8);
  runHours(uninterrupted, 2, timedEnvironment);
  runHours(split, 2, timedEnvironment);
  const reloaded = CreatureCore.fromSnapshot(JSON.parse(split.serialize()));
  const uninterruptedTrace = runHours(uninterrupted, 2, timedEnvironment);
  const reloadedTrace = runHours(reloaded, 2, timedEnvironment);
  assert.deepEqual(reloadedTrace, uninterruptedTrace);
  assert.deepEqual(reloaded.toSnapshot(), uninterrupted.toSnapshot());
});

test("recent interaction influence decays predictably", () => {
  const core = CreatureCore.create({ seed: 503 });
  core.recordInteraction({ kind: "POSITIVE_CONTACT", intensity: 1 });
  const immediate = core.relationshipSnapshot();
  core.advance(6 * 3600, createEnvironment({ localTime: 12 }));
  const later = core.relationshipSnapshot();
  core.advance(24 * 3600, createEnvironment({ localTime: 12 }));
  const muchLater = core.relationshipSnapshot();
  assert.ok(immediate.recentInfluence > later.recentInfluence);
  assert.ok(later.recentInfluence > muchLater.recentInfluence);
  assert.ok(muchLater.events.length === 0);
  assert.ok(later.bond > 0.5);
});

test("repeated interaction saturates instead of dominating bond immediately", () => {
  const core = CreatureCore.create({ seed: 504 });
  for (let index = 0; index < 20; index += 1) {
    core.recordInteraction({ kind: "POSITIVE_CONTACT", intensity: 1 });
  }
  assert.ok(core.relationship.bond > 0.5);
  assert.ok(core.relationship.bond < 0.9);
});

test("same-hour positive interactions form a stronger isolated attention habit", () => {
  const routine = CreatureCore.create({ seed: 505 });
  const distributed = CreatureCore.create({ seed: 505 });
  for (let index = 0; index < 8; index += 1) {
    const interaction = { kind: "POSITIVE_CONTACT", intensity: 0.4 };
    routine.recordInteraction(interaction, environmentAt(20));
    distributed.recordInteraction(interaction, environmentAt(index));
  }

  const routineCandidate = candidate(routine, "SEEK_ATTENTION", environmentAt(20));
  const distributedCandidate = candidate(distributed, "SEEK_ATTENTION", environmentAt(20));
  assert.equal(routine.relationship.bond, distributed.relationship.bond);
  assert.ok(routineCandidate.contributors.timeHabit > distributedCandidate.contributors.timeHabit);
  assert.ok(routineCandidate.contributors.timeHabit >= 0.05);
});

test("time habit persists through schema-2 migration and deterministic reload", () => {
  const core = CreatureCore.create({ seed: 506 });
  for (let index = 0; index < 4; index += 1) {
    core.recordInteraction({ kind: "POSITIVE_CONTACT", intensity: 0.8 }, environmentAt(20));
  }
  const snapshot = core.toSnapshot();
  const reloaded = CreatureCore.fromSnapshot(JSON.parse(core.serialize()));
  assert.deepEqual(reloaded.toSnapshot(), snapshot);

  const schema2 = { ...snapshot, schemaVersion: 2 };
  delete schema2.habit;
  const migrated = CreatureCore.fromSnapshot(schema2);
  assert.equal(migrated.toSnapshot().schemaVersion, 4);
  assert.deepEqual(migrated.toSnapshot().habit.attentionByHour, Array(24).fill(0));
  assert.equal(migrated.toSnapshot().spatial.restSiteAffinity, 0);
  assert.equal(migrated.relationship.events.length, snapshot.relationship.events.length);
  assert.equal(migrated.creatureId, snapshot.creatureId);
});

test("time habit decays over days", () => {
  const core = CreatureCore.create({ seed: 507 });
  core.recordInteraction({ kind: "POSITIVE_CONTACT", intensity: 1 }, environmentAt(20));
  const initial = core.habitSnapshot(environmentAt(20)).timeHabit;
  core.advance(7 * 24 * 3600, environmentAt(12));
  const later = core.habitSnapshot(environmentAt(20)).timeHabit;
  core.advance(7 * 24 * 3600, environmentAt(12));
  const muchLater = core.habitSnapshot(environmentAt(20)).timeHabit;
  assert.ok(initial > later);
  assert.ok(later > muchLater);
});

test("strong fatigue can override a learned attention habit", () => {
  const core = CreatureCore.create({ seed: 508 });
  for (let index = 0; index < 24; index += 1) {
    core.recordInteraction({ kind: "POSITIVE_CONTACT", intensity: 1 }, environmentAt(20));
  }
  core.drives = { energy: 1, social: 0.05, curiosity: 0.05, stimulation: 0.05 };
  core.currentBehavior = null;
  assert.equal(core.advance(0, environmentAt(20))[0].action, "SLEEP");
});

test("active presence raises attention and lowers sleep utility", () => {
  const core = CreatureCore.create({ seed: 509 });
  const active = createEnvironment({ localTime: 12, userPresent: true, userIdleDuration: 0 });
  const idle = createEnvironment({ localTime: 12, userPresent: false, userIdleDuration: 600 });
  const candidateFor = (environment, action) => candidate(core, action, environment);

  assert.ok(candidateFor(active, "SEEK_ATTENTION").score > candidateFor(idle, "SEEK_ATTENTION").score);
  assert.ok(candidateFor(active, "SLEEP").score < candidateFor(idle, "SLEEP").score);
});

test("sustained presence relieves social pressure relative to absence", () => {
  const active = CreatureCore.create({ seed: 510 });
  const absent = CreatureCore.create({ seed: 510 });
  const activeEnvironment = createEnvironment({ userPresent: true, userIdleDuration: 0 });
  const absentEnvironment = createEnvironment({ userPresent: false, userIdleDuration: 600 });

  active.evolveDrives(4 * 3600, activeEnvironment);
  absent.evolveDrives(4 * 3600, absentEnvironment);

  assert.ok(active.drives.social < absent.drives.social);
});

function candidate(core, action, environment) {
  return core.evaluate(environment).candidates.find((entry) => entry.action === action);
}

function environmentAt(localTime) {
  return createEnvironment({
    localTime,
    userPresent: true,
    userIdleDuration: 60,
    novelty: 0.1,
    interactionPressure: 0.1,
  });
}

function timedEnvironment(timestamp) {
  const localTime = (timestamp % 86400) / 3600;
  const userPresent = localTime >= 8 && localTime < 22;
  return createEnvironment({
    localTime,
    userPresent,
    userIdleDuration: userPresent ? 120 : 3600,
    novelty: ((Math.floor(timestamp / 3600) * 7) % 10) / 10,
    interactionPressure: userPresent ? 0.12 : 0.02,
  });
}
