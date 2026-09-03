---
name: documentation
description: Write, update, restructure, and review technical documentation for clarity, onboarding, setup reproducibility, operational usefulness, API references, architecture notes, and engineering communication quality.
---

# Documentation

## Priorities

- Write for the reader's task and likely familiarity with the system.
- Keep instructions accurate, concise, scannable, and reproducible.
- State prerequisites, assumptions, commands, expected outcomes, failure recovery, and operational risks.
- Organize content from common paths to advanced or exceptional cases.
- Explain acronyms and necessary domain terms; remove jargon and detail that do not help the task.
- Use realistic examples where they resolve ambiguity.
- Verify documentation against the implementation and update stale context instead of preserving drift.

## Matching the doc to its job

Identify which kind of document is needed before writing, since each has a different job:

- **README** — orientation and getting-started; keep it short and link out rather than absorbing everything.
- **Runbook / operational doc** — task-oriented for on-call or ops use; lead with the steps, not the background.
- **API reference** — generated or kept in sync with the implementation (OpenAPI/Swagger) where possible, rather than hand-maintained prose that drifts.
- **Architecture note / ADR** — records a decision and its context for future readers, not a how-to.

Don't default to prose narrative when a table, numbered procedure, or diagram communicates faster — use a diagram for anything with real spatial or flow structure (request flow, system boundaries, state machines).

## Keeping docs live

Prefer docs-as-code (versioned alongside the code, reviewed in the same PR) over documentation that lives separately from what it describes, so drift shows up as a diff instead of silently accumulating.

## Reviews

Assess correctness and missing information before prose style. Identify ambiguous steps, hidden assumptions, onboarding or operational risks, and maintenance concerns. Recommend concrete edits and provide rewritten examples only where they materially improve clarity.
