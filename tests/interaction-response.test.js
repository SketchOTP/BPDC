import assert from "node:assert/strict";
import test from "node:test";

import { CreatureCore, createEnvironment } from "../src/creature-core/index.js";
import { offlineEnvironmentAt, restoreAndReconcile } from "../integrations/openpets/elapsed-reconciliation.js";
import { OpenPetsAdapter } from "../integrations/openpets/openpets-adapter.js";
import { serializePersistenceEnvelope } from "../integrations/openpets/persistence-envelope.js";

function createFakeContext() {
  const calls = [];
  const state = { currentAnimation: "idle" };
  return {
    calls,
    state,
    pet: {
      async physics(options) { calls.push(["physics", options]); },
      async wander(options) { calls.push(["wander", options]); state.currentAnimation = "run-right"; },
      async react(reaction, options) { calls.push(["react", reaction, options]); state.currentAnimation = reaction; },
      async getState() { return structuredClone(state); },
    },
  };
}

function createManualScheduler() {
  let nextId = 1;
  const timers = new Map();
  return {
    timers,
    setTimeoutFn(callback, delay) {
      const id = nextId++;
      timers.set(id, { callback, delay });
      return id;
    },
    clearTimeoutFn(id) {
      timers.delete(id);
    },
    async flush() {
      const pending = [...timers.entries()];
      timers.clear();
      for (const [, timer] of pending) await timer.callback();
    },
  };
}

function responseFor({ bond, sociability, independence, action = "IDLE" }) {
  const core = CreatureCore.create({ seed: 700 });
  core.advance(0, createEnvironment({ localTime: 12, userPresent: true }));
  core.relationship.bond = bond;
  core.personality.sociability = sociability;
  core.personality.independence = independence;
  core.currentBehavior.action = action;
  return core.selectInteractionResponse();
}

test("state-dependent contact response uses existing bond and personality", () => {
  const enjoy = responseFor({ bond: 0.95, sociability: 0.95, independence: 0.1 });
  const neutral = responseFor({ bond: 0.5, sociability: 0.5, independence: 0.5 });
  const withdraw = responseFor({ bond: 0.1, sociability: 0.2, independence: 0.95 });

  assert.equal(enjoy.kind, "ENJOY_CONTACT");
  assert.equal(neutral.kind, "ACKNOWLEDGE_CONTACT");
  assert.equal(withdraw.kind, "WITHDRAW_CONTACT");
  assert.deepEqual(Object.keys(enjoy.diagnostics.contributors).sort(), [
    "bond", "currentBehavior", "independence", "sociability",
  ]);
  assert.ok(enjoy.diagnostics.affinity > neutral.diagnostics.affinity);
  assert.ok(neutral.diagnostics.affinity > withdraw.diagnostics.affinity);
});

test("contact response preserves autonomous behavior, timing, RNG, and drives", () => {
  const core = CreatureCore.create({ seed: 701 });
  core.advance(0, createEnvironment({ localTime: 12, userPresent: true }));
  const before = {
    currentBehavior: structuredClone(core.currentBehavior),
    rngState: core.rng.getState(),
    drives: structuredClone(core.drives),
  };

  core.recordInteraction({ kind: "POSITIVE_CONTACT", intensity: 0.4 });
  const response = core.selectInteractionResponse();
  const after = {
    currentBehavior: structuredClone(core.currentBehavior),
    rngState: core.rng.getState(),
    drives: structuredClone(core.drives),
  };

  assert.ok(response.diagnostics);
  assert.deepEqual(after, before);
});

test("contact response leaves relationship, habit, and presence learning unchanged", () => {
  const core = CreatureCore.create({ seed: 702 });
  core.advance(0, createEnvironment({ localTime: 20, userPresent: true }));
  const bondBefore = core.relationship.bond;
  const habitBefore = core.habit.attentionByHour[20];
  const recorded = core.recordInteraction({ kind: "POSITIVE_CONTACT", intensity: 0.4 }, createEnvironment({ localTime: 20, userPresent: true }));
  const response = core.selectInteractionResponse();

  assert.equal(recorded.kind, "POSITIVE_CONTACT");
  assert.ok(core.relationship.bond > bondBefore);
  assert.ok(core.habit.attentionByHour[20] > habitBefore);
  assert.ok(response.kind);
});

test("sleeping state constrains contact expression without replacing sleep", () => {
  const core = CreatureCore.create({ seed: 703 });
  core.drives = { energy: 1, social: 0.05, curiosity: 0.05, stimulation: 0.05 };
  core.advance(0, createEnvironment({ localTime: 2, userPresent: true }));
  assert.equal(core.currentBehavior.action, "SLEEP");
  const before = structuredClone(core.currentBehavior);
  core.relationship.bond = 1;
  core.personality.sociability = 1;
  core.personality.independence = 0;
  const response = core.selectInteractionResponse();

  assert.equal(response.kind, "ACKNOWLEDGE_CONTACT");
  assert.equal(response.diagnostics.currentBehavior, "SLEEP");
  assert.deepEqual(core.currentBehavior, before);
});

test("adapter maps every transient response and restores the supplied behavior", async () => {
  for (const [kind, reaction] of [
    ["ENJOY_CONTACT", "celebrating"],
    ["ACKNOWLEDGE_CONTACT", "waving"],
    ["WITHDRAW_CONTACT", "failed"],
  ]) {
    const ctx = createFakeContext();
    const scheduler = createManualScheduler();
    const adapter = new OpenPetsAdapter(ctx, scheduler);
    await adapter.executeInteractionResponse({ kind, duration: 0.6 }, { action: "IDLE", duration: 1 });
    assert.equal(scheduler.timers.size, 1);
    assert.equal(ctx.calls.at(-1)[1], reaction);
    await scheduler.flush();
    assert.equal(ctx.calls.filter(([name]) => name === "react").at(-1)[1], "idle");
    assert.equal(scheduler.timers.size, 0);
  }
});

test("rapid contact responses coalesce to one restoration timer", async () => {
  const ctx = createFakeContext();
  const scheduler = createManualScheduler();
  const adapter = new OpenPetsAdapter(ctx, scheduler);
  const restore = { action: "WANDER", duration: 1 };
  for (const kind of ["ENJOY_CONTACT", "ACKNOWLEDGE_CONTACT", "WITHDRAW_CONTACT", "ACKNOWLEDGE_CONTACT"]) {
    await adapter.executeInteractionResponse({ kind, duration: 0.6 }, restore);
    assert.equal(scheduler.timers.size, 1);
  }

  await scheduler.flush();
  assert.equal(scheduler.timers.size, 0);
  assert.equal(ctx.calls.filter(([name]) => name === "wander").length, 1);
  assert.equal(ctx.calls.filter(([name]) => name === "react").length, 4);
});

test("offline reconciliation never fabricates a contact response", () => {
  const savedAt = 800_000;
  const core = CreatureCore.create({ seed: 704 });
  core.advance(0, (timestamp) => offlineEnvironmentAt(savedAt + timestamp * 1_000, savedAt));
  const restored = restoreAndReconcile(
    serializePersistenceEnvelope(core.serialize(), savedAt),
    { nowEpochMs: savedAt + 6 * 3600 * 1_000, coreFactory: CreatureCore.fromSnapshot },
  );

  assert.equal(restored.elapsedSeconds, 6 * 3600);
  assert.equal(Object.hasOwn(restored, "response"), false);
  assert.equal(Object.hasOwn(restored.core.toSnapshot(), "interactionResponse"), false);
});
