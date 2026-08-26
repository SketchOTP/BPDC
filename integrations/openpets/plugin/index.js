// integrations/openpets/plugin/core/clock.js
var SimulationClock = class {
  constructor(timestamp = 0) {
    assertFiniteNonNegative(timestamp, "timestamp");
    this.timestamp = timestamp;
  }
  now() {
    return this.timestamp;
  }
  advance(seconds) {
    assertFiniteNonNegative(seconds, "seconds");
    this.timestamp += seconds;
    return this.timestamp;
  }
  set(timestamp) {
    assertFiniteNonNegative(timestamp, "timestamp");
    this.timestamp = timestamp;
    return this.timestamp;
  }
};
function assertFiniteNonNegative(value, name) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name} must be a finite non-negative number.`);
  }
}

// integrations/openpets/plugin/core/seeded-rng.js
var SeededRng = class {
  constructor(seed = 1) {
    this.state = normalizeSeed(seed);
  }
  next() {
    let t = this.state += 1831565813;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
  nextRange(min, max) {
    return min + (max - min) * this.next();
  }
  getState() {
    return this.state >>> 0;
  }
  setState(state) {
    this.state = normalizeSeed(state);
    return this;
  }
};
function normalizeSeed(seed) {
  if (typeof seed === "string") {
    let hash = 2166136261;
    for (const character of seed) {
      hash ^= character.codePointAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0 || 1;
  }
  if (!Number.isFinite(seed)) {
    throw new TypeError("Seed must be a finite number or string.");
  }
  return Math.trunc(seed) >>> 0 || 1;
}

// integrations/openpets/plugin/core/models.js
var DRIVE_NAMES = ["energy", "social", "curiosity", "stimulation"];
var PERSONALITY_TRAITS = [
  "curiosity",
  "sociability",
  "playfulness",
  "boldness",
  "independence",
  "sleepiness"
];
function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}
function createInitialDrives() {
  return {
    energy: 0.2,
    social: 0.25,
    curiosity: 0.35,
    stimulation: 0.25
  };
}
function createPersonality(seed) {
  const rng = new SeededRng(seed);
  return Object.fromEntries(
    PERSONALITY_TRAITS.map((trait) => [trait, Number((0.2 + rng.next() * 0.6).toFixed(6))])
  );
}
function createEnvironment({
  localTime = 12,
  userPresent = false,
  userIdleDuration = 0,
  novelty = 0,
  interactionPressure = 0
} = {}) {
  if (!Number.isFinite(localTime) || localTime < 0 || localTime >= 24) {
    throw new RangeError("localTime must be in the range 0 <= localTime < 24.");
  }
  return {
    localTime,
    userPresent: Boolean(userPresent),
    userIdleDuration: nonNegative(userIdleDuration, "userIdleDuration"),
    novelty: clamp01(novelty),
    interactionPressure: clamp01(interactionPressure)
  };
}
function validateDrives(drives) {
  for (const name of DRIVE_NAMES) {
    if (!Number.isFinite(drives?.[name])) {
      throw new TypeError(`Missing normalized drive: ${name}`);
    }
  }
  return Object.fromEntries(DRIVE_NAMES.map((name) => [name, clamp01(drives[name])]));
}
function validatePersonality(personality) {
  for (const trait of PERSONALITY_TRAITS) {
    if (!Number.isFinite(personality?.[trait])) {
      throw new TypeError(`Missing personality trait: ${trait}`);
    }
  }
  return Object.fromEntries(
    PERSONALITY_TRAITS.map((trait) => [trait, clamp01(personality[trait])])
  );
}
function nonNegative(value, name) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name} must be a finite non-negative number.`);
  }
  return value;
}

// integrations/openpets/plugin/core/behavior.js
var ACTIONS = [
  "IDLE",
  "OBSERVE",
  "WANDER",
  "PLAY",
  "SEEK_ATTENTION",
  "AVOID",
  "FOLLOW_CURSOR",
  "SLEEP"
];
var BEHAVIOR_DEFINITIONS = {
  IDLE: { minDuration: 45, maxDuration: 150, interruptible: true, cooldown: 0 },
  OBSERVE: { minDuration: 45, maxDuration: 180, interruptible: true, cooldown: 30 },
  WANDER: { minDuration: 90, maxDuration: 300, interruptible: true, cooldown: 60 },
  PLAY: { minDuration: 60, maxDuration: 240, interruptible: true, cooldown: 120 },
  SEEK_ATTENTION: { minDuration: 45, maxDuration: 180, interruptible: true, cooldown: 120 },
  AVOID: { minDuration: 30, maxDuration: 90, interruptible: false, cooldown: 90 },
  FOLLOW_CURSOR: { minDuration: 30, maxDuration: 45, interruptible: true, cooldown: 180 },
  SLEEP: { minDuration: 600, maxDuration: 1800, interruptible: false, cooldown: 300 }
};
var BehaviorScorer = class {
  scoreAll({ drives, personality, environment, relationship, habit, learnedPreference = 0, developmentalSocialization = 0 }) {
    return ACTIONS.map((action) => this.score(action, {
      drives,
      personality,
      environment,
      relationship,
      habit,
      learnedPreference,
      developmentalSocialization
    }));
  }
  score(action, {
    drives,
    personality,
    environment,
    relationship = { bond: 0.5, recentInfluence: 0 },
    habit = { timeHabit: 0 },
    learnedPreference = 0,
    developmentalSocialization = 0
  }) {
    const night = environment.localTime >= 22 || environment.localTime < 7 ? 1 : 0;
    const activeUser = environment.userPresent && environment.userIdleDuration < 300 ? 1 : 0;
    const scores = {
      IDLE: {
        baseline: 0.25,
        lowPressure: (1 - drives.energy) * 0.15,
        calm: (1 - environment.novelty) * 0.12
      },
      OBSERVE: {
        curiosity: drives.curiosity * 1.35,
        novelty: environment.novelty * 0.95,
        boldness: personality.boldness * 0.35,
        fatiguePenalty: -drives.energy * 0.45
      },
      WANDER: {
        curiosity: drives.curiosity * 0.65,
        stimulation: drives.stimulation * 0.7,
        independence: personality.independence * 0.55,
        boldness: personality.boldness * 0.35,
        fatiguePenalty: -drives.energy * 0.45
      },
      PLAY: {
        stimulation: drives.stimulation * 1.45,
        playfulness: personality.playfulness * 0.9,
        learnedPreference,
        novelty: environment.novelty * 0.3,
        fatiguePenalty: -drives.energy * 0.35
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
        fatiguePenalty: -drives.energy * 0.35
      },
      AVOID: {
        interactionPressure: environment.interactionPressure * 1.25,
        lowBoldness: (1 - personality.boldness) * 0.75,
        socialPressure: drives.social * 0.2,
        bond: (0.5 - relationship.bond) * 0.8,
        recentBond: -relationship.recentInfluence * 0.2,
        novelty: environment.novelty * 0.2
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
        fatiguePenalty: -drives.energy * 0.25
      },
      SLEEP: {
        fatiguePressure: drives.energy * 2.2,
        sleepiness: personality.sleepiness * 0.85,
        nightBias: night * 0.5,
        noveltyPenalty: -environment.novelty * 0.35,
        userPenalty: -activeUser * 0.15
      }
    };
    if (!scores[action]) {
      throw new RangeError(`Unknown behavior action: ${action}`);
    }
    const contributors = scores[action];
    const score = Object.values(contributors).reduce((sum, value) => sum + value, 0);
    const eligible = action !== "FOLLOW_CURSOR" || activeUser === 1;
    return { action, score, contributors: { ...contributors }, eligible };
  }
};
var BehaviorSelector = class {
  constructor({ scorer = new BehaviorScorer(), noiseAmplitude = 0.025 } = {}) {
    this.scorer = scorer;
    this.noiseAmplitude = noiseAmplitude;
  }
  select({ drives, personality, environment, relationship, habit, learnedPreference, developmentalSocialization, rng }) {
    const candidates = this.scorer.scoreAll({
      drives,
      personality,
      environment,
      relationship,
      habit,
      learnedPreference,
      developmentalSocialization
    }).map((candidate) => {
      const noise = rng.nextRange(-this.noiseAmplitude, this.noiseAmplitude);
      return {
        ...candidate,
        noise,
        score: candidate.score + noise,
        contributors: { ...candidate.contributors, noise }
      };
    });
    candidates.sort((left, right) => Number(right.eligible) - Number(left.eligible) || right.score - left.score || left.action.localeCompare(right.action));
    return { selected: candidates[0], candidates };
  }
};

