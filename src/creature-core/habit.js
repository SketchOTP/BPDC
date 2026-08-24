import { clamp01 } from "./models.js";

export const HABIT_SCHEMA_VERSION = 1;
export const HABIT_HOURS = 24;
export const HABIT_LEARNING_RATE = 0.08;
export const HABIT_HALF_LIFE_SECONDS = 7 * 24 * 3600;
export const TIME_HABIT_UTILITY_WEIGHT = 0.25;

export function createInitialHabit(timestamp = 0) {
  return {
    schemaVersion: HABIT_SCHEMA_VERSION,
    attentionByHour: Array(HABIT_HOURS).fill(0),
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
  return {
    schemaVersion: HABIT_SCHEMA_VERSION,
    attentionByHour: habit.attentionByHour.map((value) => clamp01(value)),
    lastUpdatedAt: habit.lastUpdatedAt,
  };
}

export function decayHabit(habit, timestamp) {
  if (timestamp < habit.lastUpdatedAt) return habit;
  const elapsed = timestamp - habit.lastUpdatedAt;
  if (elapsed > 0) {
    const retention = 2 ** (-elapsed / HABIT_HALF_LIFE_SECONDS);
    habit.attentionByHour = habit.attentionByHour.map((value) => clamp01(value * retention));
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

function assertLocalTime(localTime) {
  if (!Number.isFinite(localTime) || localTime < 0 || localTime >= 24) {
    throw new RangeError("localTime must be in the range 0 <= localTime < 24.");
  }
}
