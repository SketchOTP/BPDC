import { SeededRng } from "./seeded-rng.js";

export const DRIVE_NAMES = ["energy", "social", "curiosity", "stimulation"];
export const PERSONALITY_TRAITS = [
  "curiosity",
  "sociability",
  "playfulness",
  "boldness",
  "independence",
  "sleepiness",
];

export function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

export function createInitialDrives() {
  // All four values are normalized pressures: 0 is satisfied and 1 is urgent.
  // `energy` therefore means fatigue pressure, not remaining energy.
  return {
    energy: 0.2,
    social: 0.25,
    curiosity: 0.35,
    stimulation: 0.25,
  };
}

export function createPersonality(seed) {
  const rng = new SeededRng(seed);
  return Object.fromEntries(
    PERSONALITY_TRAITS.map((trait) => [trait, Number((0.2 + rng.next() * 0.6).toFixed(6))]),
  );
}

export function createEnvironment({
  localTime = 12,
  userPresent = false,
  userIdleDuration = 0,
  novelty = 0,
  interactionPressure = 0,
} = {}) {
  if (!Number.isFinite(localTime) || localTime < 0 || localTime >= 24) {
    throw new RangeError("localTime must be in the range 0 <= localTime < 24.");
  }

  return {
    localTime,
    userPresent: Boolean(userPresent),
    userIdleDuration: nonNegative(userIdleDuration, "userIdleDuration"),
    novelty: clamp01(novelty),
    interactionPressure: clamp01(interactionPressure),
  };
}

export function validateDrives(drives) {
  for (const name of DRIVE_NAMES) {
    if (!Number.isFinite(drives?.[name])) {
      throw new TypeError(`Missing normalized drive: ${name}`);
    }
  }
  return Object.fromEntries(DRIVE_NAMES.map((name) => [name, clamp01(drives[name])]));
}

export function validatePersonality(personality) {
  for (const trait of PERSONALITY_TRAITS) {
    if (!Number.isFinite(personality?.[trait])) {
      throw new TypeError(`Missing personality trait: ${trait}`);
    }
  }
  return Object.fromEntries(
    PERSONALITY_TRAITS.map((trait) => [trait, clamp01(personality[trait])]),
  );
}

function nonNegative(value, name) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name} must be a finite non-negative number.`);
  }
  return value;
}
