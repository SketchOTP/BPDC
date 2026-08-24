export { CreatureCore } from "./creature-core.js";
export { BehaviorIntent, InteractionResponseIntent, INTERACTION_RESPONSE_KINDS } from "./intent.js";
export { InteractionEvent, INTERACTION_KINDS, normalizeInteractionEvent } from "./interaction.js";
export { SimulationClock } from "./clock.js";
export { SeededRng, normalizeSeed } from "./seeded-rng.js";
export {
  HABIT_HALF_LIFE_SECONDS,
  HABIT_HOURS,
  HABIT_LEARNING_RATE,
  HABIT_SCHEMA_VERSION,
  TIME_HABIT_UTILITY_WEIGHT,
  createInitialHabit,
  decayHabit,
  reinforceAttentionHabit,
  timeHabitForScoring,
  validateHabit,
} from "./habit.js";
export {
  ACTIONS,
  BEHAVIOR_DEFINITIONS,
  BehaviorScorer,
  BehaviorSelector,
} from "./behavior.js";
export {
  DRIVE_NAMES,
  PERSONALITY_TRAITS,
  clamp01,
  createEnvironment,
  createInitialDrives,
  createPersonality,
} from "./models.js";
export {
  SNAPSHOT_SCHEMA_VERSION,
  deserializeSnapshot,
  serializeSnapshot,
} from "./persistence.js";
export {
  BOND_HALF_LIFE_SECONDS,
  BOND_LEARNING_RATE,
  DEFAULT_BOND,
  EVENT_RETENTION_SECONDS,
  MAX_INTERACTION_EVENTS,
  RECENT_EVENT_HALF_LIFE_SECONDS,
  createInitialRelationship,
  recentInfluence,
} from "./relationship.js";
export {
  REST_SITE_AFFINITY_HALF_LIFE_SECONDS,
  REST_SITE_AFFINITY_LEARNING_RATE,
  REST_SITE_AFFINITY_THRESHOLD,
  SPATIAL_OBSERVATION_KINDS,
  SPATIAL_SCHEMA_VERSION,
  createInitialSpatial,
  decaySpatial,
  reinforceRestSite,
  resetRestSite,
  validateSpatial,
} from "./spatial.js";
export {
  PLAY_PREFERENCE_HALF_LIFE_SECONDS,
  PLAY_PREFERENCE_LEARNING_RATE,
  PLAY_PREFERENCE_SCHEMA_VERSION,
  PLAY_PREFERENCE_UTILITY_WEIGHT,
  createInitialPlayPreference,
  decayPlayPreference,
  learnedPlayPreferenceForScoring,
  reinforcePlayPreference,
  validatePlayPreference,
} from "./play-preference.js";
