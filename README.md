# BPDC headless CreatureCore

This repository currently contains the first framework-independent behavioral kernel for the Believably Persistent Desktop Creature. It intentionally has no Electron, OpenPets, WPF, Windows, cursor, window, animation, graphics, network, or LLM dependency.

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
```

The simulator emits JSON containing behavior selections, durations, machine-readable score breakdowns, final drives, personality, and persistence state.

## Boundary

```text
CreatureCore -> BehaviorIntent -> future DesktopAdapter
```

`CreatureCore` owns deterministic state and decisions. A later adapter may translate `BehaviorIntent` values into OpenPets actions, but desktop integration is not part of this phase.
