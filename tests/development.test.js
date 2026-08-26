import assert from "node:assert/strict";
import test from "node:test";

import {
  CreatureCore,
  MATURATION_DURATION_SECONDS,
  SNAPSHOT_SCHEMA_VERSION,
  developmentSnapshot,
  createEnvironment,
} from "../src/creature-core/index.js";
import { offlineEnvironmentAt, restoreAndReconcile } from "../integrations/openpets/elapsed-reconciliation.js";
import { OpenPetsAdapter } from "../integrations/openpets/openpets-adapter.js";
import { serializePersistenceEnvelope } from "../integrations/openpets/persistence-envelope.js";

const DAY = 24 * 60 * 60;

function assertClose(actual, expected, tolerance = 1e-12) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} is not close to ${expected}`);
}

function fakeContext() {
  const calls = [];
  return {
    calls,
    pet: {
      async setScale(sizeFactor) { calls.push(["setScale", sizeFactor]); },
    },
  };
}

test("development curve is continuous, monotonic, bounded, and age-derived", () => {
  const expected = [
    [0, 0, 0.8],
    [3.5, 0.25, 0.85],
    [7, 0.5, 0.9],
    [10.5, 0.75, 0.95],
    [14, 1, 1],
    [30, 1, 1],
  ];
  let previous = 0;
  for (const [days, maturity, sizeFactor] of expected) {
    const projection = developmentSnapshot({ createdAt: 100, simulationTimestamp: 100 + days * DAY });
    assertClose(projection.maturity, maturity);
    assertClose(projection.sizeFactor, sizeFactor);
    assert.ok(projection.sizeFactor >= previous);
    previous = projection.sizeFactor;
  }
  assert.equal(developmentSnapshot({ createdAt: 100, simulationTimestamp: 0 }).ageSeconds, 0);
  assert.equal(developmentSnapshot({ createdAt: 100, simulationTimestamp: 100 + 30 * DAY }).maturity, 1);
});

test("development is derived without schema or stored development state", () => {
  const core = CreatureCore.create({ seed: 801, createdAt: 400 });
  core.advance(7 * DAY, createEnvironment({ localTime: 12, userPresent: true }), { collectIntents: false });
  const snapshot = core.toSnapshot();
  const restored = CreatureCore.fromSnapshot(snapshot);

  assert.equal(snapshot.schemaVersion, SNAPSHOT_SCHEMA_VERSION);
  assert.equal(SNAPSHOT_SCHEMA_VERSION, 6);
  assert.equal(Object.hasOwn(snapshot, "development"), false);
  assert.deepEqual(restored.developmentSnapshot(), core.developmentSnapshot());
});

test("age changes do not change behavior candidates or behavioral state", () => {
  const young = CreatureCore.create({ seed: 802, createdAt: 0 });
  const mature = CreatureCore.fromSnapshot({
    ...young.toSnapshot(),
    simulationTimestamp: 14 * DAY,
  });
  const environment = createEnvironment({ localTime: 12, userPresent: true, novelty: 0.2 });
  const youngEvaluation = young.evaluate(environment);
  const matureEvaluation = mature.evaluate(environment);

  assert.deepEqual(matureEvaluation.candidates, youngEvaluation.candidates);
  assert.deepEqual(mature.personality, young.personality);
  assert.deepEqual(mature.drives, young.drives);
  assert.deepEqual(mature.relationship.events, young.relationship.events);
  assert.equal(mature.relationship.bond, young.relationship.bond);
  assert.deepEqual(mature.habit.attentionByHour, young.habit.attentionByHour);
  assert.deepEqual(mature.spatial, young.spatial);
  assert.equal(mature.playPreference.playPreference, young.playPreference.playPreference);
  assert.equal(young.developmentSnapshot().sizeFactor, 0.8);
  assert.equal(mature.developmentSnapshot().sizeFactor, 1);
});

test("offline reconciliation advances maturity through the existing P6 clock", () => {
  const savedAt = 900_000;
  const juvenile = CreatureCore.create({ seed: 803, createdAt: 0 });
  const savedProjection = juvenile.developmentSnapshot();
  const restored = restoreAndReconcile(
    serializePersistenceEnvelope(juvenile.serialize(), savedAt),
    {
      nowEpochMs: savedAt + 7 * DAY * 1_000,
      coreFactory: CreatureCore.fromSnapshot,
    },
  );
  const continuous = CreatureCore.fromSnapshot(juvenile.toSnapshot());
  continuous.reconcileElapsed(7 * DAY, (timestamp) => offlineEnvironmentAt(savedAt + timestamp * 1_000, savedAt));

  assert.equal(savedProjection.maturity, 0);
  assertClose(restored.core.developmentSnapshot().maturity, 0.5);
  assert.deepEqual(restored.core.developmentSnapshot(), continuous.developmentSnapshot());
  assert.equal(restored.elapsedSeconds, 7 * DAY);
});

test("save and reload preserve the same derived development projection", () => {
  const core = CreatureCore.create({ seed: 804, createdAt: 100 });
  core.reconcileElapsed(10 * DAY, createEnvironment({ localTime: 8, userPresent: false }));
  const before = core.developmentSnapshot();
  const restored = CreatureCore.fromSnapshot(core.serialize());
  assert.deepEqual(restored.developmentSnapshot(), before);
});

test("adapter applies bounded scale and suppresses unchanged quantized updates", async () => {
  const ctx = fakeContext();
  const adapter = new OpenPetsAdapter(ctx);
  const first = await adapter.applyDevelopment({ sizeFactor: 0.8 });
  const second = await adapter.applyDevelopment({ sizeFactor: 0.804 });
  const third = await adapter.applyDevelopment({ sizeFactor: 1.4 });

  assert.deepEqual(first, { command: "pet.setScale(0.8)", sizeFactor: 0.8, changed: true });
  assert.deepEqual(second, { command: "pet.setScale skipped", sizeFactor: 0.8, changed: false });
  assert.deepEqual(third, { command: "pet.setScale(1.4)", sizeFactor: 1.4, changed: true });
  assert.deepEqual(ctx.calls, [["setScale", 0.8], ["setScale", 1.4]]);
});

test("scale calls are bounded by meaningful 0.01 changes, not tick count", async () => {
  const ctx = fakeContext();
  const adapter = new OpenPetsAdapter(ctx);
  for (let index = 0; index <= 1_000; index += 1) {
    await adapter.applyDevelopment({ sizeFactor: 0.8 + (0.2 * index) / 1_000 });
  }

  assert.equal(ctx.calls.length, 21);
  assert.equal(ctx.calls[0][1], 0.8);
  assert.equal(ctx.calls.at(-1)[1], 1);
  assert.ok(MATURATION_DURATION_SECONDS > 0);
});
