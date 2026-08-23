export { CreatureCore } from "./creature-core.js";
export { BehaviorIntent } from "./intent.js";
export { InteractionEvent, INTERACTION_KINDS, normalizeInteractionEvent } from "./interaction.js";
export { SimulationClock } from "./clock.js";
export { SeededRng, normalizeSeed } from "./seeded-rng.js";
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
