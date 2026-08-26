import { clamp01 } from "./models.js";

export const SOCIALIZATION_LEARNING_RATE = 0.03;
export const SOCIALIZATION_UTILITY_WEIGHT = 0.12;

export function validateSocializationImprint(value) {
  if (value === undefined || value === null) return 0;
  if (!Number.isFinite(value)) {
    throw new TypeError("Socialization imprint must be finite.");
  }
  return clamp01(value);
}

export function reinforceSocializationImprint(imprint, intensity, maturity) {
  const boundedIntensity = clamp01(intensity);
  const juvenilePlasticity = 1 - clamp01(maturity);
  const delta = SOCIALIZATION_LEARNING_RATE
    * boundedIntensity
    * juvenilePlasticity
    * (1 - clamp01(imprint));
  return clamp01(imprint + delta);
}

export function developmentalSocializationForScoring(imprint, maturity) {
  return validateSocializationImprint(imprint)
    * clamp01(maturity)
    * SOCIALIZATION_UTILITY_WEIGHT;
}
