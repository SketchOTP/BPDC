---
name: authority
description: Mandatory Authority 3.0 workflow for BPDC investigations, implementation, validation, and Architect handoffs.
---

# Authority 3.0 Codex Workflow

Codex is the live-codebase and technical-evidence authority. The ChatGPT Architect owns strategic direction, project-plan progression, and milestone acceptance.

## SYNC

1. Confirm the repository root and nested instructions.
2. Read `.agent/INDEX.md`, then `PROJECT_GOAL.md`, `PROJECT_PROFILE.md`, and `CURRENT.md`.
3. Resolve the active directive and load relevant directives, outcomes, learnings, records, repo-map entries, external discoveries, evidence, and task packets.
4. Review relevant Notion and GitHub state when available.
5. Inspect Git status and the live working tree; preserve unfamiliar work.

## FRAME and INVESTIGATE

State objective, goal relationship, scope, exclusions, acceptance, validation, discovery requirement, and stop conditions. Locate implementation, callers, interfaces, tests, dependencies, and integration boundaries before shared-behavior changes. Report retrieval confidence as `ADEQUATE`, `UNCERTAIN`, or `INSUFFICIENT`; insufficient retrieval blocks substantial edits.

## DISCOVER and EXECUTE

Use `../external-discovery/SKILL.md` before substantial new capability, subsystem, framework, algorithm, infrastructure, difficult custom mechanism, rewrite, repeated failure, new domain, or novelty claim. Evaluate candidates as `ADOPT`, `WRAP`, `EXTEND`, `FORK`, `COMPOSE`, `REFERENCE`, `BENCHMARK`, `BUILD`, or `REJECT`.

Make the smallest authorized change, prefer existing correct capability, preserve qualified work, and do not silently change strategic direction.

## VERIFY and RECORD

Report each check as `PASSED`, `FAILED`, `NOT RUN`, `NOT APPLICABLE`, or `BLOCKED`. Use `.agent/EVIDENCE.md`; never promote evidence implicitly. Update `CURRENT.md` after meaningful work and append outcomes, learnings, decisions, evidence, repo-map, or external entries only when warranted.

## ESCALATE

Return to the Architect when a material assumption is false, acceptance is impossible as written, scope must materially expand, qualified work would be replaced, a discovery changes strategic direction, or a security/data-integrity issue changes the decision boundary.

## HANDOFF

Return the exact structure in `references/result-contract.md`. Never claim code, tests, commits, runtime behavior, or external integration that was not directly established.
