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

## BPDC-P3-003 - CODEX HANDOFF COMPLETE

- Outcome ID: `BPDC-P3-003-RELATIONSHIP-LIVE-GATE`
- Closed for Codex handoff: 2026-08-23 America/New_York
- Acceptance: `COMPLETE_FOR_ARCHITECT_REVIEW`
- Summary: Recovered the responsive authoritative worktree, preserved the existing Phase 3 implementation, and operationally observed a real OpenPets click entering the adapter/Core path, mutating relationship state, persisting to the normal snapshot, surviving host shutdown/restart, and contributing measurably to post-restart utility.
- Live evidence: baseline `creature-42504443`, schema `2`, bond `0.5`, empty history; `pet:clicked` at `2026-08-23T23:10:21.209Z`; one `POSITIVE_CONTACT` event with valence `1` and intensity `0.4`; bond increased to `0.5099997657179275` before modeled elapsed-time decay; restart restored the same creature ID and event; post-restart `SEEK_ATTENTION` score exceeded neutral by `0.08770903988079931`.
- Validation: `node --test` 13/13; relationship experiments passed; local-staged plugin build passed at 30,052 bytes; OpenPets manifest validation passed; CreatureCore host-boundary scan passed; `git diff --check` passed with line-ending warnings only.
- Evidence level: `E5_OPERATIONALLY_OBSERVED` for the live click/persistence/restart chain; deterministic implementation evidence remains `E3_TARGET_TESTED`.
- Exclusions preserved: no relationship redesign, no Phase 4 work, no OpenPets core changes, and no GitHub push.
- Follow-up directive: Architect acceptance decision for Phase 3.

## BPDC-P3-003 - ARCHITECT ACCEPTED

- Outcome ID: `BPDC-P3-003-ARCHITECT-ACCEPTED`
- Accepted: 2026-08-23 America/New_York
- Acceptance: `MET`
- Decision: Phase 3 is closed at `E5_OPERATIONALLY_OBSERVED` for the live click → relationship mutation → persistence → restart → utility chain.
- Authorization: `BPDC-SYNC-001` repository durability checkpoint granted.
- Boundary: Phase 4 remains unauthorized until the accepted local state is safely synchronized.

## BPDC-SYNC-001 - BLOCKED

- Outcome ID: `BPDC-SYNC-001-REMOTE-ANCESTRY-BLOCKED`
- Closed for Codex handoff: 2026-08-23 America/New_York
- Acceptance: `BLOCKED_PENDING_ARCHITECT_REVIEW`
- Summary: Local worktree was clean at accepted tip `1ef39377dbae0aa243e74383413cb86fabc3fb7d`; fetched remote `origin/main` at `c1eaf44196fb2c58e92e61fa1059e2e283304cf1`.
- Ancestry: `git merge-base --is-ancestor origin/main HEAD` failed because the remote bootstrap root and local accepted history have no merge base. The local chain begins at `dc489465...`; the remote is a separate root `c1eaf441...`.
- Validation: `node --test` PASSED 13/13; `git diff --check` PASSED; tracked-file safety scan found no obvious secret/key/env filename or token pattern.
- Push: NOT RUN. No merge, rebase, reset, force push, or application change was performed.
- Required decision: Architect must choose the safe reconciliation strategy before synchronization continues.

## BPDC-SYNC-002 - PASSED

- Outcome ID: `BPDC-SYNC-002-RECONCILIATION-PUBLISHED`
- Closed: 2026-08-23 America/New_York
- Acceptance: `MET`
- Summary: Authority-only changes were checkpointed at `5780122059755516b99da56366d33e6c5d5f2432`; safety ref `safety/pre-github-root-reconcile` and isolated branch `sync/github-root-reconcile` were created.
- Reconciliation: remote bootstrap `c1eaf44196fb2c58e92e61fa1059e2e283304cf1` was joined to accepted local history with one explicit `--allow-unrelated-histories` merge. The only conflict was `.gitignore`; remote MIT `LICENSE` added cleanly. Reconciliation commit `34aef6f965a10624b5db0eb06691cab60af89b1c` has parents `5780122059755516b99da56366d33e6c5d5f2432` and `c1eaf44196fb2c58e92e61fa1059e2e283304cf1`.
- Application invariant: staged delta under `src/`, `tests/`, and `integrations/` was empty; no product code or Phase 4 capability changed.
- Validation: `node --test` PASSED 13/13; relationship experiments PASSED; OpenPets manifest validation PASSED; local-staged plugin build PASSED at 30,052 bytes; staged diff check PASSED; safety scan PASSED; both ancestry checks PASSED.
- Publication: immediate refetch showed no remote movement; normal non-force push succeeded. GitHub and local `main` both resolve to `34aef6f965a10624b5db0eb06691cab60af89b1c`.
- Supersession: `BPDC-SYNC-001` blocker is superseded by this completed reconciliation.
- Boundary: Phase 4 remains unauthorized.

