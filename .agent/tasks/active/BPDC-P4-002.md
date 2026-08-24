# BPDC-P4-002 — Live Time-of-Day Habit Evidence

## Status

`SUPERSEDED_AS_BLOCKING_GATE_DEFERRED_UNKNOWN`

## Directive

Close the single P4 evidence gap through one real OpenPets physical click:

```text
physical click → pet:clicked → InteractionEvent → current-hour habit reinforcement → persist → restart → restored habit → SEEK_ATTENTION.timeHabit
```

No habit-system expansion or subsequent phase is authorized.

## Verified entry state

- Canonical repository: `\\atlas\ATLAS\100_ACTIVE\Projects\BPDC`
- Local `main`: `b40232c691adeb9c376ef9b88ae7618db9022ecb`
- `origin/main`: `b40232c691adeb9c376ef9b88ae7618db9022ecb`
- Existing P4 implementation is dirty/uncommitted and preserved.

## Checks completed

- `node --test`: `PASSED`, 17/17.
- `node src/cli/experiments.js`: `PASSED`, P4 suite.
- Local-staged `node scripts/build-openpets-plugin.mjs`: `PASSED`, 34,901 bytes.
- OpenPets manifest validation: `PASSED`.
- CreatureCore host-boundary scan: `PASSED`.
- `git diff --check`: `PASSED` with line-ending warnings only.

## Live gate

`BLOCKED`: no callable Computer Use `node_repl`/Sky tool is exposed in this session. Therefore no live OpenPets launch, physical click, restart, or live habit claim was made. Synthetic events, direct learner calls, manual habit mutation, and snapshot editing were not used.

## Disposition

Architect accepted `BPDC-P4-001` and superseded this live gate as a blocking condition. When callable desktop automation is available, the specified live experiment may be run opportunistically, but no synthetic interaction or manual state mutation is permitted and its result must remain separately classified. No subsequent phase starts from this packet.
