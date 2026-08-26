import assert from "node:assert/strict";
import test from "node:test";

import {
  BEHAVIOR_DEFINITIONS,
  CreatureCore,
  ROUTINE_ACTIONS,
  ROUTINE_HALF_LIFE_SECONDS,
  ROUTINE_LEARNING_RATE,
  ROUTINE_UTILITY_WEIGHT,
  createEnvironment,
} from "../src/creature-core/index.js";

const PERIOD_ENVIRONMENTS = [0, 6, 12, 18].map((localTime) =>
  createEnvironment({ localTime, userPresent: true, userIdleDuration: 0, novelty: 0.2 }));

test("same-period natural completions learn one coarse activity affinity", () => {
  const core = CreatureCore.create({ seed: 1601 });
  complete(core, "PLAY", 2, 1);
  complete(core, "PLAY", 2, 1);

  assert.ok(core.habit.activityByPeriod[2].PLAY > 0);
  assert.equal(core.habit.activityByPeriod[0].PLAY, 0);
  assert.equal(core.habit.activityByPeriod[1].PLAY, 0);
  assert.equal(core.habit.activityByPeriod[3].PLAY, 0);
  const candidate = candidateFor(core, "PLAY", PERIOD_ENVIRONMENTS[2]);
  assert.equal(candidate.contributors.routine, core.habit.activityByPeriod[2].PLAY * ROUTINE_UTILITY_WEIGHT);
});

test("concentrated activity history is stronger than distributed history", () => {
  const concentrated = CreatureCore.create({ seed: 1602 });
  const distributed = CreatureCore.create({ seed: 1602 });
  for (let index = 0; index < 20; index += 1) {
    complete(concentrated, "PLAY", 2, 1);
    complete(distributed, "PLAY", index % 4, 1);
  }

  assert.ok(concentrated.habit.activityByPeriod[2].PLAY > distributed.habit.activityByPeriod[2].PLAY);
});

test("selected but incomplete activity does not learn, natural completion learns once", () => {
  const core = CreatureCore.create({ seed: 1603 });
  core.currentBehavior = behavior("PLAY", 10, 2);
  core.currentBehavior.interruptible = false;
  core.advance(5, PERIOD_ENVIRONMENTS[2]);
  assert.equal(core.habit.activityByPeriod[2].PLAY, 0);
  core.advance(5, PERIOD_ENVIRONMENTS[2]);
  assert.equal(core.habit.activityByPeriod[2].PLAY, ROUTINE_LEARNING_RATE);
});

test("midpoint abandonment does not learn the abandoned activity", () => {
  const core = CreatureCore.create({ seed: 1604 });
  core.currentBehavior = behavior("PLAY", 100, 2);
  core.reconsiderAtMidpoint = () => {
    core.startBehaviorCooldown("PLAY", core.clock.now());
    return core.commitBehavior(PERIOD_ENVIRONMENTS[2], {
      selection: {
        selected: { action: "OBSERVE", score: 1, contributors: {}, eligible: true },
        candidates: [{ action: "OBSERVE", score: 1, contributors: {}, eligible: true }],
      },
    });
  };
  core.advance(50, PERIOD_ENVIRONMENTS[2]);
  assert.equal(core.habit.activityByPeriod[2].PLAY, 0);
  assert.equal(core.habit.activityByPeriod[2].OBSERVE, 0);
});

test("schema-7 active behavior without period metadata does not invent learning", () => {
  const core = CreatureCore.create({ seed: 1605 });
  core.currentBehavior = behavior("PLAY", 1, 2);
  delete core.currentBehavior.routinePeriodAtStart;
  const legacy = core.toSnapshot();
  legacy.schemaVersion = 7;
  legacy.habit.schemaVersion = 1;
  delete legacy.habit.activityByPeriod;
  const restored = CreatureCore.fromSnapshot(legacy);

  restored.advance(1, PERIOD_ENVIRONMENTS[2]);
  assert.equal(restored.habit.activityByPeriod[2].PLAY, 0);
  restored.advance(0, PERIOD_ENVIRONMENTS[2]);
  assert.equal(restored.currentBehavior.routinePeriodAtStart, 2);
});

test("P4 attention habit remains isolated from routine learning and decay", () => {
  const routine = CreatureCore.create({ seed: 1606 });
  const control = CreatureCore.create({ seed: 1606 });
  for (let index = 0; index < 5; index += 1) {
    complete(routine, "PLAY", 2, 1);
    complete(control, "PLAY", 2, 1);
  }
  assert.deepEqual(routine.habit.attentionByHour, control.habit.attentionByHour);
  assert.equal(routine.habit.lastUpdatedAt, control.habit.lastUpdatedAt);
  assert.equal(ROUTINE_HALF_LIFE_SECONDS, 14 * 24 * 3600);
});

test("routine affinity decays by one fourteen-day half-life", () => {
  const core = CreatureCore.create({ seed: 1607 });
  complete(core, "PLAY", 2, 1);
  const before = core.habit.activityByPeriod[2].PLAY;
  core.clock.set(core.habit.lastUpdatedAt + ROUTINE_HALF_LIFE_SECONDS);
  core.decayHabit();
  assert.ok(Math.abs(core.habit.activityByPeriod[2].PLAY - before / 2) < 1e-12);
});

