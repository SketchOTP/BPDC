import assert from "node:assert/strict";

import {
  BEHAVIOR_DEFINITIONS,
  CreatureCore,
  ROUTINE_HALF_LIFE_SECONDS,
  ROUTINE_LEARNING_RATE,
  ROUTINE_UTILITY_WEIGHT,
  createEnvironment,
} from "../creature-core/index.js";

const ENVIRONMENTS = [0, 6, 12, 18].map((localTime) =>
  createEnvironment({ localTime, userPresent: true, userIdleDuration: 0, novelty: 0.2 }));

export function runP16Experiments() {
  const results = {
    samePeriod: experiment(() => {
      const core = CreatureCore.create({ seed: 1701 });
      complete(core, "PLAY", 2);
      complete(core, "PLAY", 2);
      assert.ok(core.habit.activityByPeriod[2].PLAY > 0);
      assert.equal(core.habit.activityByPeriod[0].PLAY, 0);
      assert.ok(candidate(core, "PLAY", ENVIRONMENTS[2]).contributors.routine > 0);
    }),
    distributed: experiment(() => {
      const concentrated = CreatureCore.create({ seed: 1702 });
      const distributed = CreatureCore.create({ seed: 1702 });
      for (let index = 0; index < 20; index += 1) {
        complete(concentrated, "PLAY", 2);
        complete(distributed, "PLAY", index % 4);
      }
      assert.ok(concentrated.habit.activityByPeriod[2].PLAY > distributed.habit.activityByPeriod[2].PLAY);
    }),
    completion: experiment(() => {
      const core = CreatureCore.create({ seed: 1703 });
      core.currentBehavior = behavior("PLAY", 10, 2);
      core.currentBehavior.interruptible = false;
      core.advance(5, ENVIRONMENTS[2]);
      assert.equal(core.habit.activityByPeriod[2].PLAY, 0);
      core.advance(5, ENVIRONMENTS[2]);
      assert.equal(core.habit.activityByPeriod[2].PLAY, ROUTINE_LEARNING_RATE);
    }),
    abandonment: experiment(() => {
      const core = CreatureCore.create({ seed: 1704 });
      core.currentBehavior = behavior("PLAY", 100, 2);
      core.reconsiderAtMidpoint = () => {
        core.startBehaviorCooldown("PLAY");
        return core.commitBehavior(ENVIRONMENTS[2], {
          selection: { selected: { action: "OBSERVE", score: 1, contributors: {} }, candidates: [] },
        });
      };
      core.advance(50, ENVIRONMENTS[2]);
      assert.equal(core.habit.activityByPeriod[2].PLAY, 0);
    }),
    legacy: experiment(() => {
      const core = CreatureCore.create({ seed: 1705 });
      core.currentBehavior = behavior("PLAY", 1, 2);
      delete core.currentBehavior.routinePeriodAtStart;
      const legacy = core.toSnapshot();
      legacy.schemaVersion = 7;
      legacy.habit.schemaVersion = 1;
      delete legacy.habit.activityByPeriod;
      const restored = CreatureCore.fromSnapshot(legacy);
      restored.advance(1, ENVIRONMENTS[2]);
      assert.equal(restored.habit.activityByPeriod[2].PLAY, 0);
    }),
    p4Isolation: experiment(() => {
      const routine = CreatureCore.create({ seed: 1706 });
      const control = CreatureCore.create({ seed: 1706 });
      for (let index = 0; index < 5; index += 1) {
        complete(routine, "PLAY", 2);
        complete(control, "PLAY", 2);
      }
      assert.deepEqual(routine.habit.attentionByHour, control.habit.attentionByHour);
    }),
    decay: experiment(() => {
      const core = CreatureCore.create({ seed: 1707 });
      complete(core, "PLAY", 2);
      const before = core.habit.activityByPeriod[2].PLAY;
      core.clock.set(core.habit.lastUpdatedAt + ROUTINE_HALF_LIFE_SECONDS);
      core.decayHabit();
      assert.ok(Math.abs(core.habit.activityByPeriod[2].PLAY - before / 2) < 1e-12);
    }),
    nonDomination: experiment(() => {
      const core = CreatureCore.create({ seed: 1708 });
      core.habit.activityByPeriod[2].PLAY = 1;
      core.drives = { energy: 1, social: 0.05, curiosity: 0.05, stimulation: 0.05 };
      assert.equal(core.advance(0, ENVIRONMENTS[2])[0].action, "SLEEP");
      const nonSleep = CreatureCore.create({ seed: 1714 });
      nonSleep.habit.activityByPeriod[2].SLEEP = 1;
      nonSleep.drives = { energy: 0.05, social: 0.2, curiosity: 0.8, stimulation: 0.8 };
      nonSleep.personality = {
        curiosity: 0.8, sociability: 0.5, playfulness: 0.8, boldness: 0.8, independence: 0.5, sleepiness: 0.2,
      };
      assert.notEqual(nonSleep.advance(0, createEnvironment({ localTime: 12, userPresent: true, novelty: 0.8 }))[0].action, "SLEEP");
    }),
    eligibility: experiment(() => {
      const core = CreatureCore.create({ seed: 1709 });
      core.habit.activityByPeriod[2].FOLLOW_CURSOR = 1;
      assert.equal(candidate(core, "FOLLOW_CURSOR", createEnvironment({ localTime: 12 })).eligible, false);
      core.habit.activityByPeriod[2].PLAY = 1;
      core.behaviorCooldowns.PLAY = 100;
      assert.equal(candidate(core, "PLAY", ENVIRONMENTS[2]).eligible, false);
    }),
    differentiation: experiment(() => {
      const play = CreatureCore.create({ seed: 1710 });
      const wander = CreatureCore.create({ seed: 1710 });
      for (let index = 0; index < 10; index += 1) {
        complete(play, "PLAY", 2);
        complete(wander, "WANDER", 2);
      }
      assert.ok(candidate(play, "PLAY", ENVIRONMENTS[2]).contributors.routine
        > candidate(wander, "PLAY", ENVIRONMENTS[2]).contributors.routine);
    }),
    persistence: experiment(() => {
      const core = CreatureCore.create({ seed: 1711 });
      complete(core, "PLAY", 2);
      const restored = CreatureCore.fromSnapshot(JSON.parse(core.serialize()));
      assert.deepEqual(restored.habit.activityByPeriod, core.habit.activityByPeriod);
      assert.deepEqual(restored.evaluate(ENVIRONMENTS[2]), core.evaluate(ENVIRONMENTS[2]));
    }),
    offline: experiment(() => {
      const continuous = CreatureCore.create({ seed: 1712 });
      const offline = CreatureCore.create({ seed: 1712 });
      continuous.currentBehavior = behavior("SLEEP", 10, 3);
      offline.currentBehavior = behavior("SLEEP", 10, 3);
      const environment = (timestamp) => ENVIRONMENTS[Math.floor((timestamp / 10) % 4)];
      continuous.advance(200, environment);
      offline.reconcileElapsed(200, environment);
      assert.deepEqual(offline.toSnapshot(), continuous.toSnapshot());
    }),
    cooldownAntiLock: experiment(() => {
      const core = CreatureCore.create({ seed: 1713 });
      core.habit.activityByPeriod[2].PLAY = 1;
      core.behaviorCooldowns.PLAY = 100;
      const play = candidate(core, "PLAY", ENVIRONMENTS[2]);
      assert.equal(play.contributors.routine, ROUTINE_UTILITY_WEIGHT);
      assert.equal(play.eligible, false);
    }),
  };
  return {
    status: Object.values(results).every((result) => result.status === "PASS") ? "PASS" : "FAIL",
    experiments: results,
  };
}

function experiment(run) {
  try {
    run();
    return { status: "PASS" };
  } catch (error) {
    return { status: "FAIL", error: error.message };
  }
}

function complete(core, action, period) {
  core.currentBehavior = behavior(action, 1, period);
  core.currentBehavior.interruptible = false;
  core.advance(1, ENVIRONMENTS[period]);
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

function candidate(core, action, environment) {
  return core.evaluate(environment).candidates.find((entry) => entry.action === action);
}
