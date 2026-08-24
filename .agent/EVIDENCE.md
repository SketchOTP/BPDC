# Project Evidence Catalog

## Evidence ladder

- `E0_CLAIMED` — assertion only; not acceptance evidence.
- `E1_OBSERVED` — directly inspected static fact or source.
- `E2_REPRODUCED` — behavior/problem reproduced.
- `E3_TARGET_TESTED` — focused deterministic target check passes.
- `E4_REGRESSION_PROTECTED` — target check plus meaningful broader/pre-existing protection.
- `E5_OPERATIONALLY_OBSERVED` — observed in the authorized real or production-like environment.

New target tests alone are at most `E3_TARGET_TESTED`. A commit is not runtime evidence.

## BPDC-E001 — governance bootstrap basis

- Created: 2026-08-22 America/New_York
- Directive/outcome: `AUTHORITY-BOOTSTRAP-BPDC-001` / `BPDC-AUTHORITY-BOOTSTRAP-001`
- Evidence level: `E1_OBSERVED`
- Type: `STATIC_OBSERVATION`
- Sources: BPDC Notion page; Authority 3.0 Notion page; GitHub `SketchOTP/BPDC` metadata; local workspace inspection.
- Result: `OBSERVED`
- Reliability/limitations: no application source exists yet; Phase 0 candidates were named by Notion but not independently evaluated.
- Reproduction command/method: Notion fetch, GitHub repository metadata fetch, local read-only directory/Git inspection.

## BPDC-E002 — OpenPets traced integration seam

- Created: 2026-08-22 America/New_York
- Directive/outcome: `BPDC-P0-001` / pending Architect acceptance
- Evidence level: `E1_OBSERVED`
- Type: `STATIC_OBSERVATION`
- Sources: OpenPets commit `a77d3747caab0337934959980c68f60e0d3c615c`; SDK documentation and types; desktop plugin bridge, pet API/registry, motion, display, quota, and official virtual-pet plugin sources.
- Result: `OBSERVED`
- Finding: OpenPets provides plugin-owned persistent JSON storage, schedules, curated events, direct movement, reactions, declared sprite animation, state reads, click/drag interaction, and host-owned display containment while keeping plugins out of the render/window boundary.
- Reliability/limitations: static source observation; live Electron/Windows runtime was not run.

## BPDC-E003 — disposable OpenPets proof

- Created: 2026-08-22 America/New_York
- Directive/outcome: `BPDC-P0-001` / pending Architect acceptance
- Evidence level: `E3_TARGET_TESTED`
- Type: `FOCUSED_REPRODUCTION`
- Scratch proof: `C:\Users\sketc\AppData\Local\Temp\bpdc-p0-001-proof\proof.mjs`
- Command: `node C:\Users\sketc\AppData\Local\Temp\bpdc-p0-001-proof\proof.mjs`
- Result: `PASSED`
- Output: `BPDC_OPENPETS_PROOF=PASS`; movement, reaction, timer, custom state, restore, event, and headless checks all passed.
- Reliability/limitations: disposable SDK harness only; it does not prove a live desktop runtime.

## BPDC-E004 — OpenPets SDK and official plugin checks

- Created: 2026-08-22 America/New_York
- Directive/outcome: `BPDC-P0-001` / pending Architect acceptance
- Evidence level: `E3_TARGET_TESTED`
- Type: `FOCUSED_REPRODUCTION`
- Commands: `pnpm --filter @open-pets/plugin-sdk build`; `pnpm --filter @open-pets/plugin-sdk test`; `node plugins/official/openpets.virtual-pet/test.js`.
- Result: `PASSED`; SDK build, SDK contract tests, and official virtual-pet checks completed successfully.
- Reliability/limitations: upstream checkout was disposable and pinned to the recorded commit.

## BPDC-E005 — OpenPets motion/display focused checks

- Created: 2026-08-22 America/New_York
- Directive/outcome: `BPDC-P0-001` / pending Architect acceptance
- Evidence level: `E3_TARGET_TESTED`
- Type: `FOCUSED_REPRODUCTION`
- Command: direct execution of the built display, confinement, motion-engine, gravity, and roaming-controller test targets after `pnpm --filter @open-pets/desktop test:build`.
- Result: `PASSED`; final marker `TARGETED_MOTION_DISPLAY=PASS`.
- Reliability/limitations: focused desktop test targets only; no live Electron/Windows window validation.

