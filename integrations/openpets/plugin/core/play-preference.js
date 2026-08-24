import { clamp01 } from "./models.js";

export const PLAY_PREFERENCE_SCHEMA_VERSION = 1;
export const PLAY_PREFERENCE_LEARNING_RATE = 0.06;
export const PLAY_PREFERENCE_HALF_LIFE_SECONDS = 21 * 24 * 3600;
export const PLAY_PREFERENCE_UTILITY_WEIGHT = 0.3;

export function createInitialPlayPreference(timestamp = 0) {
  return {
    schemaVersion: PLAY_PREFERENCE_SCHEMA_VERSION,
    playPreference: 0,
    lastUpdatedAt: timestamp,
  };
}

export function validatePlayPreference(value, timestamp = 0) {
  const preference = value ?? createInitialPlayPreference(timestamp);
  if (!Number.isFinite(preference.lastUpdatedAt) || preference.lastUpdatedAt < 0) {
    throw new RangeError("Play preference lastUpdatedAt must be finite and non-negative.");
  }
  return {
    schemaVersion: PLAY_PREFERENCE_SCHEMA_VERSION,
    playPreference: clamp01(preference.playPreference),
    lastUpdatedAt: preference.lastUpdatedAt,
  };
}

export function decayPlayPreference(preference, timestamp) {
  if (timestamp < preference.lastUpdatedAt) return preference;
  const elapsed = timestamp - preference.lastUpdatedAt;
  if (elapsed > 0) {
    const retention = 2 ** (-elapsed / PLAY_PREFERENCE_HALF_LIFE_SECONDS);
    preference.playPreference = clamp01(preference.playPreference * retention);
  }
  preference.lastUpdatedAt = timestamp;
  return preference;
}

export function reinforcePlayPreference(preference, intensity, timestamp) {
  decayPlayPreference(preference, timestamp);
  const learning = PLAY_PREFERENCE_LEARNING_RATE * clamp01(intensity);
  preference.playPreference = clamp01(
    preference.playPreference + learning * (1 - preference.playPreference),
  );
  return preference.playPreference;
}

export function learnedPlayPreferenceForScoring(preference, timestamp) {
  decayPlayPreference(preference, timestamp);
  return preference.playPreference * PLAY_PREFERENCE_UTILITY_WEIGHT;
}
