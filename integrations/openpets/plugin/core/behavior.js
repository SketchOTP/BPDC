export const ACTIONS = [
  "IDLE",
  "OBSERVE",
  "WANDER",
  "PLAY",
  "SEEK_ATTENTION",
  "AVOID",
  "FOLLOW_CURSOR",
  "SLEEP",
];

export const BEHAVIOR_DEFINITIONS = {
  IDLE: { minDuration: 45, maxDuration: 150, interruptible: true, cooldown: 0 },
  OBSERVE: { minDuration: 45, maxDuration: 180, interruptible: true, cooldown: 30 },
  WANDER: { minDuration: 90, maxDuration: 300, interruptible: true, cooldown: 60 },
  PLAY: { minDuration: 60, maxDuration: 240, interruptible: true, cooldown: 120 },
  SEEK_ATTENTION: { minDuration: 45, maxDuration: 180, interruptible: true, cooldown: 120 },
  AVOID: { minDuration: 30, maxDuration: 90, interruptible: false, cooldown: 90 },
  FOLLOW_CURSOR: { minDuration: 30, maxDuration: 45, interruptible: true, cooldown: 180 },
  SLEEP: { minDuration: 600, maxDuration: 1800, interruptible: false, cooldown: 300 },
};

export class BehaviorScorer {
  scoreAll({
    drives,
    personality,
    environment,
    relationship,
    habit,
    learnedPreference = 0,
    developmentalSocialization = 0,
    behaviorCooldowns = {},
    simulationTime = 0,
  }) {
    return ACTIONS.map((action) => this.score(action, {
      drives,
      personality,
      environment,
      relationship,
      habit,
      learnedPreference,
      developmentalSocialization,
      behaviorCooldowns,
      simulationTime,
    }));
  }

  score(action, {
    drives,
    personality,
    environment,
    relationship = { bond: 0.5, recentInfluence: 0 },
    habit = { timeHabit: 0 },
    learnedPreference = 0,
    developmentalSocialization = 0,
    behaviorCooldowns = {},
    simulationTime = 0,
  }) {
    const night = environment.localTime >= 22 || environment.localTime < 7 ? 1 : 0;
    const activeUser = environment.userPresent && environment.userIdleDuration < 300 ? 1 : 0;
    const scores = {
      IDLE: {
        baseline: 0.25,
        lowPressure: (1 - drives.energy) * 0.15,
        calm: (1 - environment.novelty) * 0.12,
      },
      OBSERVE: {
        curiosity: drives.curiosity * 1.35,
        novelty: environment.novelty * 0.95,
        boldness: personality.boldness * 0.35,
        fatiguePenalty: -drives.energy * 0.45,
      },
      WANDER: {
        curiosity: drives.curiosity * 0.65,
        stimulation: drives.stimulation * 0.7,
        independence: personality.independence * 0.55,
        boldness: personality.boldness * 0.35,
        fatiguePenalty: -drives.energy * 0.45,
      },
      PLAY: {
        stimulation: drives.stimulation * 1.45,
        playfulness: personality.playfulness * 0.9,
        learnedPreference,
        novelty: environment.novelty * 0.3,
        fatiguePenalty: -drives.energy * 0.35,
      },
      SEEK_ATTENTION: {
        socialPressure: drives.social * 1.55,
        sociability: personality.sociability * 0.95,
        bond: (relationship.bond - 0.5) * 0.8,
        recentBond: relationship.recentInfluence * 0.2,
        userPresent: activeUser * 0.35,
        interaction: environment.interactionPressure * 0.25,
        timeHabit: habit.timeHabit ?? 0,
        developmentalSocialization,
        independencePenalty: -personality.independence * 0.35,
        fatiguePenalty: -drives.energy * 0.35,
      },
      AVOID: {
        interactionPressure: environment.interactionPressure * 1.25,
        lowBoldness: (1 - personality.boldness) * 0.75,
        socialPressure: drives.social * 0.2,
        bond: (0.5 - relationship.bond) * 0.8,
        recentBond: -relationship.recentInfluence * 0.2,
        novelty: environment.novelty * 0.2,
      },
      FOLLOW_CURSOR: {
        activeUser: activeUser * 0.55,
        socialPressure: drives.social * 0.16,
        curiosity: drives.curiosity * 0.2,
        playfulness: personality.playfulness * 0.08,
        sociability: personality.sociability * 0.08,
        bond: (relationship.bond - 0.5) * 0.12,
        developmentalSocialization: developmentalSocialization * 0.25,
        independencePenalty: -personality.independence * 0.12,
        fatiguePenalty: -drives.energy * 0.25,
      },
      SLEEP: {
        fatiguePressure: drives.energy * 2.2,
        sleepiness: personality.sleepiness * 0.85,
        nightBias: night * 0.5,
        noveltyPenalty: -environment.novelty * 0.35,
        userPenalty: -activeUser * 0.15,
      },
    };

    if (!scores[action]) {
      throw new RangeError(`Unknown behavior action: ${action}`);
    }

    const contributors = scores[action];
    const score = Object.values(contributors).reduce((sum, value) => sum + value, 0);
    const baseEligible = action !== "FOLLOW_CURSOR" || activeUser === 1;
    const cooldownUntil = behaviorCooldowns[action] ?? 0;
    const cooldownRemaining = Math.max(0, cooldownUntil - simulationTime);
    const cooldownEligible = simulationTime >= cooldownUntil;
    return {
      action,
      score,
      contributors: { ...contributors },
      eligible: baseEligible && cooldownEligible,
      baseEligible,
      cooldownEligible,
      cooldownUntil,
      cooldownRemaining,
    };
  }
}

export class BehaviorSelector {
  constructor({ scorer = new BehaviorScorer(), noiseAmplitude = 0.025 } = {}) {
    this.scorer = scorer;
    this.noiseAmplitude = noiseAmplitude;
  }

  select({
    drives,
    personality,
    environment,
    relationship,
    habit,
    learnedPreference,
    developmentalSocialization,
    behaviorCooldowns,
    simulationTime,
    rng,
  }) {
    const candidates = this.scorer.scoreAll({
      drives,
      personality,
      environment,
      relationship,
      habit,
      learnedPreference,
      developmentalSocialization,
      behaviorCooldowns,
      simulationTime,
    }).map((candidate) => {
      const noise = rng.nextRange(-this.noiseAmplitude, this.noiseAmplitude);
      return {
        ...candidate,
        noise,
        score: candidate.score + noise,
        contributors: { ...candidate.contributors, noise },
      };
    });

    candidates.sort((left, right) => Number(right.eligible) - Number(left.eligible)
      || right.score - left.score
      || left.action.localeCompare(right.action));
    return { selected: candidates[0], candidates };
  }
}
