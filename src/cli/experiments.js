#!/usr/bin/env node
import { CreatureCore, createEnvironment } from "../creature-core/index.js";
import { PresenceTracker } from "../../integrations/openpets/presence-tracker.js";
import { RestSiteTracker, distanceBetween } from "../../integrations/openpets/rest-site-tracker.js";
import { offlineEnvironmentAt, restoreAndReconcile } from "../../integrations/openpets/elapsed-reconciliation.js";
import {
  deserializePersistenceEnvelope,
  serializePersistenceEnvelope,
} from "../../integrations/openpets/persistence-envelope.js";

const replay = runReplayExperiment();
const personality = runPersonalityExperiment();
const causality = runCausalityExperiment();
const persistence = runPersistenceExperiment();
const trace24h = runTraceExperiment();
const relationship = runRelationshipCausalityExperiment();
const relationshipPersistence = runRelationshipPersistenceExperiment();
const forgetting = runForgettingExperiment();
const saturation = runSaturationExperiment();
const habitConcentration = runHabitConcentrationExperiment();
const habitPersistence = runHabitPersistenceExperiment();
const habitDecay = runHabitDecayExperiment();
const habitNonDomination = runHabitNonDominationExperiment();
const presenceTransitions = runPresenceTransitionExperiment();
const presenceUtility = runPresenceUtilityExperiment();
const presenceDriveEvolution = runPresenceDriveEvolutionExperiment();
const quietNormal = runQuietNormalExperiment();
const absence = runAbsenceExperiment();
const decayContinuity = runDecayContinuityExperiment();
const midnight = runMidnightExperiment();
const idempotentRestart = runIdempotentRestartExperiment();
const backwardClock = runBackwardClockExperiment();
const legacyMigration = runLegacyMigrationExperiment();
const longAbsence = runLongAbsenceExperiment();
const integrationHarness = runIntegrationHarnessExperiment();
const responseState = runInteractionResponseStateExperiment();
const responsePreservation = runInteractionResponsePreservationExperiment();
const responseLearning = runInteractionResponseLearningExperiment();
const responseOffline = runInteractionResponseOfflineExperiment();
const spatialConcentration = runSpatialConcentrationExperiment();
const spatialSaturation = runSpatialSaturationExperiment();
const spatialDecayRelocation = runSpatialDecayRelocationExperiment();
const spatialPersistence = runSpatialPersistenceExperiment();
const spatialUtility = runSpatialUtilityNonInterferenceExperiment();

console.log(JSON.stringify({
  directive: "BPDC-P8-001",
  status: [replay, personality, causality, persistence, relationship, relationshipPersistence, forgetting, saturation, habitConcentration, habitPersistence, habitDecay, habitNonDomination, presenceTransitions, presenceUtility, presenceDriveEvolution, quietNormal, absence, decayContinuity, midnight, idempotentRestart, backwardClock, legacyMigration, longAbsence, integrationHarness, responseState, responsePreservation, responseLearning, responseOffline, spatialConcentration, spatialSaturation, spatialDecayRelocation, spatialPersistence, spatialUtility]
    .every((result) => result.status === "PASS")
    ? "PASS"
    : "FAIL",
  experiments: {
    replay, personality, causality, persistence, relationship, relationshipPersistence, forgetting, saturation,
    habitConcentration, habitPersistence, habitDecay, habitNonDomination,
    presenceTransitions, presenceUtility, presenceDriveEvolution,
    quietNormal, absence, decayContinuity, midnight, idempotentRestart,
    backwardClock, legacyMigration, longAbsence, integrationHarness,
    responseState, responsePreservation, responseLearning, responseOffline,
    spatialConcentration, spatialSaturation, spatialDecayRelocation, spatialPersistence, spatialUtility,
  },
  trace24h,
}, null, 2));

function runReplayExperiment() {
  const first = CreatureCore.create({ seed: 1234 });
  const second = CreatureCore.create({ seed: 1234 });
  const firstTrace = runHours(first, 24, timedEnvironment);
  const secondTrace = runHours(second, 24, timedEnvironment);
  return {
    status: JSON.stringify(firstTrace) === JSON.stringify(secondTrace) ? "PASS" : "FAIL",
    events: firstTrace.length,
    finalTimestamp: first.toSnapshot().simulationTimestamp,
  };
}

