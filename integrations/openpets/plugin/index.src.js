import { CreatureCore, BehaviorIntent, createEnvironment } from "./core/index.js";
import { OpenPetsAdapter } from "./openpets-adapter.js";

const SNAPSHOT_KEY = "bpdc.creature.snapshot";
const LOG_PREFIX = "BPDC";
let activeRuntime = null;

function log(ctx, stage, timestamp, message, details = undefined) {
  void ctx.log.info(LOG_PREFIX, { stage, timestamp, message, ...(details ? { details } : {}) });
}

function environmentNow() {
  const date = new Date();
  return createEnvironment({
    localTime: date.getHours() + date.getMinutes() / 60,
    userPresent: false,
    userIdleDuration: 0,
    novelty: 0.1,
    interactionPressure: 0,
  });
}

function forcedIntent(action) {
  return new BehaviorIntent({
    action, time: 0, duration: 2, reason: "forced mapping validation", score: null,
    scoreBreakdown: { source: "FORCED_MAPPING_VALIDATION" }, interruptible: true,
  });
}

export function register(OpenPetsPlugin) {
  OpenPetsPlugin.register({
    async start(ctx) {
      const adapter = new OpenPetsAdapter(ctx, {
        log: (stage, timestamp, intent, message, details) => log(ctx, stage, timestamp, message, {
          action: intent.action, utility: intent.score, durationSeconds: intent.duration,
          ...(details ? { hostState: details } : {}),
        }),
      });

      await ctx.pet.show();
      await ctx.pet.physics({ gravity: false, bounce: 0 });
      const saved = await ctx.storage.get(SNAPSHOT_KEY);
      const core = saved ? CreatureCore.fromSnapshot(saved) : CreatureCore.create({ seed: 0x42504443 });
      log(ctx, "CORE", new Date().toISOString(), saved ? "snapshot restored" : "new individual created", {
        creatureId: core.creatureId, snapshot: Boolean(saved),
      });

      let saveChain = Promise.resolve();
      let lastPersistAt = 0;
      const persist = (force = false) => {
        const now = Date.now();
        if (!force && now - lastPersistAt < 1_000) return saveChain;
        lastPersistAt = now;
        const snapshot = core.serialize();
        saveChain = saveChain.then(() => ctx.storage.set(SNAPSHOT_KEY, snapshot));
        return saveChain;
      };

      const executeIntent = async (intent, source = "AUTONOMOUS") => {
        log(ctx, "CORE", new Date().toISOString(), `${source} selected ${intent.action}`, {
          creatureId: core.creatureId, utility: intent.score, durationSeconds: intent.duration,
          reason: intent.reason, scoreBreakdown: intent.scoreBreakdown,
        });
        await adapter.execute(intent);
        await persist(true);
      };

      await persist(true);
      for (const intent of core.advance(0, environmentNow())) await executeIntent(intent);

      const runtime = {
        adapter,
        unsubscribe: () => {},
        unsubscribeInteraction: () => {},
        tickChain: Promise.resolve(),
        persist,
      };
      runtime.unsubscribeInteraction = adapter.subscribeInteraction((event) => {
        runtime.tickChain = runtime.tickChain.then(async () => {
          const environment = environmentNow();
          const habitBefore = core.habitSnapshot(environment);
          const recorded = core.recordInteraction(event, environment);
          const habitAfter = core.habitSnapshot(environment);
          log(ctx, "CORE", new Date().toISOString(), "positive interaction recorded", {
            creatureId: core.creatureId,
            interaction: recorded,
            relationship: core.relationshipSnapshot(),
            habit: {
              hour: habitAfter.currentHour,
              before: habitBefore.habitStrength,
              after: habitAfter.habitStrength,
              timeHabitBefore: habitBefore.timeHabit,
              timeHabitAfter: habitAfter.timeHabit,
              attentionByHour: habitAfter.attentionByHour,
            },
          });
          await persist(true);
        }).catch((error) => log(ctx, "ERROR", new Date().toISOString(), "interaction handling failed", { message: String(error?.message ?? error) }));
      });
      runtime.unsubscribe = ctx.pet.onTick((dtMs) => {
        runtime.tickChain = runtime.tickChain.then(async () => {
          const seconds = Math.max(0, Math.min(5, dtMs / 1_000));
          for (const intent of core.advance(seconds, environmentNow())) await executeIntent(intent);
          await persist(false);
        }).catch((error) => log(ctx, "ERROR", new Date().toISOString(), "autonomous tick failed", { message: String(error?.message ?? error) }));
      });

      const registerForced = (id, action, title) => ctx.commands.register({ id, title, placement: "top" }, async () => {
        log(ctx, "FORCED", new Date().toISOString(), `${action} mapping validation requested`, { source: "FORCED_MAPPING_VALIDATION" });
        await adapter.execute(forcedIntent(action));
      });
      await registerForced("bpdc-probe-wander", "WANDER", "BPDC probe: wander");
      await registerForced("bpdc-probe-sleep", "SLEEP", "BPDC probe: sleep");
      await registerForced("bpdc-probe-attention", "SEEK_ATTENTION", "BPDC probe: attention");
      await ctx.commands.register({ id: "bpdc-status", title: "BPDC status", placement: "top" }, async () => {
        const hostState = await adapter.getExecutionState();
        log(ctx, "STATUS", new Date().toISOString(), "diagnostic snapshot", { diagnostic: core.diagnosticSnapshot(environmentNow()), hostState });
      });

      activeRuntime = runtime;
      log(ctx, "HOST", new Date().toISOString(), "OpenPets host authority configured", {
        nativeGravity: false, hostBehaviorSelection: "none observed; host tick only",
      });
    },
    async stop() {
      const runtime = activeRuntime;
      activeRuntime = null;
      if (!runtime) return;
      runtime.unsubscribe();
      runtime.unsubscribeInteraction();
      await runtime.tickChain;
      await runtime.persist(true);
      await runtime.adapter.shutdown();
    },
  });
}
