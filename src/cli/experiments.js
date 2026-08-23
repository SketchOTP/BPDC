#!/usr/bin/env node
import { CreatureCore, createEnvironment } from "../creature-core/index.js";

const replay = runReplayExperiment();
const personality = runPersonalityExperiment();
const causality = runCausalityExperiment();
const persistence = runPersistenceExperiment();
const trace24h = runTraceExperiment();
const relationship = runRelationshipCausalityExperiment();
const relationshipPersistence = runRelationshipPersistenceExperiment();
const forgetting = runForgettingExperiment();
const saturation = runSaturationExperiment();

console.log(JSON.stringify({
  directive: "BPDC-P3-001",
  status: [replay, personality, causality, persistence, relationship, relationshipPersistence, forgetting, saturation]
    .every((result) => result.status === "PASS")
    ? "PASS"
    : "FAIL",
  experiments: {
    replay, personality, causality, persistence, relationship, relationshipPersistence, forgetting, saturation,
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
