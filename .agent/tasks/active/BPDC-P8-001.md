# BPDC-P8-001 — Spatial Habitat Familiarity

## Status

`IMPLEMENTED_PENDING_ARCHITECT_ACCEPTANCE`

## Objective

Implement one persistent abstract `REST_SITE` preference learned from repeated user placement. Keep raw desktop geometry in the OpenPets integration only; after SLEEP is normally selected, optionally move the pet to the learned site.

## Implemented boundary

- CreatureCore schema 4 persists only `restSiteAffinity` and `lastUpdatedAt`.
- `RestSiteTracker` owns one candidate coordinate and a bounded relocation streak.
- `pet:dragEnd` reads current host position and sends a host-neutral placement observation.
- First placement establishes a site without learning; nearby placements reinforce; scattered placement does not; three repeated placements in a new area relocate the site.
- Affinity learning is saturating at rate `0.12 * strength`, decays with a 14-day half-life, and targets `REST_SITE` at `0.6`.
- Integration envelope version 2 stores tracker state; version-1/raw migrations preserve prior state without invented spatial learning.
- `display:changed` invalidates geometry and resets the preference.
- Already-selected SLEEP may carry `habitatTarget: REST_SITE`; adapter resolves it through `moveTo` before the existing waiting reaction and falls back safely.

## Validation

- `node --test`: 45/45 PASS.
- `node src/cli/experiments.js`: `BPDC-P8-001` PASS.
- Local-staged plugin build: PASS, 59,600 bytes.
- OpenPets manifest validation: PASS.
- Boundary/privacy/secret scans: zero findings.
- `git diff --check`: PASS.
- Live Windows/Electron P8 drag/return observation: `UNKNOWN` / not claimed.

## Stop boundary

Do not add multiple sites, a screen grid, pathfinding, navigation, new behaviors/drives/utility weights, privacy-sensitive sensing, OpenPets core changes, or Phase 9 work.
