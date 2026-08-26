import { ACTIONS } from "./behavior.js";

export function createInitialBehaviorCooldowns() {
  return {};
}

export function validateBehaviorCooldowns(cooldowns) {
  if (cooldowns === undefined || cooldowns === null) return createInitialBehaviorCooldowns();
  if (typeof cooldowns !== "object" || Array.isArray(cooldowns)) {
    throw new TypeError("behaviorCooldowns must be an object.");
  }

  const validated = {};
  for (const [action, availableAt] of Object.entries(cooldowns)) {
    if (!ACTIONS.includes(action)) {
      throw new RangeError(`Unknown behavior cooldown action: ${action}`);
    }
    if (!Number.isFinite(availableAt) || availableAt < 0) {
      throw new RangeError(`Cooldown expiry for ${action} must be finite and non-negative.`);
    }
    validated[action] = availableAt;
  }
  return validated;
}

