import assert from "node:assert/strict";
import test from "node:test";

import { CreatureCore, createEnvironment } from "../src/creature-core/index.js";
import { OpenPetsAdapter } from "../integrations/openpets/openpets-adapter.js";
import { targetSleepIntent } from "../integrations/openpets/plugin/index.src.js";
import { RestSiteTracker, distanceBetween } from "../integrations/openpets/rest-site-tracker.js";
import { restoreAndReconcile } from "../integrations/openpets/elapsed-reconciliation.js";
import {
  deserializePersistenceEnvelope,
  serializePersistenceEnvelope,
} from "../integrations/openpets/persistence-envelope.js";

test("repeated nearby placement reinforces one REST_SITE more than scattered placement", () => {
  const concentratedCore = CreatureCore.create({ seed: 801 });
  const concentrated = new RestSiteTracker();
  concentrated.observePlacement({ x: 100, y: 100 });
  for (const position of [{ x: 102, y: 101 }, { x: 98, y: 99 }, { x: 101, y: 102 }, { x: 100, y: 100 }]) {
    concentratedCore.observeSpatial(concentrated.observePlacement(position));
  }

  const scatteredCore = CreatureCore.create({ seed: 801 });
  const scattered = new RestSiteTracker();
  for (const position of [{ x: 100, y: 100 }, { x: 400, y: 100 }, { x: 800, y: 100 }, { x: 1_200, y: 100 }, { x: 1_600, y: 100 }]) {
    scatteredCore.observeSpatial(scattered.observePlacement(position));
  }

  assert.ok(concentratedCore.spatialSnapshot().restSiteAffinity > 0.3);
  assert.ok(concentratedCore.spatialSnapshot().restSiteAffinity > scatteredCore.spatialSnapshot().restSiteAffinity);
  assert.equal(scatteredCore.spatialSnapshot().restSiteAffinity, 0);
});

test("REST_SITE affinity saturates, decays, and relocation requires repeated placement", () => {
  const core = CreatureCore.create({ seed: 802 });
  const tracker = new RestSiteTracker();
  tracker.observePlacement({ x: 50, y: 50 });
  for (let index = 0; index < 20; index += 1) {
    core.observeSpatial(tracker.observePlacement({ x: 50, y: 50 }));
  }
  const saturated = core.spatialSnapshot().restSiteAffinity;
  assert.ok(saturated > 0.8 && saturated < 1);

  core.advance(14 * 24 * 3600, createEnvironment({ localTime: 12 }));
  assert.ok(core.spatialSnapshot().restSiteAffinity < saturated);

  assert.equal(tracker.observePlacement({ x: 500, y: 500 }).kind, "REST_SITE_PLACEMENT");
  assert.equal(tracker.observePlacement({ x: 502, y: 501 }).kind, "REST_SITE_PLACEMENT");
  assert.equal(tracker.observePlacement({ x: 498, y: 499 }).kind, "REST_SITE_RELOCATED");
  assert.ok(distanceBetween(tracker.resolveTarget(), { x: 498, y: 499 }) < 5);
});

test("spatial preference persists and schema-3 snapshots migrate without geometry", () => {
  const core = CreatureCore.create({ seed: 803 });
  const tracker = new RestSiteTracker();
  tracker.observePlacement({ x: 200, y: 300 });
  for (let index = 0; index < 5; index += 1) core.observeSpatial(tracker.observePlacement({ x: 200, y: 300 }));

  const stored = serializePersistenceEnvelope(core.serialize(), 10_000, tracker.toSnapshot());
  const restored = restoreAndReconcile(stored, {
    nowEpochMs: 10_000,
    coreFactory: CreatureCore.fromSnapshot,
  });
  assert.equal(restored.core.creatureId, core.creatureId);
  assert.deepEqual(restored.spatialState, tracker.toSnapshot());
  assert.deepEqual(restored.core.spatialSnapshot(), core.spatialSnapshot());
  assert.equal(deserializePersistenceEnvelope(stored).envelopeVersion, 2);

  const schema3 = { ...core.toSnapshot(), schemaVersion: 3 };
  delete schema3.spatial;
  const migrated = CreatureCore.fromSnapshot(schema3);
  assert.equal(migrated.toSnapshot().schemaVersion, 8);
  assert.equal(migrated.spatialSnapshot().restSiteAffinity, 0);
});