// integrations/openpets/plugin/core/relationship.js
var RELATIONSHIP_SCHEMA_VERSION = 1;
var DEFAULT_BOND = 0.5;
var MAX_INTERACTION_EVENTS = 8;
var BOND_LEARNING_RATE = 0.05;
var BOND_HALF_LIFE_SECONDS = 72 * 3600;
var RECENT_EVENT_HALF_LIFE_SECONDS = 6 * 3600;
var EVENT_RETENTION_SECONDS = 24 * 3600;
function createInitialRelationship(timestamp = 0) {
  return {
    schemaVersion: RELATIONSHIP_SCHEMA_VERSION,
    bond: DEFAULT_BOND,
    events: [],
    lastUpdatedAt: timestamp
  };
}
function validateRelationship(value, timestamp = 0) {
  const relationship = value ?? createInitialRelationship(timestamp);
  if (!Number.isFinite(relationship.bond)) throw new TypeError("Relationship bond is required.");
  if (!Number.isFinite(relationship.lastUpdatedAt) || relationship.lastUpdatedAt < 0) {
    throw new RangeError("Relationship lastUpdatedAt must be finite and non-negative.");
  }
  const events = Array.isArray(relationship.events) ? relationship.events : [];
  return {
    schemaVersion: RELATIONSHIP_SCHEMA_VERSION,
    bond: clamp01(relationship.bond),
    events: events.slice(-MAX_INTERACTION_EVENTS).map((event) => ({
      timestamp: nonNegative2(event.timestamp, "interaction timestamp"),
      kind: String(event.kind),
      valence: clamp(event.valence, -1, 1, "interaction valence"),
      intensity: clamp(event.intensity, 0, 1, "interaction intensity")
    })),
    lastUpdatedAt: relationship.lastUpdatedAt
  };
}
function decayRelationship(relationship, timestamp) {
  if (timestamp < relationship.lastUpdatedAt) return relationship;
  const elapsed = timestamp - relationship.lastUpdatedAt;
  if (elapsed > 0) {
    const retention = 2 ** (-elapsed / BOND_HALF_LIFE_SECONDS);
    relationship.bond = clamp01(DEFAULT_BOND + (relationship.bond - DEFAULT_BOND) * retention);
  }
  relationship.events = relationship.events.filter((event) => timestamp - event.timestamp <= EVENT_RETENTION_SECONDS).slice(-MAX_INTERACTION_EVENTS);
  relationship.lastUpdatedAt = timestamp;
  return relationship;
}
function recentInfluence(relationship, timestamp) {
  const totals = relationship.events.reduce((result, event) => {
    const age = Math.max(0, timestamp - event.timestamp);
    const weight = 2 ** (-age / RECENT_EVENT_HALF_LIFE_SECONDS);
    result.value += event.valence * event.intensity * weight;
    return result;
  }, { value: 0 });
  if (relationship.events.length === 0) return 0;
  return Math.max(-1, Math.min(1, totals.value / relationship.events.length));
}
function relationshipForScoring(relationship, timestamp) {
  return {
    bond: relationship.bond,
    recentInfluence: recentInfluence(relationship, timestamp)
  };
}
function clamp(value, min, max, name) {
  if (!Number.isFinite(value) || value < min || value > max) throw new RangeError(`${name} is out of range.`);
  return Math.max(min, Math.min(max, value));
}
function nonNegative2(value, name) {
  if (!Number.isFinite(value) || value < 0) throw new RangeError(`${name} must be finite and non-negative.`);
  return value;
}

// integrations/openpets/plugin/core/habit.js
var HABIT_SCHEMA_VERSION = 1;
var HABIT_HOURS = 24;
var HABIT_LEARNING_RATE = 0.08;
var HABIT_HALF_LIFE_SECONDS = 7 * 24 * 3600;
var TIME_HABIT_UTILITY_WEIGHT = 0.25;
function createInitialHabit(timestamp = 0) {
  return {
    schemaVersion: HABIT_SCHEMA_VERSION,
    attentionByHour: Array(HABIT_HOURS).fill(0),
    lastUpdatedAt: timestamp
  };
}
function validateHabit(value, timestamp = 0) {
  const habit = value ?? createInitialHabit(timestamp);
  if (!Array.isArray(habit.attentionByHour) || habit.attentionByHour.length !== HABIT_HOURS) {
    throw new TypeError(`Habit attentionByHour must contain exactly ${HABIT_HOURS} values.`);
  }
  if (!Number.isFinite(habit.lastUpdatedAt) || habit.lastUpdatedAt < 0) {
    throw new RangeError("Habit lastUpdatedAt must be finite and non-negative.");
  }
  return {
    schemaVersion: HABIT_SCHEMA_VERSION,
    attentionByHour: habit.attentionByHour.map((value2) => clamp01(value2)),
    lastUpdatedAt: habit.lastUpdatedAt
  };
}
function decayHabit(habit, timestamp) {
  if (timestamp < habit.lastUpdatedAt) return habit;
  const elapsed = timestamp - habit.lastUpdatedAt;
  if (elapsed > 0) {
    const retention = 2 ** (-elapsed / HABIT_HALF_LIFE_SECONDS);
    habit.attentionByHour = habit.attentionByHour.map((value) => clamp01(value * retention));
  }
  habit.lastUpdatedAt = timestamp;
  return habit;
}
function reinforceAttentionHabit(habit, localTime, intensity, timestamp) {
  assertLocalTime(localTime);
  decayHabit(habit, timestamp);
  const hour = Math.floor(localTime);
  const learning = HABIT_LEARNING_RATE * clamp01(intensity);
  const current = habit.attentionByHour[hour];
  habit.attentionByHour[hour] = clamp01(current + learning * (1 - current));
  return habit.attentionByHour[hour];
}
function timeHabitForScoring(habit, localTime, timestamp) {
  assertLocalTime(localTime);
  decayHabit(habit, timestamp);
  return habit.attentionByHour[Math.floor(localTime)] * TIME_HABIT_UTILITY_WEIGHT;
}
function assertLocalTime(localTime) {
  if (!Number.isFinite(localTime) || localTime < 0 || localTime >= 24) {
    throw new RangeError("localTime must be in the range 0 <= localTime < 24.");
  }
}

// integrations/openpets/plugin/core/spatial.js
var SPATIAL_SCHEMA_VERSION = 1;
var REST_SITE_AFFINITY_LEARNING_RATE = 0.12;
var REST_SITE_AFFINITY_HALF_LIFE_SECONDS = 14 * 24 * 3600;
var REST_SITE_AFFINITY_THRESHOLD = 0.6;
function createInitialSpatial(timestamp = 0) {
  return {
    schemaVersion: SPATIAL_SCHEMA_VERSION,
    restSiteAffinity: 0,
    lastUpdatedAt: timestamp
  };
}
function validateSpatial(value, timestamp = 0) {
  const spatial = value ?? createInitialSpatial(timestamp);
  if (!Number.isFinite(spatial.restSiteAffinity)) {
    throw new TypeError("Spatial restSiteAffinity must be finite.");
  }
  if (!Number.isFinite(spatial.lastUpdatedAt) || spatial.lastUpdatedAt < 0) {
    throw new RangeError("Spatial lastUpdatedAt must be finite and non-negative.");
  }
  return {
    schemaVersion: SPATIAL_SCHEMA_VERSION,
    restSiteAffinity: clamp01(spatial.restSiteAffinity),
    lastUpdatedAt: spatial.lastUpdatedAt
  };
}
function decaySpatial(spatial, timestamp) {
  if (timestamp < spatial.lastUpdatedAt) return spatial;
  const elapsed = timestamp - spatial.lastUpdatedAt;
  if (elapsed > 0) {
    spatial.restSiteAffinity = clamp01(
      spatial.restSiteAffinity * 2 ** (-elapsed / REST_SITE_AFFINITY_HALF_LIFE_SECONDS)
    );
  }
  spatial.lastUpdatedAt = timestamp;
  return spatial;
}
function reinforceRestSite(spatial, strength, timestamp) {
  decaySpatial(spatial, timestamp);
  const learning = REST_SITE_AFFINITY_LEARNING_RATE * clamp01(strength);
  spatial.restSiteAffinity = clamp01(
    spatial.restSiteAffinity + learning * (1 - spatial.restSiteAffinity)
  );
  return spatial.restSiteAffinity;
}
function resetRestSite(spatial, timestamp) {
  decaySpatial(spatial, timestamp);
  spatial.restSiteAffinity = 0;
  spatial.lastUpdatedAt = timestamp;
  return spatial;
}

// integrations/openpets/plugin/core/play-preference.js
var PLAY_PREFERENCE_SCHEMA_VERSION = 1;
var PLAY_PREFERENCE_LEARNING_RATE = 0.06;
var PLAY_PREFERENCE_HALF_LIFE_SECONDS = 21 * 24 * 3600;
var PLAY_PREFERENCE_UTILITY_WEIGHT = 0.3;
function createInitialPlayPreference(timestamp = 0) {
  return {
    schemaVersion: PLAY_PREFERENCE_SCHEMA_VERSION,
    playPreference: 0,
    lastUpdatedAt: timestamp
  };
}
function validatePlayPreference(value, timestamp = 0) {
  const preference = value ?? createInitialPlayPreference(timestamp);
  if (!Number.isFinite(preference.lastUpdatedAt) || preference.lastUpdatedAt < 0) {
    throw new RangeError("Play preference lastUpdatedAt must be finite and non-negative.");
  }
  return {
    schemaVersion: PLAY_PREFERENCE_SCHEMA_VERSION,
    playPreference: clamp01(preference.playPreference),
    lastUpdatedAt: preference.lastUpdatedAt
  };
}
function decayPlayPreference(preference, timestamp) {
  if (timestamp < preference.lastUpdatedAt) return preference;
  const elapsed = timestamp - preference.lastUpdatedAt;
  if (elapsed > 0) {
    const retention = 2 ** (-elapsed / PLAY_PREFERENCE_HALF_LIFE_SECONDS);
    preference.playPreference = clamp01(preference.playPreference * retention);
  }
  preference.lastUpdatedAt = timestamp;
  return preference;
}
function reinforcePlayPreference(preference, intensity, timestamp) {
  decayPlayPreference(preference, timestamp);
  const learning = PLAY_PREFERENCE_LEARNING_RATE * clamp01(intensity);
  preference.playPreference = clamp01(
    preference.playPreference + learning * (1 - preference.playPreference)
  );
  return preference.playPreference;
}
function learnedPlayPreferenceForScoring(preference, timestamp) {
  decayPlayPreference(preference, timestamp);
  return preference.playPreference * PLAY_PREFERENCE_UTILITY_WEIGHT;
}

