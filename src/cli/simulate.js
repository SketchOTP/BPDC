#!/usr/bin/env node
import { CreatureCore, createEnvironment } from "../creature-core/index.js";

const options = parseArgs(process.argv.slice(2));
const core = CreatureCore.create({ seed: options.seed, createdAt: 0 });
const trace = [];
const stepSeconds = 300;
const totalSeconds = options.hours * 3600;

for (let elapsed = 0; elapsed < totalSeconds; elapsed += stepSeconds) {
  const duration = Math.min(stepSeconds, totalSeconds - elapsed);
  trace.push(...core.advance(duration, environmentAt));
}

const diagnostic = core.diagnosticSnapshot(environmentAt);
const counts = Object.fromEntries(
  ["IDLE", "OBSERVE", "WANDER", "PLAY", "SEEK_ATTENTION", "AVOID", "SLEEP"].map((action) => [
    action,
    trace.filter((event) => event.action === action).length,
  ]),
);

console.log(
  JSON.stringify(
    {
      seed: options.seed,
      simulatedHours: options.hours,
      trace,
      summary: {
        behaviorSelections: trace.length,
        behaviorSelectionCounts: counts,
        final: diagnostic,
      },
    },
    null,
    2,
  ),
);

function environmentAt(timestamp) {
  const localTime = (timestamp % 86400) / 3600;
  const userPresent = localTime >= 8 && localTime < 22;
  const hourBucket = Math.floor(timestamp / 3600);
  return createEnvironment({
    localTime,
    userPresent,
    userIdleDuration: userPresent ? 120 : 3600,
    novelty: ((hourBucket * 7) % 10) / 10,
    interactionPressure: userPresent ? 0.12 : 0.02,
  });
}

function parseArgs(args) {
  const values = { seed: 1234, hours: 24 };
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "--seed") values.seed = Number(args[++index]);
    if (args[index] === "--hours") values.hours = Number(args[++index]);
  }
  if (!Number.isFinite(values.seed) || !Number.isFinite(values.hours) || values.hours <= 0) {
    throw new Error("Usage: bpdc-sim [--seed number] [--hours positive-number]");
  }
  return values;
}
