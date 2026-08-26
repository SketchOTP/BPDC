import test from "node:test";
import assert from "node:assert/strict";
import {
  ACTIONS,
  BEHAVIOR_DEFINITIONS,
  BehaviorIntent,
  CreatureCore,
  MATURATION_DURATION_SECONDS,
  createEnvironment,
} from "../src/creature-core/index.js";
import { OpenPetsAdapter } from "../integrations/openpets/openpets-adapter.js";

function activeEnvironment(overrides = {}) {
  return createEnvironment({
    localTime: 12,
    userPresent: true,
    userIdleDuration: 0,
    novelty: 0.2,
    interactionPressure: 0,
    ...overrides,
  });
}

function absentEnvironment() {
  return createEnvironment({ localTime: 12, userPresent: false, userIdleDuration: 3_600 });
}

function controlledFollowBehavior(core) {
  const now = core.clock.now();
  core.currentBehavior = {
    action: "FOLLOW_CURSOR",
    startedAt: now,
    endsAt: now + 30,
    duration: 30,
    interruptible: true,
    cooldown: 180,
    reason: "controlled follow experiment",
    score: 0,
    scoreBreakdown: { source: "CONTROLLED_FOLLOW_EXPERIMENT" },
  };
}

function followIntent(duration = 30) {
  return new BehaviorIntent({
    action: "FOLLOW_CURSOR",
    time: 0,
    duration,
    reason: "follow experiment",
    score: 0,
    scoreBreakdown: { source: "FOLLOW_TEST" },
    interruptible: true,
  });
}

