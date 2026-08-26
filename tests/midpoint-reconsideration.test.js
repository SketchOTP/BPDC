import assert from "node:assert/strict";
import test from "node:test";

import { BehaviorIntent, CreatureCore, createEnvironment } from "../src/creature-core/index.js";
import { OpenPetsAdapter } from "../integrations/openpets/openpets-adapter.js";

const STABLE_ENVIRONMENT = createEnvironment({
  localTime: 12,
  userPresent: true,
  userIdleDuration: 0,
  novelty: 0.2,
});

function controlledBehavior(core, action = "WANDER", duration = 100) {
  const startedAt = core.clock.now();
  core.currentBehavior = {
    action,
    startedAt,
    endsAt: startedAt + duration,
    duration,
    interruptible: !["SLEEP", "AVOID"].includes(action),
    cooldown: 0,
    reason: "controlled midpoint experiment",
    score: 0,
    scoreBreakdown: { source: "CONTROLLED_MIDPOINT_EXPERIMENT" },
  };
}

function changedNoveltyEnvironment(timestamp) {
  return createEnvironment({
    localTime: 12,
    userPresent: true,
    userIdleDuration: 0,
    novelty: timestamp < 50 ? 0 : 1,
  });
}

function activeThenAbsentEnvironment(timestamp) {
  return createEnvironment({
    localTime: 12,
    userPresent: timestamp < 50,
    userIdleDuration: timestamp < 50 ? 0 : 3_600,
    novelty: 0.2,
  });
}

function highCuriosityCore(seed = 1401) {
  const core = CreatureCore.create({ seed });
  core.drives = { energy: 0.1, social: 0.1, curiosity: 0.8, stimulation: 0.1 };
  core.personality = {
    curiosity: 0.8, sociability: 0.2, playfulness: 0.2, boldness: 0.5, independence: 0.1, sleepiness: 0.1,
  };
  return core;
}

function candidate(action, score, eligible = true) {
  return { action, score, eligible, contributors: { score } };
}

function fixedScorer(entries) {
  return { scoreAll: () => entries.map((entry) => ({ ...entry })) };
}

test("stable interruptible commitments cross one midpoint without changing state or RNG", () => {
  const core = highCuriosityCore();
  controlledBehavior(core, "OBSERVE");
  const before = core.toSnapshot();

  const events = core.advance(60, STABLE_ENVIRONMENT);

  assert.deepEqual(events, []);
  assert.equal(core.currentBehavior.action, before.currentBehavior.action);
  assert.equal(core.currentBehavior.startedAt, before.currentBehavior.startedAt);
  assert.equal(core.currentBehavior.endsAt, before.currentBehavior.endsAt);
  assert.equal(core.rng.getState(), before.rngState);
  assert.equal(core.clock.now(), 60);
});

test("changed utility causes exactly one midpoint switch with inspectable diagnostics", () => {
  const core = highCuriosityCore();
  controlledBehavior(core);

  const events = core.advance(60, changedNoveltyEnvironment);

  assert.equal(events.length, 1);
  assert.equal(events[0].action, "OBSERVE");
  assert.equal(events[0].time, 50);
  assert.deepEqual(events[0].scoreBreakdown.reconsideration, {
    source: "MIDPOINT_RECONSIDERATION",
    previousAction: "WANDER",
    currentScore: events[0].scoreBreakdown.reconsideration.currentScore,
    challenger: "OBSERVE",
    challengerScore: events[0].scoreBreakdown.reconsideration.challengerScore,
    margin: 0.15,
    reason: "utility margin",
  });
  assert.equal(core.currentBehavior.action, "OBSERVE");
  assert.equal(core.currentBehavior.startedAt, 50);
});

test("loss of FOLLOW_CURSOR eligibility switches at the midpoint", () => {
  const core = CreatureCore.create({ seed: 1402 });
  controlledBehavior(core, "FOLLOW_CURSOR");

  const events = core.advance(60, activeThenAbsentEnvironment);

  assert.equal(events.length, 1);
  assert.notEqual(events[0].action, "FOLLOW_CURSOR");
  assert.equal(events[0].time, 50);
  assert.equal(events[0].scoreBreakdown.reconsideration.reason, "ineligible");
  assert.equal(events[0].scoreBreakdown.reconsideration.previousAction, "FOLLOW_CURSOR");
});