function runPersonalityExperiment() {
  const distributions = [];
  for (let seed = 1; seed <= 10; seed += 1) {
    const core = CreatureCore.create({ seed });
    const events = runHours(core, 24, sharedEnvironment);
    distributions.push({
      seed,
      personality: core.personality,
      behaviorCounts: countBehaviors(events),
    });
  }
  const signatures = new Set(distributions.map(({ behaviorCounts }) => JSON.stringify(behaviorCounts)));
  return {
    status: signatures.size >= 3 ? "PASS" : "FAIL",
    distinctDistributions: signatures.size,
    distributions,
  };
}

function runCausalityExperiment() {
  const sleepy = CreatureCore.create({ seed: 21 });
  sleepy.drives = { energy: 1, social: 0.05, curiosity: 0.05, stimulation: 0.05 };
  const social = CreatureCore.create({ seed: 22 });
  social.drives = { energy: 0.05, social: 1, curiosity: 0.05, stimulation: 0.05 };
  social.personality = {
    curiosity: 0.2, sociability: 1, playfulness: 0.2, boldness: 0.2, independence: 0.1, sleepiness: 0.2,
  };
  const playful = CreatureCore.create({ seed: 23 });
  playful.drives = { energy: 0.05, social: 0.05, curiosity: 0.2, stimulation: 1 };
  playful.personality = {
    curiosity: 0.3, sociability: 0.2, playfulness: 1, boldness: 0.5, independence: 0.5, sleepiness: 0.1,
  };
  const selected = {
    lowEnergy: sleepy.advance(0, createEnvironment({ localTime: 2 }))[0].action,
    highSocial: social.advance(0, createEnvironment({ localTime: 12, userPresent: true }))[0].action,
    highStimulation: playful.advance(0, sharedEnvironment)[0].action,
  };
  return {
    status: selected.lowEnergy === "SLEEP" && selected.highSocial === "SEEK_ATTENTION" && selected.highStimulation === "PLAY"
      ? "PASS"
      : "FAIL",
    selected,
  };
}

function runPersistenceExperiment() {
  const uninterrupted = CreatureCore.create({ seed: 77, createdAt: 100 });
  const split = CreatureCore.create({ seed: 77, createdAt: 100 });
  runHours(uninterrupted, 12, timedEnvironment);
  runHours(split, 12, timedEnvironment);
  const reloaded = CreatureCore.fromSnapshot(JSON.parse(split.serialize()));
  const uninterruptedSecond = runHours(uninterrupted, 12, timedEnvironment);
  const reloadedSecond = runHours(reloaded, 12, timedEnvironment);
  return {
    status: JSON.stringify(uninterruptedSecond) === JSON.stringify(reloadedSecond)
      && JSON.stringify(uninterrupted.toSnapshot()) === JSON.stringify(reloaded.toSnapshot())
      ? "PASS"
      : "FAIL",
    saveBoundary: 12,
    finalTimestamp: reloaded.toSnapshot().simulationTimestamp,
  };
}

function runTraceExperiment() {
  const core = CreatureCore.create({ seed: 9001 });
  const trace = runHours(core, 24, timedEnvironment);
  return {
    status: trace.length >= 10 ? "PASS" : "FAIL",
    events: trace.length,
    behaviorCounts: countBehaviors(trace),
    finalDrives: core.drives,
    finalBehavior: core.currentBehavior?.action ?? null,
  };
}

function runRelationshipCausalityExperiment() {
  const environment = createEnvironment({ localTime: 12, userPresent: true, userIdleDuration: 60, interactionPressure: 0.3 });
  const positive = CreatureCore.create({ seed: 601 });
  const neutral = CreatureCore.create({ seed: 601 });
  const negative = CreatureCore.create({ seed: 601 });
  for (let index = 0; index < 4; index += 1) {
    positive.recordInteraction({ kind: "POSITIVE_CONTACT", intensity: 0.8 });
    negative.recordInteraction({ kind: "NEGATIVE_CONTACT", intensity: 0.8 });
  }
  const get = (core, action) => core.evaluate(environment).candidates.find((candidate) => candidate.action === action);
  const seekDelta = get(positive, "SEEK_ATTENTION").score - get(negative, "SEEK_ATTENTION").score;
  const avoidDelta = get(negative, "AVOID").score - get(positive, "AVOID").score;
  return {
    status: seekDelta > 0.1 && avoidDelta > 0.1 && neutral.relationship.bond === 0.5 ? "PASS" : "FAIL",
    seekDelta,
    avoidDelta,
    bonds: [positive.relationship.bond, neutral.relationship.bond, negative.relationship.bond],
  };
}

