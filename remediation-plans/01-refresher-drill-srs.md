# Implementation Plan 01: Spaced Repetition Refresher Drill & SRS Engine

**Target Issue**: Refresher buttons on `/analytics` and `/quizzes` silently bounce the student back to `/quizzes` instead of assembling and launching the 20-question spaced repetition drill.  
**Governing Standards**:  
* [Software Standards SKILL.md §6](file:///.agents/skills/software-standards/SKILL.md) (Defensive Payload Ingestion, Non-Silent Failure Escalation)  
* [Software Standards SKILL.md §3](file:///.agents/skills/software-standards/SKILL.md) (Guest Mode DB Fallbacks, Foreign Key Constraints)

---

## 1. Root-Cause Summary

1. **Silent Client Fallback**: [`platform/components/launch-drill-button.tsx`](file:///platform/components/launch-drill-button.tsx#L33-L38) catches API errors from `/api/srs/daily-drill` and silently calls `router.push('/quizzes')`.
2. **Zero Mock Store Fallback in Drill Engine**: [`platform/lib/srs.ts`](file:///platform/lib/srs.ts#L366-L472) (`assembleDailyRefresherDrill`) executes direct PostgreSQL queries via `db.select()` and `db.insert()`. If `DATABASE_URL` is offline or table constraints fail, the route crashes with HTTP 500.
3. **Foreign Key Violation on Guest User**: The engine attempts to write to `questionSets` with `uploadedByUserId: userId`. Guest users (`00000000-0000-0000-0000-000000000001`) fail foreign key validation against `users.id`.
4. **Flawed SQL Filter**: Line 381 computes `dueTopicCodes`, but never includes `dueTopicCodes` in any SQL `where` clause. It queries `questions.isAnchor = true` (which is `false` for 100% of seed questions), returning 0 questions.

---

## 2. Technical Solution & Changes

### A. Client-Side Error Escalation & Feedback
* **File**: [`platform/components/launch-drill-button.tsx`](file:///platform/components/launch-drill-button.tsx)
* **Implementation**:
  * Remove `router.push("/quizzes")` from the failure block.
  * Add error state and an accessible UI toast/banner notification informing the student if drill generation fails.
  * Add loading state on the button during API dispatch.
* **File**: [`platform/components/refresher-customizer-modal.tsx`](file:///platform/components/refresher-customizer-modal.tsx)
  * Display an accessible error toast inside the modal if `/api/srs/daily-drill` returns an error, preventing the modal from hanging in an uninformative state.

### B. Fault-Tolerant SRS Drill Assembly Engine
* **File**: [`platform/lib/srs.ts`](file:///platform/lib/srs.ts) (`assembleDailyRefresherDrill`)
* **Implementation**:
  1. Wrap database operations in a defensive `try/catch` block.
  2. Implement an in-memory fallback using `getMockStore()` from [`platform/lib/store.ts`](file:///platform/lib/store.ts) when PostgreSQL is disconnected or table constraints reject the write.
  3. **Guest User FK Fix**: Before executing `db.insert(questionSets)`, check if the user is authenticated in PostgreSQL. If the student is a guest (`00000000-0000-0000-0000-000000000001`), save the ephemeral drill set to the mock store or omit the foreign key constraint.
  4. **Active Question Filtering**:
     * Actually filter the candidate questions by `dueTopicCodes` using Drizzle's `inArray(questions.topicCode, dueTopicCodes)`.
     * If domain is specified (e.g. `domain === "MATH"`), filter by domain.
     * Remove the hard filter `questions.isAnchor = true`, or fall back to standard topic practice questions if zero anchor questions exist.

---

## 3. Step-by-Step Implementation Steps

1. **Refactor `platform/components/launch-drill-button.tsx`**:
   * Replace `router.push("/quizzes")` with `toast.error(data.error || "Failed to assemble drill")`.
2. **Refactor `platform/lib/srs.ts`**:
   * Add `try/catch` around DB queries.
   * Implement mock store fallback for guest users.
   * Apply `dueTopicCodes` and domain filter to question selection query.
3. **Update `platform/app/api/srs/daily-drill/route.ts`**:
   * Validate session and pass sanitized parameters to `assembleDailyRefresherDrill`.

---

## 4. Verification & Walkthrough Steps

1. Log in as a guest user (or unauthenticated session).
2. Navigate to `/analytics` $\to$ Click **"Launch 20-Q Refresher Drill"**.
3. Verify the browser navigates directly to `/attempts/[attemptId]`.
4. Verify the quiz runner contains 20 questions corresponding to weak/due topics.
5. Simulate database disconnection $\to$ Verify that the drill still generates via `getMockStore()` without redirecting to `/quizzes`.