## BPDC-E006 — broad OpenPets desktop suite concern

- Created: 2026-08-22 America/New_York
- Directive/outcome: `BPDC-P0-001` / pending Architect acceptance
- Evidence level: `E2_REPRODUCED`
- Type: `REGRESSION_OBSERVATION`
- Command: `pnpm --filter @open-pets/desktop test`
- Result: `FAILED_WITH_CONCERN` at `tests/plugin-service.test.js`: local-plugin pruning expected the stale `old-sample` record to be removed but observed it still present. A malformed temporary plugin-state JSON case logged and recovered to defaults and passed.
- Reliability/limitations: no upstream repair was attempted; the failure is not characterized as BPDC-caused.

## BPDC-E007 — VPet fallback review

- Created: 2026-08-22 America/New_York
- Directive/outcome: `BPDC-P0-001` / pending Architect acceptance
- Evidence level: `E1_OBSERVED`
- Type: `STATIC_OBSERVATION`
- Sources: VPet commit `b6f7b00363529bafe3e7fc14bf51e17640941691`; README; secondary-development documentation; plugin interfaces; main logic, controller, save-state, and demo plugin sources.
- Result: `REFERENCE_FALLBACK`
- Finding: credible Windows/WPF desktop pet host with animation, interaction, plugin, and save seams, but gameplay/save/render coupling is stronger and default animation assets carry separate terms.
- Reliability/limitations: VPet build and runtime were not run; the demo's foreground-window observation is excluded from BPDC's privacy boundary.

## BPDC-E008 — Petz/PetzA behavioral reference review

- Created: 2026-08-22 America/New_York
- Directive/outcome: `BPDC-P0-001` / pending Architect acceptance
- Evidence level: `E1_OBSERVED`
- Type: `STATIC_OBSERVATION`
- Sources: PetzA commit `6c36688bcd1839e4f2a5fd4d91bcd187297c1abc`; petz-file-formats commit `cd1634b9e908078fb831ae833975d1219da30e36`; MIT Catz behavioral paper.
- Result: `REFERENCE_ONLY`
- Finding: reusable behavioral ideas include drives/biorhythms, target location, identity/profiles, constrained randomness, layered animation/timing, and direct interaction; PetzA's executable hooks and assets are version-specific and outside the BPDC foundation.
- Reliability/limitations: historical/reference material only; no runtime reuse or asset copying authorized.

## BPDC-E009 — framework-independent CreatureCore implementation

- Created: 2026-08-22 America/New_York
- Directive/outcome: `BPDC-P1-001` / `BPDC-P1-001-CREATURE-CORE`
- Evidence level: `E1_OBSERVED`
- Type: `IMPLEMENTATION_OBSERVATION`
- Sources: `src/creature-core/`, `src/cli/`, `package.json`, and `README.md`.
- Result: `IMPLEMENTED`
- Finding: the core has four normalized pressure drives, six persisted traits, seven behaviors, injectable clock, seeded RNG, commitment timing, machine-readable score contributors, and versioned JSON snapshots. No desktop or OpenPets import exists.
- Reliability/limitations: static source observation; runtime behavior is covered by E010 and E011.

## BPDC-E010 — unit and behavioral test suite

- Created: 2026-08-22 America/New_York
- Directive/outcome: `BPDC-P1-001` / `BPDC-P1-001-CREATURE-CORE`
- Evidence level: `E3_TARGET_TESTED`
- Type: `FOCUSED_REPRODUCTION`
- Command: `node --test`
- Result: `PASSED`; 6 tests passed, 0 failed.
- Coverage: seven behaviors and diagnostics, deterministic replay, ten-seed personality divergence, extreme-drive causality, save/reload continuation, and accelerated trace structure.
- Reliability/limitations: Node 24 test environment; no desktop runtime.

## BPDC-E011 — required Phase 1 experiments

