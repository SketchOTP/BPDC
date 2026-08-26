import assert from "node:assert/strict";
import test from "node:test";

import { CreatureCore, createEnvironment } from "../src/creature-core/index.js";
import { restoreAndReconcile } from "../integrations/openpets/elapsed-reconciliation.js";
import { serializePersistenceEnvelope } from "../integrations/openpets/persistence-envelope.js";

const PLAY_ENVIRONMENT = createEnvironment({
  localTime: 12,
  userPresent: true,
  userIdleDuration: 60,
  novelty: 0.1,
  interactionPressure: 0.1,
});

test("positive contact during PLAY reinforces one preference, outside PLAY does not", () => {
  const playing = CreatureCore.create({ seed: 901 });
  const control = CreatureCore.create({ seed: 901 });
  commit(playing, "PLAY");
  commit(control, "WANDER");

  for (let index = 0; index < 8; index += 1) {
    const interaction = { kind: "POSITIVE_CONTACT", intensity: 0.6 };
    playing.recordInteraction(interaction, PLAY_ENVIRONMENT);
    control.recordInteraction(interaction, PLAY_ENVIRONMENT);
  }

  assert.ok(playing.playPreference.playPreference > 0);
  assert.equal(control.playPreference.playPreference, 0);
  assert.equal(playing.relationship.bond, control.relationship.bond);
  assert.deepEqual(playing.habit.attentionByHour, control.habit.attentionByHour);
  assert.equal(playing.personality.playfulness, control.personality.playfulness);
});

test("PLAY utility exposes a bounded learnedPreference contributor", () => {
  const trained = CreatureCore.create({ seed: 902 });
  const neutral = CreatureCore.create({ seed: 902 });
  train(trained, 10, 0.8);
  for (let index = 0; index < 10; index += 1) {
    commit(neutral, "OBSERVE");
    neutral.recordInteraction({ kind: "POSITIVE_CONTACT", intensity: 0.8 }, PLAY_ENVIRONMENT);
  }

  const trainedPlay = candidate(trained, "PLAY");
  const neutralPlay = candidate(neutral, "PLAY");
  assert.ok(trainedPlay.contributors.learnedPreference > 0);
  assert.ok(trainedPlay.contributors.learnedPreference <= 0.3);
  assert.equal(neutralPlay.contributors.learnedPreference, 0);
  assert.ok(trainedPlay.score > neutralPlay.score);
  assert.ok(Math.abs(
    trainedPlay.score - neutralPlay.score
      - (trainedPlay.contributors.learnedPreference - neutralPlay.contributors.learnedPreference),
  ) < 1e-12);
  assert.equal(trained.diagnosticSnapshot(PLAY_ENVIRONMENT).playPreference.learnedPreference, trainedPlay.contributors.learnedPreference);
});

test("autonomous PLAY without contact does not self-reinforce", () => {
  const core = CreatureCore.create({ seed: 903 });
  train(core, 6, 1);
  const before = core.playPreference.playPreference;
  commit(core, "PLAY");
  core.advance(24 * 3600, PLAY_ENVIRONMENT);
  const after = core.playPreference.playPreference;
  assert.ok(after < before);
  assert.ok(Math.abs(after - before * 2 ** (-(24 * 3600) / (21 * 24 * 3600))) < 1e-12);
});

test("play preference saturates and decays on a slow reversible timescale", () => {
  const core = CreatureCore.create({ seed: 904 });
  train(core, 40, 1);
  const saturated = core.playPreference.playPreference;
  core.advance(21 * 24 * 3600, createEnvironment({ localTime: 12 }));
  const decayed = core.playPreference.playPreference;

  assert.ok(saturated > 0.8 && saturated < 1);
  assert.ok(decayed < saturated);
  assert.ok(Math.abs(decayed - saturated / 2) < 1e-9);
});

test("strong fatigue still defeats a learned PLAY preference", () => {
  const core = CreatureCore.create({ seed: 905 });
  train(core, 40, 1);
  core.drives = { energy: 1, social: 0.05, curiosity: 0.05, stimulation: 0.05 };
  core.currentBehavior = null;

  assert.equal(core.advance(0, createEnvironment({ localTime: 12 }))[0].action, "SLEEP");
});

test("play preference persists and schema-4 creatures migrate with zero preference", () => {
  const core = CreatureCore.create({ seed: 906 });
  train(core, 5, 0.7);
  const snapshot = core.toSnapshot();
  const reloaded = CreatureCore.fromSnapshot(JSON.parse(core.serialize()));
  assert.deepEqual(reloaded.toSnapshot(), snapshot);
  assert.equal(reloaded.toSnapshot().schemaVersion, 7);

  const schema4 = { ...snapshot, schemaVersion: 4 };
  delete schema4.playPreference;
  const migrated = CreatureCore.fromSnapshot(schema4);
  assert.equal(migrated.toSnapshot().schemaVersion, 7);
  assert.equal(migrated.playPreference.playPreference, 0);
  assert.deepEqual(migrated.relationship, core.relationship);
  assert.deepEqual(migrated.habit, core.habit);
  assert.deepEqual(migrated.spatial, core.spatial);
  assert.deepEqual(migrated.personality, core.personality);
});

test("offline reconciliation may decay play preference but never reinforces it", () => {
  const savedAt = 10_000_000;
  const core = CreatureCore.create({ seed: 907 });
  train(core, 8, 0.8);
  const before = core.playPreference.playPreference;
  const restored = restoreAndReconcile(
    serializePersistenceEnvelope(core.serialize(), savedAt),
    { nowEpochMs: savedAt + 21 * 24 * 3600 * 1_000, coreFactory: CreatureCore.fromSnapshot },
  );

  assert.ok(restored.core.playPreference.playPreference < before);
  assert.ok(restored.core.relationship.events.length <= core.relationship.events.length);
  assert.equal(restored.elapsedSeconds, 21 * 24 * 3600);
});

test("P7 contact response remains independent of learned PLAY preference", () => {
  const trained = CreatureCore.create({ seed: 908 });
  const neutral = CreatureCore.create({ seed: 908 });
  commit(trained, "PLAY");
  commit(neutral, "PLAY");
  trained.recordInteraction({ kind: "POSITIVE_CONTACT", intensity: 1 }, PLAY_ENVIRONMENT);
  neutral.recordInteraction({ kind: "POSITIVE_CONTACT", intensity: 1 }, PLAY_ENVIRONMENT);

  assert.equal(trained.selectInteractionResponse().kind, neutral.selectInteractionResponse().kind);
  assert.equal(trained.currentBehavior.action, neutral.currentBehavior.action);
});

function train(core, count, intensity) {
  commit(core, "PLAY");
  for (let index = 0; index < count; index += 1) {
    core.recordInteraction({ kind: "POSITIVE_CONTACT", intensity }, PLAY_ENVIRONMENT);
  }
}

function commit(core, action) {
  const now = core.clock.now();
  core.currentBehavior = {
    action,
    startedAt: now,
    endsAt: now + 600,
    duration: 600,
    interruptible: true,
    cooldown: 0,
    reason: "controlled test behavior",
    score: 0,
    scoreBreakdown: { source: "CONTROLLED_TEST_BEHAVIOR" },
  };
}

function candidate(core, action) {
  return core.evaluate(PLAY_ENVIRONMENT).candidates.find((entry) => entry.action === action);
}
