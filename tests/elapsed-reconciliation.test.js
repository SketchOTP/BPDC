import assert from "node:assert/strict";
import test from "node:test";

import { CreatureCore, createEnvironment } from "../src/creature-core/index.js";
import {
  localHourAt,
  offlineEnvironmentAt,
  restoreAndReconcile,
} from "../integrations/openpets/elapsed-reconciliation.js";
import {
  deserializePersistenceEnvelope,
  serializePersistenceEnvelope,
} from "../integrations/openpets/persistence-envelope.js";

const SIX_HOURS = 6 * 3600;
const DAY = 24 * 3600;

test("quiet reconciliation and normal advancement preserve identical final state", () => {
  const normal = CreatureCore.create({ seed: 701 });
  const quiet = CreatureCore.create({ seed: 701 });
  const environment = (timestamp) => timedEnvironment(timestamp);
  normal.advance(0, environment);
  quiet.advance(0, environment);

  const normalEvents = normal.advance(SIX_HOURS, environment);
  const quietEvents = quiet.reconcileElapsed(SIX_HOURS, environment);

  assert.ok(normalEvents.length > 0);
  assert.deepEqual(quietEvents, []);
  assert.deepEqual(quiet.toSnapshot(), normal.toSnapshot());
});

test("six hours of absence advance simulation without inventing interaction", () => {
  const core = CreatureCore.create({ seed: 702 });
  core.advance(0, (timestamp) => offlineEnvironmentAt(timestamp * 1_000, 0));
  const before = core.toSnapshot();

  const events = core.reconcileElapsed(SIX_HOURS, (timestamp) => offlineEnvironmentAt(timestamp * 1_000, 0));
  const after = core.toSnapshot();

  assert.deepEqual(events, []);
  assert.equal(after.simulationTimestamp, before.simulationTimestamp + SIX_HOURS);
  assert.notDeepEqual(after.internalState, before.internalState);
  assert.deepEqual(after.relationship.events, []);
  assert.ok(core.currentIntent());
});

test("relationship and time-habit decay continue during offline reconciliation", () => {
  const core = CreatureCore.create({ seed: 703 });
  core.recordInteraction({ kind: "POSITIVE_CONTACT", intensity: 1 }, createEnvironment({ localTime: 20 }));
  const bondBefore = core.relationshipSnapshot().bond;
  const habitBefore = core.habitSnapshot(createEnvironment({ localTime: 20 })).timeHabit;

  core.reconcileElapsed(8 * DAY, (timestamp) => offlineEnvironmentAt(timestamp * 1_000, 0));

  const bondAfter = core.relationshipSnapshot().bond;
  const habitAfter = core.habitSnapshot(createEnvironment({ localTime: 20 })).timeHabit;
  assert.ok(bondBefore > bondAfter);
  assert.ok(habitBefore > habitAfter);
  assert.equal(core.relationship.events.length, 0);
});

test("offline environment local time crosses midnight", () => {
  const startEpochMs = new Date(2026, 7, 24, 23, 0, 0).getTime();
  const observedHours = [];
  const core = CreatureCore.create({ seed: 704 });
  core.advance(0, (timestamp) => {
    const epochMs = startEpochMs + timestamp * 1_000;
    observedHours.push(Math.floor(localHourAt(epochMs)));
    return offlineEnvironmentAt(epochMs, startEpochMs);
  });
  core.reconcileElapsed(8 * 3600, (timestamp) => {
    const epochMs = startEpochMs + timestamp * 1_000;
    observedHours.push(Math.floor(localHourAt(epochMs)));
    return offlineEnvironmentAt(epochMs, startEpochMs);
  });
  const finalEnvironment = offlineEnvironmentAt(startEpochMs + 8 * 3600 * 1_000, startEpochMs);
  observedHours.push(Math.floor(finalEnvironment.localTime));

  assert.ok(observedHours.includes(23));
  assert.ok(observedHours.includes(0));
  assert.ok(observedHours.includes(7));
});

