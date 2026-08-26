# Project Learnings

## BPDC-L001

- Date: 2026-08-22
- Fact: BPDC is a new empty GitHub repository with no committed implementation, and its Notion directive explicitly limits the immediate assignment to Phase 0 foundation evaluation.
- Evidence: GitHub repository metadata; local working-tree inspection; BPDC Notion page Phase 0 assignment.
- Confidence: `VERIFIED`
- Scope: repository bootstrap and Phase 0 planning.
- Supersedes: `NONE`

## BPDC-L006

- Date: 2026-08-22
- Fact: A small four-pressure-drive kernel with six seeded personality dimensions and seven utility-selected behaviors can produce deterministic replay, measurable ten-seed divergence, causal extreme-drive selections, and save/reload continuation without a desktop framework.
- Evidence: `BPDC-E009`, `BPDC-E010`, `BPDC-E011`.
- Confidence: `VERIFIED`
- Scope: Phase 1 headless behavioral core.
- Supersedes: `NONE`

## BPDC-L007

- Date: 2026-08-22
- Fact: Commitment timing is necessary for this first kernel: behavior selection is held until its duration ends, and snapshots preserve current behavior timing so reload does not consume a different decision path.
- Evidence: `BPDC-E009`, `BPDC-E010`, `BPDC-E011`.
- Confidence: `VERIFIED`
- Scope: behavior selection and persistence.
- Supersedes: `NONE`

## BPDC-L003

- Date: 2026-08-22
- Fact: OpenPets SDK v3 can host a BPDC-owned simulation without an LLM: plugin storage survives restart, schedules reconcile wall-clock time, schedules/events/pet handles expose the required Phase 0 controls, and the published harness is deterministic without Electron. Hidden taxes are plugin quotas, opaque display geometry, no animation-completion event, host-driven tick pausing while hidden/dragged, and SDK/platform coupling.
- Evidence: OpenPets commit `a77d3747caab0337934959980c68f60e0d3c615c`; disposable proof; SDK and focused tests.
- Confidence: `VERIFIED`
- Scope: Phase 0 foundation selection.
- Supersedes: `NONE`

## BPDC-L004

- Date: 2026-08-22
- Fact: VPet exposes a richer Windows/WPF plugin surface, but `MainPlugin` receives `IMainWindow`, `GameCore`, `GameSave_v2`, and host timers/display methods. That makes direct movement and animation feasible but couples a BPDC adapter to host gameplay state, Windows UI lifecycle, and host save format.
- Evidence: VPet commit `b6f7b00363529bafe3e7fc14bf51e17640941691`; source and demo documentation review.
- Confidence: `VERIFIED`
- Scope: Phase 0 fallback evaluation.
- Supersedes: `NONE`

## BPDC-L005

- Date: 2026-08-22
- Fact: PetzA source is a 0BSD Windows DLL/add-on that patches specific Petz executable versions and exposes biorhythm/brain sliders, target-location hooks, profile management, and animation-format tooling. It is not a reusable desktop-pet host. The Catz design paper supports constrained randomness, layered animation, direct interaction, and user-perceived life as BPDC reference principles.
- Evidence: PetzA commit `6c36688bcd1839e4f2a5fd4d91bcd187297c1abc`; petz-file-formats commit `cd1634b9e908078fb831ae833975d1219da30e36`; MIT Catz paper.
- Confidence: `VERIFIED`
- Scope: Phase 0 behavioral/reference evaluation.
- Supersedes: `NONE`

## BPDC-L002

- Date: 2026-08-22
- Fact: Authority 3.0 is the installation/operating model; the stable governance baseline carried by the install is Authority 2026.08.15 with schema 2.2.0.
- Evidence: Authority 3.0 Notion page; Authority VERSION.json record.
- Confidence: `VERIFIED`
- Scope: project governance.
- Supersedes: `NONE`

## BPDC-L008

- Date: 2026-08-23
- Fact: OpenPets remains a viable BPDC body when BPDC disables host gravity, treats the host tick as timing only, and sends every visible action through a thin adapter. The host does not choose BPDC behavior in the pinned runtime path.
- Evidence: `BPDC-E013`, `BPDC-E015`.
- Confidence: `VERIFIED`
- Scope: Phase 2 OpenPets integration.
- Supersedes: `NONE`

## BPDC-L009

- Date: 2026-08-23
- Fact: OpenPets local plugin loading requires a self-contained declared entry for BPDC's generated runtime; a bundle avoids undeclared imports and preserves the core/adapter source boundary for review.
- Evidence: `BPDC-E013`, `BPDC-E014`.
- Confidence: `VERIFIED`
- Scope: plugin packaging.
- Supersedes: `NONE`

## BPDC-L010

- Date: 2026-08-23
- Fact: Transparent always-on-top pet windows may be absent from ordinary Windows desktop screen capture even while OpenPets reports the window visible and the rendered document references the installed sprite sheet. Host logs and rendered HTML are required companion evidence.
- Evidence: `BPDC-E015`.
- Confidence: `VERIFIED`
- Scope: runtime visual verification.
- Supersedes: `NONE`

