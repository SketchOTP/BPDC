# BPDC-P4-001 — Minimal Time-of-Day Habit

## Status

`ACCEPTED_IMPLEMENTATION_DEFERRED_LIVE_EVIDENCE`

## Entry state

- Canonical repository: `\\atlas\ATLAS\100_ACTIVE\Projects\BPDC`
- Branch: `main`
- Entry `HEAD`: `b40232c691adeb9c376ef9b88ae7618db9022ecb`
- Entry `origin/main`: `b40232c691adeb9c376ef9b88ae7618db9022ecb`
- Entry worktree: clean
- Phase 3: Architect accepted
- Phase 4: authorized by attached Architect review

## Implemented scope

- One 24-slot `attentionByHour` aggregate.
- Positive interaction reinforcement through host-neutral `localTime`.
- Saturating learning: `0.08 × interaction intensity × remaining capacity`.
- Seven-day half-life decay.
- One `SEEK_ATTENTION.timeHabit` utility contributor with maximum weight `0.25`.
- Snapshot schema `2 → 3` migration with zeroed habit state and preservation of accepted Phase 3 state.
- OpenPets plugin logs hour, raw habit strength before/after, utility contribution before/after, and persisted snapshot path.

## Validation

- `node --test`: `PASSED`, 17/17.
- `node src/cli/experiments.js`: `PASSED`, P4 suite.
- OpenPets manifest: `PASSED`.
- Local-staged plugin build: `PASSED`, 35,453 bytes.
- CreatureCore dependency/time scan: `PASSED`; no OpenPets/Electron/window/document/Date API references.
- `git diff --check`: `PASSED` with line-ending warnings only.

## Target evidence

- Same-hour routine vs distributed history: `0.05727286423429983` vs `0` target-hour `timeHabit`; bond difference `0`.
- Decay: `0.02 → 0.01 → 0.005` across successive seven-day intervals.
- Strong fatigue with learned habit: selected `SLEEP`.
- Schema-2 migration: identity, relationship history, and accepted state preserved; habit starts at zero.

## Live gate

`NOT RUN / UNKNOWN`: callable Computer Use `node_repl`/Sky tooling was not exposed in this session. No synthetic `pet:clicked`, direct habit mutation, or manual snapshot editing was used.

Required next evidence:

```text
physical click → pet:clicked → InteractionEvent → current-hour habit reinforcement → persist → restart → restored habit
```

## Boundary

Architect accepted the implementation. Habit-specific live click/restart evidence remains `UNKNOWN` and is deferred opportunistically; it is not a blocker to repository synchronization. No subsequent phase started.
