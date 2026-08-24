# BPDC-P5-001 — Minimal User Presence Awareness

## Status

`COMPLETE_FOR_ARCHITECT_REVIEW`

## Objective

Translate OpenPets' bounded `idle:enter`, `idle:exit`, `screen:locked`, and `screen:unlocked` events through the adapter into the existing host-neutral `EnvironmentSnapshot`, replacing the live plugin's hard-coded user absence without adding a new behavioral subsystem.

## Implementation

- Added an integration-side `PresenceTracker` with injectable clock and transient `UNKNOWN`, `ACTIVE`, `IDLE`, and `LOCKED` state.
- Chosen startup rule: internal `UNKNOWN` maps conservatively to `userPresent=false` and `userIdleDuration=0` until a curated signal arrives.
- Idle duration starts from host-reported `idleSeconds` and increases from elapsed integration time.
- Idle exit, screen unlock, and direct pet interaction return to active presence; screen lock maps to absence while preserving an existing idle duration.
- Presence is not persisted and OpenPets event names remain outside CreatureCore.

## Validation

- `node --test`: 22/22 PASS.
- `node src/cli/experiments.js`: PASS, including P4 and new presence experiments.
- OpenPets adapter event harness: PASS.
- OpenPets manifest validation: PASS.
- Local-staged plugin build: PASS, 38,483 bytes.
- CreatureCore dependency/time scan: PASS.
- Privacy-sensitive API scan: PASS.
- `git diff --check`: PASS with line-ending warnings only.

## Evidence boundary

`BPDC-E026` is `E4_REGRESSION_PROTECTED`. No live desktop evidence is claimed; the directive explicitly states it is not required for acceptance. No Phase 6 work is authorized.
