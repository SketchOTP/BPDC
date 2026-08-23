export class SimulationClock {
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
}

function assertFiniteNonNegative(value, name) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name} must be a finite non-negative number.`);
  }
}