- Created: 2026-08-22 America/New_York
- Directive/outcome: `BPDC-P1-001` / `BPDC-P1-001-CREATURE-CORE`
- Evidence level: `E3_TARGET_TESTED`
- Type: `EXPERIMENTAL_REPRODUCTION`
- Command: `node src/cli/experiments.js`
- Result: `PASSED`; replay, personality divergence, drive causality, and save/reload continuity all passed.
- Measured findings: 10 distinct behavior distributions from 10 personality seeds under identical 24-hour conditions; the 24-hour trace runner emitted 590 behavior selections for seed 9001; persistence final timestamp was 86400 seconds.
- Reliability/limitations: accelerated deterministic simulation only; no claim about perceived believability or live desktop behavior.

## BPDC-E012 — headless JSON trace runner

- Created: 2026-08-22 America/New_York
- Directive/outcome: `BPDC-P1-001` / `BPDC-P1-001-CREATURE-CORE`
- Evidence level: `E3_TARGET_TESTED`
- Type: `FOCUSED_REPRODUCTION`
- Command: `node src/cli/simulate.js --seed 1234 --hours 24`
- Result: `PASSED`; JSON parsed successfully with 606 behavior selections and final simulation time 86400 seconds.
- Reliability/limitations: CLI output is headless simulation evidence, not desktop integration evidence.

## BPDC-E013 — OpenPets pinned host and adapter boundary

- Created: 2026-08-23 America/New_York
- Directive/outcome: `BPDC-P2-001` / `BPDC-P2-001-EMBODIMENT`
- Evidence level: `E1_OBSERVED`
- Type: `STATIC_OBSERVATION`
- Sources: pinned OpenPets checkout, `src/desktop/desktop-adapter.js`, `integrations/openpets/openpets-adapter.js`, and `src/creature-core/`.
- Result: `BOUNDARY_PRESERVED`; CreatureCore has no OpenPets/Electron/Windows imports, while the adapter owns all host translation. Pinned host source showed a timing tick and host movement/physics controls but no host behavior selector for BPDC.
- Reliability/limitations: source and API observation do not alone prove user-perceived animation quality.

## BPDC-E014 — Phase 2 adapter, bundle, validator, and harness checks

- Created: 2026-08-23 America/New_York
- Directive/outcome: `BPDC-P2-001` / `BPDC-P2-001-EMBODIMENT`
- Evidence level: `E3_TARGET_TESTED`
- Type: `FOCUSED_REPRODUCTION`
- Commands/checks: `node --test`; local-staged `node scripts/build-openpets-plugin.mjs`; pinned OpenPets CLI `plugin validate`; OpenPets test harness start/forced `WANDER`/`SLEEP`/`SEEK_ATTENTION` commands with `expectNoErrors()`.
- Result: `PASSED`; 8 BPDC tests passed, generated entry was 22,579 bytes, manifest validation passed, and the harness completed without errors. Adapter tests verified no behavior selection and rejection of unsupported actions.
- Reliability/limitations: harness and validator are target-focused; not a substitute for a human believability judgment.

## BPDC-E015 — live Windows/Electron BPDC runtime

- Created: 2026-08-23 America/New_York
- Directive/outcome: `BPDC-P2-001` / `BPDC-P2-001-EMBODIMENT`
- Evidence level: `E5_OPERATIONALLY_OBSERVED`
- Type: `RUNTIME_OBSERVATION`
- Runtime: pinned OpenPets desktop checkout, Electron 42 on Windows, disposable user data `C:\Users\sketc\AppData\Local\Temp\bpdc-p2-001-openpets-userdata3`, staged local plugin path, and installed pet `bpdc-test-pet`.
- Result: `PASSED_WITH_CONCERN`; the host installed and rendered the original placeholder, reported it as the default pet, showed it visibly, loaded `index.js`, started `bpdc.embodiment`, selected autonomous `SLEEP`, called the adapter, read host state, disabled native gravity, and logged `hostBehaviorSelection=none observed; host tick only`.
- Reliability/limitations: the transparent always-on-top pet was not captured by normal desktop screen capture; direct rendered HTML, sprite asset, host visibility/state log, and live plugin log are retained. Autonomous live observation exercised SLEEP; the three forced mappings were target-tested through the official harness.