test("persisting at resume makes immediate restart idempotent", () => {
  const savedAt = Date.UTC(2026, 7, 24, 22, 0, 0);
  const resumedAt = savedAt + SIX_HOURS * 1_000;
  const initial = CreatureCore.create({ seed: 705 });
  initial.advance(0, (timestamp) => offlineEnvironmentAt(savedAt + timestamp * 1_000, savedAt));
  const stored = serializePersistenceEnvelope(initial.serialize(), savedAt);

  const first = restoreAndReconcile(stored, { nowEpochMs: resumedAt, coreFactory: CreatureCore.fromSnapshot });
  const persistedAtResume = serializePersistenceEnvelope(first.core.serialize(), resumedAt);
  const second = restoreAndReconcile(persistedAtResume, { nowEpochMs: resumedAt, coreFactory: CreatureCore.fromSnapshot });

  assert.equal(first.elapsedSeconds, SIX_HOURS);
  assert.equal(second.elapsedSeconds, 0);
  assert.deepEqual(second.core.toSnapshot(), first.core.toSnapshot());
});

test("backward wall-clock movement skips catch-up and preserves state", () => {
  const savedAt = 2_000_000;
  const core = CreatureCore.create({ seed: 706 });
  core.advance(0, offlineEnvironmentAt);
  const stored = serializePersistenceEnvelope(core.serialize(), savedAt);
  const restored = restoreAndReconcile(stored, { nowEpochMs: savedAt - 60_000, coreFactory: CreatureCore.fromSnapshot });

  assert.equal(restored.clockSkew, true);
  assert.equal(restored.elapsedSeconds, 0);
  assert.deepEqual(restored.core.toSnapshot(), core.toSnapshot());
});

test("legacy raw schema-3 storage gets zero invented catch-up and migrates", () => {
  const core = CreatureCore.create({ seed: 707 });
  core.recordInteraction({ kind: "POSITIVE_CONTACT", intensity: 0.6 });
  const raw = core.serialize();
  const restored = restoreAndReconcile(raw, { nowEpochMs: 9_000_000, coreFactory: CreatureCore.fromSnapshot });
  const migrated = serializePersistenceEnvelope(restored.core.serialize(), 9_000_000);
  const decoded = deserializePersistenceEnvelope(migrated);

  assert.equal(restored.legacy, true);
  assert.equal(restored.elapsedSeconds, 0);
  assert.deepEqual(restored.core.toSnapshot(), core.toSnapshot());
  assert.equal(decoded.legacy, false);
  assert.equal(decoded.savedAtEpochMs, 9_000_000);
});

test("exact 30-day quiet reconciliation remains bounded and does not collect history", () => {
  const core = CreatureCore.create({ seed: 708 });
  core.advance(0, (timestamp) => offlineEnvironmentAt(timestamp * 1_000, 0));
  const started = process.hrtime.bigint();
  const events = core.reconcileElapsed(30 * DAY, (timestamp) => offlineEnvironmentAt(timestamp * 1_000, 0));
  const elapsedMs = Number(process.hrtime.bigint() - started) / 1e6;

  assert.deepEqual(events, []);
  assert.ok(Math.abs(core.toSnapshot().simulationTimestamp - 30 * DAY) < 1e-6);
  assert.ok(elapsedMs < 5_000, `30-day reconciliation took ${elapsedMs.toFixed(2)}ms`);
});

test("OpenPets persistence harness restores, catches up, and saves a new envelope", () => {
  const storage = new Map();
  const savedAt = 10_000_000;
  const resumedAt = savedAt + SIX_HOURS * 1_000;
  const original = CreatureCore.create({ seed: 709 });
  original.advance(0, offlineEnvironmentAt);
  storage.set("bpdc.creature.snapshot", serializePersistenceEnvelope(original.serialize(), savedAt));

  const restored = restoreAndReconcile(storage.get("bpdc.creature.snapshot"), {
    nowEpochMs: resumedAt,
    coreFactory: CreatureCore.fromSnapshot,
  });
  storage.set("bpdc.creature.snapshot", serializePersistenceEnvelope(restored.core.serialize(), resumedAt));
  const finalEnvelope = deserializePersistenceEnvelope(storage.get("bpdc.creature.snapshot"));
  const finalCore = CreatureCore.fromSnapshot(finalEnvelope.creatureSnapshot);

  assert.equal(finalEnvelope.savedAtEpochMs, resumedAt);
  assert.equal(finalCore.creatureId, original.creatureId);
  assert.equal(finalCore.toSnapshot().simulationTimestamp, SIX_HOURS);
});

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
