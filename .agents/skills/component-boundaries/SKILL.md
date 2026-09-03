---
name: component-boundaries
description: Design, implement, refactor, and review frontend component boundaries, responsibility separation, maintainability, state ownership, hooks, and UI composition. Use when Codex is building or changing React components, frontend feature structure, or component APIs.
---

# Component Boundaries

## Core checks

- Give each component a cohesive responsibility and an explicit prop contract.
- Keep state at the lowest owner that coordinates all consumers; preserve predictable data flow.
- Separate presentation from business logic when that boundary improves testing or reuse.
- Extract hooks for cohesive stateful behavior, not merely to reduce line count.
- Encapsulate features while following the project's established composition patterns.
- Split components only when it improves clarity, ownership, testing, or demonstrated reuse.

Avoid all-purpose components, scattered business logic, deep prop drilling, excessive wrappers, and fragmentation into trivial components.

## Review output

Describe current responsibilities and what works before identifying boundary, ownership, or state-flow problems. Recommend the smallest useful decomposition and include a refactor example only when it makes the boundary concrete.
