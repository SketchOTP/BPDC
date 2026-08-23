# BPDC-P2-001 — Desktop Embodiment Gate

Status: ACTIVE_ENTRY_GATE  
Issued: 2026-08-22  
Architect: SketchOTP  
OpenPets pin: `a77d3747caab0337934959980c68f60e0d3c615c`

## Objective

Prove the accepted `CreatureCore` can control a real visible OpenPets desktop creature on Windows through a thin adapter while remaining independent of OpenPets:

`CreatureCore → BehaviorIntent → DesktopAdapter → OpenPets → visible behavior`

## Entry gate

- Phase 1 Architect acceptance received.
- Re-run `node --test` and `node src/cli/experiments.js` before integration edits.
- Create a local checkpoint commit containing the accepted Phase 1 implementation.
- Do not push.

## Required work

- Preserve zero OpenPets/Electron/Windows imports in `src/creature-core/`.
- Define the smallest host-neutral `DesktopAdapter` seam.
- Implement an OpenPets-specific adapter/plugin with no behavioral decisions.
- Use only original/generated placeholder assets.
- Map at least three distinct intents, prioritizing `WANDER`, `SLEEP`, and `SEEK_ATTENTION` (or `OBSERVE`).
- Log intent selection, utility, duration, translation, host command, and host result/state when available.
- Run the pinned OpenPets host in a real Windows/Electron runtime.
- Test autonomous operation, host-authority non-conflict, and BPDC snapshot persistence across restart.

## Stop conditions

Stop and return evidence if OpenPets remains a second behavioral authority, invasive host changes/fork are needed, the adapter leaks host concepts into CreatureCore, BPDC persistence cannot survive host restart, the host cannot run on Windows, three intentions cannot be expressed, or license concerns appear.

## Explicit exclusions

No memory, habits, relationship learning, hunger/feeding, inventory, cursor/window/application observation, multi-monitor behavior, evolution, growth, battles, LLM, speech, final art, large animation libraries, OpenPets fork, VPet fallback, or Phase 3 work.
