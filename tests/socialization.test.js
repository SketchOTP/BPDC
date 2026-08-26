import assert from "node:assert/strict";
import test from "node:test";

import {
  CreatureCore,
  MATURATION_DURATION_SECONDS,
  SOCIALIZATION_LEARNING_RATE,
  SOCIALIZATION_UTILITY_WEIGHT,
  createEnvironment,
} from "../src/creature-core/index.js";
import { offlineEnvironmentAt, restoreAndReconcile } from "../integrations/openpets/elapsed-reconciliation.js";
import { serializePersistenceEnvelope } from "../integrations/openpets/persistence-envelope.js";

const DAY = 24 * 60 * 60;
const SOCIAL_ENVIRONMENT = createEnvironment({
  localTime: 12,
  userPresent: true,
  userIdleDuration: 60,
  interactionPressure: 0.1,
});

function atMaturity(maturity, seed = 1101) {
  return CreatureCore.fromSnapshot({
    ...CreatureCore.create({ seed, createdAt: 0 }).toSnapshot(),
    simulationTimestamp: maturity * MATURATION_DURATION_SECONDS,
  });
}

function positiveContact(core, intensity = 1) {
  core.recordInteraction({ kind: "POSITIVE_CONTACT", intensity }, SOCIAL_ENVIRONMENT);
}

function candidate(core, action = "SEEK_ATTENTION") {
  return core.evaluate(SOCIAL_ENVIRONMENT).candidates.find((entry) => entry.action === action);
}

test("juvenile plasticity declines continuously and adult contact cannot imprint", () => {
  const values = [0, 0.25, 0.5, 0.75, 1].map((maturity, index) => {
    const core = atMaturity(maturity, 1101 + index);
    positiveContact(core);
    return core.socializationImprint;
  });

  assert.deepEqual(values, [
    SOCIALIZATION_LEARNING_RATE,
    SOCIALIZATION_LEARNING_RATE * 0.75,
    SOCIALIZATION_LEARNING_RATE * 0.5,
    SOCIALIZATION_LEARNING_RATE * 0.25,
    0,
  ]);
  assert.ok(values[0] > values[1] && values[1] > values[2] && values[2] > values[3]);
});

test("repeated juvenile contact saturates without allowing a few clicks to dominate", () => {
  const core = atMaturity(0, 1108);
  for (let index = 0; index < 40; index += 1) positiveContact(core);

  assert.ok(core.socializationImprint > 0.6);
  assert.ok(core.socializationImprint < 1);
  assert.ok(core.socializationImprint < 0.8);
});

test("no-contact maturation leaves the imprint at zero", () => {
  const core = CreatureCore.create({ seed: 1109, createdAt: 0 });
  core.reconcileElapsed(MATURATION_DURATION_SECONDS, () => createEnvironment({ localTime: 12 }));
  assert.equal(core.developmentSnapshot().maturity, 1);
  assert.equal(core.socializationImprint, 0);
});

test("developmental socialization is independent from bond and is the only utility delta", () => {
  const neutral = atMaturity(1, 1110);
  const imprinted = CreatureCore.fromSnapshot({
    ...neutral.toSnapshot(),
    socializationImprint: 0.8,
  });
  const neutralCandidate = candidate(neutral);
  const imprintedCandidate = candidate(imprinted);

  assert.equal(imprinted.relationship.bond, neutral.relationship.bond);
  assert.equal(imprinted.personality.sociability, neutral.personality.sociability);
  assert.equal(neutralCandidate.contributors.developmentalSocialization, 0);
  assert.equal(imprintedCandidate.contributors.developmentalSocialization, 0.8 * SOCIALIZATION_UTILITY_WEIGHT);
  assert.ok(Math.abs(
    imprintedCandidate.score - neutralCandidate.score
      - imprintedCandidate.contributors.developmentalSocialization,
  ) < 1e-12);
});

test("strong fatigue still defeats the bounded developmental attention bonus", () => {
  const core = atMaturity(1, 1111);
  core.socializationImprint = 1;
  core.drives = { energy: 1, social: 0.05, curiosity: 0.05, stimulation: 0.05 };
  core.currentBehavior = null;

  assert.equal(core.advance(0, SOCIAL_ENVIRONMENT)[0].action, "SLEEP");
});

test("imprint persists through reload and schema-5 migration invents none", () => {
  const core = atMaturity(0.25, 1112);
  positiveContact(core, 0.8);
  const snapshot = core.toSnapshot();
  const reloaded = CreatureCore.fromSnapshot(core.serialize());
  const schema5 = { ...snapshot, schemaVersion: 5 };
  delete schema5.socializationImprint;
  const migrated = CreatureCore.fromSnapshot(schema5);

  assert.equal(snapshot.schemaVersion, 6);
  assert.deepEqual(reloaded.toSnapshot(), snapshot);
  assert.equal(migrated.toSnapshot().schemaVersion, 6);
  assert.equal(migrated.socializationImprint, 0);
  assert.equal(migrated.relationship.bond, core.relationship.bond);
});

test("offline maturity crossing closes plasticity without fabricating contact", () => {
  const savedAt = 12_000_000;
  const core = atMaturity(0.5, 1113);
  positiveContact(core, 0.8);
  const before = core.socializationImprint;
  const restored = restoreAndReconcile(
    serializePersistenceEnvelope(core.serialize(), savedAt),
    {
      nowEpochMs: savedAt + 7 * DAY * 1_000,
      coreFactory: CreatureCore.fromSnapshot,
    },
  );

  assert.equal(restored.core.developmentSnapshot().maturity, 1);
  assert.equal(restored.core.socializationImprint, before);
  assert.ok(restored.core.relationship.events.length <= core.relationship.events.length);
  assert.equal(restored.elapsedSeconds, 7 * DAY);
  assert.deepEqual(
    restored.core.developmentSnapshot(),
    { ageSeconds: MATURATION_DURATION_SECONDS, maturity: 1, sizeFactor: 1 },
  );
  assert.equal(offlineEnvironmentAt(savedAt).userPresent, false);
});

test("adult positive contact keeps existing learning systems while leaving imprint unchanged", () => {
  const core = atMaturity(1, 1114);
  const responseBefore = core.selectInteractionResponse();
  const bondBefore = core.relationship.bond;
  const playBefore = core.playPreference.playPreference;
  const habitBefore = core.habit.attentionByHour[12];
  core.currentBehavior = null;
  core.currentBehavior = {
    action: "PLAY", startedAt: 0, endsAt: 600, duration: 600, interruptible: true,
    cooldown: 0, reason: "controlled adult contact", score: 0, scoreBreakdown: {},
  };
  positiveContact(core, 1);

  assert.equal(core.socializationImprint, 0);
  assert.ok(core.relationship.bond > bondBefore);
  assert.ok(core.playPreference.playPreference > playBefore);
  assert.ok(core.habit.attentionByHour[12] > habitBefore);
  assert.equal(core.selectInteractionResponse().kind, responseBefore.kind);
});
