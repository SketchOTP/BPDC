import { clamp01 } from "./models.js";

export const MATURATION_DURATION_SECONDS = 14 * 24 * 60 * 60;
export const INITIAL_SIZE_FACTOR = 0.8;
export const MATURE_SIZE_FACTOR = 1;

export function developmentSnapshot({ createdAt, simulationTimestamp } = {}) {
  assertFiniteNonNegative(createdAt, "createdAt");
  assertFiniteNonNegative(simulationTimestamp, "simulationTimestamp");

  const ageSeconds = Math.max(0, simulationTimestamp - createdAt);
  const maturity = clamp01(ageSeconds / MATURATION_DURATION_SECONDS);
  const sizeFactor = INITIAL_SIZE_FACTOR + (MATURE_SIZE_FACTOR - INITIAL_SIZE_FACTOR) * maturity;

  return { ageSeconds, maturity, sizeFactor };
}

function assertFiniteNonNegative(value, name) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name} must be a finite non-negative number.`);
  }
}
