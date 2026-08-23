# Repository Map

## Verified at adoption

- `AGENTS.md` — always-on Authority router for Codex.
- `.authority/VERSION.json` — machine-readable Authority installation and baseline provenance.
- `.authority/ARCHITECT_STARTUP_PROMPT.md` — filled BPDC Architect prompt for ChatGPT Project Instructions.
- `.agent/` — BPDC project identity, current state, directives, outcomes, learnings, decisions, evidence, and prior-art ledger.
- `.agents/skills/authority/` — reusable Authority workflow and handoff contracts.
- `.agents/skills/external-discovery/` — proportional prior-art evaluation workflow.
- `.agent/tasks/` — conditional complex-task packet area; no active packet at adoption.

## Not yet established

- Application entry point, runtime, core modules, desktop adapter, tests, configuration, assets, and generated areas.

## Completeness

This map covers the governance bootstrap only. It is not an exhaustive application map.

## BPDC-P1-001 verified implementation map

- `src/creature-core/` — framework-independent CreatureCore, BehaviorIntent, clock, seeded RNG, models, behavior scoring/selection, and snapshot serialization.
- `src/cli/simulate.js` — accelerated machine-readable headless trace runner.
- `src/cli/experiments.js` — reproducible Phase 1 A–D experiment runner and 24-hour summary.
- `tests/creature-core.test.js` — unit, replay, personality, causality, persistence, and accelerated-trace tests.
- `package.json` — Node ESM metadata and local scripts; no third-party dependencies.
- `README.md` — drive semantics and framework boundary.

## BPDC-P2-001 verified embodiment map

- `src/desktop/desktop-adapter.js` — host-neutral translation seam.
- `integrations/openpets/openpets-adapter.js` — OpenPets-only intent translation and host state/provenance logging.
- `integrations/openpets/plugin/index.src.js` — BPDC plugin lifecycle, autonomous ticking, storage persistence, forced mapping probes, and CORE/ADAPT/HOST logs.
- `integrations/openpets/plugin/openpets.plugin.json` — OpenPets SDK v3 manifest.
- `integrations/openpets/plugin/index.js` — generated self-contained runtime entry.
- `scripts/build-openpets-plugin.mjs` — reproducible bundle builder.
- `assets/bpdc-test-pet/` — original temporary 8×9 sprite sheet and pet manifest.
- `tests/desktop-adapter.test.js` — mapping and behavior-authority boundary tests.
- `.agent/tasks/active/BPDC-P2-001.md` — current Architect handoff packet.