test("version-1 integration envelopes migrate without inventing a REST_SITE", () => {
  const core = CreatureCore.create({ seed: 804 });
  const legacyEnvelope = JSON.stringify({
    envelopeVersion: 1,
    savedAtEpochMs: 50_000,
    creatureSnapshot: core.serialize(),
  });
  const restored = restoreAndReconcile(legacyEnvelope, {
    nowEpochMs: 50_000,
    coreFactory: CreatureCore.fromSnapshot,
  });
  assert.equal(restored.spatialState, null);
  assert.equal(restored.core.spatialSnapshot().restSiteAffinity, 0);
});

test("adapter resolves REST_SITE before the normal SLEEP expression and falls back safely", async () => {
  const ctx = createFakeContext();
  const tracker = new RestSiteTracker();
  tracker.observePlacement({ x: 640, y: 480 });
  const adapter = new OpenPetsAdapter(ctx, { spatialTracker: tracker });

  await adapter.execute({ action: "SLEEP", duration: 600, habitatTarget: "REST_SITE" });
  assert.deepEqual(ctx.calls.map(([name]) => name), ["physics", "moveTo", "react", "getState"]);
  assert.deepEqual(ctx.calls[1][1], { x: 640, y: 480 });

  const noTarget = new OpenPetsAdapter(createFakeContext());
  await noTarget.execute({ action: "SLEEP", duration: 600, habitatTarget: "REST_SITE" });
  assert.equal(noTarget.ctx.calls.some(([name]) => name === "moveTo"), false);
});

test("REST_SITE targeting decorates an already-selected SLEEP without changing utility", () => {
  const core = CreatureCore.create({ seed: 805 });
  core.drives = { energy: 1, social: 0.05, curiosity: 0.05, stimulation: 0.05 };
  const environment = createEnvironment({ localTime: 2 });
  const before = core.evaluate(environment).candidates;
  const tracker = new RestSiteTracker();
  tracker.observePlacement({ x: 10, y: 20 });
  for (let index = 0; index < 8; index += 1) core.observeSpatial(tracker.observePlacement({ x: 10, y: 20 }));
  const intent = core.advance(0, environment)[0];
  const targeted = targetSleepIntent(intent, core, tracker);
  const after = core.evaluate(environment).candidates;

  assert.equal(intent.action, "SLEEP");
  assert.equal(targeted.habitatTarget, "REST_SITE");
  assert.deepEqual(after, before);
});

test("dragEnd becomes a host-neutral placement and display change invalidates geometry", async () => {
  const ctx = createFakeContext();
  const adapter = new OpenPetsAdapter(ctx);
  const received = [];
  const unsubscribe = adapter.subscribeSpatial((signal) => received.push(signal));

  ctx.state.position = { x: 321, y: 222 };
  await ctx.handlers.get("pet:dragEnd")();
  ctx.handlers.get("display:changed")();
  unsubscribe();

  assert.deepEqual(received[0], {
    kind: "USER_PLACED",
    source: "pet:dragEnd",
    position: { x: 321, y: 222 },
  });
  assert.deepEqual(received[1], { kind: "DISPLAY_CHANGED", source: "display:changed" });
});

function createFakeContext() {
  const calls = [];
  const handlers = new Map();
  const state = { position: { x: 20, y: 30 }, currentAnimation: "idle" };
  return {
    calls,
    handlers,
    state,
    pet: {
      async physics(options) { calls.push(["physics", options]); },
      async moveTo(position) { calls.push(["moveTo", position]); state.position = { ...position }; },
      async react(reaction, options) { calls.push(["react", reaction, options]); state.currentAnimation = reaction; },
      async getState() { calls.push(["getState"]); return structuredClone(state); },
    },
    events: {
      on(name, handler) { handlers.set(name, handler); return () => handlers.delete(name); },
    },
  };
}