test("deterministic hysteresis rejects a challenger below the margin and accepts one above it", () => {
  const below = CreatureCore.create({ seed: 1403 });
  controlledBehavior(below);
  below.scorer = fixedScorer([
    candidate("WANDER", 1),
    candidate("OBSERVE", 1.149),
  ]);
  below.clock.advance(50);
  assert.equal(below.reconsiderAtMidpoint(STABLE_ENVIRONMENT), null);
  assert.equal(below.rng.getState(), CreatureCore.create({ seed: 1403 }).rng.getState());

  const above = CreatureCore.create({ seed: 1404 });
  controlledBehavior(above);
  above.scorer = fixedScorer([
    candidate("WANDER", 1),
    candidate("OBSERVE", 1.151),
  ]);
  above.clock.advance(50);
  const switched = above.reconsiderAtMidpoint(STABLE_ENVIRONMENT);
  assert.equal(switched.action, "OBSERVE");
  assert.equal(switched.scoreBreakdown.reconsideration.reason, "utility margin");
});

test("SLEEP and AVOID never reconsider at their midpoint", () => {
  for (const action of ["SLEEP", "AVOID"]) {
    const core = highCuriosityCore(1410 + action.length);
    controlledBehavior(core, action);
    const before = core.toSnapshot();

    const events = core.advance(60, changedNoveltyEnvironment);

    assert.deepEqual(events, []);
    assert.equal(core.currentBehavior.action, action);
    assert.equal(core.currentBehavior.endsAt, before.currentBehavior.endsAt);
  }
});

test("large and partitioned advances produce identical midpoint state and intents", () => {
  const large = highCuriosityCore(1415);
  const partitioned = highCuriosityCore(1415);
  controlledBehavior(large);
  controlledBehavior(partitioned);

  const largeEvents = large.advance(60, changedNoveltyEnvironment);
  const partitionedEvents = [
    ...partitioned.advance(20, changedNoveltyEnvironment),
    ...partitioned.advance(20, changedNoveltyEnvironment),
    ...partitioned.advance(20, changedNoveltyEnvironment),
  ];

  assertIntentClose(partitionedEvents[0], largeEvents[0]);
  assertCloseSnapshots(partitioned.toSnapshot(), large.toSnapshot());
});

test("save and reload are deterministic before and after the derived midpoint", () => {
  const uninterrupted = highCuriosityCore(1420);
  const beforeReload = highCuriosityCore(1420);
  controlledBehavior(uninterrupted);
  controlledBehavior(beforeReload);

  uninterrupted.advance(60, changedNoveltyEnvironment);
  beforeReload.advance(20, changedNoveltyEnvironment);
  const reloadedBefore = CreatureCore.fromSnapshot(JSON.parse(beforeReload.serialize()));
  reloadedBefore.advance(40, changedNoveltyEnvironment);
  assertCloseSnapshots(reloadedBefore.toSnapshot(), uninterrupted.toSnapshot());

  const afterSource = highCuriosityCore(1421);
  controlledBehavior(afterSource);
  afterSource.advance(60, changedNoveltyEnvironment);
  const reloadedAfter = CreatureCore.fromSnapshot(JSON.parse(afterSource.serialize()));
  const followUpSource = afterSource.advance(10, changedNoveltyEnvironment);
  const followUpReloaded = reloadedAfter.advance(10, changedNoveltyEnvironment);
  assert.deepEqual(followUpReloaded, followUpSource);
  assert.deepEqual(reloadedAfter.toSnapshot(), afterSource.toSnapshot());
  assert.equal(Object.hasOwn(reloadedAfter.currentBehavior, "midpoint"), false);
});

test("offline reconciliation performs the same midpoint switch while suppressing historical intents", () => {
  const online = highCuriosityCore(1422);
  const offline = highCuriosityCore(1422);
  controlledBehavior(online, "FOLLOW_CURSOR");
  controlledBehavior(offline, "FOLLOW_CURSOR");

  const onlineEvents = online.advance(60, activeThenAbsentEnvironment);
  const offlineEvents = offline.reconcileElapsed(60, activeThenAbsentEnvironment);

  assert.equal(onlineEvents.length, 1);
  assert.deepEqual(offlineEvents, []);
  assert.deepEqual(offline.toSnapshot(), online.toSnapshot());
});

