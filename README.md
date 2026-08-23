# BPDC CreatureCore and OpenPets embodiment

This repository contains the framework-independent behavioral kernel for the Believably Persistent Desktop Creature plus a thin OpenPets embodiment plugin. CreatureCore remains free of Electron, OpenPets, WPF, Windows, cursor, window, network, and LLM dependencies.

## Drive semantics

All four normalized drives are pressure values in the range `0..1`:

- `energy`: fatigue pressure; `0` is energetic and `1` is exhausted.
- `social`: desire for social contact; `0` is satisfied and `1` is urgent.
- `curiosity`: desire to inspect novelty; `0` is satisfied and `1` is urgent.
- `stimulation`: desire for activity; `0` is satisfied and `1` is urgent.

This keeps the scoring direction consistent: larger values represent stronger internal pressure.

## Commands

```text
npm test
npm run simulate -- --seed 1234 --hours 24
npm run build:openpets
```

The simulator emits JSON containing behavior selections, durations, machine-readable score breakdowns, final drives, personality, and persistence state.

## Desktop embodiment

The adapter translates decisions; it does not select behavior:

```text
CreatureCore -> BehaviorIntent -> DesktopAdapter -> OpenPets SDK -> visible pet
```

`integrations/openpets/plugin/index.src.js` owns the plugin lifecycle, BPDC snapshot persistence, and provenance logs. `integrations/openpets/openpets-adapter.js` maps intents to OpenPets movement/reaction calls. The original temporary body is in `assets/bpdc-test-pet/`.

Build the single-file plugin bundle with `node scripts/build-openpets-plugin.mjs`. The generated `integrations/openpets/plugin/index.js` is the runtime entry accepted by OpenPets; the build mirrors the core and adapter into the plugin directory so the source artifact is inspectable while the entry remains self-contained.

For this UNC workspace, run the bundle build from a local staging directory and copy the generated entry back. Native `esbuild` child-process startup is environment-sensitive on the UNC path; this is a workspace limitation, not an OpenPets dependency.

The plugin stores its versioned CreatureCore snapshot under `bpdc.creature.snapshot` in OpenPets plugin storage and logs `CORE`, `ADAPT`, `HOST`, and `STATUS` records. OpenPets host gravity is explicitly disabled. The pinned host's tick is used as timing only; no host behavior selector was found or used.

## Boundary

```text
CreatureCore -> BehaviorIntent -> future DesktopAdapter
```

`CreatureCore` owns deterministic state and decisions. A later adapter may translate `BehaviorIntent` values into OpenPets actions, but desktop integration is not part of this phase.
