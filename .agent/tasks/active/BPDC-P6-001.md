# BPDC-P6-001 — Elapsed-Time Reconciliation

## Status

`COMPLETE_FOR_ARCHITECT_REVIEW`

## Objective

Make the creature's internal life continue across ordinary host shutdown and restart using a persisted real-time checkpoint and the existing deterministic CreatureCore simulation.

## Implementation

- Added a version-1 integration-owned persistence envelope with `savedAtEpochMs` and the existing serialized schema-3 snapshot.
- Added safe legacy raw-snapshot migration with zero invented catch-up.
- Added non-negative elapsed-time reconciliation with backward-clock diagnostics.
- Added offline absent-environment reconciliation with changing local time and growing unavailable duration.
- Added quiet advancement through the same core mechanics and a current-intent accessor so historical behaviors are not replayed visually.
- Plugin persists immediately after reconciliation and expresses only the current resume behavior.

## Validation

- `node --test`: 31/31 PASS.
- `node src/cli/experiments.js`: BPDC-P6-001 PASS, including all A-I experiments.
- OpenPets persistence harness: PASS.
- OpenPets manifest validation: PASS.
- Local-staged plugin build: PASS, 43,351 bytes.
- CreatureCore wall-clock boundary scan: PASS.
- Privacy scan: PASS.
- `git diff --check`: pending final commit.

## Evidence boundary

`BPDC-E027` is `E4_REGRESSION_PROTECTED`. Live Windows/Electron elapsed-time observation remains `UNKNOWN` and is not claimed. No later phase is authorized.
