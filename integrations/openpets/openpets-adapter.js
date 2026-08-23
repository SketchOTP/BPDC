const ACTIONS = new Set([
  "IDLE", "OBSERVE", "WANDER", "PLAY", "SEEK_ATTENTION", "AVOID", "SLEEP",
]);

const REACTION_BY_ACTION = {
  IDLE: "idle",
  OBSERVE: "thinking",
  PLAY: "celebrating",
  SEEK_ATTENTION: "waving",
  AVOID: "failed",
  SLEEP: "waiting",
};

function clampDurationMs(seconds) {
  return Math.max(250, Math.min(1_500, Math.round(seconds * 1_000)));
}

/** OpenPets is the body adapter. It translates, never selects, behavior. */
export class OpenPetsAdapter {
  constructor(ctx, { log = () => {} } = {}) {
    this.ctx = ctx;
    this.log = log;
  }

  async execute(intent) {
    if (!intent || !ACTIONS.has(intent.action)) {
      throw new TypeError(`Unsupported BehaviorIntent action: ${intent?.action}`);
    }
    const durationMs = clampDurationMs(intent.duration ?? 1);
    const startedAt = new Date().toISOString();
    this.log("ADAPT", startedAt, intent, "pending");

    // Disable optional host physics for this pet so OpenPets cannot add a
    // second movement decision behind BPDC.
    await this.ctx.pet.physics({ gravity: false, bounce: 0 });

    let command;
    if (intent.action === "WANDER") {
      await this.ctx.pet.wander({ distance: 110, durationMs });
      command = "pet.wander(distance=110)";
    } else {
      const reaction = REACTION_BY_ACTION[intent.action] ?? "idle";
      await this.ctx.pet.react(reaction, { showMessage: false });
      command = `pet.react(${reaction})`;
    }

    const hostState = await this.getExecutionState();
    this.log("HOST", new Date().toISOString(), intent, `${command} result=accepted`, hostState);
    return { command, hostState };
  }

  async getExecutionState() {
    return this.ctx.pet.getState();
  }

  async shutdown() {
    await this.ctx.pet.physics({ gravity: false, bounce: 0 });
  }
}
