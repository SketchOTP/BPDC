# BPDC CreatureCore and OpenPets embodiment

This repository contains the framework-independent behavioral kernel for the Believably Persistent Desktop Creature plus a thin OpenPets embodiment plugin. CreatureCore remains free of Electron, OpenPets, WPF, Windows, cursor, window, network, and LLM dependencies.

## Drive semantics

All four normalized drives are pressure values in the range `0..1`:

- `energy`: fatigue pressure; `0` is energetic and `1` is exhausted.
- `social`: desire for social contact; `0` is satisfied and `1` is urgent.
- `curiosity`: desire to inspect novelty; `0` is satisfied and `1` is urgent.
- `stimulation`: desire for activity; `0` is satisfied and `1` is urgent.

This keeps the scoring direction consistent: larger values represent stronger internal pressure.

## Commands

```text
npm test
npm run simulate -- --seed 1234 --hours 24
npm run build:openpets
```

The simulator emits JSON containing behavior selections, durations, machine-readable score breakdowns, final drives, personality, and persistence state.

## Desktop embodiment

The adapter translates decisions; it does not select behavior:

```text
CreatureCore -> BehaviorIntent -> DesktopAdapter -> OpenPets SDK -> visible pet
```

`integrations/openpets/plugin/index.src.js` owns the plugin lifecycle, BPDC snapshot persistence, and provenance logs. `integrations/openpets/openpets-adapter.js` maps intents to OpenPets movement/reaction calls. The original temporary body is in `assets/bpdc-test-pet/`.

Build the single-file plugin bundle with `node scripts/build-openpets-plugin.mjs`. The generated `integrations/openpets/plugin/index.js` is the runtime entry accepted by OpenPets; the build mirrors the core and adapter into the plugin directory so the source artifact is inspectable while the entry remains self-contained.

For this UNC workspace, run the bundle build from a local staging directory and copy the generated entry back. Native `esbuild` child-process startup is environment-sensitive on the UNC path; this is a workspace limitation, not an OpenPets dependency.

The plugin stores its versioned CreatureCore snapshot under `bpdc.creature.snapshot` in OpenPets plugin storage and logs `CORE`, `ADAPT`, `HOST`, and `STATUS` records. OpenPets host gravity is explicitly disabled. The pinned host's tick is used as timing only; no host behavior selector was found or used.

## Elapsed-time reconciliation

The integration stores a version-2 persistence envelope containing the serialized CreatureCore snapshot, `savedAtEpochMs`, and the integration-owned REST_SITE tracker state. On restart, elapsed wall time is calculated outside CreatureCore and reconciled through the same deterministic simulation path with `userPresent=false`, zero interaction pressure, and changing local time. Historical intents are suppressed; only the current resume behavior is expressed. Legacy raw schema-3 values and version-1 envelopes receive zero invented catch-up and are migrated on the next save. Backward clock movement also receives zero catch-up and a diagnostic. CreatureCore remains free of wall-clock APIs.

## Presence boundary

The plugin translates only OpenPets' curated `idle:enter`, `idle:exit`, `screen:locked`, and `screen:unlocked` events into a transient `PresenceTracker`. The tracker exposes `ACTIVE`, `IDLE`, and `LOCKED` semantics through the existing host-neutral `userPresent` and `userIdleDuration` environment fields; direct pet interaction also establishes active presence. Startup is conservatively `UNKNOWN`, which maps to absent/zero-duration until an explicit signal arrives. Presence is not persisted and no keystrokes, clipboard contents, screen pixels, window titles, application names, or document contents are collected.

## Transient contact expression

After a normalized `POSITIVE_CONTACT` is learned, CreatureCore returns a separate, non-persistent `InteractionResponseIntent`. It uses only existing bond, sociability, independence, and current-behavior state to choose one of `ENJOY_CONTACT`, `ACKNOWLEDGE_CONTACT`, or `WITHDRAW_CONTACT`. The response does not call the autonomous selector, consume RNG, replace behavior timing, or advance simulation time. The OpenPets adapter maps the response to an existing placeholder reaction, coalesces rapid responses to one restoration timer, and restores the still-current autonomous behavior afterward. Offline elapsed-time reconciliation never fabricates a contact response.

## Spatial habitat preference

Phase 8 adds exactly one persistent spatial preference: `restSiteAffinity`, a bounded, saturating, slowly decaying scalar in CreatureCore. The core stores no coordinates. The OpenPets integration owns one normalized candidate coordinate and a bounded relocation streak. Only repeated user placement from `pet:dragEnd` reinforces the preference; random wandering does not. Nearby placements are smoothed within a fixed radius, scattered placements do not reinforce, and three repeated placements in a new area relocate the candidate. `display:changed` invalidates the stored host geometry and resets the affinity so stale coordinates cannot be used.

