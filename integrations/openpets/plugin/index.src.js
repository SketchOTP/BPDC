import { CreatureCore, BehaviorIntent, REST_SITE_AFFINITY_THRESHOLD, createEnvironment } from "./core/index.js";
import { OpenPetsAdapter } from "./openpets-adapter.js";
import { PresenceTracker } from "../presence-tracker.js";
import { RestSiteTracker } from "../rest-site-tracker.js";
import { restoreAndReconcile } from "../elapsed-reconciliation.js";
import { serializePersistenceEnvelope } from "../persistence-envelope.js";

const SNAPSHOT_KEY = "bpdc.creature.snapshot";
const LOG_PREFIX = "BPDC";
let activeRuntime = null;

function log(ctx, stage, timestamp, message, details = undefined) {
  void ctx.log.info(LOG_PREFIX, { stage, timestamp, message, ...(details ? { details } : {}) });
}

function environmentNow(presence, epochMs = Date.now()) {
  const date = new Date(epochMs);
  const presenceSnapshot = presence.snapshot();
  return createEnvironment({
    localTime: date.getHours() + date.getMinutes() / 60,
    userPresent: presenceSnapshot.userPresent,
    userIdleDuration: presenceSnapshot.userIdleDuration,
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

export function targetSleepIntent(intent, core, restSiteTracker) {
  if (intent?.action !== "SLEEP" || core.spatialSnapshot().restSiteAffinity < REST_SITE_AFFINITY_THRESHOLD) {
    return intent;
  }
  if (!restSiteTracker.resolveTarget()) return intent;
  return new BehaviorIntent({ ...intent, habitatTarget: "REST_SITE" });
}

export function register(OpenPetsPlugin) {
  OpenPetsPlugin.register({
    async start(ctx) {
      const adapter = new OpenPetsAdapter(ctx, {
        log: (stage, timestamp, intent, message, details) => log(ctx, stage, timestamp, message, {
          action: intent.action ?? null, responseKind: intent.kind ?? null,
          utility: intent.score, durationSeconds: intent.duration,
          ...(details ? { hostState: details } : {}),
        }),
      });
      const presence = new PresenceTracker();

      await ctx.pet.show();
      await ctx.pet.physics({ gravity: false, bounce: 0 });
      const startupEpochMs = Date.now();
      const saved = await ctx.storage.get(SNAPSHOT_KEY);
      const restored = restoreAndReconcile(saved, {
        nowEpochMs: startupEpochMs,
        coreFactory: CreatureCore.fromSnapshot,
      });
      const core = restored.core ?? CreatureCore.create({ seed: 0x42504443 });
      const restSiteTracker = RestSiteTracker.fromSnapshot(restored.spatialState);
      adapter.spatialTracker = restSiteTracker;
      log(ctx, "CORE", new Date().toISOString(), saved ? "snapshot restored" : "new individual created", {
        creatureId: core.creatureId,
        snapshot: Boolean(saved),
        elapsedSeconds: restored.elapsedSeconds,
        legacy: restored.legacy,
        clockSkew: restored.clockSkew,
      });
      if (restored.clockSkew) {
        log(ctx, "PERSIST", new Date().toISOString(), "clock moved backwards; skipped elapsed catch-up", {
          savedAtEpochMs: restored.savedAtEpochMs, nowEpochMs: startupEpochMs,
        });
      }

      let saveChain = Promise.resolve();
      let lastPersistAt = 0;
      const persist = (force = false) => {
        const now = Date.now();
        if (!force && now - lastPersistAt < 1_000) return saveChain;
        lastPersistAt = now;
        const envelope = serializePersistenceEnvelope(core.serialize(), now, restSiteTracker.toSnapshot());
        saveChain = saveChain.then(() => ctx.storage.set(SNAPSHOT_KEY, envelope));
        return saveChain;
      };

      const executeIntent = async (intent, source = "AUTONOMOUS") => {
        const bodyIntent = targetSleepIntent(intent, core, restSiteTracker);
        log(ctx, "CORE", new Date().toISOString(), `${source} selected ${intent.action}`, {
          creatureId: core.creatureId, utility: intent.score, durationSeconds: intent.duration,
          reason: intent.reason, scoreBreakdown: intent.scoreBreakdown,
          habitatTarget: bodyIntent.habitatTarget,
        });
        await adapter.execute(bodyIntent);
        await persist(true);
      };

      await persist(true);
      const resumeIntent = restored.resumeIntent ?? core.advance(0, environmentNow(presence, startupEpochMs))[0];
      if (resumeIntent) await executeIntent(resumeIntent, restored.resumeIntent ? "RESUME" : "AUTONOMOUS");

      const runtime = {
        adapter,
        unsubscribe: () => {},
        unsubscribeInteraction: () => {},
        unsubscribePresence: () => {},
        tickChain: Promise.resolve(),
        persist,
        unsubscribeSpatial: () => {},
      };
      runtime.unsubscribePresence = adapter.subscribePresence((signal) => {
        const snapshot = presence.apply(signal);
        log(ctx, "ENV", new Date().toISOString(), "presence updated", { presence: snapshot });
      });
      runtime.unsubscribeInteraction = adapter.subscribeInteraction((event) => {
        runtime.tickChain = runtime.tickChain.then(async () => {
          const presenceSnapshot = presence.markActive();
          log(ctx, "ENV", new Date().toISOString(), "direct interaction established presence", { presence: presenceSnapshot });
          const environment = environmentNow(presence);
          const habitBefore = core.habitSnapshot(environment);
          const recorded = core.recordInteraction(event, environment);
          const habitAfter = core.habitSnapshot(environment);
          const response = core.selectInteractionResponse();
          const restoreIntent = core.currentIntent();
          log(ctx, "CORE", new Date().toISOString(), "positive interaction recorded", {
            creatureId: core.creatureId,
            interaction: recorded,
            response: {
              kind: response.kind,
              durationSeconds: response.duration,
              diagnostics: response.diagnostics,
            },
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
          await adapter.executeInteractionResponse(response, restoreIntent);
          await persist(true);
        }).catch((error) => log(ctx, "ERROR", new Date().toISOString(), "interaction handling failed", { message: String(error?.message ?? error) }));
      });
      runtime.unsubscribeSpatial = adapter.subscribeSpatial((observation) => {
        runtime.tickChain = runtime.tickChain.then(async () => {
          if (observation.kind === "DISPLAY_CHANGED") {
            restSiteTracker.invalidate();
            const spatial = core.resetRestSitePreference();
            log(ctx, "SPATIAL", new Date().toISOString(), "display changed; REST_SITE invalidated", { spatial });
            await persist(true);
            return;
          }

          const before = core.spatialSnapshot();
          const trackerResult = restSiteTracker.observePlacement(observation.position);
          const spatial = trackerResult.kind === "REST_SITE_RELOCATED"
            ? core.resetRestSitePreference()
            : core.observeSpatial(trackerResult);
          log(ctx, "SPATIAL", new Date().toISOString(), "user placement observed", {
            source: observation.source,
            position: observation.position,
            tracker: trackerResult,
            affinityBefore: before.restSiteAffinity,
            affinityAfter: spatial.restSiteAffinity,
            site: restSiteTracker.resolveTarget(),
          });
          await persist(true);
        }).catch((error) => log(ctx, "ERROR", new Date().toISOString(), "spatial observation handling failed", { message: String(error?.message ?? error) }));
      });
      runtime.unsubscribe = ctx.pet.onTick((dtMs) => {
        runtime.tickChain = runtime.tickChain.then(async () => {
          const seconds = Math.max(0, Math.min(5, dtMs / 1_000));
          for (const intent of core.advance(seconds, environmentNow(presence))) await executeIntent(intent);
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
        log(ctx, "STATUS", new Date().toISOString(), "diagnostic snapshot", {
          diagnostic: core.diagnosticSnapshot(environmentNow(presence)),
          presence: presence.snapshot(),
          hostState,
        });
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
      runtime.unsubscribePresence();
      runtime.unsubscribeInteraction();
      runtime.unsubscribeSpatial();
      await runtime.tickChain;
      await runtime.persist(true);
      await runtime.adapter.shutdown();
    },
  });
}
