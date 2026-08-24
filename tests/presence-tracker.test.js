import assert from "node:assert/strict";
import test from "node:test";

import { PresenceTracker } from "../integrations/openpets/presence-tracker.js";

function controlledClock() {
  let now = 10_000;
  return {
    clock: () => now,
    advance(milliseconds) { now += milliseconds; },
  };
}

test("presence transitions preserve bounded active, idle, and locked semantics", () => {
  const time = controlledClock();
  const tracker = new PresenceTracker({ clock: time.clock });

  assert.deepEqual(tracker.snapshot(), { state: "UNKNOWN", userPresent: false, userIdleDuration: 0 });

  tracker.apply({ kind: "IDLE", idleSeconds: 120 });
  assert.deepEqual(tracker.snapshot(), { state: "IDLE", userPresent: false, userIdleDuration: 120 });
  time.advance(30_000);
  assert.deepEqual(tracker.snapshot(), { state: "IDLE", userPresent: false, userIdleDuration: 150 });

  tracker.apply({ kind: "ACTIVE" });
  assert.deepEqual(tracker.snapshot(), { state: "ACTIVE", userPresent: true, userIdleDuration: 0 });
  tracker.apply({ kind: "LOCKED" });
  assert.deepEqual(tracker.snapshot(), { state: "LOCKED", userPresent: false, userIdleDuration: 0 });
  tracker.apply({ kind: "ACTIVE" });
  assert.deepEqual(tracker.snapshot(), { state: "ACTIVE", userPresent: true, userIdleDuration: 0 });
});

test("locked state preserves an existing idle duration and rejects invalid signals", () => {
  const time = controlledClock();
  const tracker = new PresenceTracker({ clock: time.clock });
  tracker.apply({ kind: "IDLE", idleSeconds: 45 });
  time.advance(5_000);
  tracker.apply({ kind: "LOCKED" });
  assert.equal(tracker.snapshot().userIdleDuration, 50);
  assert.throws(() => tracker.apply({ kind: "UNKNOWN" }), /Unsupported presence signal/);
});