## BPDC-P4-001 - PARTIAL IMPLEMENTATION HANDOFF

- Outcome ID: `BPDC-P4-001-TIME-HABIT-IMPLEMENTATION`
- Opened: 2026-08-23 America/New_York
- Acceptance: `PARTIAL_PENDING_LIVE_EVIDENCE`
- Summary: Implemented one 24-slot persistent `attentionByHour` habit. Positive interactions reinforce the current host-neutral local hour with saturating learning; habit values decay with a seven-day half-life; `SEEK_ATTENTION` exposes `timeHabit`; schema 2 migrates with a zeroed habit while preserving accepted Phase 3 state.
- Parameters: learning rate `0.08 × interaction intensity × remaining capacity`; utility weight `0.25`; decay `2^(-elapsed / 604800)`.
- Validation: `node --test` PASSED 17/17; P4 experiment suite PASSED; OpenPets manifest validation PASSED; local-staged plugin build PASSED at 35,453 bytes; CreatureCore dependency/time scan PASSED; `git diff --check` PASSED.
- Target evidence: same-hour concentration produced `timeHabit 0.05727286423429983` versus distributed `0`; bond difference `0`; decay `0.02 → 0.01 → 0.005`; strong fatigue selected `SLEEP`; schema-2 migration and deterministic reload passed.
- Live evidence: `NOT RUN`. Callable Computer Use `node_repl`/Sky tooling was unavailable; no synthetic click or manual state mutation was used.
- Files: `src/creature-core/habit.js`, core scoring/persistence/interaction integration, OpenPets plugin provenance logging, generated plugin core/bundle, experiments, and tests.
- Boundary: no subsequent phase started; implementation remains uncommitted pending the live evidence gate.

## BPDC-P4-002 - BLOCKED LIVE EVIDENCE

- Outcome ID: `BPDC-P4-002-TIME-HABIT-LIVE-GATE`
- Closed for Codex handoff: 2026-08-23 America/New_York
- Acceptance: `BLOCKED_ENVIRONMENT`
- Summary: Re-read the P4-002 Architect continuation, confirmed canonical Atlas state and the expected dirty P4 implementation, reran deterministic validation, rebuilt the staged plugin, validated the manifest, scanned the CreatureCore boundary, and passed diff checking. The required live physical-click → current-hour habit → persistence → restart evidence could not be run because no callable Computer Use `node_repl`/Sky tool is exposed in this session.
- Validation: `node --test` PASSED 17/17; P4 experiment suite PASSED; OpenPets manifest validation PASSED; local-staged plugin build PASSED at 34,901 bytes; CreatureCore boundary scan PASSED; `git diff --check` PASSED.
- Live evidence: `BLOCKED`; no host launch/click/restart claim, synthetic event, direct learner call, manual habit mutation, or snapshot edit was used.
- Repository state: local `main` and `origin/main` both remain `b40232c691adeb9c376ef9b88ae7618db9022ecb`; Phase 4 implementation and records remain uncommitted; no push performed.
- Recommendation: `CONTINUE` P4-002 when callable desktop automation is available; do not begin Phase 5 or any broader habit work.

## BPDC-SYNC-003 - PASSED