## BPDC-E016 — restart persistence and runtime reload

- Created: 2026-08-23 America/New_York
- Directive/outcome: `BPDC-P2-001` / `BPDC-P2-001-EMBODIMENT`
- Evidence level: `E5_OPERATIONALLY_OBSERVED`
- Type: `RUNTIME_OBSERVATION`
- Result: `PASSED`; the live log recorded `new individual created` followed by `snapshot restored` for stable `creature-42504443` across plugin reload and host restart, using OpenPets plugin storage key `bpdc.creature.snapshot`.
- Reliability/limitations: the test used a disposable host profile and validates identity/snapshot restoration, not a long-duration unattended Windows run.

## BPDC-E017 — live WANDER mapping in Windows/Electron OpenPets

- Created: 2026-08-23 America/New_York
- Directive/outcome: `BPDC-P2-002` / `BPDC-P2-002-EMBODIMENT-CLOSURE`
- Evidence level: `E5_OPERATIONALLY_OBSERVED`
- Type: `RUNTIME_OBSERVATION`
- Runtime: pinned OpenPets Electron 42 on Windows, disposable user data `C:\Users\sketc\AppData\Local\Temp\bpdc-p2-001-openpets-userdata3`, native host menu command `BPDC probe: wander`.
- Result: `PASSED`; the real host accepted `pet.wander(distance=110)` at `2026-08-23T15:32:31.494Z`, with `visible=true` and host position/state returned. Direct desktop capture: `C:\Users\sketc\AppData\Local\Temp\bpdc-p2-002-live-wander.png`.
- Reliability/limitations: this probe validates the live adapter-to-host mapping; it is not autonomous selection evidence.

## BPDC-E018 — live SLEEP mapping in Windows/Electron OpenPets

- Created: 2026-08-23 America/New_York
- Directive/outcome: `BPDC-P2-002` / `BPDC-P2-002-EMBODIMENT-CLOSURE`
- Evidence level: `E5_OPERATIONALLY_OBSERVED`
- Type: `RUNTIME_OBSERVATION`
- Runtime: same pinned OpenPets Windows/Electron profile and native host menu command `BPDC probe: sleep`.
- Result: `PASSED`; the real host accepted `pet.react(waiting)` at `2026-08-23T15:34:16.610Z`, rendered reaction state `waiting`, and returned `visible=true`. Direct desktop capture: `C:\Users\sketc\AppData\Local\Temp\bpdc-p2-002-live-sleep.png`, visibly showing the sleeping body/`Z Z` treatment.
- Reliability/limitations: this probe validates the live adapter-to-host mapping; it is not autonomous selection evidence.

## BPDC-E019 — live SEEK_ATTENTION mapping in Windows/Electron OpenPets

- Created: 2026-08-23 America/New_York
- Directive/outcome: `BPDC-P2-002` / `BPDC-P2-002-EMBODIMENT-CLOSURE`
- Evidence level: `E5_OPERATIONALLY_OBSERVED`
- Type: `RUNTIME_OBSERVATION`
- Runtime: same pinned OpenPets Windows/Electron profile and native host menu command `BPDC probe: attention`.
- Result: `PASSED`; the real host accepted `pet.react(waving)` at `2026-08-23T15:34:02.878Z`, rendered reaction state `waving`, and returned `visible=true`. Direct desktop capture: `C:\Users\sketc\AppData\Local\Temp\bpdc-p2-002-live-attention.png`, visibly showing the attention/waving treatment.
- Reliability/limitations: this probe validates the live adapter-to-host mapping; it is not autonomous selection evidence.

## BPDC-E020 — autonomous multi-intent live session

