---
name: architecture-design
description: Design, implement, refactor, and review system architecture, module boundaries, dependency direction, scalability, coupling, maintainability, and long-term engineering structure. Use for backend organization, frontend architecture, modularization, or cross-cutting feature changes.
---

# Architecture Design

## Priorities

- Define cohesive modules, explicit responsibilities, ownership, and dependency direction.
- Protect stable business logic from volatile frameworks and integrations.
- Optimize for maintainability, operational simplicity, testability, and current constraints.
- Design for present scale with reasonable growth in product, data, operations, and teams.
- Follow existing architecture unless its costs justify change.
- Prefer reversible, incremental improvements over speculative abstractions or rewrites.

## Decision process

1. Map the current structure, dependency flow, responsibility distribution, constraints, and important existing decisions.
2. Identify concrete pressure: unclear ownership, harmful coupling, scaling limits, operational risk, or rising maintenance cost.
3. Compare the smallest viable options, including leaving the design unchanged.
4. Evaluate code, data, deployment, failure, migration, team-ownership, and compatibility tradeoffs.
5. Recommend the simplest option whose benefit exceeds its implementation and migration cost.

Always ask whether the proposed architecture is simpler than the problem it solves. Avoid premature microservices, circular dependencies, broad shared utility layers, shared data without ownership, framework-driven complexity, and big-bang rewrites. Prefer modular monoliths, vertical slices, bounded contexts, and facades/contracts when they fit the evidence—not by default.

## Backend pattern toolkit

Name the pattern under consideration explicitly rather than describing structure only in the abstract. Common options and when they earn their cost:

- **Modular monolith / vertical slices** — default starting point; use unless a concrete pressure from step 2 argues otherwise.
- **Event-driven / message queue** — when work is naturally async, needs to survive downstream outages, or must fan out to multiple independent consumers.
- **CQRS** — when read and write load, shape, or scaling needs diverge significantly; adds real complexity, so require clear evidence.
- **Service-per-database / bounded-context data ownership** — when two teams or domains are contending over the same tables with conflicting change cadence.

Treat these as options to weigh against "no change," not defaults to reach for.

## Decision records

For architecturally significant changes, capture the decision, context, alternatives considered, and consequences — in the project's existing ADR location/format if one exists, otherwise as a short note alongside the change. This matters most when the choice is hard to reverse.

## Influences

Use these as lenses, not authorities:

- Martin Fowler: evolutionary design, incremental refactoring, and practical tradeoffs.
- Robert C. Martin: dependency direction, cohesion, boundary protection, and testability.
- Sam Newman: service boundaries, distributed-system costs, failure modes, and team ownership.
- Vaughn Vernon: bounded contexts, aggregates, ubiquitous language, and domain-oriented modules.
- Michael Nygard: resilience, stability, and operational readiness.

## Architecture reviews

Structure substantial reviews around:

1. Current architecture and strengths
2. Risks, boundary violations, and ownership/coupling issues
3. Scalability and operational implications
4. Prioritized improvements

For each recommendation, state the evidence, benefit, tradeoffs, complexity, and migration path. Omit empty sections and distinguish observed problems from future risks.