- Outcome ID: `BPDC-SYNC-003-PHASE4-PUBLISHED`
- Closed: 2026-08-23 America/New_York
- Acceptance: `MET`
- Summary: The Architect-accepted Phase 4 habit implementation and corresponding Authority records were committed and published to canonical GitHub `main` without application redesign or history rewrite.
- Dirty-tree review: all 26 staged files were accepted P4 source/plugin/tests or matching Authority/task records. No unrelated application change was found.
- Validation: `node --test` PASSED 17/17; P4 experiment suite PASSED; OpenPets manifest validation PASSED; local-staged plugin build PASSED at 34,901 bytes; CreatureCore boundary scan PASSED; schema 2 → 3 migration review PASSED; newly added-line publication-safety scan PASSED; `git diff --check` PASSED. Canonical UNC esbuild remains a known `spawn EPERM`; the prescribed staging workaround passed.
- Migration: schema 2 snapshots retain identity, personality, drives, relationship, bounded interaction history, RNG state, and current behavior while receiving zeroed habit state; schema 3 persists the accepted habit.
- Product commit: `cb5d6ad1b61a3833582781a9f169ea53954b7d67` (`feat: add time-of-day attention habit`).
- Publication: normal `git push origin main` succeeded from remote `b40232c` to product commit `cb5d6ad`.
- Deferred evidence: habit-specific physical click → current-hour reinforcement → restart remains `UNKNOWN`/deferred. The Phase 3 underlying click/persistence seam remains accepted at E5; no synthetic live evidence was manufactured.
- Boundary: no Phase 5 or additional habit/environment capability started.

## BPDC-P5-001 - PRESENCE IMPLEMENTATION HANDOFF

- Outcome ID: `BPDC-P5-001-PRESENCE-AWARENESS`
- Closed for Codex handoff: 2026-08-24 America/New_York
- Acceptance: `COMPLETE_FOR_ARCHITECT_REVIEW`
- Summary: Added a bounded integration-side `PresenceTracker` and OpenPets adapter subscriptions for `idle:enter`, `idle:exit`, `screen:locked`, and `screen:unlocked`. The live plugin now supplies the existing host-neutral environment fields instead of hard-coded absence; direct pet interaction marks active presence.
- Startup semantics: internal `UNKNOWN`, conservatively mapped to `userPresent=false` and `userIdleDuration=0` until a curated signal is observed. This state is not added to CreatureCore and presence is not persisted.
- Validation: `node --test` 22/22; combined P4/presence experiment suite PASS; adapter harness PASS; manifest PASS; local-staged bundle PASS at 38,483 bytes; core boundary/privacy scans PASS; `git diff --check` PASS. Canonical UNC esbuild remains a known `spawn EPERM`; staging workaround passed.
- Evidence: `BPDC-E026`, target-tested/regression-protected only. No live desktop claim was made because live observation is not required by the directive.
- Boundary: no new behavior, drive, memory, habit, persistence schema, or privacy-sensitive sensing; no subsequent phase started.
- Follow-up directive: Architect review of `BPDC-P5-001`.

## BPDC-P5-001 - PUBLISHED

- Outcome ID: `BPDC-P5-001-PRESENCE-AWARENESS-PUBLISHED`
- Published: 2026-08-24 America/New_York
- Acceptance: `MET_FOR_ARCHITECT_REVIEW`
- Product commit: `c13d3e8b0a51b1799872672ffbca57059fa56a55` (`feat: wire curated user presence signals`)
- Publication: normal push succeeded from `9189d3129199a3ff46f0fa8df6a0bd8b284567b4` to `c13d3e8`; no force-push or history rewrite.
- Scope: only the bounded presence tracker, curated adapter mappings, plugin bundle, deterministic validation, README, and Authority records were published.
- Evidence boundary: `BPDC-E026` remains `E4_REGRESSION_PROTECTED`; no live desktop claim is made. No subsequent phase started.
- Closure: final records-only Authority commit and local/remote equality/clean-worktree verification follow.

## BPDC-P6-001 - CODEX HANDOFF COMPLETE

- Outcome ID: `BPDC-P6-001-ELAPSED-TIME-RECONCILIATION`
- Closed for Codex handoff: 2026-08-24 America/New_York
- Acceptance: `COMPLETE_FOR_ARCHITECT_REVIEW`
- Summary: Implemented the smallest elapsed-time continuity layer at the OpenPets persistence boundary. A version-1 envelope records real `savedAtEpochMs` beside the unchanged schema-3 CreatureCore snapshot; restart computes safe elapsed time, runs exact quiet reconciliation through existing mechanics under offline absence, and persists the reconciled state before live ticking.
- Validation: `node --test` PASSED 31/31; `node src/cli/experiments.js` BPDC-P6-001 PASSED; OpenPets persistence harness PASSED; manifest PASSED; local-staged plugin build PASSED at 43,351 bytes; core wall-clock boundary and privacy scans PASSED; `git diff --check` pending final commit.
- Measured performance: exact quiet catch-up approximately 13ms for 24h, 81ms for 7d, and 340ms for 30d in the Node 24 environment; no historical intent collection occurred.
- Evidence: `BPDC-E027`, `E4_REGRESSION_PROTECTED`; live desktop elapsed-time observation remains `UNKNOWN`/not claimed.
- Boundary: no CreatureCore wall-clock dependency, no new behavior/drive/memory/habit category, no offline interaction or intent replay, no OpenPets core change, and no later phase started.
- Follow-up directive: Architect review of `BPDC-P6-001`.