- Created: 2026-08-23 America/New_York
- Directive/outcome: `BPDC-P2-002` / `BPDC-P2-002-EMBODIMENT-CLOSURE`
- Evidence level: `E5_OPERATIONALLY_OBSERVED`
- Type: `RUNTIME_OBSERVATION`
- Runtime: pinned OpenPets Electron 42 on Windows, disposable user data `C:\Users\sketc\AppData\Local\Temp\bpdc-p2-002-autonomous-distinct-userdata`, staged unchanged P2 plugin, creature `creature-42504443`.
- Result: `PASSED`; without probe commands, the same restored CreatureCore selected `SEEK_ATTENTION` at `2026-08-23T15:53:12.047Z`, the adapter called `pet.react(waving)` and the host accepted it, then after the `158.683` second commitment expired CreatureCore selected `WANDER` at `2026-08-23T15:55:50.756Z` and the host accepted `pet.wander(distance=110)` at `2026-08-23T15:55:50.759Z`. The live log records `CORE → ADAPT → HOST` for both selections. Direct desktop capture after the second transition: `C:\Users\sketc\AppData\Local\Temp\bpdc-p2-002-live-autonomous-wander.png`.
- Fixture disclosure: only the disposable persisted `internalState` was prepared (`energy=0`, `social=0.3`, `curiosity=0.2`, `stimulation=0.1`) so the runtime would reach the requested multi-intent boundary promptly; behavior selection, timing, adaptation, and host execution remained production code paths.
- Reliability/limitations: one live session proves two distinct autonomous selections, not long-term behavioral believability or later memory/relationship features.

## BPDC-E021 — OpenPets non-override confirmation during P2-002

- Created: 2026-08-23 America/New_York
- Directive/outcome: `BPDC-P2-002` / `BPDC-P2-002-EMBODIMENT-CLOSURE`
- Evidence level: `E5_OPERATIONALLY_OBSERVED`
- Type: `RUNTIME_OBSERVATION`
- Result: `PASSED`; the autonomous log records `nativeGravity=false` and `hostBehaviorSelection="none observed; host tick only"`, while each BPDC-selected action is followed by the corresponding adapter/host acceptance and host visibility/state.
- Reliability/limitations: this is bounded to the pinned OpenPets runtime and the disposable session; it does not claim all future OpenPets versions behave identically.

## BPDC-E022 — live relationship click, persistence, restart, and utility effect

- Created: 2026-08-23 America/New_York
- Directive/outcome: `BPDC-P3-003` / `BPDC-P3-003-RELATIONSHIP-LIVE-GATE`
- Evidence level: `E5_OPERATIONALLY_OBSERVED`
- Type: `RUNTIME_OBSERVATION`
- Runtime: pinned OpenPets Electron 42 on Windows, disposable plugin root `C:\Users\sketc\AppData\Local\Temp\bpdc-p3-003-openpets-dev`, disposable user data `C:\Users\sketc\AppData\Local\Temp\bpdc-p3-003-live-userdata`.
- Baseline: `creature-42504443`, snapshot schema `2`, bond `0.5`, empty interaction history, and `SEEK_ATTENTION` bond/recentBond contributors `0/0`.
- Click provenance: the host log recorded `pet:clicked` at `2026-08-23T23:10:21.209Z`; the plugin then recorded `CORE positive interaction recorded` at `2026-08-23T23:10:21.210Z` with host-neutral `POSITIVE_CONTACT`, valence `1`, and intensity `0.4`.
- Mutation/persistence: the normal plugin-storage snapshot recorded the same creature ID, schema `2`, one bounded event, and bond `0.5099997657179275` immediately after the click; later values differ only by modeled relationship decay.
- Restart: the host was stopped and relaunched with the same disposable profile; logs recorded `snapshot restored` with `creature-42504443`, and the stored history returned unchanged.
- Utility effect: after restart, restored `SEEK_ATTENTION` scored `0.5404200243808092` versus neutral-history `0.45271098450000985`, delta `0.08770903988079931`; restored contributors were bond `0.007997591419477335` and recentBond `0.07971144846132208`.
- Reliability/limitations: the evidence is bounded to the pinned OpenPets runtime and disposable profile; no claim is made about future OpenPets versions. The transparent pet window is visually observable through Computer Use, while authoritative provenance and persistence are log/snapshot evidence.

## BPDC-E023 — P4 time-of-day habit target evidence

