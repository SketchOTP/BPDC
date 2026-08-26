import { clamp01 } from "./models.js";

export const HABIT_SCHEMA_VERSION = 2;
export const HABIT_HOURS = 24;
export const HABIT_LEARNING_RATE = 0.08;
export const HABIT_HALF_LIFE_SECONDS = 7 * 24 * 3600;
export const TIME_HABIT_UTILITY_WEIGHT = 0.25;
export const ROUTINE_PERIODS = 4;
export const ROUTINE_ACTIONS = ["OBSERVE", "WANDER", "PLAY", "FOLLOW_CURSOR", "SLEEP"];
export const ROUTINE_LEARNING_RATE = 0.04;
export const ROUTINE_HALF_LIFE_SECONDS = 14 * 24 * 3600;
export const ROUTINE_UTILITY_WEIGHT = 0.12;

export function createInitialActivityByPeriod() {
  return Array.from({ length: ROUTINE_PERIODS }, () =>
    Object.fromEntries(ROUTINE_ACTIONS.map((action) => [action, 0])),
  );
}

export function createInitialHabit(timestamp = 0) {
  return {
    schemaVersion: HABIT_SCHEMA_VERSION,
    attentionByHour: Array(HABIT_HOURS).fill(0),
    activityByPeriod: createInitialActivityByPeriod(),
    lastUpdatedAt: timestamp,
  };
}

export function validateHabit(value, timestamp = 0) {
  const habit = value ?? createInitialHabit(timestamp);
  if (!Array.isArray(habit.attentionByHour) || habit.attentionByHour.length !== HABIT_HOURS) {
    throw new TypeError(`Habit attentionByHour must contain exactly ${HABIT_HOURS} values.`);
  }
  if (!Number.isFinite(habit.lastUpdatedAt) || habit.lastUpdatedAt < 0) {
    throw new RangeError("Habit lastUpdatedAt must be finite and non-negative.");
  }
  const activityByPeriod = habit.activityByPeriod ?? createInitialActivityByPeriod();
  if (!Array.isArray(activityByPeriod) || activityByPeriod.length !== ROUTINE_PERIODS) {
    throw new TypeError(`Habit activityByPeriod must contain exactly ${ROUTINE_PERIODS} values.`);
  }
  return {
    schemaVersion: HABIT_SCHEMA_VERSION,
    attentionByHour: habit.attentionByHour.map((value) => clamp01(value)),
    activityByPeriod: activityByPeriod.map((period) => {
      if (!period || typeof period !== "object" || Array.isArray(period)) {
        throw new TypeError("Habit activity period must be an object.");
      }
      return Object.fromEntries(ROUTINE_ACTIONS.map((action) => {
        const value = period[action] ?? 0;
        if (!Number.isFinite(value)) throw new TypeError(`Habit affinity for ${action} must be finite.`);
        return [action, clamp01(value)];
      }));
    }),
    lastUpdatedAt: habit.lastUpdatedAt,
  };
}

export function decayHabit(habit, timestamp) {
  if (timestamp < habit.lastUpdatedAt) return habit;
  const elapsed = timestamp - habit.lastUpdatedAt;
  if (elapsed > 0) {
    const retention = 2 ** (-elapsed / HABIT_HALF_LIFE_SECONDS);
    habit.attentionByHour = habit.attentionByHour.map((value) => clamp01(value * retention));
    const routineRetention = 2 ** (-elapsed / ROUTINE_HALF_LIFE_SECONDS);
    habit.activityByPeriod = habit.activityByPeriod.map((period) =>
      Object.fromEntries(ROUTINE_ACTIONS.map((action) => [
        action,
        clamp01(period[action] * routineRetention),
      ])),
    );
  }
  habit.lastUpdatedAt = timestamp;
  return habit;
}

export function reinforceAttentionHabit(habit, localTime, intensity, timestamp) {
  assertLocalTime(localTime);
  decayHabit(habit, timestamp);
  const hour = Math.floor(localTime);
  const learning = HABIT_LEARNING_RATE * clamp01(intensity);
  const current = habit.attentionByHour[hour];
  habit.attentionByHour[hour] = clamp01(current + learning * (1 - current));
  return habit.attentionByHour[hour];
}

export function timeHabitForScoring(habit, localTime, timestamp) {
  assertLocalTime(localTime);
  decayHabit(habit, timestamp);
  return habit.attentionByHour[Math.floor(localTime)] * TIME_HABIT_UTILITY_WEIGHT;
}

export function coarseActivityPeriod(localTime) {
  assertLocalTime(localTime);
  return Math.floor(localTime / 6);
}

export function reinforceActivityRoutine(habit, action, period, timestamp) {
  if (!ROUTINE_ACTIONS.includes(action)) return 0;
  if (!Number.isInteger(period) || period < 0 || period >= ROUTINE_PERIODS) {
    throw new RangeError(`Routine period must be an integer in the range 0 <= period < ${ROUTINE_PERIODS}.`);
  }
  decayHabit(habit, timestamp);
  const current = habit.activityByPeriod[period][action];
  habit.activityByPeriod[period][action] = clamp01(
    current + ROUTINE_LEARNING_RATE * (1 - current),
  );
  return habit.activityByPeriod[period][action];
}

export function routineBiasesForScoring(habit, localTime, timestamp) {
  const period = coarseActivityPeriod(localTime);
  decayHabit(habit, timestamp);
  return Object.fromEntries(ROUTINE_ACTIONS.map((action) => [
    action,
    habit.activityByPeriod[period][action] * ROUTINE_UTILITY_WEIGHT,
  ]));
}

export function migrateHabit(value, timestamp = 0) {
  return validateHabit(value, timestamp);
}

function assertLocalTime(localTime) {
  if (!Number.isFinite(localTime) || localTime < 0 || localTime >= 24) {
    throw new RangeError("localTime must be in the range 0 <= localTime < 24.");
  }
}
