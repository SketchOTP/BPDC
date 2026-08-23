export const SNAPSHOT_SCHEMA_VERSION = 1;

export function serializeSnapshot(snapshot) {
  return JSON.stringify(snapshot, null, 2);
}

export function deserializeSnapshot(serialized) {
  const snapshot = typeof serialized === "string" ? JSON.parse(serialized) : serialized;
  if (snapshot?.schemaVersion !== SNAPSHOT_SCHEMA_VERSION) {
    throw new Error(`Unsupported CreatureSnapshot schema: ${snapshot?.schemaVersion}`);
  }
  return snapshot;
}
