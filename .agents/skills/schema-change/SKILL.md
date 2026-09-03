---
name: schema-change
description: Design, implement, migrate, and review database schema changes, Prisma models, migrations, relationships, indexes, constraints, seed data, and backward compatibility. Use when Codex is adding or changing persisted data shapes or API/frontend contracts tied to schema fields.
---

# Schema Change

## Design checks

- Confirm persistence or a schema change is necessary and matches real query and lifecycle needs.
- Use clear names, explicit ownership, intentional nullability/defaults, and appropriate normalization.
- Define foreign keys, cardinality, uniqueness, delete behavior, and consistency boundaries.
- Choose enums only for stable values; avoid opaque JSON for structured relational data.
- Design indexes from actual reads, filters, sorts, joins, and uniqueness requirements.
- Preserve room for known variation without making the model prematurely generic.

Challenge both rigid and over-general designs. Compare alternatives when they materially affect correctness, query complexity, migration safety, or maintenance.

## Migration safety

Assess production data volume and quality, locks and deployment duration, backfills, defaults, nullable-to-required transitions, renames, destructive changes, enum changes, large-table indexes, rollback/recovery, and mixed-version application compatibility.

For risky changes, use an expand-and-contract sequence where applicable:

1. Add the compatible nullable field, table, or parallel shape.
2. Deploy compatible reads/writes; dual-write only when required and define reconciliation.
3. Backfill in bounded, observable batches.
4. Verify data and application reads.
5. Enforce required constraints after compatibility is proven.
6. Remove the old shape in a later release with a recovery plan.

Do not approve destructive migrations without an explicit backup, backfill, or recovery strategy.

## Prisma checks

Verify model and relation names, optionality, `onDelete`, `@unique`, `@@unique`, `@@index`, enum stability, generated-client impact, and resulting `select`/`include` query cost. Prefer explicit relations and indexes over accidental behavior.

## Application impact

Trace changes through DTO and request validation, API contracts, authorization, frontend types and defaults, filters/sorts/pagination, integrations, seed/dev data, audit/logging, generated artifacts, and tests. Do not review the schema in isolation.

## Reviews

Lead with data-loss, production-safety, integrity, and compatibility findings. Then cover model quality, query/index implications, and application impact. Provide a staged migration plan when risk warrants it. Label severity only when useful:

- **Critical:** data loss, unsafe deployment, broken production behavior, or security impact.
- **Major:** integrity, relationship, compatibility, or likely scale problem.
- **Minor:** localized naming or maintainability concern.
- **Suggestion:** optional improvement.
