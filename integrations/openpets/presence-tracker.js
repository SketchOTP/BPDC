export const PRESENCE_STATES = Object.freeze(["UNKNOWN", "ACTIVE", "IDLE", "LOCKED"]);

/**
 * Translates bounded host-neutral presence signals into the environment fields
 * CreatureCore already understands. Presence is transient integration state;
 * it is intentionally not part of the creature snapshot.
 */
export class PresenceTracker {
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
    return returnedFromAbsence
      ? { ...snapshot, previousState, absenceSeconds, returnedFromAbsence: true }
      : snapshot;
  }

  markIdle(idleSeconds = 0) {
    const now = this.clock();
    const seconds = nonNegativeFinite(idleSeconds, "idleSeconds");
    this.state = "IDLE";
    this.idleSinceMs = now - seconds * 1_000;
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
        userIdleDuration: 0,
      };
    }

    const elapsed = this.idleSinceMs === null ? this.lastIdleDuration : (now - this.idleSinceMs) / 1_000;
    return {
      state: this.state,
      userPresent: false,
      userIdleDuration: Math.max(this.lastIdleDuration, elapsed, 0),
    };
  }
}

function nonNegativeFinite(value, name) {
  if (!Number.isFinite(value) || value < 0) throw new RangeError(`${name} must be finite and non-negative.`);
  return value;
}
