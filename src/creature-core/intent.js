export class BehaviorIntent {
  constructor({ action, time, duration, reason, score, scoreBreakdown, interruptible, habitatTarget = null }) {
    this.action = action;
    this.time = time;
    this.duration = duration;
    this.reason = reason;
    this.score = score;
    this.scoreBreakdown = scoreBreakdown;
    this.interruptible = interruptible;
    this.habitatTarget = habitatTarget;
  }
}

export const INTERACTION_RESPONSE_KINDS = [
  "ENJOY_CONTACT",
  "ACKNOWLEDGE_CONTACT",
  "WITHDRAW_CONTACT",
];

export class InteractionResponseIntent {
  constructor({ kind, duration, diagnostics }) {
    if (!INTERACTION_RESPONSE_KINDS.includes(kind)) {
      throw new RangeError(`Unknown interaction response kind: ${kind}`);
    }
    if (!Number.isFinite(duration) || duration <= 0) {
      throw new RangeError("Interaction response duration must be positive.");
    }
    this.kind = kind;
    this.duration = duration;
    this.diagnostics = diagnostics;
  }
}

export const REUNION_RESPONSE_KINDS = [
  "ACKNOWLEDGE_RETURN",
  "GREET_RETURN",
];

export class ReunionResponseIntent {
  constructor({ kind, duration, diagnostics }) {
    if (!REUNION_RESPONSE_KINDS.includes(kind)) {
      throw new RangeError(`Unknown reunion response kind: ${kind}`);
    }
    if (!Number.isFinite(duration) || duration <= 0) {
      throw new RangeError("Reunion response duration must be positive.");
    }
    this.kind = kind;
    this.duration = duration;
    this.diagnostics = diagnostics;
  }
}
