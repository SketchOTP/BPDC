import { clamp01 } from "./models.js";

export const SPATIAL_SCHEMA_VERSION = 1;
export const REST_SITE_AFFINITY_LEARNING_RATE = 0.12;
export const REST_SITE_AFFINITY_HALF_LIFE_SECONDS = 14 * 24 * 3600;
export const REST_SITE_AFFINITY_THRESHOLD = 0.6;
export const SPATIAL_OBSERVATION_KINDS = ["REST_SITE_PLACEMENT"];

export function createInitialSpatial(timestamp = 0) {
  return {
    schemaVersion: SPATIAL_SCHEMA_VERSION,
    restSiteAffinity: 0,
    lastUpdatedAt: timestamp,
  };
}

export function validateSpatial(value, timestamp = 0) {
  const spatial = value ?? createInitialSpatial(timestamp);
  if (!Number.isFinite(spatial.restSiteAffinity)) {
    throw new TypeError("Spatial restSiteAffinity must be finite.");
  }
  if (!Number.isFinite(spatial.lastUpdatedAt) || spatial.lastUpdatedAt < 0) {
    throw new RangeError("Spatial lastUpdatedAt must be finite and non-negative.");
  }
  return {
    schemaVersion: SPATIAL_SCHEMA_VERSION,
    restSiteAffinity: clamp01(spatial.restSiteAffinity),
    lastUpdatedAt: spatial.lastUpdatedAt,
  };
}

export function decaySpatial(spatial, timestamp) {
  if (timestamp < spatial.lastUpdatedAt) return spatial;
  const elapsed = timestamp - spatial.lastUpdatedAt;
  if (elapsed > 0) {
    spatial.restSiteAffinity = clamp01(
      spatial.restSiteAffinity * 2 ** (-elapsed / REST_SITE_AFFINITY_HALF_LIFE_SECONDS),
    );
  }
  spatial.lastUpdatedAt = timestamp;
  return spatial;
}

export function reinforceRestSite(spatial, strength, timestamp) {
  decaySpatial(spatial, timestamp);
  const learning = REST_SITE_AFFINITY_LEARNING_RATE * clamp01(strength);
  spatial.restSiteAffinity = clamp01(
    spatial.restSiteAffinity + learning * (1 - spatial.restSiteAffinity),
  );
  return spatial.restSiteAffinity;
}

export function resetRestSite(spatial, timestamp) {
  decaySpatial(spatial, timestamp);
  spatial.restSiteAffinity = 0;
  spatial.lastUpdatedAt = timestamp;
  return spatial;
}