// integrations/openpets/plugin/core/persistence.js
var SNAPSHOT_SCHEMA_VERSION = 6;
function serializeSnapshot(snapshot) {
  return JSON.stringify(snapshot, null, 2);
}
function deserializeSnapshot(serialized) {
  const snapshot = typeof serialized === "string" ? JSON.parse(serialized) : serialized;
  if (snapshot?.schemaVersion === 1) {
    return {
      ...snapshot,
      schemaVersion: SNAPSHOT_SCHEMA_VERSION,
      relationship: createInitialRelationship(snapshot.simulationTimestamp ?? 0),
      habit: createInitialHabit(snapshot.simulationTimestamp ?? 0),
      spatial: createInitialSpatial(snapshot.simulationTimestamp ?? 0),
      playPreference: createInitialPlayPreference(snapshot.simulationTimestamp ?? 0),
      socializationImprint: 0
    };
  }
  if (snapshot?.schemaVersion === 2) {
    return {
      ...snapshot,
      schemaVersion: SNAPSHOT_SCHEMA_VERSION,
      habit: createInitialHabit(snapshot.simulationTimestamp ?? 0),
      spatial: createInitialSpatial(snapshot.simulationTimestamp ?? 0),
      playPreference: createInitialPlayPreference(snapshot.simulationTimestamp ?? 0),
      socializationImprint: 0
    };
  }
  if (snapshot?.schemaVersion === 3) {
    return {
      ...snapshot,
      schemaVersion: SNAPSHOT_SCHEMA_VERSION,
      spatial: createInitialSpatial(snapshot.simulationTimestamp ?? 0),
      playPreference: createInitialPlayPreference(snapshot.simulationTimestamp ?? 0),
      socializationImprint: 0
    };
  }
  if (snapshot?.schemaVersion === 4) {
    return {
      ...snapshot,
      schemaVersion: SNAPSHOT_SCHEMA_VERSION,
      playPreference: createInitialPlayPreference(snapshot.simulationTimestamp ?? 0),
      socializationImprint: 0
    };
  }
  if (snapshot?.schemaVersion === 5) {
    return {
      ...snapshot,
      schemaVersion: SNAPSHOT_SCHEMA_VERSION,
      socializationImprint: 0
    };
  }
  if (snapshot?.schemaVersion !== SNAPSHOT_SCHEMA_VERSION) {
    throw new Error(`Unsupported CreatureSnapshot schema: ${snapshot?.schemaVersion}`);
  }
  return snapshot;
}

// integrations/openpets/plugin/core/intent.js
var BehaviorIntent = class {
  constructor({ action, time, duration, reason, score, scoreBreakdown, interruptible, habitatTarget = null }) {
    this.action = action;
    this.time = time;
    this.duration = duration;
    this.reason = reason;
    this.score = score;
    this.scoreBreakdown = scoreBreakdown;
    this.interruptible = interruptible;
    this.habitatTarget = habitatTarget;
  }
};
var INTERACTION_RESPONSE_KINDS = [
  "ENJOY_CONTACT",
  "ACKNOWLEDGE_CONTACT",
  "WITHDRAW_CONTACT"
];
var InteractionResponseIntent = class {
  constructor({ kind, duration, diagnostics }) {
    if (!INTERACTION_RESPONSE_KINDS.includes(kind)) {
      throw new RangeError(`Unknown interaction response kind: ${kind}`);
    }
    if (!Number.isFinite(duration) || duration <= 0) {
      throw new RangeError("Interaction response duration must be positive.");
    }
    this.kind = kind;
    this.duration = duration;
    this.diagnostics = diagnostics;
  }
};
var REUNION_RESPONSE_KINDS = [
  "ACKNOWLEDGE_RETURN",
  "GREET_RETURN"
];
var ReunionResponseIntent = class {
  constructor({ kind, duration, diagnostics }) {
    if (!REUNION_RESPONSE_KINDS.includes(kind)) {
      throw new RangeError(`Unknown reunion response kind: ${kind}`);
    }
    if (!Number.isFinite(duration) || duration <= 0) {
      throw new RangeError("Reunion response duration must be positive.");
    }
    this.kind = kind;
    this.duration = duration;
    this.diagnostics = diagnostics;
  }
};

// integrations/openpets/plugin/core/interaction.js
var INTERACTION_KINDS = ["POSITIVE_CONTACT", "NEGATIVE_CONTACT"];
var InteractionEvent = class {
  constructor({ kind, valence = defaultValence(kind), intensity = 0.4, timestamp = 0 }) {
    if (!INTERACTION_KINDS.includes(kind)) {
      throw new RangeError(`Unknown interaction kind: ${kind}`);
    }
    if (!Number.isFinite(valence) || valence < -1 || valence > 1) {
      throw new RangeError("Interaction valence must be in the range -1..1.");
    }
    if (!Number.isFinite(intensity) || intensity < 0 || intensity > 1) {
      throw new RangeError("Interaction intensity must be in the range 0..1.");
    }
    if (!Number.isFinite(timestamp) || timestamp < 0) {
      throw new RangeError("Interaction timestamp must be finite and non-negative.");
    }
    this.kind = kind;
    this.valence = valence;
    this.intensity = intensity;
    this.timestamp = timestamp;
  }
};
function normalizeInteractionEvent(event, timestamp = 0) {
  if (!event || typeof event !== "object") throw new TypeError("InteractionEvent is required.");
  return new InteractionEvent({
    kind: event.kind,
    valence: event.valence,
    intensity: event.intensity,
    timestamp: event.timestamp ?? timestamp
  });
}
function defaultValence(kind) {
  if (kind === "POSITIVE_CONTACT") return 1;
  if (kind === "NEGATIVE_CONTACT") return -1;
  return 0;
}

