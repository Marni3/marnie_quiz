---
name: feature-planning
description: Plan features before and during implementation by clarifying requirements, challenging assumptions, identifying missing behavior, validating direction, and choosing an implementation path. Use for new features, workflow changes, schema changes, architectural modifications, or major refactors.
---

# Feature Planning

## Goal

Establish enough shared understanding to choose a sound implementation without turning planning into a gate. Investigate available project context first. Ask only when unresolved uncertainty would materially change behavior, scope, data, security, architecture, or user experience; otherwise state reasonable assumptions and proceed.

## Planning workflow

1. Define the problem, users, workflow, desired outcome, and measurable success.
2. Inspect existing behavior, conventions, constraints, affected systems, and ownership.
3. Identify missing requirements, edge and failure cases, compatibility needs, and operational expectations.
4. Test the proposed solution against simpler alternatives and the option of no change.
5. Compare viable directions by complexity, risk, reversibility, migration cost, and future maintenance.
6. Recommend the smallest incremental path that solves the current need and name its assumptions.

Consider, where relevant: API contracts, schema and data ownership, authorization and privacy, performance and scale, state management, UI states and accessibility, observability, rollout/rollback, tests, and integration impact.

## Acceptance criteria

Before implementation starts, state what "done" means in testable terms: the specific behaviors, inputs/outputs, and error cases that must hold. Use the project's existing format (tickets, specs) where one exists. Treat vague criteria ("works well", "handles errors") as a planning gap to resolve, not something to interpret later.

## Clarification behavior

Ask small, high-impact, implementation-relevant questions, grouped when useful. Do not overwhelm the user with theoretical or low-consequence questions. If a missing answer makes implementation risky, explain the decision it controls. Avoid speculative abstractions and commitments based only on hypothetical future requirements.

## Planning output

Adapt the depth to the change. Capture current understanding, material unknowns or assumptions, affected behavior, options and tradeoffs, risks, acceptance criteria, and a recommended next step. Omit sections that add no decision value.