function runRelationshipPersistenceExperiment() {
  const uninterrupted = CreatureCore.create({ seed: 602 });
  const split = CreatureCore.create({ seed: 602 });
  for (let index = 0; index < 3; index += 1) {
    uninterrupted.recordInteraction({ kind: "POSITIVE_CONTACT", intensity: 0.7 });
    split.recordInteraction({ kind: "POSITIVE_CONTACT", intensity: 0.7 });
  }
  runHours(uninterrupted, 2, timedEnvironment);
  runHours(split, 2, timedEnvironment);
  const reloaded = CreatureCore.fromSnapshot(JSON.parse(split.serialize()));
  const first = runHours(uninterrupted, 3, timedEnvironment);
  const second = runHours(reloaded, 3, timedEnvironment);
  return {
    status: JSON.stringify(first) === JSON.stringify(second)
      && JSON.stringify(uninterrupted.toSnapshot()) === JSON.stringify(reloaded.toSnapshot()) ? "PASS" : "FAIL",
    bond: reloaded.relationship.bond,
    events: reloaded.relationship.events.length,
  };
}

function runForgettingExperiment() {
  const core = CreatureCore.create({ seed: 603 });
  core.recordInteraction({ kind: "POSITIVE_CONTACT", intensity: 1 });
  const immediate = core.relationshipSnapshot().recentInfluence;
  core.advance(6 * 3600, createEnvironment({ localTime: 12 }));
  const later = core.relationshipSnapshot().recentInfluence;
  core.advance(24 * 3600, createEnvironment({ localTime: 12 }));
  const muchLater = core.relationshipSnapshot();
  return {
    status: immediate > later && later > muchLater.recentInfluence && muchLater.events.length === 0 ? "PASS" : "FAIL",
    immediate, later, muchLater: muchLater.recentInfluence, bond: muchLater.bond,
  };
}

function runSaturationExperiment() {
  const core = CreatureCore.create({ seed: 604 });
  for (let index = 0; index < 20; index += 1) core.recordInteraction({ kind: "POSITIVE_CONTACT", intensity: 1 });
  return {
    status: core.relationship.bond > 0.5 && core.relationship.bond < 0.9 ? "PASS" : "FAIL",
    bondAfter20Positive: core.relationship.bond,
    retainedEvents: core.relationship.events.length,
  };
}

function runHabitConcentrationExperiment() {
  const routine = CreatureCore.create({ seed: 605 });
  const distributed = CreatureCore.create({ seed: 605 });
  for (let index = 0; index < 8; index += 1) {
    const interaction = { kind: "POSITIVE_CONTACT", intensity: 0.4 };
    routine.recordInteraction(interaction, environmentAt(20));
    distributed.recordInteraction(interaction, environmentAt(index));
  }
  const routineScore = getCandidate(routine, "SEEK_ATTENTION", environmentAt(20));
  const distributedScore = getCandidate(distributed, "SEEK_ATTENTION", environmentAt(20));
  return {
    status: routineScore.contributors.timeHabit > distributedScore.contributors.timeHabit
      && routine.relationship.bond === distributed.relationship.bond ? "PASS" : "FAIL",
    routineTimeHabit: routineScore.contributors.timeHabit,
    distributedTimeHabit: distributedScore.contributors.timeHabit,
    bondDifference: routine.relationship.bond - distributed.relationship.bond,
  };
}

