import { createInitialRelationship } from "./relationship.js";
import { createInitialHabit } from "./habit.js";
import { createInitialSpatial } from "./spatial.js";
import { createInitialPlayPreference } from "./play-preference.js";

export const SNAPSHOT_SCHEMA_VERSION = 6;

export function serializeSnapshot(snapshot) {
  return JSON.stringify(snapshot, null, 2);
}

export function deserializeSnapshot(serialized) {
  const snapshot = typeof serialized === "string" ? JSON.parse(serialized) : serialized;
  if (snapshot?.schemaVersion === 1) {
    return {
      ...snapshot,
      schemaVersion: SNAPSHOT_SCHEMA_VERSION,
      relationship: createInitialRelationship(snapshot.simulationTimestamp ?? 0),
      habit: createInitialHabit(snapshot.simulationTimestamp ?? 0),
      spatial: createInitialSpatial(snapshot.simulationTimestamp ?? 0),
      playPreference: createInitialPlayPreference(snapshot.simulationTimestamp ?? 0),
      socializationImprint: 0,
    };
  }
  if (snapshot?.schemaVersion === 2) {
    return {
      ...snapshot,
      schemaVersion: SNAPSHOT_SCHEMA_VERSION,
      habit: createInitialHabit(snapshot.simulationTimestamp ?? 0),
      spatial: createInitialSpatial(snapshot.simulationTimestamp ?? 0),
      playPreference: createInitialPlayPreference(snapshot.simulationTimestamp ?? 0),
      socializationImprint: 0,
    };
  }
  if (snapshot?.schemaVersion === 3) {
    return {
      ...snapshot,
      schemaVersion: SNAPSHOT_SCHEMA_VERSION,
      spatial: createInitialSpatial(snapshot.simulationTimestamp ?? 0),
      playPreference: createInitialPlayPreference(snapshot.simulationTimestamp ?? 0),
      socializationImprint: 0,
    };
  }
  if (snapshot?.schemaVersion === 4) {
    return {
      ...snapshot,
      schemaVersion: SNAPSHOT_SCHEMA_VERSION,
      playPreference: createInitialPlayPreference(snapshot.simulationTimestamp ?? 0),
      socializationImprint: 0,
    };
  }
  if (snapshot?.schemaVersion === 5) {
    return {
      ...snapshot,
      schemaVersion: SNAPSHOT_SCHEMA_VERSION,
      socializationImprint: 0,
    };
  }
  if (snapshot?.schemaVersion !== SNAPSHOT_SCHEMA_VERSION) {
    throw new Error(`Unsupported CreatureSnapshot schema: ${snapshot?.schemaVersion}`);
  }
  return snapshot;
}
