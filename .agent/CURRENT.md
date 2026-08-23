# Current State

## Lifecycle

- Status: `ACTIVE`
- Last updated: 2026-08-23 America/New_York

## Active state

- Local directive ID: `NONE`
- External directive ID: `BPDC-P2-001`
- Objective: Prove that the accepted CreatureCore can control a real visible OpenPets desktop creature on Windows through a thin adapter while remaining independent of OpenPets.
- Current status: `HANDOFF_PENDING_ARCHITECT`
- Acceptance: `BPDC-P2-001` implementation and runtime evidence are complete with concerns recorded. The Architect must decide whether the live host evidence is sufficient for Phase 3 authorization.
- Current phase: `Phase 2 — Desktop Embodiment Gate`
- Expected touched areas: `src/desktop/`, `integrations/openpets/`, `assets/`, `tests/`, package metadata, README, and `.agent/` records. CreatureCore remains host-independent.
- Immediate next action: Architect review of the BPDC-P2-001 evidence and the explicit Phase 3 boundary.

## Temporary task-relevant facts

- Local workspace was empty and was not a Git checkout at inspection time.
- GitHub repository exists at `SketchOTP/BPDC`, default branch `main`, and has no committed source files.
- Notion defines Phase 0 as evaluation of OpenPets first, VPet second, and a minimal shell only if required, with PetzA as behavioral research.

## Last validation

- Command or check: Phase 0 evidence package, OpenPets proof, SDK/official tests, targeted motion/display tests, and full desktop suite
- Result: `PASSED_WITH_CONCERN`; focused checks passed, full desktop suite failed at unrelated local-plugin pruning test.

## Risks and blockers

- BPDC Phase 1 uses framework-independent ECMAScript modules and Node's built-in test runner; no third-party runtime dependency was added.
- jCodemunch-MCP is unavailable in this session; code indexing is therefore not yet verified.
- Full OpenPets desktop suite has a reproducible failure in `plugin-service.test.js` under this Windows/Node 24 environment; it remains tracked and is outside BPDC Phase 1.
- Live Windows/Electron integration: `E5_OPERATIONALLY_OBSERVED` in a disposable Electron profile; the original placeholder was installed, rendered, shown, and the BPDC plugin started against it.

## Pending decisions

- Architect acceptance of the Phase 2 evidence. Three forced mappings were verified through the OpenPets test harness and adapter tests; autonomous live observation exercised SLEEP. A normal desktop screenshot could not capture the transparent always-on-top pet window, so the rendered HTML, sprite asset, host log, and visibility/state records are the visual evidence.