## BPDC-P6-001 - PUBLISHED

- Outcome ID: `BPDC-P6-001-ELAPSED-TIME-RECONCILIATION-PUBLISHED`
- Published: 2026-08-24 America/New_York
- Acceptance: `MET_FOR_ARCHITECT_REVIEW`
- Product and Authority implementation commit: `2e4ff7eb261b1df1c8db57392cfa4bbee9b99b61` (`feat: reconcile elapsed life across restart`).
- Publication: normal non-force push succeeded from `47bb5cc` to `2e4ff7e`; final local/remote equality verified at `2e4ff7e`; worktree clean before this records-only closure.
- Validation: 31/31 tests, P6 experiments, persistence harness, manifest, staged bundle, boundary/privacy scans, publication-safety scan, and diff check passed. Direct UNC esbuild `spawn EPERM` remains a known environment limitation.
- Evidence boundary: `BPDC-E027` remains deterministic/regression-protected; live Windows/Electron elapsed-time observation remains `UNKNOWN`/not claimed.
- Supersession: `BPDC-P6-001-CODEX HANDOFF COMPLETE` pending-acceptance state.

## BPDC-P7-001 - CODEX HANDOFF COMPLETE

- Outcome ID: `BPDC-P7-001-TRANSIENT-CONTACT-EXPRESSION`
- Closed for Codex handoff: 2026-08-24 America/New_York
- Acceptance: `COMPLETE_FOR_ARCHITECT_REVIEW`
- Retrieval confidence: `ADEQUATE`; jCodemunch-MCP was unavailable, so bounded direct reads were used only for the relevant implementation, tests, build, and Authority files.
- Summary: Implemented the smallest immediate causal-expression layer. Existing `POSITIVE_CONTACT` learning now leads CreatureCore to a separate transient response intent chosen from existing relationship/personality/current-behavior state. The OpenPets adapter maps it to existing reactions and restores the still-current autonomous behavior with one superseding, generation-guarded timer.
- Response vocabulary: `ENJOY_CONTACT`, `ACKNOWLEDGE_CONTACT`, `WITHDRAW_CONTACT`.
- Validation: `node --test` PASSED 38/38; P7 CLI experiment suite PASSED; adapter harness, sleep constraint, rapid-click safety, offline regression, manifest, staged build, boundary/privacy/publication-safety scans, and diff check PASSED. Direct UNC esbuild remains BLOCKED by known `spawn EPERM`; staged build PASSED at 48,071 bytes.
- Evidence: `BPDC-E028`, `E4_REGRESSION_PROTECTED`; live Windows/Electron physical-click observation of the new response remains `UNKNOWN`/not claimed.
- Boundary: no new autonomous behavior, drive, memory/habit dimension, persistence field, utility weight, privacy-sensitive signal, OpenPets core change, or Phase 8 work.
- Follow-up directive: Architect review of `BPDC-P7-001`.

## BPDC-P7-001 - LOCAL COMMIT RECORDED

- Outcome ID: `BPDC-P7-001-LOCAL-COMMIT`
- Recorded: 2026-08-24 America/New_York
- Acceptance: `MET_FOR_ARCHITECT_REVIEW`
- Local commit: `98b506d` (`feat: express immediate contact response`).
- Publication: not pushed; local `main` is intentionally one commit ahead of `origin/main` at accepted Phase 6 head `bdeffd9` because the directive did not separately authorize remote publication.
- Notion: canonical BPDC page updated with the P7 handoff and evidence boundary.
- Supersession: `BPDC-P7-001-TRANSIENT-CONTACT-EXPRESSION` handoff record remains the implementation evidence record.

## BPDC-P7-001 - ARCHITECT ACCEPTED

