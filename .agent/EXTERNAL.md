# External Discovery Ledger

No material prior-art investigation has been completed in this bootstrap. The next Phase 0 directive must evaluate the underlying desktop-pet foundation problem before implementation and record candidates, freshness, licensing, fit, disposition, and recheck triggers here.

## BPDC-EXT-000 — pending Phase 0 evaluation

- Date: 2026-08-22
- Problem being investigated: reusable desktop-pet runtime and believable-agent foundations.
- Trigger: new subsystem / major technical foundation decision.
- Internal vocabulary: desktop creature, CreatureCore, BehaviorIntent, DesktopAdapter.
- External vocabulary: desktop pet framework, transparent desktop overlay, virtual pet runtime, utility-based autonomous agent.
- Sources/classes searched: `NOT RUN`
- Freshness class: `UNKNOWN`
- Review-after/recheck trigger: start of Phase 0 evaluation.
- Candidates: OpenPets, VPet, PetzA — identified by the Notion directive; not yet evaluated in this record.
- Dispositions: `NOT YET DECIDED`
- Recommended implication: do not implement a custom shell before the bounded evaluation.
- Existing qualified work impact: `NONE`
- Rationale/evidence: BPDC Notion directive, Phase 0 assignment.
- Search limitations: evaluation not yet performed.

## BPDC-EXT-001 — Phase 0 foundation evaluation

- Date: 2026-08-22
- Problem: smallest legally clean desktop body/renderer for an independently testable persistent creature simulation.
- Freshness: current upstream heads checked 2026-08-22.
- Retrieval confidence: `ADEQUATE` for evaluated public sources; Electron runtime observation remains unrun.

### OpenPets

- Source: https://github.com/alvinunreal/openpets, MIT, head `a77d3747caab0337934959980c68f60e0d3c615c`.
- Evidence: `AGENTS.md`, architecture/desktop/pets/plugins/SDK/testing docs, SDK types/harness, plugin bridge/registry, motion engine, display module, and official virtual-pet plugin/tests.
- Verified fit: sandboxed plugin runtime; plugin-owned storage (5 MiB quota); schedules; curated interaction/display/power/idle/day-part events; direct pet-handle move/reaction/declared-sprite animation; position/bounds/animation state reads; host display containment and multiple-display path; no-Electron deterministic harness.
- Hidden tax: SDK/plugin coupling; raw monitor geometry and cursor coordinates are not exposed; animation completion is not a public signal; host tick pauses while hidden/dragged; movement and animation actions are rate-limited; schedules and state must be re-armed/reconciled by BPDC on plugin start; host-rendered UI prevents direct drawing.
- Disposition: `ADOPT` as BPDC's initial body/renderer via a thin adapter/plugin. No core fork justified by current proof. Recheck if a required BPDC behavior needs raw geometry, animation completion, or higher-frequency control.

### VPet

- Sources: https://github.com/LorisYounger/VPet, Apache-2.0 code, head `b6f7b00363529bafe3e7fc14bf51e17640941691`; https://github.com/LorisYounger/VPet.Plugin.Demo, Apache-2.0 demo repository, head `4a53d8b822f499b4399ae6983eccc9813aa8fa45`.
- Evidence: English README, Apache license, secondary-development documentation, `MainPlugin`, `IMainWindow`, `IController`, `GameCore`, `MainLogic`, `GameSave_VPet`, and Demo plugin sources.
- Verified fit: C#/.NET 8 WPF host; plugin lifecycle and host save callbacks; direct window movement via `IController.MoveWindows`; host animation/display calls; mouse/drag interaction; custom PNG/ABC animation pipeline; plugin examples with timers and persisted plugin data.
- Asset boundary: supplied default animations and built-in images carry separate VUP-Simulator authorization terms; custom BPDC assets can avoid those assets, but VPet plugin/demo assets require independent review.
- Hidden tax: Windows/WPF-only host; plugin receives host gameplay objects and host save format; built-in `MainLogic` periodically mutates health/needs/mood and selects random displays; headless testing and monitor geometry were not established; integration would likely require bypassing or forking host gameplay lifecycle.
- Disposition: `REFERENCE` / `FALLBACK`, not selected while OpenPets meets the required seam.

### Petz/PetzA

- Sources: https://github.com/thenickdude/PetzA, 0BSD, head `6c36688bcd1839e4f2a5fd4d91bcd187297c1abc`; https://github.com/thenickdude/petz-file-formats, head `cd1634b9e908078fb831ae833975d1219da30e36`; https://alumni.media.mit.edu/~benres/verbiage/Catz%20A%20User%20Perception%20Based%20Approach.htm.
- Verified scope: PetzA is an injected/version-specific Delphi add-on and repair/utility layer, with biorhythm sliders, target-location hooks, profiles, and access to Petz class instances; it is not a general host.
- Reusable concepts: `ADAPTABLE` biorhythm/drive parameters, target locations, profiles/identity, interaction-aware animation timing.
- Reference-only concepts: exact Petz executable hooks, private memory layouts, original assets, and runtime-specific binary patches.
- Behavioral paper mechanisms: `ADAPTABLE` constrained randomness, layered simultaneous animation, direct touch/drag interaction, object interest, and perception-first expression; `REFERENCE-ONLY` for design, not copied implementation.
- Disposition: `REFERENCE`; no Petz/PetzA runtime or copyrighted asset reuse.

## BPDC-EXT-002 — P2 pinned-host authority review

- Date: 2026-08-23
- Problem: confirm that the adopted OpenPets pin can remain a body/renderer while BPDC owns behavior, timing, and persistence.
- Source: OpenPets commit `a77d3747caab0337934959980c68f60e0d3c615c`, disposable checkout `C:\Users\sketc\AppData\Local\Temp\bpdc-p2-001-openpets`.
- Evidence: SDK v3 context, plugin pet registry, roaming controller, default pet controller, plugin loader, desktop documentation, CLI validator, harness, and live Windows/Electron log.
- Finding: the host tick provides timing and visibility; host behavior selection was not observed. Gravity is an explicit host feature and was disabled by the BPDC adapter. Plugin-declared source is snapshotted, so BPDC ships a self-contained generated entry.
- Disposition: `WRAP` / `ADOPT`; no fork or upstream modification.
- Recheck trigger: a required BPDC behavior needs raw geometry, animation completion, high-frequency control, or host capabilities outside the current SDK seam.
