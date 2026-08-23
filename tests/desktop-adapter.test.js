import assert from "node:assert/strict";
import test from "node:test";

import { OpenPetsAdapter } from "../integrations/openpets/openpets-adapter.js";

function createFakeContext() {
  const calls = [];
  const state = {
    position: { x: 20, y: 30 },
    bounds: { x: 20, y: 30, width: 192, height: 208 },
    currentAnimation: "idle",
    visible: true,
    dragging: false,
  };
  return {
    calls,
    state,
    pet: {
      async physics(options) { calls.push(["physics", options]); },
      async wander(options) { calls.push(["wander", options]); state.position.x += options.distance; state.currentAnimation = "run-right"; },
      async react(reaction, options) { calls.push(["react", reaction, options]); state.currentAnimation = reaction; },
      async getState() { calls.push(["getState"]); return structuredClone(state); },
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
