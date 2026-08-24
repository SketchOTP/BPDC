export const PERSISTENCE_ENVELOPE_VERSION = 1;

export function serializePersistenceEnvelope(creatureSnapshot, savedAtEpochMs) {
  assertEpoch(savedAtEpochMs);
  if (typeof creatureSnapshot !== "string") {
    throw new TypeError("creatureSnapshot must be the serialized CreatureCore snapshot.");
  }
  return JSON.stringify({
    envelopeVersion: PERSISTENCE_ENVELOPE_VERSION,
    savedAtEpochMs,
    creatureSnapshot,
  });
}

export function deserializePersistenceEnvelope(storedValue) {
  const parsed = typeof storedValue === "string" ? JSON.parse(storedValue) : storedValue;
  if (parsed?.envelopeVersion === PERSISTENCE_ENVELOPE_VERSION) {
    assertEpoch(parsed.savedAtEpochMs);
    if (typeof parsed.creatureSnapshot !== "string") {
      throw new TypeError("Persistence envelope creatureSnapshot must be serialized text.");
    }
    return {
      envelopeVersion: PERSISTENCE_ENVELOPE_VERSION,
      savedAtEpochMs: parsed.savedAtEpochMs,
      creatureSnapshot: parsed.creatureSnapshot,
      legacy: false,
    };
  }

  if (parsed?.schemaVersion !== undefined) {
    return {
      envelopeVersion: null,
      savedAtEpochMs: null,
      creatureSnapshot: storedValue,
      legacy: true,
    };
  }

  throw new Error("Unsupported BPDC persistence value.");
}

function assertEpoch(value) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError("savedAtEpochMs must be a finite non-negative number.");
  }
}
