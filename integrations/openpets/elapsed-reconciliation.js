import { deserializePersistenceEnvelope } from "./persistence-envelope.js";

export function localHourAt(epochMs) {
  const date = new Date(epochMs);
  return date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3_600;
}

export function offlineEnvironmentAt(epochMs, startEpochMs = epochMs) {
  return {
    localTime: localHourAt(epochMs),
    userPresent: false,
    userIdleDuration: Math.max(0, (epochMs - startEpochMs) / 1_000),
    novelty: 0.1,
    interactionPressure: 0,
  };
}

export function restoreAndReconcile(storedValue, {
  nowEpochMs = Date.now(),
  coreFactory,
  environmentAt = offlineEnvironmentAt,
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
      spatialState: null,
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
  const elapsedSeconds = elapsedMs / 1_000;

  if (elapsedSeconds > 0) {
    core.reconcileElapsed(
      elapsedSeconds,
      (simulationTimestamp) => environmentAt(
        savedAtEpochMs + (simulationTimestamp - initialSimulationTimestamp) * 1_000,
        savedAtEpochMs,
      ),
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
    spatialState: envelope.spatialState,
  };
}
