import { createInitialRelationship } from "./relationship.js";

export const SNAPSHOT_SCHEMA_VERSION = 2;

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
    };
  }
  if (snapshot?.schemaVersion !== SNAPSHOT_SCHEMA_VERSION) {
    throw new Error(`Unsupported CreatureSnapshot schema: ${snapshot?.schemaVersion}`);
  }
  return snapshot;
}
