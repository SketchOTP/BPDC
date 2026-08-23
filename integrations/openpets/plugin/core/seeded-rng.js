export class SeededRng {
  constructor(seed = 1) {
    this.state = normalizeSeed(seed);
  }

  next() {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
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
}

export function normalizeSeed(seed) {
  if (typeof seed === "string") {
    let hash = 2166136261;
    for (const character of seed) {
      hash ^= character.codePointAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0) || 1;
  }

  if (!Number.isFinite(seed)) {
    throw new TypeError("Seed must be a finite number or string.");
  }

  return (Math.trunc(seed) >>> 0) || 1;
}