test("a new autonomous intent cancels stale P7/P12 restoration without a second timer", async () => {
  const host = fakeHost();
  const adapter = new OpenPetsAdapter(host.ctx, host.scheduler);
  await adapter.execute(followIntent());
  await adapter.executeReunionResponse({ kind: "GREET_RETURN", duration: 1.2 }, followIntent());
  const staleTimer = host.timers.values().next().value;

  await adapter.execute({ action: "OBSERVE", duration: 30 });
  assert.equal(host.timers.size, 0);
  await staleTimer.callback();
  await Promise.resolve();
  assert.equal(adapter.cursorFollowing, false);
  assert.deepEqual(host.ctx.calls.filter(([name]) => name === "followCursor"), [
    ["followCursor", { enabled: true, lag: 0.35 }],
    ["followCursor", { enabled: false }],
  ]);
});

function followIntent() {
  return new BehaviorIntent({
    action: "FOLLOW_CURSOR",
    time: 0,
    duration: 30,
    reason: "midpoint transient experiment",
    score: 0,
    scoreBreakdown: { source: "MIDPOINT_TRANSIENT_EXPERIMENT" },
    interruptible: true,
  });
}

function fakeHost() {
  const calls = [];
  const timers = new Map();
  let nextTimer = 0;
  return {
    ctx: {
      calls,
      pet: {
        async followCursor(options) { calls.push(["followCursor", options]); },
        async physics(options) { calls.push(["physics", options]); },
        async react(reaction) { calls.push(["react", reaction]); },
        async getState() { return {}; },
      },
    },
    timers,
    scheduler: {
      setTimeoutFn(callback, delay) {
        const id = ++nextTimer;
        timers.set(id, { callback, delay });
        return id;
      },
      clearTimeoutFn(id) { timers.delete(id); },
    },
  };
}

function assertCloseSnapshots(actual, expected) {
  assert.equal(actual.simulationTimestamp, expected.simulationTimestamp);
  assert.equal(actual.rngState, expected.rngState);
  assert.deepEqual(actual.personality, expected.personality);
  assert.equal(actual.currentBehavior.action, expected.currentBehavior.action);
  assert.equal(actual.currentBehavior.startedAt, expected.currentBehavior.startedAt);
  assert.equal(actual.currentBehavior.endsAt, expected.currentBehavior.endsAt);
  assert.equal(actual.currentBehavior.duration, expected.currentBehavior.duration);
  assert.equal(actual.currentBehavior.interruptible, expected.currentBehavior.interruptible);
  assert.ok(Math.abs(actual.currentBehavior.score - expected.currentBehavior.score) < 1e-12);
  assert.deepEqual(
    actual.currentBehavior.scoreBreakdown.reconsideration
      ? Object.fromEntries(Object.entries(actual.currentBehavior.scoreBreakdown.reconsideration).filter(([key]) => key === "source" || key === "previousAction" || key === "challenger" || key === "reason"))
      : null,
    expected.currentBehavior.scoreBreakdown.reconsideration
      ? Object.fromEntries(Object.entries(expected.currentBehavior.scoreBreakdown.reconsideration).filter(([key]) => key === "source" || key === "previousAction" || key === "challenger" || key === "reason"))
      : null,
  );
  for (const name of ["energy", "social", "curiosity", "stimulation"]) {
    assert.ok(Math.abs(actual.internalState[name] - expected.internalState[name]) < 1e-12, name);
  }
}

function assertIntentClose(actual, expected) {
  assert.equal(actual.action, expected.action);
  assert.equal(actual.time, expected.time);
  assert.equal(actual.interruptible, expected.interruptible);
  assert.ok(Math.abs(actual.duration - expected.duration) < 1e-12);
  assert.ok(Math.abs(actual.score - expected.score) < 1e-12);
  assert.deepEqual(
    Object.fromEntries(Object.entries(actual.scoreBreakdown.reconsideration).filter(([key]) => key === "source" || key === "previousAction" || key === "challenger" || key === "reason")),
    Object.fromEntries(Object.entries(expected.scoreBreakdown.reconsideration).filter(([key]) => key === "source" || key === "previousAction" || key === "challenger" || key === "reason")),
  );
}
