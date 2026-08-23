import { clamp01 } from "./models.js";

export const RELATIONSHIP_SCHEMA_VERSION = 1;
export const DEFAULT_BOND = 0.5;
export const MAX_INTERACTION_EVENTS = 8;
export const BOND_LEARNING_RATE = 0.05;
export const BOND_HALF_LIFE_SECONDS = 72 * 3600;
export const RECENT_EVENT_HALF_LIFE_SECONDS = 6 * 3600;
export const EVENT_RETENTION_SECONDS = 24 * 3600;

export function createInitialRelationship(timestamp = 0) {
  return {
    schemaVersion: RELATIONSHIP_SCHEMA_VERSION,
    bond: DEFAULT_BOND,
    events: [],
    lastUpdatedAt: timestamp,
  };
}

export function validateRelationship(value, timestamp = 0) {
  const relationship = value ?? createInitialRelationship(timestamp);
  if (!Number.isFinite(relationship.bond)) throw new TypeError("Relationship bond is required.");
  if (!Number.isFinite(relationship.lastUpdatedAt) || relationship.lastUpdatedAt < 0) {
    throw new RangeError("Relationship lastUpdatedAt must be finite and non-negative.");
  }
  const events = Array.isArray(relationship.events) ? relationship.events : [];
  return {
    schemaVersion: RELATIONSHIP_SCHEMA_VERSION,
    bond: clamp01(relationship.bond),
    events: events.slice(-MAX_INTERACTION_EVENTS).map((event) => ({
      timestamp: nonNegative(event.timestamp, "interaction timestamp"),
      kind: String(event.kind),
      valence: clamp(event.valence, -1, 1, "interaction valence"),
      intensity: clamp(event.intensity, 0, 1, "interaction intensity"),
    })),
    lastUpdatedAt: relationship.lastUpdatedAt,
  };
}

export function decayRelationship(relationship, timestamp) {
  if (timestamp < relationship.lastUpdatedAt) return relationship;
  const elapsed = timestamp - relationship.lastUpdatedAt;
  if (elapsed > 0) {
    const retention = 2 ** (-elapsed / BOND_HALF_LIFE_SECONDS);
    relationship.bond = clamp01(DEFAULT_BOND + (relationship.bond - DEFAULT_BOND) * retention);
  }
  relationship.events = relationship.events
    .filter((event) => timestamp - event.timestamp <= EVENT_RETENTION_SECONDS)
    .slice(-MAX_INTERACTION_EVENTS);
  relationship.lastUpdatedAt = timestamp;
  return relationship;
}

export function recentInfluence(relationship, timestamp) {
  const totals = relationship.events.reduce((result, event) => {
      const age = Math.max(0, timestamp - event.timestamp);
      const weight = 2 ** (-age / RECENT_EVENT_HALF_LIFE_SECONDS);
      result.value += event.valence * event.intensity * weight;
      return result;
    }, { value: 0 });
  if (relationship.events.length === 0) return 0;
  return Math.max(-1, Math.min(1, totals.value / relationship.events.length));
}

export function relationshipForScoring(relationship, timestamp) {
  return {
    bond: relationship.bond,
    recentInfluence: recentInfluence(relationship, timestamp),
  };
}

function clamp(value, min, max, name) {
  if (!Number.isFinite(value) || value < min || value > max) throw new RangeError(`${name} is out of range.`);
  return Math.max(min, Math.min(max, value));
}

function nonNegative(value, name) {
  if (!Number.isFinite(value) || value < 0) throw new RangeError(`${name} must be finite and non-negative.`);
  return value;
}
