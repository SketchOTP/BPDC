# Project Outcome Ledger

## AUTHORITY-BOOTSTRAP-BPDC-001 - COMPLETE

- Outcome ID: `BPDC-AUTHORITY-BOOTSTRAP-001`
- Supersedes outcome: `NONE`
- Closed: 2026-08-22 America/New_York
- Acceptance: `MET`
- Summary: Authority 3.0 project-state and reusable Codex workflow were installed for the empty BPDC repository. Phase 0 foundation evaluation remains unperformed.
- Changed areas: `AGENTS.md`, `.authority/`, `.agent/`, `.agents/`
- Validation:
  - Notion project page fetched - `PASSED`
  - Notion Authority 3.0 page fetched - `PASSED`
  - GitHub repository metadata inspected - `PASSED`
  - Local repository state inspected - `PASSED`
  - Required-file, JSON, state-placeholder, and secret-pattern validation - `PASSED`
  - Phase 0 foundation evaluation - `NOT RUN`
- Evidence level: `E1_OBSERVED`
- Remaining risks: implementation foundation and runtime are undecided; no project-specific test command exists.
- Blockers: none for governance installation; Phase 0 is the next required project decision.
- Follow-up directive: `NONE`

## BPDC-P0-001 - CODEX HANDOFF COMPLETE

- Outcome ID: `BPDC-P0-001-FOUNDATION-EVALUATION`
- Supersedes outcome: `NONE`
- Closed for Codex: 2026-08-22 America/New_York
- Acceptance: `MET_WITH_CONCERN`
- Summary: OpenPets is recommended as the smallest legally clean body/renderer foundation through a BPDC plugin adapter. No OpenPets core fork is required by the disposable proof. VPet is retained as the Windows-specific fallback. Petz/PetzA is reference-only.
- Upstream commits: OpenPets `a77d3747caab0337934959980c68f60e0d3c615c`; VPet `b6f7b00363529bafe3e7fc14bf51e17640941691`; VPet.Plugin.Demo `4a53d8b822f499b4399ae6983eccc9813aa8fa45`; PetzA `6c36688bcd1839e4f2a5fd4d91bcd187297c1abc`; petz-file-formats `cd1634b9e908078fb831ae833975d1219da30e36`.
- Validation: OpenPets SDK contract `PASSED`; official virtual-pet harness `PASSED`; disposable BPDC proof `PASSED`; targeted motion/display tests `PASSED`; full desktop suite `FAILED` at `plugin-service.test.js` local-plugin pruning scenario.
- Evidence levels: upstream/static `E1_OBSERVED`; disposable proof and focused tests `E3_TARGET_TESTED`; operational Windows/Electron runtime `NOT RUN`.
- Files: `.agent/CURRENT.md`, `.agent/DIRECTIVES.md`, `.agent/OUTCOMES.md`, `.agent/LEARNINGS.md`, `.agent/RECORD.md`, `.agent/EXTERNAL.md`, `.agent/EVIDENCE.md`, `.agent/tasks/completed/BPDC-P0-001.md`.
- Phase 1: `NOT READY`; Architect must accept the foundation and issue the next directive.

## BPDC-P1-001 - CODEX HANDOFF COMPLETE

- Outcome ID: `BPDC-P1-001-CREATURE-CORE`
- Supersedes outcome: `NONE`
- Closed for Codex: 2026-08-22 America/New_York
- Acceptance: `MET`
- Summary: Headless CreatureCore implemented without desktop-framework dependencies. Four pressure drives, six stable personality traits, seven utility-scored behaviors, seeded randomness, injectable time, commitment timing, inspectable diagnostics, versioned JSON persistence, and accelerated experiments are present.
- Validation: `node --test` passed 6/6; `node src/cli/experiments.js` passed replay/personality/causality/persistence; `node src/cli/simulate.js --seed 1234 --hours 24` parsed as JSON with 606 selections.
- Evidence levels: implementation `E1_OBSERVED`; tests and experiments `E3_TARGET_TESTED`; live desktop integration `UNKNOWN` and not run.
- Files: `package.json`, `README.md`, `src/creature-core/`, `src/cli/`, `tests/creature-core.test.js`, and relevant `.agent/` records.
- Phase 2: `NOT AUTHORIZED`; Architect review is required before any desktop integration.

## BPDC-P0-001 - ARCHITECT ACCEPTED

- Outcome ID: `BPDC-P0-001-ARCHITECT-ACCEPTED`
- Date: 2026-08-22 America/New_York
- Acceptance: `MET`
- Decision: OpenPets adapter/plugin is the primary foundation; VPet is fallback-only; Petz/PetzA are behavioral references only; the pruning concern does not block Phase 1.
- Authorization: `BPDC-P1-001` headless CreatureCore implementation granted.
- Remaining gate: live Windows/Electron validation is `UNKNOWN` and required before desktop integration.

