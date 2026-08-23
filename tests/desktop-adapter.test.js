import assert from "node:assert/strict";
import test from "node:test";

import { OpenPetsAdapter } from "../integrations/openpets/openpets-adapter.js";

function createFakeContext() {
  const calls = [];
  const interactionHandlers = new Map();
  const state = {
    position: { x: 20, y: 30 },
    bounds: { x: 20, y: 30, width: 192, height: 208 },
    currentAnimation: "idle",
    visible: true,
    dragging: false,
  };
  return {
    calls,
    interactionHandlers,
    state,
    pet: {
      async physics(options) { calls.push(["physics", options]); },
      async wander(options) { calls.push(["wander", options]); state.position.x += options.distance; state.currentAnimation = "run-right"; },
      async react(reaction, options) { calls.push(["react", reaction, options]); state.currentAnimation = reaction; },
      async getState() { calls.push(["getState"]); return structuredClone(state); },
    },
    events: {
      on(name, handler) { interactionHandlers.set(name, handler); return () => interactionHandlers.delete(name); },
    },
  };
}

test("OpenPetsAdapter maps three intents without selecting behavior", async () => {
  const ctx = createFakeContext();
  const log = [];
  const adapter = new OpenPetsAdapter(ctx, { log: (...entry) => log.push(entry) });

  await adapter.execute({ action: "WANDER", duration: 2 });
  await adapter.execute({ action: "SLEEP", duration: 600 });
  await adapter.execute({ action: "SEEK_ATTENTION", duration: 45 });

  assert.deepEqual(ctx.calls.filter(([name]) => name === "wander").map(([, options]) => options.distance), [110]);
  assert.deepEqual(ctx.calls.filter(([name]) => name === "react").map(([, reaction]) => reaction), ["waiting", "waving"]);
  assert.equal(ctx.calls.filter(([name]) => name === "physics").length, 3);
  assert.equal(log.filter(([stage]) => stage === "HOST").length, 3);
  assert.equal(ctx.state.currentAnimation, "waving");
});

test("OpenPetsAdapter rejects behavior decisions outside the CreatureCore action set", async () => {
  const adapter = new OpenPetsAdapter(createFakeContext());
  await assert.rejects(() => adapter.execute({ action: "FEED", duration: 1 }), /Unsupported BehaviorIntent action/);
});

test("OpenPetsAdapter normalizes a real host click into a positive interaction", () => {
  const ctx = createFakeContext();
  const adapter = new OpenPetsAdapter(ctx);
  const received = [];
  const unsubscribe = adapter.subscribeInteraction((event) => received.push(event));

  ctx.interactionHandlers.get("pet:clicked")({ petId: "default" });
  unsubscribe();

  assert.deepEqual(received, [{ kind: "POSITIVE_CONTACT", valence: 1, intensity: 0.4 }]);
  assert.equal(ctx.interactionHandlers.size, 0);
});
