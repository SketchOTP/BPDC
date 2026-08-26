import assert from "node:assert/strict";
import test from "node:test";

import { CreatureCore } from "../src/creature-core/index.js";
import { PresenceTracker } from "../integrations/openpets/presence-tracker.js";
import { OpenPetsAdapter } from "../integrations/openpets/openpets-adapter.js";

function controlledClock() {
  let now = 1_000_000;
  return {
    clock: () => now,
    advance(milliseconds) { now += milliseconds; },
  };
}

function controlledBehavior(core, action = "IDLE") {
  const now = core.clock.now();
  core.currentBehavior = {
    action,
    startedAt: now,
    endsAt: now + 600,
    duration: 600,
    interruptible: true,
    cooldown: 0,
    reason: "controlled reunion experiment",
    score: 0,
    scoreBreakdown: { source: "CONTROLLED_REUNION_EXPERIMENT" },
  };
}

function responseFor({ absenceSeconds, bond = 0.5, sociability = 0.5, imprint = 0, action = "IDLE" } = {}) {
  const core = CreatureCore.create({ seed: 1201 });
  controlledBehavior(core, action);
  core.relationship.bond = bond;
  core.personality.sociability = sociability;
  core.socializationImprint = imprint;
  return { core, response: core.selectReunionResponse({ absenceSeconds, previousState: "IDLE" }) };
}

test("presence return exposes one-shot observed absence metadata", () => {
  const time = controlledClock();
  const tracker = new PresenceTracker({ clock: time.clock });
  tracker.apply({ kind: "IDLE", idleSeconds: 120 });
  time.advance(1_800_000);

  const returned = tracker.apply({ kind: "ACTIVE" });
  assert.equal(returned.state, "ACTIVE");
  assert.equal(returned.previousState, "IDLE");
  assert.equal(returned.absenceSeconds, 1920);
  assert.equal(returned.returnedFromAbsence, true);
  assert.equal(Object.hasOwn(tracker.snapshot(), "returnedFromAbsence"), false);
});

test("reunion duration is saturating and trivial absence is suppressed", () => {
  const short = responseFor({ absenceSeconds: 60 }).response;
  const medium = responseFor({ absenceSeconds: 1_800 }).response;
  const long = responseFor({ absenceSeconds: 7_200 }).response;

  assert.equal(short, null);
  assert.equal(medium.kind, "ACKNOWLEDGE_RETURN");
  assert.equal(long.kind, "GREET_RETURN");
  assert.ok(long.diagnostics.contributors.absence > medium.diagnostics.contributors.absence);
  assert.ok(long.diagnostics.contributors.absence < 0.6);
});

test("bond, sociability, and juvenile socialization make an equal return warmer", () => {
  const low = responseFor({ absenceSeconds: 3_600, bond: 0.1, sociability: 0.2, imprint: 0 });
  const high = responseFor({ absenceSeconds: 3_600, bond: 0.9, sociability: 0.9, imprint: 1 });

  assert.ok(high.response.diagnostics.affinity > low.response.diagnostics.affinity);
  assert.ok(high.response.diagnostics.contributors.bond > low.response.diagnostics.contributors.bond);
  assert.ok(high.response.diagnostics.contributors.sociability > low.response.diagnostics.contributors.sociability);
  assert.ok(high.response.diagnostics.contributors.socialization > low.response.diagnostics.contributors.socialization);
});

test("reunion selection preserves autonomous state and does not mutate relationship or development", () => {
  const { core } = responseFor({ absenceSeconds: 7_200, bond: 0.8, sociability: 0.7, imprint: 0.6 });
  const before = {
    behavior: structuredClone(core.currentBehavior),
    rng: core.rng.getState(),
    drives: structuredClone(core.drives),
    relationship: structuredClone(core.relationship),
    imprint: core.socializationImprint,
  };

  const response = core.selectReunionResponse({ absenceSeconds: 7_200, previousState: "LOCKED" });

  assert.ok(response);
  assert.deepEqual(core.currentBehavior, before.behavior);
  assert.equal(core.rng.getState(), before.rng);
  assert.deepEqual(core.drives, before.drives);
  assert.deepEqual(core.relationship, before.relationship);
  assert.equal(core.socializationImprint, before.imprint);
});

test("sleep remains undisturbed and startup has no reunion source", () => {
  const sleeping = responseFor({ absenceSeconds: 14_400, action: "SLEEP" }).response;
  assert.equal(sleeping, null);

  const tracker = new PresenceTracker();
  const startup = tracker.snapshot();
  assert.equal(startup.state, "UNKNOWN");
  assert.equal(Object.hasOwn(startup, "returnedFromAbsence"), false);
});

test("direct interaction consumes the return transition without a second presence reunion", () => {
  const time = controlledClock();
  const tracker = new PresenceTracker({ clock: time.clock });
  tracker.apply({ kind: "LOCKED" });
  time.advance(7_200_000);

  const directInteractionPresence = tracker.markActive();
  const duplicateActiveSignal = tracker.apply({ kind: "ACTIVE" });

  assert.equal(directInteractionPresence.returnedFromAbsence, true);
  assert.equal(Object.hasOwn(duplicateActiveSignal, "returnedFromAbsence"), false);
});

test("adapter reuses one bounded transient restoration slot for reunion and contact", async () => {
  const calls = [];
  const timers = new Map();
  let nextTimer = 1;
  const ctx = {
    calls,
    pet: {
      async react(reaction, options) { calls.push(["react", reaction, options]); },
      async wander(options) { calls.push(["wander", options]); },
      async physics(options) { calls.push(["physics", options]); },
      async getState() { return { currentAnimation: "idle" }; },
    },
  };
  const scheduler = {
    setTimeoutFn(callback, delay) { const id = nextTimer++; timers.set(id, { callback, delay }); return id; },
    clearTimeoutFn(id) { timers.delete(id); },
  };
  const adapter = new OpenPetsAdapter(ctx, scheduler);

  await adapter.executeReunionResponse({ kind: "GREET_RETURN", duration: 1.2 }, { action: "IDLE", duration: 1 });
  assert.equal(timers.size, 1);
  assert.equal(calls.at(-1)[1], "celebrating");
  await adapter.executeInteractionResponse({ kind: "ACKNOWLEDGE_CONTACT", duration: 0.6 }, { action: "IDLE", duration: 1 });
  assert.equal(timers.size, 1);
  assert.equal(calls.at(-1)[1], "waving");
});

test("P5 presence environment fields remain unchanged on return", () => {
  const time = controlledClock();
  const tracker = new PresenceTracker({ clock: time.clock });
  tracker.apply({ kind: "IDLE", idleSeconds: 600 });
  time.advance(3_600_000);
  const returned = tracker.apply({ kind: "ACTIVE" });
  assert.equal(returned.userPresent, true);
  assert.equal(returned.userIdleDuration, 0);
});
