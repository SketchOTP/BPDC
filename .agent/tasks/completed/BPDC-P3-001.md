# BPDC-P3-001 — Minimal Relationship Memory

## Status

`CONTINUE_PENDING_LIVE_GATE`

## Entry state

Architect accepted `BPDC-P2-002` on 2026-08-23. Phase 2 is closed at `E5_OPERATIONALLY_OBSERVED`; local commit `393c619` records the evidence closure. No Phase 3 implementation has started.

## Objective

Implement the smallest persistent relationship-memory system capable of making past user interaction measurably alter the creature's future autonomous behavior:

```text
user interaction → bounded memory → persistent bond → utility-score change → different future behavior
```

## Authorized scope

- One normalized persistent `bond: 0.0 .. 1.0` scalar.
- Small bounded structured interaction history with deterministic ordering and serialization.
- Host-neutral `InteractionEvent`; CreatureCore must not know OpenPets, Electron, Windows, DOM, or mouse concepts.
- At least one real supported positive OpenPets interaction through `DesktopAdapter`.
- Headless negative-history support if the host has no natural rejection gesture.
- Deterministic decay/forgetting and saturating learning.
- Existing `SEEK_ATTENTION` and `AVOID` utility integration with explicit relationship diagnostics.
- Save/reload continuity, causal experiments, live interaction evidence, and live restart evidence.

## Exclusions and stop conditions

No generic memory, semantic text, embeddings, vector database, LLM memory, habits, location/app/time routines, environmental learning, mood, hunger, feeding, health, inventory, evolution, development, battles, new autonomous behaviors, final artwork, OpenPets fork, or Phase 4.

Stop and return to the Architect if one scalar is insufficient, a general memory architecture becomes necessary, host concepts leak inward, deterministic continuation breaks, negative support requires harmful UX invention, or scope begins expanding into habits/environment/general memory.

## Required experiments

- A: identical creatures with positive, neutral, and negative histories produce measurable differences in SEEK_ATTENTION/AVOID distributions.
- B: interaction → save → reload → continue matches uninterrupted deterministic continuation.
- C: recent-event influence decays predictably while long-term bond changes slowly.
- D: repeated identical interaction saturates rather than driving bond from minimum to maximum immediately.
- E: real OpenPets interaction reaches CreatureCore, persists across restart, and a controlled later decision exposes the relationship contribution without manually editing bond.

## Required validation

`node --test`; existing deterministic experiments; relationship causality, persistence, forgetting, and saturation experiments; live OpenPets interaction and restart path; dependency-boundary scan; `git diff --check`.

## Required handoff

Return `CODEX RESULT — BPDC-P3-001` using the Authority result contract, including the relationship model, interaction schema/boundary, utility integration, decay/saturation, all experiments, live evidence, regression status, evidence classification, records/Notion state, and confirmation that work stopped before Phase 4.

## Architect closure note

Implementation and deterministic evidence are retained. The remaining live evidence was continued under `BPDC-P3-002` and then resumed by `BPDC-P3-003` after the execution-environment block.
