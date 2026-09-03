---
name: code-quality
description: Guide implementation, refactoring, and review for readable, maintainable code. Use when writing or changing code, shaping architecture within a feature, balancing DRY, naming things, handling errors, preserving existing patterns, or reviewing code quality.
---

# Code Quality

## Priorities

- Make intent, business rules, names, and control flow easy to understand.
- Follow project conventions and preserve behavior and implementation intent.
- Keep functions, components, and modules cohesive with clear boundaries.
- Balance duplication against abstraction; abstract only when it makes change safer or clearer.
- Preserve type safety, validation, error handling, and edge-case behavior.
- Prefer targeted, root-cause fixes over clever code, broad rewrites, or stacked patches.
- Update useful comments and documentation when behavior changes; do not discard context casually.

## Testability

Write code so behavior can be tested without excessive mocking — favor pure functions, explicit dependencies, and clear seams between business logic and I/O. New or changed logic should come with tests covering the primary path and meaningful edge cases, following the project's existing test conventions and coverage expectations. Flag logic that's hard to test as a design smell, not just a testing gap.

## Working behavior

Evaluate alternatives when the first implementation is complex, fragile, or inconsistent. Challenge assumptions with evidence and explain material tradeoffs. Avoid excessive helpers, generic utility layers, and abstractions that hide intent.

## Reviews

Lead with actionable findings ordered by impact; include file or code locations and explain the consequence and suggested correction. Use severity labels only when they improve prioritization:

- **Critical:** likely broken behavior, security exposure, or data loss.
- **Major:** significant maintainability, performance, or architecture risk.
- **Minor:** localized readability, naming, or consistency issue.
- **Suggestion:** optional improvement.

After findings, summarize strengths or refactor examples only when useful. Do not manufacture findings to fill a template.