// integrations/openpets/plugin/core/development.js
var MATURATION_DURATION_SECONDS = 14 * 24 * 60 * 60;
var INITIAL_SIZE_FACTOR = 0.8;
var MATURE_SIZE_FACTOR = 1;
function developmentSnapshot({ createdAt, simulationTimestamp } = {}) {
  assertFiniteNonNegative2(createdAt, "createdAt");
  assertFiniteNonNegative2(simulationTimestamp, "simulationTimestamp");
  const ageSeconds = Math.max(0, simulationTimestamp - createdAt);
  const maturity = clamp01(ageSeconds / MATURATION_DURATION_SECONDS);
  const sizeFactor = INITIAL_SIZE_FACTOR + (MATURE_SIZE_FACTOR - INITIAL_SIZE_FACTOR) * maturity;
  return { ageSeconds, maturity, sizeFactor };
}
function assertFiniteNonNegative2(value, name) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name} must be a finite non-negative number.`);
  }
}

// integrations/openpets/plugin/core/socialization.js
var SOCIALIZATION_LEARNING_RATE = 0.03;
var SOCIALIZATION_UTILITY_WEIGHT = 0.12;
function validateSocializationImprint(value) {
  if (value === void 0 || value === null) return 0;
  if (!Number.isFinite(value)) {
    throw new TypeError("Socialization imprint must be finite.");
  }
  return clamp01(value);
}
function reinforceSocializationImprint(imprint, intensity, maturity) {
  const boundedIntensity = clamp01(intensity);
  const juvenilePlasticity = 1 - clamp01(maturity);
  const delta = SOCIALIZATION_LEARNING_RATE * boundedIntensity * juvenilePlasticity * (1 - clamp01(imprint));
  return clamp01(imprint + delta);
}
function developmentalSocializationForScoring(imprint, maturity) {
  return validateSocializationImprint(imprint) * clamp01(maturity) * SOCIALIZATION_UTILITY_WEIGHT;
}

// integrations/openpets/plugin/core/creature-core.js
var CreatureCore = class _CreatureCore {
  constructor({
    creatureId,
    createdAt = 0,
    simulationTimestamp = createdAt,
    personality,
    drives = createInitialDrives(),
    rngState,
    currentBehavior = null,
    relationship,
    habit,
    spatial = createInitialSpatial(simulationTimestamp),
    playPreference = createInitialPlayPreference(simulationTimestamp),
    socializationImprint = 0,
    selector = new BehaviorSelector(),
    scorer = new BehaviorScorer()
  }) {
    this.creatureId = String(creatureId);
    this.createdAt = assertNonNegative(createdAt, "createdAt");
    this.clock = new SimulationClock(assertNonNegative(simulationTimestamp, "simulationTimestamp"));
    this.personality = validatePersonality(personality);
    this.drives = validateDrives(drives);
    this.rng = new SeededRng(rngState ?? 1);
    this.currentBehavior = currentBehavior ? clone(currentBehavior) : null;
    this.relationship = validateRelationship(relationship, this.clock.now());
    this.habit = validateHabit(habit, this.clock.now());
    this.spatial = validateSpatial(spatial, this.clock.now());
    this.playPreference = validatePlayPreference(playPreference, this.clock.now());
    this.socializationImprint = validateSocializationImprint(socializationImprint);
    this.selector = selector;
    this.scorer = scorer;
    this.lastEnvironment = createEnvironment();
  }
  static create({ seed = 1, creatureId, createdAt = 0 } = {}) {
    const normalizedSeed = normalizeSeed(seed);
    return new _CreatureCore({
      creatureId: creatureId ?? `creature-${normalizedSeed.toString(16).padStart(8, "0")}`,
      createdAt,
      simulationTimestamp: createdAt,
      personality: createPersonality(normalizedSeed),
      rngState: normalizedSeed ^ 2779096485
    });
  }
  advance(seconds, environmentInput = this.lastEnvironment, { collectIntents = true } = {}) {
    assertNonNegative(seconds, "seconds");
    this.decayRelationship();
    this.decayHabit();
    this.decayPlayPreference();
    const events = [];
    let remaining = seconds;
    if (!this.currentBehavior) {
      const environment = resolveEnvironment(environmentInput, this.clock.now());
      this.lastEnvironment = environment;
      const intent = this.commitBehavior(environment);
      if (collectIntents) events.push(intent);
    }
    while (remaining > 0) {
      const now = this.clock.now();
      const environment = resolveEnvironment(environmentInput, now);
      this.lastEnvironment = environment;
      const end = this.currentBehavior?.endsAt ?? now;
      const segment = Math.min(remaining, Math.max(0, end - now));
      if (segment > 0) {
        this.evolveDrives(segment, environment);
        this.clock.advance(segment);
        this.decayRelationship();
        this.decayHabit();
        this.decayPlayPreference();
        remaining -= segment;
      }
      if (this.currentBehavior && this.clock.now() >= this.currentBehavior.endsAt - 1e-9) {
        this.currentBehavior = null;
        if (remaining > 0) {
          const nextEnvironment = resolveEnvironment(environmentInput, this.clock.now());
          const intent = this.commitBehavior(nextEnvironment);
          if (collectIntents) events.push(intent);
        }
      } else if (segment === 0) {
        throw new Error("CreatureCore could not advance; behavior timing is invalid.");
      }
    }
    return events;
  }
  reconcileElapsed(seconds, environmentInput = this.lastEnvironment) {
    return this.advance(seconds, environmentInput, { collectIntents: false });
  }
  currentIntent() {
    if (!this.currentBehavior) return null;
    return new BehaviorIntent({
      time: this.clock.now(),
      action: this.currentBehavior.action,
      duration: Math.max(0, this.currentBehavior.endsAt - this.clock.now()),
      reason: this.currentBehavior.reason,
      score: this.currentBehavior.score,
      scoreBreakdown: clone(this.currentBehavior.scoreBreakdown),
      interruptible: this.currentBehavior.interruptible
    });
  }
  evaluate(environmentInput = this.lastEnvironment) {
    const environment = resolveEnvironment(environmentInput, this.clock.now());
    this.lastEnvironment = environment;
    const candidates = this.scorer.scoreAll({
      drives: this.drives,
      personality: this.personality,
      environment,
      relationship: this.relationshipForScoring(),
      habit: this.habitForScoring(environment),
      learnedPreference: this.learnedPlayPreferenceForScoring(),
      developmentalSocialization: this.developmentalSocializationForScoring()
    });
    return {
      simulationTime: this.clock.now(),
      candidates,
      selectedAction: this.currentBehavior?.action ?? null
    };
  }
  diagnosticSnapshot(environmentInput = this.lastEnvironment) {
    const environment = resolveEnvironment(environmentInput, this.clock.now());
    const evaluation = this.evaluate(environment);
    return {
      creatureId: this.creatureId,
      simulationTime: this.clock.now(),
      personality: clone(this.personality),
      drives: clone(this.drives),
      currentBehavior: clone(this.currentBehavior),
      behaviorDurationRemaining: this.currentBehavior ? Math.max(0, this.currentBehavior.endsAt - this.clock.now()) : 0,
      candidates: evaluation.candidates,
      relationship: this.relationshipSnapshot(),
      habit: this.habitSnapshot(environment),
      spatial: this.spatialSnapshot(),
      playPreference: this.playPreferenceSnapshot(),
      socializationImprint: this.socializationImprint,
      developmentalSocialization: this.developmentalSocializationForScoring(),
      development: this.developmentSnapshot(),
      rngState: this.rng.getState()
    };
  }
  toSnapshot() {
    const behaviorTiming = this.currentBehavior ? {
      startedAt: this.currentBehavior.startedAt,
      endsAt: this.currentBehavior.endsAt,
      duration: this.currentBehavior.duration,
      durationRemaining: Math.max(0, this.currentBehavior.endsAt - this.clock.now())
    } : null;
    return {
      schemaVersion: SNAPSHOT_SCHEMA_VERSION,
      creatureId: this.creatureId,
      createdAt: this.createdAt,
      simulationTimestamp: this.clock.now(),
      rngState: this.rng.getState(),
      personality: clone(this.personality),
      internalState: clone(this.drives),
      relationship: this.relationshipSnapshot(),
      habit: this.habitStateSnapshot(),
      spatial: this.spatialStateSnapshot(),
      playPreference: this.playPreferenceStateSnapshot(),
      socializationImprint: this.socializationImprint,
      currentBehavior: clone(this.currentBehavior),
      behaviorTiming
    };
  }
  serialize() {
    return serializeSnapshot(this.toSnapshot());
  }
  developmentSnapshot() {
    return developmentSnapshot({
      createdAt: this.createdAt,
      simulationTimestamp: this.clock.now()
    });
  }
  static fromSnapshot(snapshotOrSerialized) {
    const snapshot = deserializeSnapshot(snapshotOrSerialized);
    return new _CreatureCore({
      creatureId: snapshot.creatureId,
      createdAt: snapshot.createdAt,
      simulationTimestamp: snapshot.simulationTimestamp,
      personality: snapshot.personality,
      drives: snapshot.internalState,
      rngState: snapshot.rngState,
      currentBehavior: snapshot.currentBehavior,
      relationship: snapshot.relationship,
      habit: snapshot.habit,
      spatial: snapshot.spatial,
      playPreference: snapshot.playPreference,
      socializationImprint: snapshot.socializationImprint
    });
  }
  commitBehavior(environment) {
    const selection = this.selector.select({
      drives: this.drives,
      personality: this.personality,
      environment,
      relationship: this.relationshipForScoring(),
      habit: this.habitForScoring(environment),
      learnedPreference: this.learnedPlayPreferenceForScoring(),
      developmentalSocialization: this.developmentalSocializationForScoring(),
      rng: this.rng
    });
    const definition = BEHAVIOR_DEFINITIONS[selection.selected.action];
    const duration = this.rng.nextRange(definition.minDuration, definition.maxDuration);
    const startedAt = this.clock.now();
    const currentBehavior = {
      action: selection.selected.action,
      startedAt,
      endsAt: startedAt + duration,
      duration,
      interruptible: definition.interruptible,
      cooldown: definition.cooldown,
      reason: summarizeReason(selection.selected.contributors),
      score: selection.selected.score,
      scoreBreakdown: {
        selected: selection.selected,
        candidates: selection.candidates
      }
    };
    this.currentBehavior = currentBehavior;
    return new BehaviorIntent({
      time: startedAt,
      action: currentBehavior.action,
      duration: currentBehavior.duration,
      reason: currentBehavior.reason,
      score: currentBehavior.score,
      scoreBreakdown: clone(currentBehavior.scoreBreakdown),
      interruptible: currentBehavior.interruptible
    });
  }
  recordInteraction(event, environmentInput = this.lastEnvironment) {
    this.decayRelationship();
    this.decayHabit();
    this.decayPlayPreference();
    const environment = resolveEnvironment(environmentInput, this.clock.now());
    this.lastEnvironment = environment;
    const interaction = normalizeInteractionEvent(event, this.clock.now());
    const committedBehavior = this.currentBehavior?.action;
    const bounded = {
      timestamp: this.clock.now(),
      kind: interaction.kind,
      valence: interaction.valence,
      intensity: interaction.intensity
    };
    this.relationship.events.push(bounded);
    this.relationship.events = this.relationship.events.slice(-8);
    const direction = interaction.valence >= 0 ? 1 - this.relationship.bond : this.relationship.bond;
    this.relationship.bond = clamp01(
      this.relationship.bond + interaction.valence * interaction.intensity * BOND_LEARNING_RATE * direction
    );
    this.relationship.lastUpdatedAt = this.clock.now();
    if (interaction.valence > 0) {
      reinforceAttentionHabit(this.habit, environment.localTime, interaction.intensity, this.clock.now());
      if (committedBehavior === "PLAY") {
        reinforcePlayPreference(this.playPreference, interaction.intensity, this.clock.now());
      }
      const maturity = this.developmentSnapshot().maturity;
      this.socializationImprint = reinforceSocializationImprint(
        this.socializationImprint,
        interaction.intensity,
        maturity
      );
    }
    return clone(bounded);
  }
  selectInteractionResponse() {
    const relationship = this.relationshipForScoring();
    const currentBehavior = this.currentBehavior?.action ?? "NONE";
    const currentBehaviorContribution = interactionResponseBehaviorContribution(currentBehavior);
    const contributors = {
      bond: relationship.bond * 0.5,
      sociability: this.personality.sociability * 0.35,
      independence: (1 - this.personality.independence) * 0.15,
      currentBehavior: currentBehaviorContribution
    };
    const affinity = Object.values(contributors).reduce((sum, value) => sum + value, 0);
    const kind = affinity >= 0.64 ? "ENJOY_CONTACT" : affinity <= 0.32 ? "WITHDRAW_CONTACT" : "ACKNOWLEDGE_CONTACT";
    const duration = currentBehavior === "SLEEP" ? 0.45 : kind === "ENJOY_CONTACT" ? 0.9 : kind === "WITHDRAW_CONTACT" ? 0.75 : 0.65;
    return new InteractionResponseIntent({
      kind,
      duration,
      diagnostics: {
        contributors,
        affinity,
        thresholds: { withdrawAtOrBelow: 0.32, enjoyAtOrAbove: 0.64 },
        currentBehavior
      }
    });
  }
  selectReunionResponse({ absenceSeconds = 0, previousState = null } = {}) {
    const absence = assertNonNegative(absenceSeconds, "absenceSeconds");
    const currentBehavior = this.currentBehavior?.action ?? "NONE";
    if (currentBehavior === "SLEEP" || absence < REUNION_MIN_ABSENCE_SECONDS) return null;
    const effectiveAbsence = absence - REUNION_MIN_ABSENCE_SECONDS;
    const absenceContribution = 1 - Math.exp(-effectiveAbsence / REUNION_ABSENCE_SATURATION_SECONDS);
    const relationship = this.relationshipForScoring();
    const contributors = {
      absence: absenceContribution * 0.6,
      bond: relationship.bond * 0.16,
      sociability: this.personality.sociability * 0.14,
      socialization: this.socializationImprint * 0.1,
      currentBehavior: reunionBehaviorContribution(currentBehavior)
    };
    const affinity = Object.values(contributors).reduce((sum, value) => sum + value, 0);
    if (affinity < REUNION_RESPONSE_THRESHOLD) return null;
    const kind = absence >= REUNION_LONG_ABSENCE_SECONDS && affinity >= REUNION_GREETING_THRESHOLD ? "GREET_RETURN" : "ACKNOWLEDGE_RETURN";
    return new ReunionResponseIntent({
      kind,
      duration: kind === "GREET_RETURN" ? 1.2 : 0.65,
      diagnostics: {
        contributors,
        affinity,
        absenceSeconds: absence,
        previousState,
        thresholds: {
          minimumAbsenceSeconds: REUNION_MIN_ABSENCE_SECONDS,
          greetingAbsenceSeconds: REUNION_LONG_ABSENCE_SECONDS,
          responseAtOrAbove: REUNION_RESPONSE_THRESHOLD,
          greetingAtOrAbove: REUNION_GREETING_THRESHOLD
        },
        currentBehavior
      }
    });
  }
  relationshipSnapshot() {
    this.decayRelationship();
    return {
      ...clone(this.relationship),
      recentInfluence: this.relationshipForScoring().recentInfluence
    };
  }
  relationshipForScoring() {
    return relationshipForScoring(this.relationship, this.clock.now());
  }
  decayRelationship() {
    decayRelationship(this.relationship, this.clock.now());
  }
  decayHabit() {
    decayHabit(this.habit, this.clock.now());
  }
  decaySpatial() {
    decaySpatial(this.spatial, this.clock.now());
  }
  decayPlayPreference() {
    decayPlayPreference(this.playPreference, this.clock.now());
  }
  habitForScoring(environment = this.lastEnvironment) {
    return {
      timeHabit: timeHabitForScoring(this.habit, environment.localTime, this.clock.now())
    };
  }
  learnedPlayPreferenceForScoring() {
    return learnedPlayPreferenceForScoring(this.playPreference, this.clock.now());
  }
  developmentalSocializationForScoring() {
    return developmentalSocializationForScoring(
      this.socializationImprint,
      this.developmentSnapshot().maturity
    );
  }
  habitSnapshot(environment = this.lastEnvironment) {
    this.decayHabit();
    return {
      schemaVersion: this.habit.schemaVersion,
      attentionByHour: clone(this.habit.attentionByHour),
      lastUpdatedAt: this.habit.lastUpdatedAt,
      currentHour: Math.floor(environment.localTime),
      habitStrength: this.habit.attentionByHour[Math.floor(environment.localTime)],
      timeHabit: this.habitForScoring(environment).timeHabit
    };
  }
  habitStateSnapshot() {
    this.decayHabit();
    return {
      schemaVersion: this.habit.schemaVersion,
      attentionByHour: clone(this.habit.attentionByHour),
      lastUpdatedAt: this.habit.lastUpdatedAt
    };
  }
  observeSpatial(observation2) {
    this.decaySpatial();
    if (observation2?.kind !== "REST_SITE_PLACEMENT") {
      throw new RangeError(`Unsupported spatial observation: ${observation2?.kind}`);
    }
    reinforceRestSite(this.spatial, observation2.strength ?? 0, this.clock.now());
    return this.spatialSnapshot();
  }
  resetRestSitePreference() {
    resetRestSite(this.spatial, this.clock.now());
    return this.spatialSnapshot();
  }
  spatialSnapshot() {
    this.decaySpatial();
    return {
      ...clone(this.spatial),
      restSiteTarget: this.spatial.restSiteAffinity >= REST_SITE_AFFINITY_THRESHOLD ? "REST_SITE" : null
    };
  }
  spatialStateSnapshot() {
    this.decaySpatial();
    return clone(this.spatial);
  }
  playPreferenceSnapshot() {
    this.decayPlayPreference();
    return {
      ...clone(this.playPreference),
      learnedPreference: this.learnedPlayPreferenceForScoring()
    };
  }
  playPreferenceStateSnapshot() {
    this.decayPlayPreference();
    return clone(this.playPreference);
  }
  evolveDrives(seconds, environment) {
    const hours = seconds / 3600;
    const action = this.currentBehavior?.action;
    const sleeping = action === "SLEEP";
    const playing = action === "PLAY";
    const observing = action === "OBSERVE" || action === "WANDER";
    const userRelief = environment.userPresent ? 0.012 : 0;
    this.drives.energy = clamp01(this.drives.energy + (sleeping ? -0.09 : 0.022) * hours);
    this.drives.social = clamp01(
      this.drives.social + ((environment.userPresent ? -9e-3 : 0.018) - userRelief) * hours
    );
    this.drives.curiosity = clamp01(
      this.drives.curiosity + (observing ? -0.045 : 8e-3 + environment.novelty * 0.01) * hours
    );
    this.drives.stimulation = clamp01(
      this.drives.stimulation + (playing ? -0.1 : observing ? -0.02 : 0.016 + environment.novelty * 0.01) * hours
    );
    if (environment.interactionPressure > 0 && action === "SEEK_ATTENTION") {
      this.drives.social = clamp01(this.drives.social - environment.interactionPressure * 0.06 * hours);
    }
  }
};
function resolveEnvironment(environmentInput, timestamp) {
  const value = typeof environmentInput === "function" ? environmentInput(timestamp) : environmentInput;
  return createEnvironment(value);
}
function summarizeReason(contributors) {
  return Object.entries(contributors).filter(([, value]) => Math.abs(value) >= 0.08).sort((left, right) => Math.abs(right[1]) - Math.abs(left[1])).slice(0, 3).map(([name, value]) => `${name}=${value.toFixed(3)}`).join(", ");
}
function interactionResponseBehaviorContribution(action) {
  if (action === "SLEEP") return -0.4;
  if (action === "AVOID") return -0.2;
  if (action === "SEEK_ATTENTION") return 0.04;
  return 0;
}
function reunionBehaviorContribution(action) {
  if (action === "AVOID") return -0.18;
  if (action === "SEEK_ATTENTION" || action === "PLAY") return 0.05;
  return 0;
}
var REUNION_MIN_ABSENCE_SECONDS = 300;
var REUNION_LONG_ABSENCE_SECONDS = 7200;
var REUNION_ABSENCE_SATURATION_SECONDS = 3600;
var REUNION_RESPONSE_THRESHOLD = 0.32;
var REUNION_GREETING_THRESHOLD = 0.58;
function clone(value) {
  return value === null || value === void 0 ? value : JSON.parse(JSON.stringify(value));
}
function assertNonNegative(value, name) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name} must be a finite non-negative number.`);
  }
  return value;
}

