export const REST_SITE_TRACKER_SCHEMA_VERSION = 1;
export const REST_SITE_PLACEMENT_RADIUS = 96;
export const REST_SITE_SMOOTHING = 0.25;
export const REST_SITE_RELOCATION_PLACEMENTS = 3;

/**
 * Keeps the only host geometry BPDC needs outside CreatureCore. The pending
 * relocation point is a bounded streak, not a second learned-site list.
 */
export class RestSiteTracker {
  constructor({
    candidate = null,
    pendingRelocation = null,
    relocationCount = 0,
    radius = REST_SITE_PLACEMENT_RADIUS,
    smoothing = REST_SITE_SMOOTHING,
  } = {}) {
    this.radius = assertPositive(radius, "radius");
    this.smoothing = assertRange(smoothing, 0, 1, "smoothing");
    this.candidate = normalizePointOrNull(candidate);
    this.pendingRelocation = normalizePointOrNull(pendingRelocation);
    this.relocationCount = assertInteger(relocationCount, 0, REST_SITE_RELOCATION_PLACEMENTS, "relocationCount");
    if (!this.pendingRelocation) this.relocationCount = 0;
  }

  observePlacement(position) {
    const point = normalizePoint(position);
    if (!this.candidate) {
      this.candidate = point;
      this.clearPendingRelocation();
      return observation(0, "candidate-established");
    }

    const distance = distanceBetween(this.candidate, point);
    if (distance <= this.radius) {
      this.candidate = smoothPoint(this.candidate, point, this.smoothing);
      this.clearPendingRelocation();
      return observation(1 - distance / this.radius, "near-candidate", distance);
    }

    if (this.pendingRelocation && distanceBetween(this.pendingRelocation, point) <= this.radius) {
      this.pendingRelocation = smoothPoint(this.pendingRelocation, point, this.smoothing);
      this.relocationCount += 1;
    } else {
      this.pendingRelocation = point;
      this.relocationCount = 1;
    }

    if (this.relocationCount >= REST_SITE_RELOCATION_PLACEMENTS) {
      this.candidate = this.pendingRelocation;
      this.clearPendingRelocation();
      return { kind: "REST_SITE_RELOCATED", strength: 0, reason: "repeated-new-area", distance };
    }

    return observation(0, "scattered-placement", distance);
  }

  resolveTarget() {
    return this.candidate ? { ...this.candidate } : null;
  }

  invalidate() {
    this.candidate = null;
    this.clearPendingRelocation();
  }

  toSnapshot() {
    return {
      schemaVersion: REST_SITE_TRACKER_SCHEMA_VERSION,
      candidate: this.resolveTarget(),
      pendingRelocation: this.pendingRelocation ? { ...this.pendingRelocation } : null,
      relocationCount: this.relocationCount,
    };
  }

  static fromSnapshot(snapshot) {
    if (!snapshot) return new RestSiteTracker();
    if (snapshot.schemaVersion !== REST_SITE_TRACKER_SCHEMA_VERSION) {
      throw new Error(`Unsupported REST_SITE tracker schema: ${snapshot.schemaVersion}`);
    }
    return new RestSiteTracker(snapshot);
  }

  clearPendingRelocation() {
    this.pendingRelocation = null;
    this.relocationCount = 0;
  }
}

export function distanceBetween(left, right) {
  const a = normalizePoint(left);
  const b = normalizePoint(right);
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function observation(strength, reason, distance = 0) {
  return { kind: "REST_SITE_PLACEMENT", strength: clamp01(strength), reason, distance };
}

function smoothPoint(current, next, amount) {
  return {
    x: current.x + (next.x - current.x) * amount,
    y: current.y + (next.y - current.y) * amount,
  };
}

function normalizePointOrNull(value) {
  return value === null || value === undefined ? null : normalizePoint(value);
}

function normalizePoint(value) {
  if (!Number.isFinite(value?.x) || !Number.isFinite(value?.y)) {
    throw new TypeError("REST_SITE position must contain finite x and y coordinates.");
  }
  return { x: value.x, y: value.y };
}

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function assertPositive(value, name) {
  if (!Number.isFinite(value) || value <= 0) throw new RangeError(`${name} must be positive.`);
  return value;
}

function assertRange(value, minimum, maximum, name) {
  if (!Number.isFinite(value) || value < minimum || value > maximum) throw new RangeError(`${name} is out of range.`);
  return value;
}

function assertInteger(value, minimum, maximum, name) {
  if (!Number.isInteger(value) || value < minimum || value > maximum) throw new RangeError(`${name} is out of range.`);
  return value;
}