- Outcome ID: `BPDC-P7-001-ACCEPTED`
- Accepted: 2026-08-24 America/New_York
- Acceptance: `ACCEPTED`; Phase 7 is closed.
- Decision: The transient contact-expression layer satisfies the bounded P7 boundary; live visual response remains `UNKNOWN`/not claimed.
- Supersession: `BPDC-P7-001-TRANSIENT-CONTACT-EXPRESSION` and `BPDC-P7-001-LOCAL-COMMIT` are accepted implementation records.

## BPDC-SYNC-004 - PUBLISHED

- Outcome ID: `BPDC-SYNC-004-PUBLISHED`
- Published: 2026-08-24 America/New_York
- Acceptance: `PASSED`
- Local before: `main` at `619b35e1e2020ba9157d16d5241628f73a83395c`, clean; remote before `origin/main` at `bdeffd909ef7c993dc4daf9d97837a14e36742d1`.
- Unpublished commits: `98b506d` (`feat: express immediate contact response`) and `619b35e` (`chore: close Phase 7 authority handoff`); no unexpected source changes.
- Ancestry: `origin/main` was an ancestor of local `HEAD`.
- Validation: `node --test` 38/38 PASS; `git diff --check` PASS; publication-safety scan PASS with zero filename/content findings.
- Publication: normal `git push origin main` succeeded; final local `main == origin/main == 619b35e1e2020ba9157d16d5241628f73a83395c`; worktree clean; no history rewrite.
- Evidence boundary: live P7 visual observation remains `UNKNOWN`/not claimed.
- Next boundary: wait for a new Architect directive; do not start Phase 8.

## BPDC-P8-001 - CODEX HANDOFF COMPLETE

- Outcome ID: `BPDC-P8-001-SPATIAL-HABITAT-PREFERENCE`
- Closed for Codex handoff: 2026-08-24 America/New_York
- Acceptance: `COMPLETE_FOR_ARCHITECT_REVIEW`
- Retrieval confidence: `ADEQUATE`; jCodemunch-MCP was unavailable, so bounded direct reads were used only for the relevant implementation, tests, build, and Authority files.
- Summary: Added one persistent abstract `REST_SITE` preference. Geometry remains integration-owned; repeated user drag placement is the only learning source; affinity is bounded, saturating, decaying, relocatable, and inspectable. A normally selected SLEEP may target the site through adapter-side `moveTo` without changing utility selection.
- Validation: 45/45 tests; P8 CLI experiment suite; manifest; local-staged bundle at 59,600 bytes; schema/envelope migration; spatial concentration/scatter, saturation, decay/relocation, persistence, adapter, display invalidation, utility non-interference, boundary/privacy/secret scans; and diff check all passed.
- Evidence: `BPDC-E030`, `E4_REGRESSION_PROTECTED`; live P8 visual drag/return observation remains `UNKNOWN`/not claimed and is non-blocking.
- Boundary: no multiple-site system, screen grid, pathfinding, new behavior, utility change, privacy-sensitive signal, OpenPets core change, or Phase 9 work.
- Follow-up directive: Architect review of `BPDC-P8-001`.

## BPDC-P8-001 - LOCAL COMMIT RECORDED

- Outcome ID: `BPDC-P8-001-LOCAL-COMMIT`
- Recorded: 2026-08-24 America/New_York
- Acceptance: `MET_FOR_ARCHITECT_REVIEW`
- Local commit: `0b7e70e` (`feat: teach one persistent rest site`).
- Publication: not pushed; `origin/main` remains at accepted P7 publication `b9d6b5d` pending separate authorization.
- Verification: post-commit `node --test` 45/45, P8 experiments, generated bundle syntax, and diff check passed; worktree clean before this records-only closure.
- Evidence: `BPDC-E030`; live P8 visual spatial observation remains `UNKNOWN`/not claimed.

## BPDC-SYNC-005 - PUBLISHED

- Outcome ID: `BPDC-SYNC-005-PUBLISHED`
- Published: 2026-08-24 America/New_York
- Acceptance: `PASSED`
- Local before: `main` at `807d867e898b784b2b0321e0c570db4ea9314ae5`, clean; remote before `origin/main` at `b9d6b5d10e83df54d9e039421d2b40aba1c0176d`.
- Unpublished commits: `0b7e70e` (`feat: teach one persistent rest site`) and `807d867` (`chore: record Phase 8 authority handoff`); no unexpected source or generated files.
- Ancestry: freshly fetched `origin/main` was an ancestor of local `HEAD`.
- Validation: 45/45 tests; P8 experiment suite PASS; `git diff --check` PASS; publication-safety scan PASS with zero unexpected filenames, secret-pattern findings, or out-of-scope files.
- Publication: normal `git push origin main` succeeded for the accepted P8 state, followed by records-only closure pushes; final local `main == origin/main`; worktree clean; no history rewrite. The exact final SHA is recorded in the verified Notion handoff and repository state.
- Evidence boundary: live P8 drag/return/SLEEP visual observation remains `UNKNOWN`/not claimed.
- Next boundary: Phase 8 is closed; await a new Architect directive; do not start Phase 9.

