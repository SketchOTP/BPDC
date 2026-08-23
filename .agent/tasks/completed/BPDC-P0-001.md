# CODEX DIRECTIVE — BPDC-P0-001

## DIRECTIVE

Evaluate the smallest legally clean, independently testable desktop foundation for a persistent BPDC creature simulation. Investigate OpenPets deeply first, evaluate VPet as fallback, use Petz/PetzA as behavioral references only, record exact upstream commits and licenses, create a disposable OpenPets proof, and do not begin Phase 1 implementation.

## STATUS

`PASS_WITH_CONCERNS`

Phase 0 evidence is complete for Architect review. The recommended foundation is an OpenPets adapter/plugin boundary. Phase 1 is not authorized or ready to start until the Architect accepts the decision and acknowledges the broad-suite concern.

## ENTRY STATE VERIFIED

- Authority 3.0 was installed locally and the BPDC Notion page recorded the active Architect directive.
- The BPDC workspace contained governance and project-control files but no application implementation.
- No Phase 1 source, commit, push, deployment, or external runtime mutation was performed.
- jCodemunch-MCP was unavailable in this environment; code navigation used the documented fallback of disposable checkout inspection and targeted source reads.

## UPSTREAM COMMITS AND LICENSES

| Candidate | Exact upstream commit | License observed | Disposition |
|---|---|---|---|
| OpenPets | `a77d3747caab0337934959980c68f60e0d3c615c` | MIT | Recommended adapter/plugin foundation |
| VPet | `b6f7b00363529bafe3e7fc14bf51e17640941691` | Apache-2.0 code; default animation assets have separate terms | Windows fallback/reference |
| PetzA | `6c36688bcd1839e4f2a5fd4d91bcd187297c1abc` | 0BSD-like license | Behavioral/reference only |
| petz-file-formats | `cd1634b9e908078fb831ae833975d1219da30e36` | Repository reference reviewed | Format/behavior reference only |

This is an engineering license-boundary review, not legal advice. BPDC must keep original assets and a tracked attribution/license ledger.

## OPENPETS INVESTIGATION

OpenPets is a TypeScript/Electron desktop host with sandboxed JavaScript plugins. The host owns transparent pet windows, rendering, motion, display containment, and lifecycle; plugins describe behavior through a controlled SDK.

The traced seam is sufficient for BPDC's initial independent brain boundary:

- `ctx.storage` provides plugin-owned persistent JSON key/value state with a documented 5 MiB quota.
- `ctx.schedule` provides once/every/daily/cron/at scheduling and re-arms around sleep.
- Curated events include click, drag, hover/drop, idle, lock/power, display, connectivity, and day-part changes.
- Pet handles expose movement, wandering, reactions, named or declared-sprite animation, state reads, and tick/lifecycle hooks.
- The host exposes display-safe placement and containment without exposing raw monitor geometry, cursor coordinates, keystrokes, screen contents, clipboard, or ambient filesystem watching.
- Quotas bound pet actions, schedules, and spawned pets.

### Disposable proof

The proof was created outside BPDC at `C:\Users\sketc\AppData\Local\Temp\bpdc-p0-001-proof\proof.mjs` and passed:

`BPDC_OPENPETS_PROOF=PASS movement=PASS reaction=PASS timer=PASS custom_state=PASS restore=PASS event=PASS headless=PASS`

OpenPets SDK build, SDK contract tests, official virtual-pet checks, and focused motion/display checks also passed. The broad desktop suite failed at a local-plugin pruning test: stale `old-sample` state remained where the test expected it to be removed. That concern is recorded and was not repaired upstream.

## VPET FALLBACK

VPet is a credible Windows/WPF desktop fallback with direct animation, interaction, plugins, and save data. It is less suitable as the primary BPDC foundation because the host couples gameplay, save state, and rendering more tightly; it is Windows-specific; it has no proven headless path in this evaluation; and default animation assets have separate usage terms. Its demo plugin's foreground-window observation is outside BPDC's privacy boundary and must not be reused.

VPet build and runtime were not run. It remains a static, credible fallback rather than a passed candidate.

## PETZ/PETZA REFERENCES

PetzA is a Delphi add-on that patches specific Petz executables. It is not a general desktop host and its hooks are version-specific. Petz/PetzA and the Catz behavioral material are reference-only.

Ideas worth carrying into BPDC design are drives/biorhythms, target location, identity/profiles, constrained randomness, layered animation/timing, and direct interaction. No PetzA runtime hook or asset is being adopted.