function runHabitPersistenceExperiment() {
  const uninterrupted = CreatureCore.create({ seed: 606 });
  const split = CreatureCore.create({ seed: 606 });
  for (let index = 0; index < 5; index += 1) {
    const interaction = { kind: "POSITIVE_CONTACT", intensity: 0.6 };
    uninterrupted.recordInteraction(interaction, environmentAt(20));
    split.recordInteraction(interaction, environmentAt(20));
  }
  const reloaded = CreatureCore.fromSnapshot(JSON.parse(split.serialize()));
  return {
    status: JSON.stringify(uninterrupted.toSnapshot()) === JSON.stringify(reloaded.toSnapshot()) ? "PASS" : "FAIL",
    schema: reloaded.toSnapshot().schemaVersion,
    timeHabit: reloaded.habitSnapshot(environmentAt(20)).timeHabit,
  };
}

function runHabitDecayExperiment() {
  const core = CreatureCore.create({ seed: 607 });
  core.recordInteraction({ kind: "POSITIVE_CONTACT", intensity: 1 }, environmentAt(20));
  const initial = core.habitSnapshot(environmentAt(20)).timeHabit;
  core.advance(7 * 24 * 3600, environmentAt(12));
  const later = core.habitSnapshot(environmentAt(20)).timeHabit;
  core.advance(7 * 24 * 3600, environmentAt(12));
  const muchLater = core.habitSnapshot(environmentAt(20)).timeHabit;
  return { status: initial > later && later > muchLater ? "PASS" : "FAIL", initial, later, muchLater };
}

function runHabitNonDominationExperiment() {
  const core = CreatureCore.create({ seed: 608 });
  for (let index = 0; index < 24; index += 1) {
    core.recordInteraction({ kind: "POSITIVE_CONTACT", intensity: 1 }, environmentAt(20));
  }
  core.drives = { energy: 1, social: 0.05, curiosity: 0.05, stimulation: 0.05 };
  core.currentBehavior = null;
  const intent = core.advance(0, environmentAt(20))[0];
  return { status: intent.action === "SLEEP" ? "PASS" : "FAIL", selected: intent.action };
}

function runPresenceTransitionExperiment() {
  let now = 10_000;
  const tracker = new PresenceTracker({ clock: () => now });
  const startup = tracker.snapshot();
  tracker.apply({ kind: "IDLE", idleSeconds: 120 });
  const enteredIdle = tracker.snapshot();
  now += 30_000;
  const elapsedIdle = tracker.snapshot();
  tracker.apply({ kind: "ACTIVE" });
  const returned = tracker.snapshot();
  tracker.apply({ kind: "LOCKED" });
  const locked = tracker.snapshot();
  tracker.apply({ kind: "ACTIVE" });
  const unlocked = tracker.snapshot();
  const passed = startup.userPresent === false
    && enteredIdle.userIdleDuration === 120
    && elapsedIdle.userIdleDuration === 150
    && returned.userPresent === true
    && locked.userPresent === false
    && unlocked.userPresent === true;
  return { status: passed ? "PASS" : "FAIL", startup, enteredIdle, elapsedIdle, returned, locked, unlocked };
}

function runPresenceUtilityExperiment() {
  const core = CreatureCore.create({ seed: 609 });
  const active = createEnvironment({ localTime: 12, userPresent: true, userIdleDuration: 0 });
  const idle = createEnvironment({ localTime: 12, userPresent: false, userIdleDuration: 600 });
  const activeSeek = getCandidate(core, "SEEK_ATTENTION", active);
  const idleSeek = getCandidate(core, "SEEK_ATTENTION", idle);
  const activeSleep = getCandidate(core, "SLEEP", active);
  const idleSleep = getCandidate(core, "SLEEP", idle);
  return {
    status: activeSeek.score > idleSeek.score && activeSleep.score < idleSleep.score ? "PASS" : "FAIL",
    activeSeek: activeSeek.score,
    idleSeek: idleSeek.score,
    activeSleep: activeSleep.score,
    idleSleep: idleSleep.score,
  };
}

function runPresenceDriveEvolutionExperiment() {
  const active = CreatureCore.create({ seed: 610 });
  const absent = CreatureCore.create({ seed: 610 });
  active.evolveDrives(4 * 3600, createEnvironment({ userPresent: true, userIdleDuration: 0 }));
  absent.evolveDrives(4 * 3600, createEnvironment({ userPresent: false, userIdleDuration: 600 }));
  return {
    status: active.drives.social < absent.drives.social ? "PASS" : "FAIL",
    activeSocial: active.drives.social,
    absentSocial: absent.drives.social,
  };
}