## BPDC-P9-001 - CODEX HANDOFF COMPLETE

- Outcome ID: `BPDC-P9-001-USER-SHAPED-PLAY-PREFERENCE`
- Closed for Codex handoff: 2026-08-24 America/New_York
- Acceptance: `COMPLETE_FOR_ARCHITECT_REVIEW`
- Summary: Implemented exactly one persistent `playPreference` scalar. Positive contact during committed PLAY reinforces it with bounded saturation; other behaviors and autonomous PLAY do not. Utility diagnostics expose `PLAY.learnedPreference`; innate playfulness is unchanged.
- Parameters: learning rate `0.06`; 21-day half-life; maximum utility contribution `0.3`; snapshot schema 5 with schema 4 and earlier zero-initialization.
- Controlled result: eight equal positive contacts produced play preference `0.25421048866004275` during PLAY versus `0` in non-PLAY control; bond and time habit remained equal. Trained PLAY utility was `0.91705229520286` versus neutral `0.8004909000000001`, with learned contribution `0.11656139520285994`.
- Validation: 53/53 tests; P9 CLI experiments; P4-P8 regression; migration, persistence, offline, no-self-reinforcement, non-domination, P7 response, and P8 REST_SITE checks; manifest; staged bundle at 63,376 bytes; boundary/privacy/secret/publication-safety scans; and diff check all passed.
- Evidence: `BPDC-E032`, `E4_REGRESSION_PROTECTED`; live observation is not required and is not claimed.

## BPDC-P11-001 — juvenile socialization imprint implementation

- Outcome ID: `BPDC-P11-001-LOCAL-COMMIT`
- Recorded: 2026-08-26 America/New_York
- Acceptance: `MET_FOR_ARCHITECT_REVIEW`
- Local commit: `536abe67e724437dc969e1e27736bd08af9edea1` (`feat: add juvenile socialization imprint`); not pushed.
- Implementation: one numeric `socializationImprint`, learned by positive contact with continuous `1 - maturity` plasticity at rate `0.03`; no negative learning, no decay, no personality mutation, and no generic development framework.
- Utility: only `SEEK_ATTENTION.developmentalSocialization`, capped at `0.12`; current bond, innate sociability, P7 response, P8 REST_SITE, P9 play preference, and P10 maturation remain independent.
- Persistence: schema 6; schema 5 and earlier migrate to zero imprint without fabricating prior history.
- Verification: 68/68 tests, P4–P11 experiments, staged bundle 68,010 bytes, syntax/manifest, boundary/privacy, and diff checks passed. Live desktop evidence was not required and is not claimed.
- Next boundary: Architect review; do not push and do not begin Phase 12.

## BPDC-SYNC-007 - PUBLISHED

- Outcome ID: `BPDC-SYNC-007-PUBLISHED`
- Published: 2026-08-25 America/New_York
- Acceptance: `PASSED`
- Local before: `main` at `edff9031a90a1420552ab4d51cdbc03d9d8a05d5`, clean; remote before `origin/main` at `9f38bb0db40332c6f3d2524dd889877523778a4d`.
- Unpublished commits: `9045fb7a61a29917405e3d1d53174aec63246dfb` (`feat: add continuous physical maturation`) and `edff9031a90a1420552ab4d51cdbc03d9d8a05d5` (`chore: record Phase 10 authority handoff`); no unexpected source or generated files.
- Ancestry: freshly fetched `origin/main` was an ancestor of local `HEAD`.
- Validation: 60/60 tests; P10 experiment suite PASS; `git diff --check` PASS; publication-safety scan PASS with 23 expected files, zero unexpected files, zero added secret findings; manifest delta contains only `pet:animate`.
- Publication: normal non-force `git push origin main` succeeded from `9f38bb0db40332c6f3d2524dd889877523778a4d` to `edff9031a90a1420552ab4d51cdbc03d9d8a05d5`; final local `main == origin/main`; worktree clean; no history rewrite.
- Evidence boundary: live Windows/Electron visual growth remains `UNKNOWN` / not claimed.
- Next boundary: Phase 10 is closed; await a new Architect directive; do not start Phase 11.