When `SLEEP` has already won normally, the plugin may decorate that intent with `habitatTarget: REST_SITE` after the affinity threshold is reached and the integration can resolve a current coordinate. The adapter then calls OpenPets `moveTo(...)` before the existing SLEEP reaction. Missing geometry falls back to ordinary SLEEP, and the SLEEP utility score is unchanged.

## User-shaped play preference

Phase 9 adds exactly one learned activity preference: `playPreference`. It is a bounded, saturating scalar stored in CreatureCore and learned only when positive contact occurs while the committed autonomous behavior is `PLAY`. Positive contact during other behaviors preserves its existing relationship and time-habit effects but does not reinforce play. Autonomous PLAY without contact never self-reinforces the preference.

The preference uses a `0.06` saturating learning rate, a deterministic 21-day half-life, and a maximum `0.3` `PLAY.learnedPreference` utility contribution. The contributor appears in normal score diagnostics and remains subordinate to stronger competing drives such as fatigue. Innate `personality.playfulness` is never mutated, and no general reinforcement or preference map is introduced.

CreatureCore snapshots now use schema 6. Schema 5 and earlier snapshots migrate with `playPreference = 0` where needed and `socializationImprint = 0`, preserving accepted relationship, time-habit, elapsed-life, contact-response, spatial, and play-preference state. P6 offline reconciliation may decay the play preference but cannot reinforce it; it never fabricates socialization imprint. P7 contact response and P8 REST_SITE targeting remain independent.

## Continuous physical maturation

Phase 10 derives a continuous physical maturity projection from the existing simulation-domain age:

```text
ageSeconds = max(0, simulationTimestamp - createdAt)
maturity = clamp(ageSeconds / 14 simulated days, 0, 1)
sizeFactor = 0.8 + 0.2 * maturity
```

The projection is not persisted and does not affect utility, personality, drives, relationships, habits, preferences, behavior timing, RNG, or interaction responses. Existing schema-5 snapshots migrate unchanged except for a zero-initialized Phase 11 imprint, and P6 elapsed-time reconciliation naturally advances maturity while the application is closed. The OpenPets adapter applies the bounded factor through `pet.setScale()` on startup and only when the quantized `0.01` value changes; this presentation path requires the single additional `pet:animate` permission. No levels, XP, alternate forms, evolution branches, or care-history development system are present in Phase 10.

## Juvenile socialization imprint

Phase 11 adds exactly one persistent developmental scalar: `socializationImprint`. Positive contact received while the creature is still maturing reinforces this scalar with continuous remaining plasticity:

```text
delta = 0.03 * interactionIntensity * (1 - maturity) * (1 - socializationImprint)
```

The imprint saturates in `0..1`, never decays, and stops changing at full maturity. It is distinct from current `bond` and immutable innate `personality.sociability`; low early interaction causes no penalty. At adulthood it contributes only `socializationImprint * maturity * 0.12` to `SEEK_ATTENTION.developmentalSocialization`, remaining subordinate to core drives and fatigue. Adult contact continues to update the already-accepted bond, time habit, play preference, and transient response systems but cannot change the imprint. Schema 5 and earlier snapshots migrate with zero imprint so no prior juvenile care history is invented. No negative imprint, XP, levels, evolution branches, additional developmental traits, or new OpenPets permissions are introduced.

## Midpoint reconsideration

Phase 14 gives each interruptible behavior one derived midpoint check at `startedAt + duration * 0.5`. CreatureCore re-scores the current situation without consuming RNG and switches only when the current action becomes ineligible or an eligible challenger exceeds it by the fixed `0.15` margin. `SLEEP` and `AVOID` remain non-interruptible; no checkpoint is persisted, no continuous replanning occurs, and offline reconciliation suppresses historical intents while preserving the same final core state. A switch emits the ordinary `BehaviorIntent` with `MIDPOINT_RECONSIDERATION` diagnostics, so the existing desktop adapter lifecycle and transient-expression restoration remain authoritative.

## Boundary

```text
CreatureCore -> BehaviorIntent -> DesktopAdapter -> OpenPets SDK -> visible pet
```

`CreatureCore` owns deterministic state and decisions. OpenPets owns only host translation, one coordinate tracker, and movement execution; raw desktop geometry never enters CreatureCore.