## BPDC-L011

- Date: 2026-08-23
- Fact: Native OpenPets context-menu commands can be invoked in the real Windows host and provide a narrow live mapping check; they do not replace autonomous provenance. For bounded autonomous evidence, a disposable persisted-drive fixture can shorten the first commitment while leaving CreatureCore selection, timing, adapter translation, and host execution on unchanged production paths.
- Evidence: `BPDC-E017` through `BPDC-E021`.
- Confidence: `VERIFIED`
- Scope: runtime evidence and test setup.
- Supersedes: `NONE`

## BPDC-L012

- Date: 2026-08-23
- Fact: Phase 2 is operationally closed: the pinned Windows/Electron OpenPets runtime can render three distinct BPDC intents, accept multiple autonomous CreatureCore selections, and remain a body-only host when native gravity is disabled and host behavior selection is absent.
- Evidence: `BPDC-E017` through `BPDC-E021`; Architect acceptance `BPDC-P2-002`.
- Confidence: `VERIFIED`
- Scope: Phase 2 embodiment gate.
- Supersedes: `NONE`

## BPDC-L013

- Date: 2026-08-23
- Fact: The next smallest useful believability increment is bounded relationship history: one slowly changing persistent bond plus a small structured event buffer, with no generic memory architecture or habits.
- Evidence: Architect directive `BPDC-P3-001` and Notion canonical page.
- Confidence: `SUPPORTED_HYPOTHESIS`
- Scope: Phase 3 relationship-memory implementation.
- Supersedes: `NONE`

## BPDC-L014

- Date: 2026-08-23
- Fact: In the pinned OpenPets Windows/Electron runtime, a real visible pet click emits `pet:clicked`, reaches the BPDC adapter/Core path as a host-neutral `POSITIVE_CONTACT`, persists the bounded relationship event and bond, and restores through host restart with a measurable `SEEK_ATTENTION` utility contribution.
- Evidence: `BPDC-E022`; live log correlation at `2026-08-23T23:10:21.209Z` / `2026-08-23T23:10:21.210Z`; post-restart utility delta `0.08770903988079931`.
- Confidence: `VERIFIED`
- Scope: pinned OpenPets runtime and current Phase 3 implementation.
- Supersedes: `NONE`

## BPDC-L015

- Date: 2026-08-23
- Fact: The accepted local BPDC history and GitHub `origin/main` are separate Git roots: local Phase 1 begins at `dc489465...`, while the remote remains bootstrap root `c1eaf441...`; `git merge-base --is-ancestor origin/main HEAD` therefore fails and a normal fast-forward push is unavailable.
- Evidence: `BPDC-SYNC-001-REMOTE-ANCESTRY-BLOCKED`; `git rev-list --left-right --count origin/main...HEAD` reported `1 5` and no merge base.
- Confidence: `VERIFIED`
- Scope: repository synchronization and history safety.
- Supersedes: `NONE`

## BPDC-L016

- Date: 2026-08-23
- Fact: Independently initialized Git roots can be preserved safely with one explicit `--allow-unrelated-histories` merge when the remote contains only bootstrap material and the merge is inspected before commit.
- Evidence: `BPDC-SYNC-002-RECONCILIATION-PUBLISHED`; merge commit `34aef6f...` has both roots as parents, application delta was empty, and normal push verified local/GitHub equality.
- Confidence: `VERIFIED`
- Scope: BPDC repository durability and Authority synchronization.
- Supersedes: `NONE`

## BPDC-L017

- Date: 2026-08-23
- Fact: A single bounded 24-hour `attentionByHour` aggregate is sufficient to demonstrate contextual routine formation without adding a general learning engine or new desktop sensing. Saturating reinforcement at `0.08 × intensity × remaining capacity`, a seven-day half-life, and utility weight `0.25` produced measurable target-hour influence while preserving fatigue-driven SLEEP selection.
- Evidence: `BPDC-E023`; P4 experiment suite.
- Confidence: `VERIFIED` for deterministic target tests; live host integration remains `UNKNOWN`.
- Scope: BPDC-P4-001 minimal time-of-day habit.
- Supersedes: `NONE`

## BPDC-L018

- Date: 2026-08-24
- Fact: The smallest useful presence integration is a transient adapter-side state machine. OpenPets' bounded idle and screen-lock transitions can drive the existing `userPresent` and `userIdleDuration` fields without adding a CreatureCore subsystem, persistence fields, or privacy-sensitive observation. A conservative internal `UNKNOWN` startup state avoids pretending to know session presence before the first curated event.
- Evidence: `BPDC-E026`; `BPDC-P5-001` transition, utility, drive-evolution, adapter, boundary, and privacy checks.
- Confidence: `VERIFIED` for deterministic integration behavior and current pinned event vocabulary; live desktop operation remains unobserved and is not required for acceptance.
- Scope: Phase 5 minimal user presence awareness.
- Supersedes: `NONE`

