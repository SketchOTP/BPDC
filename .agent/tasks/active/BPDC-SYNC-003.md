# BPDC-SYNC-003 — Phase 4 Durability Synchronization

## Status

`IN_PROGRESS`

## Entry decision

Architect accepted `BPDC-P4-001` and superseded `BPDC-P4-002` as a blocking gate. Habit-specific live click reinforcement remains `UNKNOWN`/deferred; the accepted deterministic implementation must now be made durable before any new behavior work.

## Scope

- classify the complete dirty tree;
- rerun regression, experiments, manifest/build, boundary, migration, safety, and diff checks;
- create one coherent Phase 4 commit;
- fetch and verify normal remote ancestry;
- push `main` without force;
- verify local `main == origin/main` and a clean worktree;
- record the final SHA in Authority and Notion.

## Validation completed

- `node --test`: 17/17 PASS.
- `node src/cli/experiments.js`: PASS.
- OpenPets manifest validation: PASS.
- Local-staged plugin build: PASS, 34,901 bytes.
- CreatureCore host/time boundary scan: PASS.
- Schema 2 → 3 migration review: PASS; accepted identity, personality, drives, relationship, interaction history, RNG, and current behavior remain carried through the snapshot path.
- Publication-safety scan: PASS for newly added lines; historical Authority references to disposable evidence paths are preserved provenance, not tracked runtime artifacts.
- `git diff --check`: PASS with line-ending warnings only.

## Deferred evidence

The habit-specific physical OpenPets click → current-hour reinforcement → persistence → restart path remains `UNKNOWN` and is not manufactured during this sync.

## Completion boundary

Do not start Phase 5 or any additional habit/environment capability. Close this task only after normal push, local/remote equality, clean worktree, Authority closure, and Notion update.