function fakeHost() {
  const calls = [];
  const timers = new Map();
  let nextTimer = 0;
  const ctx = {
    calls,
    pet: {
      async followCursor(options) { calls.push(["followCursor", options]); },
      async physics(options) { calls.push(["physics", options]); },
      async react(reaction) { calls.push(["react", reaction]); },
      async wander(options) { calls.push(["wander", options]); },
      async getState() { calls.push(["getState"]); return { currentAnimation: "idle" }; },
    },
  };
  return {
    ctx,
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

test("FOLLOW_CURSOR is the eighth bounded action and has a short commitment", () => {
  assert.ok(ACTIONS.includes("FOLLOW_CURSOR"));
  assert.deepEqual(BEHAVIOR_DEFINITIONS.FOLLOW_CURSOR, {
    minDuration: 30,
    maxDuration: 45,
    interruptible: true,
    cooldown: 180,
  });
});

test("FOLLOW_CURSOR is eligible only for established active presence", () => {
  const core = CreatureCore.create({ seed: 1301 });
  const active = core.evaluate(activeEnvironment()).candidates.find((entry) => entry.action === "FOLLOW_CURSOR");
  const absent = core.evaluate(absentEnvironment()).candidates.find((entry) => entry.action === "FOLLOW_CURSOR");

  assert.equal(active.eligible, true);
  assert.equal(absent.eligible, false);
  core.currentBehavior = null;
  assert.notEqual(core.advance(0, absentEnvironment())[0].action, "FOLLOW_CURSOR");

  const motivated = CreatureCore.create({ seed: 1301 });
  motivated.drives = { energy: 0.1, social: 0.05, curiosity: 0.05, stimulation: 0.05 };
  motivated.personality = {
    curiosity: 0.3, sociability: 0.2, playfulness: 0.2, boldness: 1, independence: 0.1, sleepiness: 0.2,
  };
  assert.equal(motivated.advance(0, activeEnvironment({ novelty: 0 }))[0].action, "FOLLOW_CURSOR");
});

test("existing relationship, personality, and developmental state directionally warm following", () => {
  const low = CreatureCore.create({ seed: 1302 });
  const high = CreatureCore.fromSnapshot({ ...low.toSnapshot() });
  low.relationship.bond = 0.1;
  low.personality.sociability = 0.1;
  low.socializationImprint = 0;
  high.relationship.bond = 0.9;
  high.personality.sociability = 0.9;
  high.socializationImprint = 1;
  high.clock.advance(MATURATION_DURATION_SECONDS);

  const lowCandidate = low.evaluate(activeEnvironment()).candidates.find((entry) => entry.action === "FOLLOW_CURSOR");
  const highCandidate = high.evaluate(activeEnvironment()).candidates.find((entry) => entry.action === "FOLLOW_CURSOR");
  assert.ok(highCandidate.score > lowCandidate.score);
  assert.ok(highCandidate.contributors.bond > lowCandidate.contributors.bond);
  assert.ok(highCandidate.contributors.sociability > lowCandidate.contributors.sociability);
  assert.ok(highCandidate.contributors.developmentalSocialization > lowCandidate.contributors.developmentalSocialization);
});

test("strong fatigue defeats FOLLOW_CURSOR", () => {
  const core = CreatureCore.create({ seed: 1303 });
  core.drives = { energy: 1, social: 0.05, curiosity: 0.05, stimulation: 0.05 };
  assert.equal(core.advance(0, activeEnvironment())[0].action, "SLEEP");
});

test("FOLLOW_CURSOR selection is deterministic under identical active inputs", () => {
  const first = CreatureCore.create({ seed: 1304 });
  const second = CreatureCore.create({ seed: 1304 });
  assert.deepEqual(first.advance(0, activeEnvironment()), second.advance(0, activeEnvironment()));
  assert.deepEqual(first.toSnapshot(), second.toSnapshot());
});

test("saved FOLLOW_CURSOR behavior uses existing persistence semantics", () => {
  const core = CreatureCore.create({ seed: 1305 });
  controlledFollowBehavior(core);
  const restored = CreatureCore.fromSnapshot(core.serialize());
  assert.equal(restored.currentBehavior.action, "FOLLOW_CURSOR");
  assert.equal(restored.toSnapshot().schemaVersion, 6);
  assert.equal(Object.hasOwn(restored.toSnapshot(), "cursor"), false);
});

test("adapter enables following, disables it before another behavior, and suppresses redundant calls", async () => {
  const host = fakeHost();
  const adapter = new OpenPetsAdapter(host.ctx);

  await adapter.execute(followIntent());
  await adapter.execute({ action: "IDLE", duration: 30 });
  await adapter.execute({ action: "IDLE", duration: 30 });

  const followCalls = host.ctx.calls.filter(([name]) => name === "followCursor");
  assert.deepEqual(followCalls, [
    ["followCursor", { enabled: true, lag: 0.35 }],
    ["followCursor", { enabled: false }],
  ]);
  const disableIndex = host.ctx.calls.findIndex(([name, options]) => name === "followCursor" && options.enabled === false);
  const nextPhysicsIndex = host.ctx.calls.findIndex((entry, index) => index > disableIndex && entry[0] === "physics");
  assert.ok(disableIndex >= 0 && nextPhysicsIndex > disableIndex);
});

test("transient contact and reunion responses pause and restore FOLLOW_CURSOR in one slot", async () => {
  const host = fakeHost();
  const adapter = new OpenPetsAdapter(host.ctx, host.scheduler);
  await adapter.execute(followIntent());
  await adapter.executeInteractionResponse({ kind: "ACKNOWLEDGE_CONTACT", duration: 0.6 }, followIntent());
  assert.equal(host.timers.size, 1);
  const [timerId, timer] = host.timers.entries().next().value;
  host.timers.delete(timerId);
  await timer.callback();
  await Promise.resolve();
  assert.equal(adapter.cursorFollowing, true);

  await adapter.executeReunionResponse({ kind: "GREET_RETURN", duration: 1.2 }, followIntent());
  assert.equal(host.timers.size, 1);
  assert.equal(host.ctx.calls.filter(([name]) => name === "followCursor").length, 4);
});

test("shutdown always disables cursor following", async () => {
  const host = fakeHost();
  const adapter = new OpenPetsAdapter(host.ctx);
  await adapter.execute(followIntent());
  await adapter.shutdown();
  assert.deepEqual(host.ctx.calls.filter(([name]) => name === "followCursor").at(-1), [
    "followCursor", { enabled: false },
  ]);
  assert.equal(adapter.cursorFollowing, false);
});
