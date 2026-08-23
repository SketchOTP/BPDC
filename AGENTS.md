# Authority Repository Agent Router

This repository is governed by Authority 3.0. Codex is the live-codebase authority; the ChatGPT Architect controls strategic direction and milestone acceptance.

## Mandatory startup

Before substantial planning, editing, coding, or validation:

1. Confirm the repository root and any nested `AGENTS.md` files.
2. Read `.agents/skills/authority/SKILL.md`.
3. Read `.agent/INDEX.md`, then the mandatory kernel: `PROJECT_GOAL.md`, `PROJECT_PROFILE.md`, and `CURRENT.md`.
4. Resolve the active directive and load relevant history from `.agent/`.
5. Inspect Git and the working tree; preserve unfamiliar or uncommitted work.
6. Establish retrieval confidence (`ADEQUATE`, `UNCERTAIN`, or `INSUFFICIENT`) before shared-behavior changes.

Do not implement from a directive alone when repository evidence is available. Do not silently redefine the goal or roadmap.

## Engineering and safety

- Make the smallest authorized change and preserve qualified work.
- Read existing behavior, callers, interfaces, tests, and configuration before changing shared behavior.
- Use `.agents/skills/external-discovery/SKILL.md` before substantial new engineering or reinvention.
- Report checks as `PASSED`, `FAILED`, `NOT RUN`, `NOT APPLICABLE`, or `BLOCKED`.
- Use the evidence ladder in `.agent/EVIDENCE.md`; new tests alone are at most `E3_TARGET_TESTED`.
- Treat `.agent/` as project state. Historical ledgers are append-only; `CURRENT.md` is the mutable snapshot.
- Do not delete unknown source, discard dirty work, rewrite Git history, force-push, deploy, alter infrastructure, or expose secrets without exact authorization.

## Completion

Re-read acceptance criteria, inspect the final diff, confirm unrelated work was preserved, run required validation, update project records, and return the canonical result format from `.agents/skills/authority/references/result-contract.md`.
