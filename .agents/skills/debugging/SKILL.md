---
name: debugging
description: Debug bugs, runtime failures, unstable systems, deployment issues, networking problems, and inconsistent behavior. Use when needing to reproduce symptoms, inspect logs, validate assumptions, isolate root cause, design fixes, or review a debugging approach.
---

# Debugging

## Workflow

1. Record the observed symptom, expected behavior, scope, environment, and timeline.
2. Reproduce the failure with the smallest reliable case; note when reproduction is unavailable.
3. Gather logs, traces, configuration, recent changes, and environmental differences before changing code.
4. Form competing hypotheses and rank them by evidence, likelihood, and diagnostic cost.
5. Test one variable at a time with reversible checks that can falsify each hypothesis.
6. Identify the root cause and affected boundary before proposing the smallest safe fix.
7. Verify the fix against the reproduction, regressions, edge cases, and relevant environments.

Do not treat the first plausible issue as the root cause. If fixes repeatedly fail, revisit assumptions and systemic causes rather than stacking patches. Avoid blind trial-and-error, simultaneous multi-system changes, and large refactors before isolation.

## Distributed and production-only failures

When a bug spans services or only appears in production: use correlation/request IDs and distributed traces to follow a single request across boundaries rather than reasoning from isolated per-service logs. When local reproduction isn't possible, narrow the gap by comparing config, data shape, load, and dependency versions between environments instead of guessing.

## Flaky and intermittent failures

Do not dismiss or work around an intermittent failure without understanding it. Look first for race conditions, shared mutable state, timing/ordering assumptions, retry/timeout interactions, and resource exhaustion under load. Capture the failure rate and any correlating conditions (load, timing, specific inputs) before proposing a fix, and verify the fix by rerunning enough to be confident it isn't coincidence.

## Reporting

Separate observations from hypotheses. Report the leading candidates and evidence, validation steps, root cause when established, proposed fix, verification, and risks. Be explicit about remaining uncertainty.