## BPDC-L019

- Date: 2026-08-24
- Fact: BPDC can preserve continuity without an offline-specific AI by storing a real integration-boundary checkpoint and running the same deterministic CreatureCore advancement with intent collection disabled. A separate current-intent accessor prevents historical desktop actions from replaying after restart.
- Evidence: `BPDC-E027`; quiet/normal equivalence, six-hour absence, midnight, idempotence, legacy migration, and 30-day performance experiments.
- Confidence: `VERIFIED` for deterministic integration behavior and current schema-3 snapshots; live desktop elapsed-time observation remains `UNKNOWN`.
- Scope: Phase 6 elapsed-time reconciliation.
- Supersedes: `NONE`

## BPDC-L020

- Date: 2026-08-24
- Fact: Immediate contact expression can remain outside autonomous behavior state when it is represented as a separate transient intent selected from existing relationship/personality/current-behavior state. A generation-guarded adapter timer can supersede rapid expressions and restore the unchanged current behavior without adding a response to persistence or offline reconciliation.
- Evidence: `BPDC-E028`; P7 response state, preservation, learning, adapter, sleep, rapid-click, offline, and regression checks.
- Confidence: `VERIFIED` for deterministic core/adapter behavior and current pinned reaction mappings; live physical-click expression remains `UNKNOWN`.
- Scope: BPDC-P7-001 immediate touch response.
- Supersedes: `NONE`
## BPDC-P8-001 spatial habitat learning

- A single abstract site is sufficient for the first spatial-familiarity cue; a portable screen grid is unnecessary and would violate the host geometry boundary.
- Keep raw coordinates in the OpenPets integration envelope. CreatureCore should persist only normalized `restSiteAffinity` and never screen, monitor, pixel, bounds, or position data.
- A first placement should establish a candidate without learning. Nearby repeated placements can reinforce with smoothing and proximity strength; a bounded repeated-new-area streak can relocate the single site without maintaining a site list.
- SLEEP targeting must be a body-side consequence of an already-selected SLEEP intent. Spatial familiarity must not affect SLEEP utility or consume autonomous-selection randomness.
- Display changes are safest when they invalidate the host coordinate and reset the scalar preference; preserving stale geometry creates an unsafe targeting path.

## BPDC-P11-001 juvenile socialization

- Keep developmental history separate from current bond: bond describes the present relationship, while `socializationImprint` is a one-way juvenile consequence.
- Deriving plasticity from the accepted maturity projection avoids an arbitrary day boundary; adult contact can continue normal relationship learning without changing the imprint.
- A single `0.03` saturating scalar is measurable after repeated contact without allowing a few clicks to dominate; a `0.12` utility cap remains subordinate to fatigue and core social pressure.
- Existing mature creatures must migrate with zero imprint. Inferring juvenile care from current bond, interaction history, habits, preference, or age would fabricate history.

## BPDC-L022

- Date: 2026-08-26
- Fact: Accepted Phase 11 work can be published safely as a two-commit fast-forward when the fetched remote is an ancestor, the delta contains only the accepted product/Authority records, validation remains green, and the permission set is unchanged.
- Evidence: `BPDC-E037`; `BPDC-SYNC-008`.
- Confidence: `VERIFIED` for this publication.
- Scope: BPDC repository durability after Phase 11.
- Supersedes: `NONE`

## BPDC-L023

- Date: 2026-08-26
- Fact: A one-shot return projection is enough to make curated presence causally visible without adding loneliness or persistent absence memory. Presence must capture the completed IDLE/LOCKED interval before resetting to ACTIVE, while direct interaction consumes that transition without scheduling a second reunion expression.
- Evidence: `BPDC-E038`; P12 presence, duration, state, sleep, startup, deduplication, P7 arbitration, and P5 regression experiments.
- Confidence: `VERIFIED` for deterministic core/integration behavior and bounded expression arbitration; live desktop reunion remains `UNKNOWN`/not claimed.
- Scope: BPDC-P12-001 reunion response.
- Supersedes: `NONE`

## BPDC-L024 — host-native cursor following

- Date: 2026-08-26
- Fact: A desktop-native autonomous action can remain host-neutral when the core selects only a semantic action and reuses an existing bounded active-presence signal; cursor coordinates and movement execution stay entirely in the adapter.
- Evidence: `BPDC-E039`; P13 active/absent eligibility, state directionality, non-domination, transition cleanup, transient restoration, offline, persistence, REST_SITE, shutdown, and deterministic generated-bundle experiments.
- Confidence: `VERIFIED` for deterministic core/adapter behavior, regression, and generated-artifact correspondence; live desktop following remains `UNKNOWN`/not claimed.
- Scope: BPDC-P13-001 `FOLLOW_CURSOR`.
- Supersedes: `NONE`
