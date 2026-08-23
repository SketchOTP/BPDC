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