- Created: 2026-08-23 America/New_York
- Directive/outcome: `BPDC-P4-001` / `BPDC-P4-001-TIME-HABIT-IMPLEMENTATION`
- Evidence level: `E3_TARGET_TESTED`
- Type: `FOCUSED_REPRODUCTION`
- Result: `PASSED`; 24 bounded hourly values reinforce from positive interaction intensity, saturate, decay over days, persist through schema 3, and contribute only to `SEEK_ATTENTION.timeHabit`. Same-hour concentration yielded `0.05727286423429983` versus `0` at the target hour with equal bond; seven-day decay yielded `0.02 → 0.01 → 0.005`; extreme fatigue still selected `SLEEP`.
- Validation: `node --test` 17/17; P4 experiment suite PASS; OpenPets manifest PASS; staged bundle PASS at 35,453 bytes; CreatureCore dependency/time scan PASS; `git diff --check` PASS.
- Reliability/limitations: this is deterministic target-tested evidence only. The required real OpenPets physical click → current-hour reinforcement → persistence → restart path is `UNKNOWN` because callable Computer Use UI tooling was unavailable in this session.

## BPDC-E024 — P4-002 live gate environment block

- Created: 2026-08-23
- Directive/outcome: `BPDC-P4-002` / `BPDC-P4-002-TIME-HABIT-LIVE-GATE`
- Evidence level: `E3_TARGET_TESTED` for regression/build checks; live integration `UNKNOWN`
- Type: `ENVIRONMENT_BLOCK`
- Result: deterministic and packaging validation passed, but the required physical OpenPets click, current-hour provenance, normal persistence, host restart, and restored utility comparison were not run because no callable Computer Use `node_repl`/Sky tool was exposed.
- Reliability/limitations: no synthetic interaction, direct habit learner call, manual habit mutation, or snapshot edit was used. This entry does not establish live P4 behavior.

## BPDC-E025 — P4 acceptance with deferred habit-specific live evidence

- Created: 2026-08-23
- Directive/outcome: Architect review accepting `BPDC-P4-001`; `BPDC-SYNC-003`
- Evidence level: `E3_TARGET_TESTED` for the Phase 4 mechanism; underlying click seam `E5_OPERATIONALLY_OBSERVED` from `BPDC-E022`; habit-specific live reinforcement remains `UNKNOWN`
- Type: `ARCHITECT_ACCEPTANCE`
- Result: the bounded 24-slot habit, saturation, seven-day decay, `SEEK_ATTENTION.timeHabit`, schema 2 → 3 migration, deterministic persistence, and fatigue subordination are accepted. The live current-hour click/restart experiment is deferred opportunistically and is not a progression blocker.
- Reliability/limitations: no new E5 claim is made for habit-specific live reinforcement; no synthetic event or manual state mutation was used.

## BPDC-E026 — Phase 5 bounded presence implementation

- Created: 2026-08-24 America/New_York
- Directive/outcome: `BPDC-P5-001` / pending Architect acceptance
- Evidence level: `E4_REGRESSION_PROTECTED`
- Type: `FOCUSED_REPRODUCTION`
- Result: `PASSED`; a transient integration `PresenceTracker` maps host-neutral `ACTIVE`, `IDLE`, and `LOCKED` signals to the existing `userPresent` and `userIdleDuration` fields. Startup is internal `UNKNOWN`, conservatively mapped to absent/zero-duration until an explicit signal arrives. Idle duration uses an injectable integration clock, increases from the host-reported `idleSeconds`, and returns to zero on active/unlocked/direct interaction.
- Validation: `node --test` 22/22; P4 and presence experiment suite PASS; adapter event harness PASS; OpenPets manifest PASS; local-staged bundle PASS at 38,483 bytes; CreatureCore framework/time scan PASS; privacy-sensitive API scan PASS; `git diff --check` PASS.
- Utility/drive results: active `SEEK_ATTENTION` `0.74979795` > idle `0.39979795`; active `SLEEP` `0.4844834` < idle `0.6344834`; four-hour social pressure active `0.166` < absent `0.322`.
- Reliability/limitations: target-tested and regression-protected only; no live desktop observation is claimed or required. Presence is transient and does not enter the persistence schema.