## BPDC-P1-001 - ARCHITECT ACCEPTED

- Outcome ID: `BPDC-P1-001-ARCHITECT-ACCEPTED`
- Date: 2026-08-22
- Acceptance: `MET`
- Decision: Phase 1 headless CreatureCore is accepted as the first real BPDC capability. Its internal pressures, personality, competing motivations, autonomous selection, persistence, replay, and commitment timing are verified.
- Remaining unknowns: perceived believability and live Windows/OpenPets integration.
- Authorization: `BPDC-P2-001` desktop embodiment gate granted.

## BPDC-P2-001 - CODEX HANDOFF COMPLETE

- Outcome ID: `BPDC-P2-001-EMBODIMENT`
- Closed for Codex handoff: 2026-08-23 America/New_York
- Acceptance: `PASS_WITH_CONCERNS`; Architect acceptance pending.
- Summary: accepted CreatureCore now reaches a real OpenPets desktop body through a thin host-neutral adapter and self-contained plugin. The original placeholder was installed and rendered in Windows Electron, autonomous SLEEP reached the host, host gravity was disabled, provenance was logged, and the stable creature snapshot restored across reload/restart.
- Validation: `node --test` 8/8; bundle build and OpenPets manifest validator passed; official harness exercised WANDER/SLEEP/SEEK_ATTENTION without errors; live Electron host and placeholder installation passed; restart restoration passed.
- Concerns: normal desktop screenshot cannot capture the transparent always-on-top window; live autonomous observation directly exercised SLEEP, while the three forced mappings are harness/adapter evidence. OpenPets broad-suite pruning concern remains isolated from BPDC.
- Exclusions preserved: no CreatureCore host imports, no OpenPets fork, no third-party assets, no Phase 3 features.
- Follow-up directive: Architect decide whether to accept Phase 2 and issue the next bounded directive.

### BPDC-P2-002 - CODEX RESULT

- Outcome ID: `BPDC-P2-002-EMBODIMENT-CLOSURE`
- Closed for Codex handoff: 2026-08-23 America/New_York
- Acceptance: `COMPLETE`; Architect acceptance pending.
- Summary: the remaining live evidence gap is closed. Real Windows/Electron OpenPets accepted WANDER, SLEEP, and SEEK_ATTENTION through the production adapter, with direct desktop captures showing distinct treatments. A single autonomous session selected SEEK_ATTENTION and then WANDER from the same CreatureCore instance; both selections reached the host with `CORE`, `ADAPT`, and `HOST` provenance.
- Validation: live native-host probes passed; autonomous multi-intent session passed; host authority log passed; existing BPDC tests, bundle build, manifest validation, and persistence checks remain passed.
- Evidence: `BPDC-E017` through `BPDC-E021`, plus `BPDC-E013` through `BPDC-E016`.
- Exclusions preserved: no production source changes, no OpenPets fork, no Phase 3 work, no deployment, no GitHub push.
- Recommendation: accept the Phase 2 embodiment evidence and issue a separate bounded directive before any Phase 3 implementation begins.

## BPDC-P2-002 - ARCHITECT ACCEPTED

- Outcome ID: `BPDC-P2-002-ARCHITECT-ACCEPTED`
- Accepted: 2026-08-23 America/New_York
- Acceptance: `MET`
- Decision: Phase 2 is closed. Live WANDER, SLEEP, and SEEK_ATTENTION, distinct treatments, autonomous multi-intent selection, CreatureCore → adapter → host provenance, and OpenPets non-override are accepted at `E5_OPERATIONALLY_OBSERVED`.
- Evidence: `BPDC-E017` through `BPDC-E021`; regression `node --test` 8/8; local commit `393c619`.
- Authorization: `BPDC-P3-001` minimal relationship memory granted.

## BPDC-P3-001 - AUTHORIZED

- Outcome ID: `BPDC-P3-001-AUTHORIZED`
- Issued: 2026-08-23 America/New_York
- Acceptance: `PENDING_CODEX_HANDOFF`
- Summary: The Architect authorized a bounded relationship-memory slice: one persistent bond scalar, bounded interaction history, host-neutral events, deterministic decay and saturation, existing utility-score influence, and live OpenPets interaction/restart evidence.
- Exclusions: generic memory, habits, environment learning, mood, hunger, evolution, new behaviors, final art, OpenPets fork, and Phase 4.
- Follow-up directive: `BPDC-P3-001`