function runQuietNormalExperiment() {
  const normal = CreatureCore.create({ seed: 611 });
  const quiet = CreatureCore.create({ seed: 611 });
  normal.advance(0, timedEnvironment);
  quiet.advance(0, timedEnvironment);
  const normalEvents = normal.advance(6 * 3600, timedEnvironment);
  const quietEvents = quiet.reconcileElapsed(6 * 3600, timedEnvironment);
  return {
    status: quietEvents.length === 0 && normalEvents.length > 0
      && JSON.stringify(normal.toSnapshot()) === JSON.stringify(quiet.toSnapshot()) ? "PASS" : "FAIL",
    normalEvents: normalEvents.length,
    quietEvents: quietEvents.length,
  };
}

function runAbsenceExperiment() {
  const savedAt = 1_000_000;
  const core = CreatureCore.create({ seed: 612 });
  core.advance(0, (timestamp) => offlineEnvironmentAt(savedAt + timestamp * 1_000, savedAt));
  const before = core.toSnapshot();
  const restored = restoreAndReconcile(
    serializePersistenceEnvelope(core.serialize(), savedAt),
    { nowEpochMs: savedAt + 6 * 3600 * 1_000, coreFactory: CreatureCore.fromSnapshot },
  );
  const after = restored.core.toSnapshot();
  return {
    status: after.simulationTimestamp > before.simulationTimestamp
      && JSON.stringify(after.internalState) !== JSON.stringify(before.internalState)
      && after.relationship.events.length === 0 ? "PASS" : "FAIL",
    elapsedSeconds: restored.elapsedSeconds,
    simulationTimestamp: after.simulationTimestamp,
    resumeAction: restored.resumeIntent?.action ?? null,
  };
}

function runDecayContinuityExperiment() {
  const core = CreatureCore.create({ seed: 613 });
  core.recordInteraction({ kind: "POSITIVE_CONTACT", intensity: 1 }, environmentAt(20));
  const bondBefore = core.relationshipSnapshot().bond;
  const habitBefore = core.habitSnapshot(environmentAt(20)).timeHabit;
  core.reconcileElapsed(8 * 24 * 3600, (timestamp) => offlineEnvironmentAt(timestamp * 1_000, 0));
  const bondAfter = core.relationshipSnapshot().bond;
  const habitAfter = core.habitSnapshot(environmentAt(20)).timeHabit;
  return {
    status: bondAfter < bondBefore && habitAfter < habitBefore && core.relationship.events.length === 0 ? "PASS" : "FAIL",
    bondBefore, bondAfter, habitBefore, habitAfter,
  };
}

function runMidnightExperiment() {
  const startEpochMs = new Date(2026, 7, 24, 23, 0, 0).getTime();
  const hours = new Set();
  const environment = (timestamp) => {
    const value = offlineEnvironmentAt(startEpochMs + timestamp * 1_000, startEpochMs);
    hours.add(Math.floor(value.localTime));
    return value;
  };
  const core = CreatureCore.create({ seed: 614 });
  core.advance(0, environment);
  core.reconcileElapsed(8 * 3600, environment);
  hours.add(Math.floor(offlineEnvironmentAt(startEpochMs + 8 * 3600 * 1_000, startEpochMs).localTime));
  return { status: hours.has(23) && hours.has(0) && hours.has(7) ? "PASS" : "FAIL", observedHours: [...hours].sort((a, b) => a - b) };
}

function runIdempotentRestartExperiment() {
  const savedAt = 2_000_000;
  const resumedAt = savedAt + 6 * 3600 * 1_000;
  const core = CreatureCore.create({ seed: 615 });
  core.advance(0, offlineEnvironmentAt);
  const first = restoreAndReconcile(
    serializePersistenceEnvelope(core.serialize(), savedAt),
    { nowEpochMs: resumedAt, coreFactory: CreatureCore.fromSnapshot },
  );
  const second = restoreAndReconcile(
    serializePersistenceEnvelope(first.core.serialize(), resumedAt),
    { nowEpochMs: resumedAt, coreFactory: CreatureCore.fromSnapshot },
  );
  return {
    status: first.elapsedSeconds === 6 * 3600 && second.elapsedSeconds === 0
      && JSON.stringify(first.core.toSnapshot()) === JSON.stringify(second.core.toSnapshot()) ? "PASS" : "FAIL",
    firstElapsedSeconds: first.elapsedSeconds,
    secondElapsedSeconds: second.elapsedSeconds,
  };
}