// integrations/openpets/plugin/openpets-adapter.js
var ACTIONS2 = /* @__PURE__ */ new Set([
  "IDLE",
  "OBSERVE",
  "WANDER",
  "PLAY",
  "SEEK_ATTENTION",
  "AVOID",
  "FOLLOW_CURSOR",
  "SLEEP"
]);
var FOLLOW_CURSOR_LAG = 0.35;
var REACTION_BY_ACTION = {
  IDLE: "idle",
  OBSERVE: "thinking",
  PLAY: "celebrating",
  SEEK_ATTENTION: "waving",
  AVOID: "failed",
  SLEEP: "waiting"
};
var INTERACTION_RESPONSE_KINDS2 = /* @__PURE__ */ new Set([
  "ENJOY_CONTACT",
  "ACKNOWLEDGE_CONTACT",
  "WITHDRAW_CONTACT"
]);
var REUNION_RESPONSE_KINDS2 = /* @__PURE__ */ new Set([
  "ACKNOWLEDGE_RETURN",
  "GREET_RETURN"
]);
var REACTION_BY_INTERACTION_RESPONSE = {
  ENJOY_CONTACT: "celebrating",
  ACKNOWLEDGE_CONTACT: "waving",
  WITHDRAW_CONTACT: "failed"
};
var REACTION_BY_REUNION_RESPONSE = {
  ACKNOWLEDGE_RETURN: "waving",
  GREET_RETURN: "celebrating"
};
function clampDurationMs(seconds) {
  return Math.max(250, Math.min(1500, Math.round(seconds * 1e3)));
}
function quantizeSizeFactor(sizeFactor) {
  if (!Number.isFinite(sizeFactor)) throw new TypeError("sizeFactor must be finite.");
  const bounded = Math.max(0.5, Math.min(2, sizeFactor));
  return Math.round((bounded + Number.EPSILON) * 100) / 100;
}
var OpenPetsAdapter = class {
  constructor(ctx, {
    log: log2 = () => {
    },
    setTimeoutFn = globalThis.setTimeout,
    clearTimeoutFn = globalThis.clearTimeout,
    spatialTracker = null
  } = {}) {
    this.ctx = ctx;
    this.log = log2;
    this.setTimeoutFn = setTimeoutFn;
    this.clearTimeoutFn = clearTimeoutFn;
    this.spatialTracker = spatialTracker;
    this.interactionExpressionTimer = null;
    this.interactionExpressionGeneration = 0;
    this.lastAppliedSizeFactor = null;
    this.cursorFollowing = false;
  }
  async applyDevelopment(development) {
    const sizeFactor = quantizeSizeFactor(
      typeof development === "number" ? development : development?.sizeFactor
    );
    if (sizeFactor === this.lastAppliedSizeFactor) {
      return { command: "pet.setScale skipped", sizeFactor, changed: false };
    }
    await this.ctx.pet.setScale(sizeFactor);
    this.lastAppliedSizeFactor = sizeFactor;
    return { command: `pet.setScale(${sizeFactor})`, sizeFactor, changed: true };
  }
  async execute(intent) {
    this.cancelInteractionResponse();
    return this.executeBehavior(intent);
  }
  async executeBehavior(intent, { generation = null } = {}) {
    if (!intent || !ACTIONS2.has(intent.action)) {
      throw new TypeError(`Unsupported BehaviorIntent action: ${intent?.action}`);
    }
    if (generation !== null && generation !== this.interactionExpressionGeneration) {
      return { command: "stale interaction restoration suppressed", stale: true };
    }
    const durationMs = clampDurationMs(intent.duration ?? 1);
    const startedAt = (/* @__PURE__ */ new Date()).toISOString();
    this.log("ADAPT", startedAt, intent, "pending");
    await this.applyCursorFollowing(intent.action === "FOLLOW_CURSOR");
    await this.ctx.pet.physics({ gravity: false, bounce: 0 });
    if (generation !== null && generation !== this.interactionExpressionGeneration) {
      return { command: "stale interaction restoration suppressed", stale: true };
    }
    let command;
    if (intent.action === "WANDER") {
      await this.ctx.pet.wander({ distance: 110, durationMs });
      command = "pet.wander(distance=110)";
    } else if (intent.action === "SLEEP" && intent.habitatTarget === "REST_SITE") {
      const target = this.spatialTracker?.resolveTarget?.();
      if (target) {
        await this.ctx.pet.moveTo(target);
        command = "pet.moveTo(REST_SITE)";
      }
      if (!target) {
        await this.ctx.pet.react(REACTION_BY_ACTION[intent.action], { showMessage: false });
        command = "pet.react(waiting)";
      } else {
        await this.ctx.pet.react(REACTION_BY_ACTION[intent.action], { showMessage: false });
        command += " then pet.react(waiting)";
      }
    } else {
      const reaction = REACTION_BY_ACTION[intent.action] ?? "idle";
      await this.ctx.pet.react(reaction, { showMessage: false });
      command = `pet.react(${reaction})`;
    }
    const hostState = await this.getExecutionState();
    this.log("HOST", (/* @__PURE__ */ new Date()).toISOString(), intent, `${command} result=accepted`, hostState);
    return { command, hostState };
  }
  async executeInteractionResponse(intent, restoreIntent = null) {
    return this.executeTransientResponse(intent, restoreIntent, INTERACTION_RESPONSE_KINDS2, REACTION_BY_INTERACTION_RESPONSE, "InteractionResponseIntent");
  }
  async executeReunionResponse(intent, restoreIntent = null) {
    return this.executeTransientResponse(intent, restoreIntent, REUNION_RESPONSE_KINDS2, REACTION_BY_REUNION_RESPONSE, "ReunionResponseIntent");
  }
  async executeTransientResponse(intent, restoreIntent, validKinds, reactionMap, intentName) {
    if (!intent || !validKinds.has(intent.kind)) {
      throw new TypeError(`Unsupported ${intentName} kind: ${intent?.kind}`);
    }
    this.cancelInteractionResponse();
    await this.applyCursorFollowing(false);
    const generation = this.interactionExpressionGeneration;
    const reaction = reactionMap[intent.kind];
    await this.ctx.pet.react(reaction, { showMessage: false });
    this.log("ADAPT", (/* @__PURE__ */ new Date()).toISOString(), intent, `pet.react(${reaction}) response=accepted`, {
      reaction,
      restoreAction: restoreIntent?.action ?? null
    });
    if (restoreIntent) {
      this.interactionExpressionTimer = this.setTimeoutFn(() => {
        if (generation !== this.interactionExpressionGeneration) return;
        this.interactionExpressionTimer = null;
        void this.executeBehavior(restoreIntent, { generation });
      }, clampDurationMs(intent.duration));
    }
    return {
      command: `pet.react(${reaction})`,
      restoreScheduled: Boolean(restoreIntent),
      activeExpressions: this.interactionExpressionTimer ? 1 : 0
    };
  }
  cancelInteractionResponse() {
    this.interactionExpressionGeneration += 1;
    if (this.interactionExpressionTimer !== null) {
      this.clearTimeoutFn(this.interactionExpressionTimer);
      this.interactionExpressionTimer = null;
    }
  }
  async getExecutionState() {
    return this.ctx.pet.getState();
  }
  async applyCursorFollowing(enabled) {
    if (this.cursorFollowing === enabled) {
      return { changed: false, enabled };
    }
    if (typeof this.ctx.pet.followCursor !== "function") {
      throw new TypeError("OpenPets host does not provide pet.followCursor().");
    }
    const options = enabled ? { enabled: true, lag: FOLLOW_CURSOR_LAG } : { enabled: false };
    await this.ctx.pet.followCursor(options);
    this.cursorFollowing = enabled;
    return { changed: true, enabled, options };
  }
  subscribeInteraction(handler) {
    if (!this.ctx.events?.on) return () => {
    };
    return this.ctx.events.on("pet:clicked", () => handler({
      kind: "POSITIVE_CONTACT",
      valence: 1,
      intensity: 0.4
    }));
  }
  subscribePresence(handler) {
    if (!this.ctx.events?.on) return () => {
    };
    const subscriptions = [
      this.ctx.events.on("idle:enter", (payload = {}) => handler({
        kind: "IDLE",
        idleSeconds: Number.isFinite(payload?.idleSeconds) ? payload.idleSeconds : 0
      })),
      this.ctx.events.on("idle:exit", () => handler({ kind: "ACTIVE" })),
      this.ctx.events.on("screen:locked", () => handler({ kind: "LOCKED" })),
      this.ctx.events.on("screen:unlocked", () => handler({ kind: "ACTIVE" }))
    ];
    return () => subscriptions.forEach((unsubscribe) => unsubscribe?.());
  }
  subscribeSpatial(handler) {
    if (!this.ctx.events?.on) return () => {
    };
    const onDragEnd = async (payload = {}) => {
      const state = payload.position ? payload : await this.getExecutionState();
      return handler({
        kind: "USER_PLACED",
        source: "pet:dragEnd",
        position: state.position
      });
    };
    const subscriptions = [
      this.ctx.events.on("pet:dragEnd", onDragEnd),
      this.ctx.events.on("display:changed", () => handler({ kind: "DISPLAY_CHANGED", source: "display:changed" }))
    ];
    return () => subscriptions.forEach((unsubscribe) => unsubscribe?.());
  }
  async shutdown() {
    this.cancelInteractionResponse();
    await this.applyCursorFollowing(false);
    await this.ctx.pet.physics({ gravity: false, bounce: 0 });
  }
};

