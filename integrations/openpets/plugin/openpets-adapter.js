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

const INTERACTION_RESPONSE_KINDS = new Set([
  "ENJOY_CONTACT",
  "ACKNOWLEDGE_CONTACT",
  "WITHDRAW_CONTACT",
]);

const REACTION_BY_INTERACTION_RESPONSE = {
  ENJOY_CONTACT: "celebrating",
  ACKNOWLEDGE_CONTACT: "waving",
  WITHDRAW_CONTACT: "failed",
};

function clampDurationMs(seconds) {
  return Math.max(250, Math.min(1_500, Math.round(seconds * 1_000)));
}

/** OpenPets is the body adapter. It translates, never selects, behavior. */
export class OpenPetsAdapter {
  constructor(ctx, { log = () => {}, setTimeoutFn = globalThis.setTimeout, clearTimeoutFn = globalThis.clearTimeout } = {}) {
    this.ctx = ctx;
    this.log = log;
    this.setTimeoutFn = setTimeoutFn;
    this.clearTimeoutFn = clearTimeoutFn;
    this.interactionExpressionTimer = null;
    this.interactionExpressionGeneration = 0;
  }

  async execute(intent) {
    this.cancelInteractionResponse();
    return this.executeBehavior(intent);
  }

  async executeBehavior(intent, { generation = null } = {}) {
    if (!intent || !ACTIONS.has(intent.action)) {
      throw new TypeError(`Unsupported BehaviorIntent action: ${intent?.action}`);
    }
    if (generation !== null && generation !== this.interactionExpressionGeneration) {
      return { command: "stale interaction restoration suppressed", stale: true };
    }
    const durationMs = clampDurationMs(intent.duration ?? 1);
    const startedAt = new Date().toISOString();
    this.log("ADAPT", startedAt, intent, "pending");

    // Disable optional host physics for this pet so OpenPets cannot add a
    // second movement decision behind BPDC.
    await this.ctx.pet.physics({ gravity: false, bounce: 0 });
    if (generation !== null && generation !== this.interactionExpressionGeneration) {
      return { command: "stale interaction restoration suppressed", stale: true };
    }

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

  async executeInteractionResponse(intent, restoreIntent = null) {
    if (!intent || !INTERACTION_RESPONSE_KINDS.has(intent.kind)) {
      throw new TypeError(`Unsupported InteractionResponseIntent kind: ${intent?.kind}`);
    }
    this.cancelInteractionResponse();
    const generation = this.interactionExpressionGeneration;
    const reaction = REACTION_BY_INTERACTION_RESPONSE[intent.kind];
    await this.ctx.pet.react(reaction, { showMessage: false });
    this.log("ADAPT", new Date().toISOString(), intent, `pet.react(${reaction}) response=accepted`, {
      reaction,
      restoreAction: restoreIntent?.action ?? null,
    });

    if (restoreIntent) {
      this.interactionExpressionTimer = this.setTimeoutFn(() => {
        if (generation !== this.interactionExpressionGeneration) return;
        this.interactionExpressionTimer = null;
        void this.executeBehavior(restoreIntent, { generation });
      }, clampDurationMs(intent.duration));
    }
    return {
      command: `pet.react(${reaction})`,
      restoreScheduled: Boolean(restoreIntent),
      activeExpressions: this.interactionExpressionTimer ? 1 : 0,
    };
  }

  cancelInteractionResponse() {
    this.interactionExpressionGeneration += 1;
    if (this.interactionExpressionTimer !== null) {
      this.clearTimeoutFn(this.interactionExpressionTimer);
      this.interactionExpressionTimer = null;
    }
  }

  async getExecutionState() {
    return this.ctx.pet.getState();
  }

  subscribeInteraction(handler) {
    if (!this.ctx.events?.on) return () => {};
    return this.ctx.events.on("pet:clicked", () => handler({
      kind: "POSITIVE_CONTACT",
      valence: 1,
      intensity: 0.4,
    }));
  }

  subscribePresence(handler) {
    if (!this.ctx.events?.on) return () => {};
    const subscriptions = [
      this.ctx.events.on("idle:enter", (payload = {}) => handler({
        kind: "IDLE",
        idleSeconds: Number.isFinite(payload?.idleSeconds) ? payload.idleSeconds : 0,
      })),
      this.ctx.events.on("idle:exit", () => handler({ kind: "ACTIVE" })),
      this.ctx.events.on("screen:locked", () => handler({ kind: "LOCKED" })),
      this.ctx.events.on("screen:unlocked", () => handler({ kind: "ACTIVE" })),
    ];
    return () => subscriptions.forEach((unsubscribe) => unsubscribe?.());
  }

  async shutdown() {
    this.cancelInteractionResponse();
    await this.ctx.pet.physics({ gravity: false, bounce: 0 });
  }
}