function runBackwardClockExperiment() {
  const savedAt = 3_000_000;
  const core = CreatureCore.create({ seed: 616 });
  const stored = serializePersistenceEnvelope(core.serialize(), savedAt);
  const restored = restoreAndReconcile(stored, { nowEpochMs: savedAt - 1, coreFactory: CreatureCore.fromSnapshot });
  return { status: restored.clockSkew && restored.elapsedSeconds === 0 ? "PASS" : "FAIL", clockSkew: restored.clockSkew };
}

function runLegacyMigrationExperiment() {
  const core = CreatureCore.create({ seed: 617 });
  core.recordInteraction({ kind: "POSITIVE_CONTACT", intensity: 0.6 });
  const restored = restoreAndReconcile(core.serialize(), { nowEpochMs: 4_000_000, coreFactory: CreatureCore.fromSnapshot });
  const migrated = deserializePersistenceEnvelope(serializePersistenceEnvelope(restored.core.serialize(), 4_000_000));
  return { status: restored.legacy && restored.elapsedSeconds === 0 && !migrated.legacy ? "PASS" : "FAIL", schema: JSON.parse(migrated.creatureSnapshot).schemaVersion };
}

function runLongAbsenceExperiment() {
  const durations = [24 * 3600, 7 * 24 * 3600, 30 * 24 * 3600];
  const timings = {};
  for (const duration of durations) {
    const core = CreatureCore.create({ seed: 618 });
    core.advance(0, offlineEnvironmentAt);
    const started = process.hrtime.bigint();
    core.reconcileElapsed(duration, (timestamp) => offlineEnvironmentAt(timestamp * 1_000, 0));
    timings[`${duration / 3600}h`] = Number(process.hrtime.bigint() - started) / 1e6;
  }
  return {
    status: Object.values(timings).every((milliseconds) => milliseconds < 5_000) ? "PASS" : "FAIL",
    milliseconds: timings,
  };
}

function runIntegrationHarnessExperiment() {
  const savedAt = 5_000_000;
  const resumedAt = savedAt + 6 * 3600 * 1_000;
  const core = CreatureCore.create({ seed: 619 });
  core.advance(0, offlineEnvironmentAt);
  const restored = restoreAndReconcile(
    serializePersistenceEnvelope(core.serialize(), savedAt),
    { nowEpochMs: resumedAt, coreFactory: CreatureCore.fromSnapshot },
  );
  const envelope = serializePersistenceEnvelope(restored.core.serialize(), resumedAt);
  const decoded = deserializePersistenceEnvelope(envelope);
  return {
    status: decoded.savedAtEpochMs === resumedAt && JSON.parse(decoded.creatureSnapshot).creatureId === core.creatureId ? "PASS" : "FAIL",
    savedAtEpochMs: decoded.savedAtEpochMs,
    creatureId: JSON.parse(decoded.creatureSnapshot).creatureId,
  };
}

function runInteractionResponseStateExperiment() {
  const enjoy = responseFixture({ bond: 0.95, sociability: 0.95, independence: 0.1 });
  const neutral = responseFixture({ bond: 0.5, sociability: 0.5, independence: 0.5 });
  const withdraw = responseFixture({ bond: 0.1, sociability: 0.2, independence: 0.95 });
  return {
    status: enjoy.kind === "ENJOY_CONTACT"
      && neutral.kind === "ACKNOWLEDGE_CONTACT"
      && withdraw.kind === "WITHDRAW_CONTACT"
      && enjoy.diagnostics.affinity > neutral.diagnostics.affinity
      && neutral.diagnostics.affinity > withdraw.diagnostics.affinity ? "PASS" : "FAIL",
    responses: [enjoy.kind, neutral.kind, withdraw.kind],
    affinities: [enjoy.diagnostics.affinity, neutral.diagnostics.affinity, withdraw.diagnostics.affinity],
  };
}