test("strong fatigue defeats routine preference", () => {
  const core = CreatureCore.create({ seed: 1608 });
  core.habit.activityByPeriod[2].PLAY = 1;
  core.drives = { energy: 1, social: 0.05, curiosity: 0.05, stimulation: 0.05 };
  core.currentBehavior = null;
  assert.equal(core.advance(0, PERIOD_ENVIRONMENTS[2])[0].action, "SLEEP");

  const nonSleep = CreatureCore.create({ seed: 1614 });
  nonSleep.habit.activityByPeriod[2].SLEEP = 1;
  nonSleep.drives = { energy: 0.05, social: 0.2, curiosity: 0.8, stimulation: 0.8 };
  nonSleep.personality = {
    curiosity: 0.8, sociability: 0.5, playfulness: 0.8, boldness: 0.8, independence: 0.5, sleepiness: 0.2,
  };
  const energetic = createEnvironment({ localTime: 12, userPresent: true, novelty: 0.8 });
  assert.notEqual(nonSleep.advance(0, energetic)[0].action, "SLEEP");
});

test("routine affinity never overrides presence or cooldown eligibility", () => {
  const core = CreatureCore.create({ seed: 1609 });
  core.habit.activityByPeriod[2].FOLLOW_CURSOR = 1;
  assert.equal(candidateFor(core, "FOLLOW_CURSOR", createEnvironment({ localTime: 12 })).eligible, false);
  core.behaviorCooldowns.PLAY = 100;
  core.habit.activityByPeriod[2].PLAY = 1;
  assert.equal(candidateFor(core, "PLAY", PERIOD_ENVIRONMENTS[2]).eligible, false);
});

test("different completed histories create different individual routine contributors", () => {
  const playIndividual = CreatureCore.create({ seed: 1610 });
  const wanderIndividual = CreatureCore.create({ seed: 1610 });
  for (let index = 0; index < 10; index += 1) {
    complete(playIndividual, "PLAY", 2, 1);
    complete(wanderIndividual, "WANDER", 2, 1);
  }
  const play = candidateFor(playIndividual, "PLAY", PERIOD_ENVIRONMENTS[2]);
  const wander = candidateFor(wanderIndividual, "PLAY", PERIOD_ENVIRONMENTS[2]);
  assert.ok(play.contributors.routine > wander.contributors.routine);
  assert.equal(playIndividual.personality.sociability, wanderIndividual.personality.sociability);
  assert.equal(playIndividual.relationship.bond, wanderIndividual.relationship.bond);
});

test("routine state and scoring survive save/reload", () => {
  const core = CreatureCore.create({ seed: 1611 });
  for (let index = 0; index < 4; index += 1) complete(core, "PLAY", 2, 1);
  const restored = CreatureCore.fromSnapshot(JSON.parse(core.serialize()));
  assert.deepEqual(restored.habit.activityByPeriod, core.habit.activityByPeriod);
  assert.deepEqual(restored.evaluate(PERIOD_ENVIRONMENTS[2]), core.evaluate(PERIOD_ENVIRONMENTS[2]));
  assert.equal(restored.toSnapshot().schemaVersion, 8);
});

test("offline reconciliation is equivalent to continuous routine learning", () => {
  const continuous = CreatureCore.create({ seed: 1612 });
  const offline = CreatureCore.create({ seed: 1612 });
  continuous.currentBehavior = behavior("SLEEP", 10, 3);
  offline.currentBehavior = behavior("SLEEP", 10, 3);
  const environment = (timestamp) => PERIOD_ENVIRONMENTS[Math.floor((timestamp / 10) % 4)];
  continuous.advance(200, environment);
  offline.reconcileElapsed(200, environment);
  assert.deepEqual(offline.toSnapshot(), continuous.toSnapshot());
});

test("routine affinity cannot bypass cooldown anti-lock", () => {
  const core = CreatureCore.create({ seed: 1613 });
  core.habit.activityByPeriod[2].PLAY = 1;
  core.behaviorCooldowns.PLAY = 100;
  const play = candidateFor(core, "PLAY", PERIOD_ENVIRONMENTS[2]);
  assert.equal(play.contributors.routine, ROUTINE_UTILITY_WEIGHT);
  assert.equal(play.eligible, false);
  assert.notEqual(core.advance(0, PERIOD_ENVIRONMENTS[2])[0].action, "PLAY");
});

function complete(core, action, period, duration) {
  core.currentBehavior = behavior(action, duration, period);
  core.currentBehavior.interruptible = false;
  core.advance(duration, PERIOD_ENVIRONMENTS[period]);
}

function behavior(action, duration, period) {
  return {
    action,
    startedAt: 0,
    endsAt: duration,
    duration,
    interruptible: !["SLEEP", "AVOID"].includes(action),
    cooldown: BEHAVIOR_DEFINITIONS[action].cooldown,
    routinePeriodAtStart: period,
    reason: "controlled routine experiment",
    score: 0,
    scoreBreakdown: { source: "CONTROLLED_ROUTINE_EXPERIMENT" },
  };
}

function candidateFor(core, action, environment) {
  return core.evaluate(environment).candidates.find((candidate) => candidate.action === action);
}