## FOUNDATION MATRIX

Weighted score, 0–5 per criterion:

| Candidate | Score | Decision |
|---|---:|---|
| OpenPets | 239 | Adopt as adapter/plugin host |
| Custom shell | 201 | Do not select; recreates solved desktop infrastructure |
| VPet | 166 | Retain as Windows fallback |

OpenPets wins because it combines a clean plugin-owned state seam, headless proofability, a solved desktop/window/display boundary, and an MIT code boundary. The broad-suite pruning failure is a release/maintenance concern, not a reason to begin a fork or bypass the adapter boundary.

## RECOMMENDED BPDC BOUNDARY

```text
CreatureCore -> BehaviorIntent -> DesktopAdapter
```

- `CreatureCore`: deterministic state, needs/drives, memory, personality, time progression, and policy. It must not import Electron, WPF, OpenPets, or desktop APIs.
- `BehaviorIntent`: serializable intents such as move, react, animate, wander, speak/announce later, inspect approved event, and persist state. It is the test seam between cognition and presentation.
- `DesktopAdapter`: OpenPets plugin implementation that translates intents to SDK calls, subscribes only to approved events, persists adapter-owned bookkeeping, and reports bounded observations back to the core.

## REQUIRED HOST MODIFICATIONS

No host modification is required for the first BPDC foundation. Phase 1 should begin as an adapter/plugin and use the public SDK. A host change may be proposed only if a concrete BPDC requirement cannot be expressed through the public seam and is separately tested against the upstream concern.

## RISKS AND LIMITATIONS

- Live Electron/Windows runtime was not run; operational desktop evidence is absent (`E5` not claimed).
- OpenPets broad desktop tests are not fully green because of the plugin-service pruning failure.
- OpenPets animation-completion signaling is limited; BPDC should model intent acknowledgement rather than depend on an unverified completion callback.
- VPet asset terms require an explicit boundary if fallback assets are ever used.
- Petz/PetzA material is historical/reference-only.
- jCodemunch-MCP was unavailable, so the repository-navigation requirement could not be met literally.

## EVIDENCE CLASSIFICATION

- `BPDC-E002`, `BPDC-E007`, `BPDC-E008`: `E1_OBSERVED` static source/reference findings.
- `BPDC-E003`, `BPDC-E004`, `BPDC-E005`: `E3_TARGET_TESTED` focused checks passed.
- `BPDC-E006`: `E2_REPRODUCED` broad-suite concern.
- No `E5_OPERATIONALLY_OBSERVED` evidence is claimed.

## FILES CHANGED

- `.agent/CURRENT.md`
- `.agent/DIRECTIVES.md`
- `.agent/EVIDENCE.md`
- `.agent/EXTERNAL.md`
- `.agent/LEARNINGS.md`
- `.agent/OUTCOMES.md`
- `.agent/RECORD.md`
- `.agent/tasks/completed/BPDC-P0-001.md`

No application implementation files were created or modified.

## COMMANDS AND TESTS RUN

- `git ls-remote` for exact upstream heads.
- `pnpm install --frozen-lockfile` in a disposable OpenPets checkout.
- OpenPets SDK build and contract tests: passed.
- OpenPets official virtual-pet checks: passed.
- OpenPets focused motion/display checks: passed.
- OpenPets broad desktop suite: failed at plugin-service stale-plugin pruning test.
- Disposable OpenPets BPDC proof: passed.
- VPet build/runtime: not run.
- Live OpenPets Electron/Windows runtime: not run.

## NOTION AND AUTHORITY STATE

Local Authority records now contain the Phase 0 evidence, external-source ledger, learning entries, outcome, and completed directive handoff. The Notion project page is being updated with the same bounded result and the Architect decision gate.

## PHASE 1 READINESS

`NOT READY` pending Architect acceptance. Do not implement `CreatureCore`, `BehaviorIntent`, or `DesktopAdapter` until the Architect accepts OpenPets as the foundation and records any required response to the plugin-service test concern.

## ARCHITECT DECISIONS REQUIRED

1. Accept or reject OpenPets as the primary BPDC desktop foundation.
2. Accept VPet as the documented fallback without importing its default assets or foreground-observation behavior.
3. Accept Petz/PetzA as behavioral reference-only material.
4. Decide whether the OpenPets broad-suite pruning failure requires upstream tracking before Phase 1.
5. Authorize Phase 1 implementation only after the above decisions are recorded.
