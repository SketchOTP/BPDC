export class BehaviorIntent {
  constructor({ action, time, duration, reason, score, scoreBreakdown, interruptible }) {
    this.action = action;
    this.time = time;
    this.duration = duration;
    this.reason = reason;
    this.score = score;
    this.scoreBreakdown = scoreBreakdown;
    this.interruptible = interruptible;
  }
}