function runInteractionResponsePreservationExperiment() {
  const core = CreatureCore.create({ seed: 620 });
  core.advance(0, createEnvironment({ localTime: 12, userPresent: true }));
  const before = {
    behavior: JSON.stringify(core.currentBehavior),
    rngState: core.rng.getState(),
    drives: JSON.stringify(core.drives),
  };
  core.recordInteraction({ kind: "POSITIVE_CONTACT", intensity: 0.4 });
  const response = core.selectInteractionResponse();
  const after = {
    behavior: JSON.stringify(core.currentBehavior),
    rngState: core.rng.getState(),
    drives: JSON.stringify(core.drives),
  };
  return {
    status: response.diagnostics && JSON.stringify(before) === JSON.stringify(after) ? "PASS" : "FAIL",
    response: response.kind,
    behavior: core.currentBehavior?.action ?? null,
  };
}

function runInteractionResponseLearningExperiment() {
  const core = CreatureCore.create({ seed: 621 });
  core.advance(0, environmentAt(20));
  const bondBefore = core.relationship.bond;
  const habitBefore = core.habit.attentionByHour[20];
  const event = core.recordInteraction({ kind: "POSITIVE_CONTACT", intensity: 0.4 }, environmentAt(20));
  const response = core.selectInteractionResponse();
  return {
    status: event.kind === "POSITIVE_CONTACT"
      && core.relationship.bond > bondBefore
      && core.habit.attentionByHour[20] > habitBefore
      && response.kind ? "PASS" : "FAIL",
    bondBefore,
    bondAfter: core.relationship.bond,
    habitBefore,
    habitAfter: core.habit.attentionByHour[20],
    response: response.kind,
  };
}

function runInteractionResponseOfflineExperiment() {
  const savedAt = 6_000_000;
  const core = CreatureCore.create({ seed: 622 });
  core.advance(0, (timestamp) => offlineEnvironmentAt(savedAt + timestamp * 1_000, savedAt));
  const restored = restoreAndReconcile(
    serializePersistenceEnvelope(core.serialize(), savedAt),
    { nowEpochMs: savedAt + 6 * 3600 * 1_000, coreFactory: CreatureCore.fromSnapshot },
  );
  return {
    status: !Object.hasOwn(restored, "response") && !Object.hasOwn(restored.core.toSnapshot(), "interactionResponse") ? "PASS" : "FAIL",
    elapsedSeconds: restored.elapsedSeconds,
    resumeAction: restored.resumeIntent?.action ?? null,
  };
}

function runSpatialConcentrationExperiment() {
  const concentrated = CreatureCore.create({ seed: 801 });
  const scattered = CreatureCore.create({ seed: 801 });
  const concentratedTracker = new RestSiteTracker();
  const scatteredTracker = new RestSiteTracker();
  concentratedTracker.observePlacement({ x: 100, y: 100 });
  for (const position of [{ x: 102, y: 101 }, { x: 98, y: 99 }, { x: 101, y: 102 }, { x: 100, y: 100 }]) {
    concentrated.observeSpatial(concentratedTracker.observePlacement(position));
  }
  for (const position of [{ x: 100, y: 100 }, { x: 400, y: 100 }, { x: 800, y: 100 }, { x: 1_200, y: 100 }, { x: 1_600, y: 100 }]) {
    scattered.observeSpatial(scatteredTracker.observePlacement(position));
  }
  const concentratedAffinity = concentrated.spatialSnapshot().restSiteAffinity;
  const scatteredAffinity = scattered.spatialSnapshot().restSiteAffinity;
  return {
    status: concentratedAffinity > scatteredAffinity && scatteredAffinity === 0 ? "PASS" : "FAIL",
    concentratedAffinity,
    scatteredAffinity,
  };
}

function runSpatialSaturationExperiment() {
  const core = CreatureCore.create({ seed: 802 });
  const tracker = new RestSiteTracker();
  tracker.observePlacement({ x: 50, y: 50 });
  for (let index = 0; index < 20; index += 1) core.observeSpatial(tracker.observePlacement({ x: 50, y: 50 }));
  const affinity = core.spatialSnapshot().restSiteAffinity;
  return { status: affinity > 0.8 && affinity < 1 ? "PASS" : "FAIL", affinity };
}