// integrations/openpets/presence-tracker.js
var PRESENCE_STATES = Object.freeze(["UNKNOWN", "ACTIVE", "IDLE", "LOCKED"]);
var PresenceTracker = class {
  constructor({ clock = () => Date.now(), initialState = "UNKNOWN" } = {}) {
    if (!PRESENCE_STATES.includes(initialState)) {
      throw new RangeError(`Unsupported presence state: ${initialState}`);
    }
    this.clock = clock;
    this.state = initialState;
    this.idleSinceMs = null;
    this.lastIdleDuration = 0;
  }
  apply(signal = {}) {
    switch (signal.kind) {
      case "ACTIVE":
        return this.markActive();
      case "IDLE":
        return this.markIdle(signal.idleSeconds);
      case "LOCKED":
        return this.markLocked();
      default:
        throw new RangeError(`Unsupported presence signal: ${signal.kind}`);
    }
  }
  markActive() {
    const previousState = this.state;
    const returnedFromAbsence = previousState === "IDLE" || previousState === "LOCKED";
    const now = this.clock();
    const absenceSeconds = returnedFromAbsence ? this.snapshot(now).userIdleDuration : 0;
    this.state = "ACTIVE";
    this.idleSinceMs = null;
    this.lastIdleDuration = 0;
    const snapshot = this.snapshot();
    return returnedFromAbsence ? { ...snapshot, previousState, absenceSeconds, returnedFromAbsence: true } : snapshot;
  }
  markIdle(idleSeconds = 0) {
    const now = this.clock();
    const seconds = nonNegativeFinite(idleSeconds, "idleSeconds");
    this.state = "IDLE";
    this.idleSinceMs = now - seconds * 1e3;
    this.lastIdleDuration = seconds;
    return this.snapshot(now);
  }
  markLocked() {
    const now = this.clock();
    if (this.state !== "IDLE") {
      this.idleSinceMs = now;
      this.lastIdleDuration = 0;
    }
    this.state = "LOCKED";
    return this.snapshot(now);
  }
  snapshot(now = this.clock()) {
    if (!Number.isFinite(now)) throw new RangeError("Presence clock must return a finite number.");
    if (this.state === "ACTIVE" || this.state === "UNKNOWN") {
      return {
        state: this.state,
        userPresent: this.state === "ACTIVE",
        userIdleDuration: 0
      };
    }
    const elapsed = this.idleSinceMs === null ? this.lastIdleDuration : (now - this.idleSinceMs) / 1e3;
    return {
      state: this.state,
      userPresent: false,
      userIdleDuration: Math.max(this.lastIdleDuration, elapsed, 0)
    };
  }
};
function nonNegativeFinite(value, name) {
  if (!Number.isFinite(value) || value < 0) throw new RangeError(`${name} must be finite and non-negative.`);
  return value;
}

