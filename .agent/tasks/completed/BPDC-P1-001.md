# CODEX DIRECTIVE — BPDC-P1-001

## Verdict

`COMPLETE` for Codex; Architect acceptance pending.

## Objective

Implement the smallest framework-independent headless CreatureCore demonstrating autonomous behavior caused by internal state, stable personality differences, and deterministic persistent identity.

## Implemented capability

- Four normalized pressure drives: `energy`, `social`, `curiosity`, `stimulation`.
- Six seeded, persisted personality traits: `curiosity`, `sociability`, `playfulness`, `boldness`, `independence`, `sleepiness`.
- Seven behaviors: `IDLE`, `OBSERVE`, `WANDER`, `PLAY`, `SEEK_ATTENTION`, `AVOID`, `SLEEP`.
- Inspectable utility scoring with machine-readable contributor breakdowns.
- One seeded RNG owned by the core.
- Injectable simulation clock and accelerated advancement.
- Behavior commitment durations, interruptibility metadata, and cooldown metadata.
- Versioned plain JSON CreatureSnapshots.
- Headless JSON trace CLI and reproducible A–D experiment runner.

## Architecture

```text
CreatureCore -> BehaviorIntent -> future DesktopAdapter
```

CreatureCore has zero Electron, OpenPets, WPF, Windows, cursor, window, graphics, network, or LLM imports.

## Validation

- `node --test`: `PASSED`, 6 tests passed, 0 failed.
- `node src/cli/experiments.js`: `PASSED`; replay, personality divergence, drive causality, and save/reload continuity passed.
- `node src/cli/simulate.js --seed 1234 --hours 24`: `PASSED`; JSON parsed with 606 behavior selections and final time 86400 seconds.
- Ten personality seeds produced ten distinct behavior distributions under identical 24-hour conditions.
- Persistence experiment matched uninterrupted and save/reloaded continuation traces and final snapshots.

## Evidence classification

- `VERIFIED`: implementation boundary, four-drive model, personality persistence, utility diagnostics, commitment timing, and required experiments.
- `IMPLEMENTED_UNVERIFIED`: perceived believability and long-term behavioral quality.
- `SUPPORTED_HYPOTHESIS`: the kernel is sufficient foundation for future desktop expression.
- `INFERRED`: none required for acceptance.
- `UNKNOWN`: live Windows/Electron integration.
- `FAILED`: none in the Phase 1 test/experiment set.
- `SUPERSEDED`: none.

## Files changed

- `package.json`, `README.md`
- `src/creature-core/seeded-rng.js`
- `src/creature-core/clock.js`
- `src/creature-core/models.js`
- `src/creature-core/behavior.js`
- `src/creature-core/intent.js`
- `src/creature-core/persistence.js`
- `src/creature-core/creature-core.js`
- `src/creature-core/index.js`
- `src/cli/simulate.js`
- `src/cli/experiments.js`
- `tests/creature-core.test.js`
- Authority records under `.agent/`

## Dependencies

None added. Node.js built-ins only.

## Architecture concerns

- Live desktop integration remains unvalidated and is a required gate before Phase 2.
- Drive semantics intentionally use pressure values, including fatigue pressure for `energy`; future additions must preserve clear directionality.
- Utility equations are intentionally small and inspectable; do not expand into an artificial-life or ML system without a new directive.
- npm scripts cannot be trusted from the current UNC working directory because Windows `cmd.exe` falls back to `C:\Windows`; direct Node commands were used for validation.

## Believability observations

The kernel demonstrates internal causes and individual differences mechanically. It does not yet establish perceived life, because no desktop expression, animation, user interaction, memory, or habit system exists. That remains a later acceptance question.

## Project boundary

OpenPets was not modified, vendored, imported, or required. Phase 2 desktop integration was not started.