function runSpatialDecayRelocationExperiment() {
  const core = CreatureCore.create({ seed: 803 });
  const tracker = new RestSiteTracker();
  tracker.observePlacement({ x: 50, y: 50 });
  for (let index = 0; index < 8; index += 1) core.observeSpatial(tracker.observePlacement({ x: 50, y: 50 }));
  const before = core.spatialSnapshot().restSiteAffinity;
  core.advance(14 * 24 * 3600, createEnvironment({ localTime: 12 }));
  const after = core.spatialSnapshot().restSiteAffinity;
  const relocation = [
    tracker.observePlacement({ x: 500, y: 500 }),
    tracker.observePlacement({ x: 502, y: 501 }),
    tracker.observePlacement({ x: 498, y: 499 }),
  ];
  return {
    status: before > after && relocation.at(-1).kind === "REST_SITE_RELOCATED"
      && distanceBetween(tracker.resolveTarget(), { x: 500, y: 500 }) < 5 ? "PASS" : "FAIL",
    before,
    after,
    relocation: relocation.map(({ kind }) => kind),
  };
}

function runSpatialPersistenceExperiment() {
  const core = CreatureCore.create({ seed: 804 });
  const tracker = new RestSiteTracker();
  tracker.observePlacement({ x: 200, y: 300 });
  for (let index = 0; index < 5; index += 1) core.observeSpatial(tracker.observePlacement({ x: 200, y: 300 }));
  const stored = serializePersistenceEnvelope(core.serialize(), 10_000, tracker.toSnapshot());
  const restored = restoreAndReconcile(stored, { nowEpochMs: 10_000, coreFactory: CreatureCore.fromSnapshot });
  return {
    status: JSON.stringify(restored.core.toSnapshot()) === JSON.stringify(core.toSnapshot())
      && JSON.stringify(restored.spatialState) === JSON.stringify(tracker.toSnapshot()) ? "PASS" : "FAIL",
    schema: restored.core.toSnapshot().schemaVersion,
    envelope: deserializePersistenceEnvelope(stored).envelopeVersion,
    affinity: restored.core.spatialSnapshot().restSiteAffinity,
  };
}

function runSpatialUtilityNonInterferenceExperiment() {
  const core = CreatureCore.create({ seed: 805 });
  const environment = createEnvironment({ localTime: 12, userPresent: true });
  const before = getCandidate(core, "SLEEP", environment);
  const tracker = new RestSiteTracker();
  tracker.observePlacement({ x: 10, y: 20 });
  for (let index = 0; index < 10; index += 1) core.observeSpatial(tracker.observePlacement({ x: 10, y: 20 }));
  const after = getCandidate(core, "SLEEP", environment);
  return {
    status: before.score === after.score && JSON.stringify(before.contributors) === JSON.stringify(after.contributors) ? "PASS" : "FAIL",
    before: before.score,
    after: after.score,
  };
}

function responseFixture({ bond, sociability, independence }) {
  const core = CreatureCore.create({ seed: 623 });
  core.advance(0, createEnvironment({ localTime: 12, userPresent: true }));
  core.relationship.bond = bond;
  core.personality.sociability = sociability;
  core.personality.independence = independence;
  return core.selectInteractionResponse();
}

function runHours(core, hours, environment) {
  const events = [];
  for (let remaining = hours * 3600; remaining > 0; remaining -= 300) {
    events.push(...core.advance(Math.min(300, remaining), environment));
  }
  return events;
}

function countBehaviors(events) {
  return Object.fromEntries(
    ["IDLE", "OBSERVE", "WANDER", "PLAY", "SEEK_ATTENTION", "AVOID", "SLEEP"].map((action) => [
      action,
      events.filter((event) => event.action === action).length,
    ]),
  );
}

function getCandidate(core, action, environment) {
  return core.evaluate(environment).candidates.find((candidate) => candidate.action === action);
}

function environmentAt(localTime) {
  return createEnvironment({
    localTime,
    userPresent: true,
    userIdleDuration: 60,
    novelty: 0.1,
    interactionPressure: 0.1,
  });
}

function sharedEnvironment() {
  return createEnvironment({
    localTime: 12,
    userPresent: true,
    userIdleDuration: 60,
    novelty: 0.45,
    interactionPressure: 0.1,
  });
}

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
