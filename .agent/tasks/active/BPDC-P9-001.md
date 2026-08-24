# BPDC-P9-001 — User-Shaped Activity Preference

## Status

`ACCEPTED_AND_PUBLISHED`

## Objective

Implement exactly one persistent `playPreference` learned from positive contact during committed autonomous `PLAY`, with a bounded `PLAY.learnedPreference` utility contributor.

## Boundary

- `personality.playfulness` remains immutable.
- No other behavior preference or generic reinforcement system.
- Positive contact outside PLAY preserves existing effects but does not reinforce play.
- Autonomous PLAY without contact does not reinforce play.
- P6 offline reconciliation may decay the preference but never reinforces it.
- P7 contact response and P8 REST_SITE behavior remain independent.
- No Phase 10 work.

## Proposed model

- Preference state: `playPreference: 0..1` with deterministic `lastUpdatedAt` metadata.
- Learning rate: `0.06`, saturating against remaining capacity.
- Decay: 21-day half-life.
- Utility: maximum `0.3` contributor named `PLAY.learnedPreference`.
- Snapshot: schema 5; schema 4 and earlier migrate with zero preference.

## Validation status

- Baseline entry: local and origin `1feeb4c`, clean.
- Current tests: 53/53 PASS.
- P9 CLI experiments: PASS.
- Local-staged plugin build: PASS, 63,376 bytes; direct UNC esbuild remains blocked by known `spawn EPERM`.
- OpenPets manifest validation: PASS.
- CreatureCore boundary scan: 0 findings.
- Privacy scan: 0 findings.
- Secret scan: 0 findings.
- Publication-safety scan: PASS.
- `git diff --check`: PASS.
- Implementation is complete for Architect review; no push performed.
- Local product commit: `f25010b0fd5a89776d8fb151c5fd5dc9e2d0b5b6` (`feat: learn user-shaped play preference`).

## Architect acceptance and publication

- Architect review: `BPDC-P9-001: ACCEPTED`; Phase 9 closed.
- Sync directive: `BPDC-SYNC-006` completed by normal non-force push.
- Published product commit: `f25010b0fd5a89776d8fb151c5fd5dc9e2d0b5b6`.
- Published Authority closure: `58acab9a85fefeb7b79d130b3ceb0e75d7aada89`.
- Final state: local `main == origin/main == 58acab9a85fefeb7b79d130b3ceb0e75d7aada89`; worktree clean.
- Live observation: not required and not claimed.
- Phase 10: not started and not authorized.