## BPDC-SYNC-006 - PUBLISHED

- Outcome ID: `BPDC-SYNC-006-PUBLISHED`
- Published: 2026-08-24 America/New_York
- Acceptance: `PASSED`
- Local before: `main` at `58acab9a85fefeb7b79d130b3ceb0e75d7aada89`, clean; remote before `origin/main` at `1feeb4c8079e823cb365a1016536f7dc655f5362`.
- Unpublished commits: `f25010b0fd5a89776d8fb151c5fd5dc9e2d0b5b6` (`feat: learn user-shaped play preference`) and `58acab9a85fefeb7b79d130b3ceb0e75d7aada89` (`chore: record Phase 9 authority handoff`); no unexpected source or generated files.
- Ancestry: freshly fetched `origin/main` was an ancestor of local `HEAD`.
- Validation: 53/53 tests; P9 experiment suite PASS; `git diff --check` PASS; publication-safety scan PASS with zero unexpected files, bad filenames, or added secret findings.
- Publication: normal `git push origin main` succeeded; final local `main == origin/main == 58acab9a85fefeb7b79d130b3ceb0e75d7aada89`; worktree clean; no history rewrite.
- Evidence boundary: live observation was not required and is not claimed.
- Next boundary: Phase 9 is closed; await a new Architect directive; do not start Phase 10.
- Boundary: no other preference, generic reinforcement engine, mutable personality, development stage, new behavior, new sensing, LLM, OpenPets core change, or Phase 10 work.
- Local commit: `f25010b0fd5a89776d8fb151c5fd5dc9e2d0b5b6` (`feat: learn user-shaped play preference`); push is explicitly not authorized by this directive.
- Follow-up directive: Architect review of `BPDC-P9-001`.

## BPDC-P10-001 - CODEX HANDOFF COMPLETE

- Outcome ID: `BPDC-P10-001-CONTINUOUS-PHYSICAL-MATURATION`
- Closed for Codex handoff: 2026-08-25 America/New_York
- Acceptance: `COMPLETE_FOR_ARCHITECT_REVIEW`
- Summary: Implemented exactly one derived continuous maturation projection from existing simulation age and mapped it to OpenPets `setScale()` presentation.
- Parameters: 14 simulated day maturation duration; maturity `0..1`; size factor `0.8..1.0`; 0.01 quantization; no persisted development state; schema remains 5.
- Evidence: `BPDC-E034`, `E4_REGRESSION_PROTECTED`; curve, age boundary, behavior non-interference, offline catch-up, save/reload, adapter mapping, and scale-call boundedness all passed.
- Validation: original 53-test regression and final 60/60 tests; P10 experiments; staged bundle at 65,763 bytes; generated syntax; manifest; exactly one new `pet:animate` permission; wall-clock/dependency, added-line privacy, publication-safety, and diff checks all passed.
- Boundary: no utility, personality, drive, relationship, habit, preference, timing, RNG, response, REST_SITE, behavior-selection, evolution, alternate-form, care-history, or Phase 11 changes.
- Local product commit: `9045fb7a61a29917405e3d1d53174aec63246dfb` (`feat: add continuous physical maturation`); push not authorized.
- Live evidence: not required for this handoff; no live visual claim made.
- Push: NO; local commit and subsequent Architect publication decision remain required.

## BPDC-P9-001 - LOCAL COMMIT RECORDED

- Outcome ID: `BPDC-P9-001-LOCAL-COMMIT`
- Recorded: 2026-08-24 America/New_York
- Acceptance: `MET_FOR_ARCHITECT_REVIEW`
- Local commit: `f25010b0fd5a89776d8fb151c5fd5dc9e2d0b5b6` (`feat: learn user-shaped play preference`).
- Publication: not pushed; `origin/main` remains at accepted Phase 8 publication `1feeb4c` pending a separate Architect publication decision.
- Verification: 53/53 tests, P9 experiments, staged bundle, manifest, boundary/privacy/secret/publication-safety scans, and diff check passed.
- Evidence: `BPDC-E032`, `E4_REGRESSION_PROTECTED`; live observation is not required and is not claimed.