// integrations/openpets/rest-site-tracker.js
var REST_SITE_TRACKER_SCHEMA_VERSION = 1;
var REST_SITE_PLACEMENT_RADIUS = 96;
var REST_SITE_SMOOTHING = 0.25;
var REST_SITE_RELOCATION_PLACEMENTS = 3;
var RestSiteTracker = class _RestSiteTracker {
  constructor({
    candidate = null,
    pendingRelocation = null,
    relocationCount = 0,
    radius = REST_SITE_PLACEMENT_RADIUS,
    smoothing = REST_SITE_SMOOTHING
  } = {}) {
    this.radius = assertPositive(radius, "radius");
    this.smoothing = assertRange(smoothing, 0, 1, "smoothing");
    this.candidate = normalizePointOrNull(candidate);
    this.pendingRelocation = normalizePointOrNull(pendingRelocation);
    this.relocationCount = assertInteger(relocationCount, 0, REST_SITE_RELOCATION_PLACEMENTS, "relocationCount");
    if (!this.pendingRelocation) this.relocationCount = 0;
  }
  observePlacement(position) {
    const point = normalizePoint(position);
    if (!this.candidate) {
      this.candidate = point;
      this.clearPendingRelocation();
      return observation(0, "candidate-established");
    }
    const distance = distanceBetween(this.candidate, point);
    if (distance <= this.radius) {
      this.candidate = smoothPoint(this.candidate, point, this.smoothing);
      this.clearPendingRelocation();
      return observation(1 - distance / this.radius, "near-candidate", distance);
    }
    if (this.pendingRelocation && distanceBetween(this.pendingRelocation, point) <= this.radius) {
      this.pendingRelocation = smoothPoint(this.pendingRelocation, point, this.smoothing);
      this.relocationCount += 1;
    } else {
      this.pendingRelocation = point;
      this.relocationCount = 1;
    }
    if (this.relocationCount >= REST_SITE_RELOCATION_PLACEMENTS) {
      this.candidate = this.pendingRelocation;
      this.clearPendingRelocation();
      return { kind: "REST_SITE_RELOCATED", strength: 0, reason: "repeated-new-area", distance };
    }
    return observation(0, "scattered-placement", distance);
  }
  resolveTarget() {
    return this.candidate ? { ...this.candidate } : null;
  }
  invalidate() {
    this.candidate = null;
    this.clearPendingRelocation();
  }
  toSnapshot() {
    return {
      schemaVersion: REST_SITE_TRACKER_SCHEMA_VERSION,
      candidate: this.resolveTarget(),
      pendingRelocation: this.pendingRelocation ? { ...this.pendingRelocation } : null,
      relocationCount: this.relocationCount
    };
  }
  static fromSnapshot(snapshot) {
    if (!snapshot) return new _RestSiteTracker();
    if (snapshot.schemaVersion !== REST_SITE_TRACKER_SCHEMA_VERSION) {
      throw new Error(`Unsupported REST_SITE tracker schema: ${snapshot.schemaVersion}`);
    }
    return new _RestSiteTracker(snapshot);
  }
  clearPendingRelocation() {
    this.pendingRelocation = null;
    this.relocationCount = 0;
  }
};
function distanceBetween(left, right) {
  const a = normalizePoint(left);
  const b = normalizePoint(right);
  return Math.hypot(a.x - b.x, a.y - b.y);
}
function observation(strength, reason, distance = 0) {
  return { kind: "REST_SITE_PLACEMENT", strength: clamp012(strength), reason, distance };
}
function smoothPoint(current, next, amount) {
  return {
    x: current.x + (next.x - current.x) * amount,
    y: current.y + (next.y - current.y) * amount
  };
}
function normalizePointOrNull(value) {
  return value === null || value === void 0 ? null : normalizePoint(value);
}
function normalizePoint(value) {
  if (!Number.isFinite(value?.x) || !Number.isFinite(value?.y)) {
    throw new TypeError("REST_SITE position must contain finite x and y coordinates.");
  }
  return { x: value.x, y: value.y };
}
function clamp012(value) {
  return Math.max(0, Math.min(1, value));
}
function assertPositive(value, name) {
  if (!Number.isFinite(value) || value <= 0) throw new RangeError(`${name} must be positive.`);
  return value;
}
function assertRange(value, minimum, maximum, name) {
  if (!Number.isFinite(value) || value < minimum || value > maximum) throw new RangeError(`${name} is out of range.`);
  return value;
}
function assertInteger(value, minimum, maximum, name) {
  if (!Number.isInteger(value) || value < minimum || value > maximum) throw new RangeError(`${name} is out of range.`);
  return value;
}

// integrations/openpets/persistence-envelope.js
var PERSISTENCE_ENVELOPE_VERSION = 2;
function serializePersistenceEnvelope(creatureSnapshot, savedAtEpochMs, spatialState = null) {
  assertEpoch(savedAtEpochMs);
  if (typeof creatureSnapshot !== "string") {
    throw new TypeError("creatureSnapshot must be the serialized CreatureCore snapshot.");
  }
  return JSON.stringify({
    envelopeVersion: PERSISTENCE_ENVELOPE_VERSION,
    savedAtEpochMs,
    creatureSnapshot,
    spatialState
  });
}
function deserializePersistenceEnvelope(storedValue) {
  const parsed = typeof storedValue === "string" ? JSON.parse(storedValue) : storedValue;
  if (parsed?.envelopeVersion === 1) {
    assertEpoch(parsed.savedAtEpochMs);
    if (typeof parsed.creatureSnapshot !== "string") {
      throw new TypeError("Persistence envelope creatureSnapshot must be serialized text.");
    }
    return {
      envelopeVersion: 1,
      savedAtEpochMs: parsed.savedAtEpochMs,
      creatureSnapshot: parsed.creatureSnapshot,
      spatialState: null,
      legacy: false
    };
  }
  if (parsed?.envelopeVersion === PERSISTENCE_ENVELOPE_VERSION) {
    assertEpoch(parsed.savedAtEpochMs);
    if (typeof parsed.creatureSnapshot !== "string") {
      throw new TypeError("Persistence envelope creatureSnapshot must be serialized text.");
    }
    return {
      envelopeVersion: PERSISTENCE_ENVELOPE_VERSION,
      savedAtEpochMs: parsed.savedAtEpochMs,
      creatureSnapshot: parsed.creatureSnapshot,
      spatialState: parsed.spatialState ?? null,
      legacy: false
    };
  }
  if (parsed?.schemaVersion !== void 0) {
    return {
      envelopeVersion: null,
      savedAtEpochMs: null,
      creatureSnapshot: storedValue,
      spatialState: null,
      legacy: true
    };
  }
  throw new Error("Unsupported BPDC persistence value.");
}
function assertEpoch(value) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError("savedAtEpochMs must be a finite non-negative number.");
  }
}

// integrations/openpets/elapsed-reconciliation.js
function localHourAt(epochMs) {
  const date = new Date(epochMs);
  return date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
}
function offlineEnvironmentAt(epochMs, startEpochMs = epochMs) {
  return {
    localTime: localHourAt(epochMs),
    userPresent: false,
    userIdleDuration: Math.max(0, (epochMs - startEpochMs) / 1e3),
    novelty: 0.1,
    interactionPressure: 0
  };
}
function restoreAndReconcile(storedValue, {
  nowEpochMs = Date.now(),
  coreFactory,
  environmentAt = offlineEnvironmentAt
} = {}) {
  if (!Number.isFinite(nowEpochMs) || nowEpochMs < 0) {
    throw new RangeError("nowEpochMs must be a finite non-negative number.");
  }
  if (!storedValue) {
    return {
      core: null,
      elapsedMs: 0,
      elapsedSeconds: 0,
      clockSkew: false,
      legacy: false,
      savedAtEpochMs: null,
      resumeIntent: null,
      spatialState: null
    };
  }
  const envelope = deserializePersistenceEnvelope(storedValue);
  if (typeof coreFactory !== "function") {
    throw new TypeError("coreFactory is required to restore a CreatureCore snapshot.");
  }
  const core = coreFactory(envelope.creatureSnapshot);
  const initialSimulationTimestamp = core.toSnapshot().simulationTimestamp;
  const savedAtEpochMs = envelope.savedAtEpochMs;
  const rawElapsedMs = savedAtEpochMs === null ? 0 : nowEpochMs - savedAtEpochMs;
  const clockSkew = rawElapsedMs < 0;
  const elapsedMs = clockSkew ? 0 : rawElapsedMs;
  const elapsedSeconds = elapsedMs / 1e3;
  if (elapsedSeconds > 0) {
    core.reconcileElapsed(
      elapsedSeconds,
      (simulationTimestamp) => environmentAt(
        savedAtEpochMs + (simulationTimestamp - initialSimulationTimestamp) * 1e3,
        savedAtEpochMs
      )
    );
  }
  return {
    core,
    elapsedMs,
    elapsedSeconds,
    clockSkew,
    legacy: envelope.legacy,
    savedAtEpochMs,
    resumeIntent: core.currentIntent(),
    spatialState: envelope.spatialState
  };
}

// integrations/openpets/plugin/index.src.js
var SNAPSHOT_KEY = "bpdc.creature.snapshot";
var LOG_PREFIX = "BPDC";
var activeRuntime = null;
function log(ctx, stage, timestamp, message, details = void 0) {
  void ctx.log.info(LOG_PREFIX, { stage, timestamp, message, ...details ? { details } : {} });
}
function environmentNow(presence, epochMs = Date.now()) {
  const date = new Date(epochMs);
  const presenceSnapshot = presence.snapshot();
  return createEnvironment({
    localTime: date.getHours() + date.getMinutes() / 60,
    userPresent: presenceSnapshot.userPresent,
    userIdleDuration: presenceSnapshot.userIdleDuration,
    novelty: 0.1,
    interactionPressure: 0
  });
}
function forcedIntent(action) {
  return new BehaviorIntent({
    action,
    time: 0,
    duration: 2,
    reason: "forced mapping validation",
    score: null,
    scoreBreakdown: { source: "FORCED_MAPPING_VALIDATION" },
    interruptible: true
  });
}
function targetSleepIntent(intent, core, restSiteTracker) {
  if (intent?.action !== "SLEEP" || core.spatialSnapshot().restSiteAffinity < REST_SITE_AFFINITY_THRESHOLD) {
    return intent;
  }
  if (!restSiteTracker.resolveTarget()) return intent;
  return new BehaviorIntent({ ...intent, habitatTarget: "REST_SITE" });
}
function register(OpenPetsPlugin) {
  OpenPetsPlugin.register({
    async start(ctx) {
      const adapter = new OpenPetsAdapter(ctx, {
        log: (stage, timestamp, intent, message, details) => log(ctx, stage, timestamp, message, {
          action: intent.action ?? null,
          responseKind: intent.kind ?? null,
          utility: intent.score,
          durationSeconds: intent.duration,
          ...details ? { hostState: details } : {}
        })
      });
      const presence = new PresenceTracker();
      await ctx.pet.show();
      await ctx.pet.physics({ gravity: false, bounce: 0 });
      const startupEpochMs = Date.now();
      const saved = await ctx.storage.get(SNAPSHOT_KEY);
      const restored = restoreAndReconcile(saved, {
        nowEpochMs: startupEpochMs,
        coreFactory: CreatureCore.fromSnapshot
      });
      const core = restored.core ?? CreatureCore.create({ seed: 1112556611 });
      const restSiteTracker = RestSiteTracker.fromSnapshot(restored.spatialState);
      adapter.spatialTracker = restSiteTracker;
      log(ctx, "CORE", (/* @__PURE__ */ new Date()).toISOString(), saved ? "snapshot restored" : "new individual created", {
        creatureId: core.creatureId,
        snapshot: Boolean(saved),
        elapsedSeconds: restored.elapsedSeconds,
        legacy: restored.legacy,
        clockSkew: restored.clockSkew
      });
      if (restored.clockSkew) {
        log(ctx, "PERSIST", (/* @__PURE__ */ new Date()).toISOString(), "clock moved backwards; skipped elapsed catch-up", {
          savedAtEpochMs: restored.savedAtEpochMs,
          nowEpochMs: startupEpochMs
        });
      }
      let saveChain = Promise.resolve();
      let lastPersistAt = 0;
      const persist = (force = false) => {
        const now = Date.now();
        if (!force && now - lastPersistAt < 1e3) return saveChain;
        lastPersistAt = now;
        const envelope = serializePersistenceEnvelope(core.serialize(), now, restSiteTracker.toSnapshot());
        saveChain = saveChain.then(() => ctx.storage.set(SNAPSHOT_KEY, envelope));
        return saveChain;
      };
      const executeIntent = async (intent, source = "AUTONOMOUS") => {
        const bodyIntent = targetSleepIntent(intent, core, restSiteTracker);
        log(ctx, "CORE", (/* @__PURE__ */ new Date()).toISOString(), `${source} selected ${intent.action}`, {
          creatureId: core.creatureId,
          utility: intent.score,
          durationSeconds: intent.duration,
          reason: intent.reason,
          scoreBreakdown: intent.scoreBreakdown,
          habitatTarget: bodyIntent.habitatTarget
        });
        await adapter.execute(bodyIntent);
        await persist(true);
      };
      const applyDevelopment = async (source) => {
        const development = core.developmentSnapshot();
        const result = await adapter.applyDevelopment(development);
        if (result.changed) {
          log(ctx, "DEVELOPMENT", (/* @__PURE__ */ new Date()).toISOString(), `${source} maturation scale applied`, {
            development,
            sizeFactor: result.sizeFactor,
            command: result.command
          });
        }
        return result;
      };
      await applyDevelopment("STARTUP");
      await persist(true);
      const resumeIntent = restored.resumeIntent ?? core.advance(0, environmentNow(presence, startupEpochMs))[0];
      if (resumeIntent) await executeIntent(resumeIntent, restored.resumeIntent ? "RESUME" : "AUTONOMOUS");
      const runtime = {
        adapter,
        unsubscribe: () => {
        },
        unsubscribeInteraction: () => {
        },
        unsubscribePresence: () => {
        },
        tickChain: Promise.resolve(),
        persist,
        unsubscribeSpatial: () => {
        }
      };
      runtime.unsubscribePresence = adapter.subscribePresence((signal) => {
        const snapshot = presence.apply(signal);
        log(ctx, "ENV", (/* @__PURE__ */ new Date()).toISOString(), "presence updated", { presence: snapshot });
        if (!snapshot.returnedFromAbsence) return;
        runtime.tickChain = runtime.tickChain.then(async () => {
          const response = core.selectReunionResponse({
            absenceSeconds: snapshot.absenceSeconds,
            previousState: snapshot.previousState
          });
          if (!response) {
            log(ctx, "CORE", (/* @__PURE__ */ new Date()).toISOString(), "reunion response suppressed", {
              creatureId: core.creatureId,
              absenceSeconds: snapshot.absenceSeconds,
              previousState: snapshot.previousState,
              currentBehavior: core.currentBehavior?.action ?? null
            });
            return;
          }
          const restoreIntent = core.currentIntent();
          log(ctx, "CORE", (/* @__PURE__ */ new Date()).toISOString(), "reunion response selected", {
            creatureId: core.creatureId,
            response: {
              kind: response.kind,
              durationSeconds: response.duration,
              diagnostics: response.diagnostics
            },
            restoreAction: restoreIntent?.action ?? null
          });
          await adapter.executeReunionResponse(response, restoreIntent);
        }).catch((error) => log(ctx, "ERROR", (/* @__PURE__ */ new Date()).toISOString(), "reunion handling failed", { message: String(error?.message ?? error) }));
      });
      runtime.unsubscribeInteraction = adapter.subscribeInteraction((event) => {
        runtime.tickChain = runtime.tickChain.then(async () => {
          const presenceSnapshot = presence.markActive();
          log(ctx, "ENV", (/* @__PURE__ */ new Date()).toISOString(), "direct interaction established presence", { presence: presenceSnapshot });
          const environment = environmentNow(presence);
          const habitBefore = core.habitSnapshot(environment);
          const recorded = core.recordInteraction(event, environment);
          const habitAfter = core.habitSnapshot(environment);
          const response = core.selectInteractionResponse();
          const restoreIntent = core.currentIntent();
          log(ctx, "CORE", (/* @__PURE__ */ new Date()).toISOString(), "positive interaction recorded", {
            creatureId: core.creatureId,
            interaction: recorded,
            response: {
              kind: response.kind,
              durationSeconds: response.duration,
              diagnostics: response.diagnostics
            },
            relationship: core.relationshipSnapshot(),
            habit: {
              hour: habitAfter.currentHour,
              before: habitBefore.habitStrength,
              after: habitAfter.habitStrength,
              timeHabitBefore: habitBefore.timeHabit,
              timeHabitAfter: habitAfter.timeHabit,
              attentionByHour: habitAfter.attentionByHour
            }
          });
          await adapter.executeInteractionResponse(response, restoreIntent);
          await persist(true);
        }).catch((error) => log(ctx, "ERROR", (/* @__PURE__ */ new Date()).toISOString(), "interaction handling failed", { message: String(error?.message ?? error) }));
      });
      runtime.unsubscribeSpatial = adapter.subscribeSpatial((observation2) => {
        runtime.tickChain = runtime.tickChain.then(async () => {
          if (observation2.kind === "DISPLAY_CHANGED") {
            restSiteTracker.invalidate();
            const spatial2 = core.resetRestSitePreference();
            log(ctx, "SPATIAL", (/* @__PURE__ */ new Date()).toISOString(), "display changed; REST_SITE invalidated", { spatial: spatial2 });
            await persist(true);
            return;
          }
          const before = core.spatialSnapshot();
          const trackerResult = restSiteTracker.observePlacement(observation2.position);
          const spatial = trackerResult.kind === "REST_SITE_RELOCATED" ? core.resetRestSitePreference() : core.observeSpatial(trackerResult);
          log(ctx, "SPATIAL", (/* @__PURE__ */ new Date()).toISOString(), "user placement observed", {
            source: observation2.source,
            position: observation2.position,
            tracker: trackerResult,
            affinityBefore: before.restSiteAffinity,
            affinityAfter: spatial.restSiteAffinity,
            site: restSiteTracker.resolveTarget()
          });
          await persist(true);
        }).catch((error) => log(ctx, "ERROR", (/* @__PURE__ */ new Date()).toISOString(), "spatial observation handling failed", { message: String(error?.message ?? error) }));
      });
      runtime.unsubscribe = ctx.pet.onTick((dtMs) => {
        runtime.tickChain = runtime.tickChain.then(async () => {
          const seconds = Math.max(0, Math.min(5, dtMs / 1e3));
          const intents = core.advance(seconds, environmentNow(presence));
          await applyDevelopment("TICK");
          for (const intent of intents) await executeIntent(intent);
          await persist(false);
        }).catch((error) => log(ctx, "ERROR", (/* @__PURE__ */ new Date()).toISOString(), "autonomous tick failed", { message: String(error?.message ?? error) }));
      });
      const registerForced = (id, action, title) => ctx.commands.register({ id, title, placement: "top" }, async () => {
        log(ctx, "FORCED", (/* @__PURE__ */ new Date()).toISOString(), `${action} mapping validation requested`, { source: "FORCED_MAPPING_VALIDATION" });
        await adapter.execute(forcedIntent(action));
      });
      await registerForced("bpdc-probe-wander", "WANDER", "BPDC probe: wander");
      await registerForced("bpdc-probe-sleep", "SLEEP", "BPDC probe: sleep");
      await registerForced("bpdc-probe-attention", "SEEK_ATTENTION", "BPDC probe: attention");
      await ctx.commands.register({ id: "bpdc-status", title: "BPDC status", placement: "top" }, async () => {
        const hostState = await adapter.getExecutionState();
        log(ctx, "STATUS", (/* @__PURE__ */ new Date()).toISOString(), "diagnostic snapshot", {
          diagnostic: core.diagnosticSnapshot(environmentNow(presence)),
          presence: presence.snapshot(),
          hostState
        });
      });
      activeRuntime = runtime;
      log(ctx, "HOST", (/* @__PURE__ */ new Date()).toISOString(), "OpenPets host authority configured", {
        nativeGravity: false,
        hostBehaviorSelection: "none observed; host tick only"
      });
    },
    async stop() {
      const runtime = activeRuntime;
      activeRuntime = null;
      if (!runtime) return;
      runtime.unsubscribe();
      runtime.unsubscribePresence();
      runtime.unsubscribeInteraction();
      runtime.unsubscribeSpatial();
      await runtime.tickChain;
      await runtime.persist(true);
      await runtime.adapter.shutdown();
    }
  });
}
export {
  register,
  targetSleepIntent
};
