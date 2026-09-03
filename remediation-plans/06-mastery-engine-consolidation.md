# Implementation Plan 06: Mastery Challenge & Core Quiz Engine Consolidation

**Target Issue**: Bifurcated quiz systems (`mastery-runner.tsx` vs standard `question_sets` engine), lack of question-level database persistence for mastery exams, hallucinated AI debriefs, and duplicate code.  
**Governing Standards**:  
* [Software Standards SKILL.md §3](file:///.agents/skills/software-standards/SKILL.md) (Server-Side Grading & Parameterized Persistence)  
* [Software Standards SKILL.md §6](file:///.agents/skills/software-standards/SKILL.md) (Guaranteed Transaction Verification: Input-to-Save Completeness)

---

## 1. Root-Cause Summary

1. **Dual Parallel Architectures**: Standard quizzes use PostgreSQL (`question_sets`, `questions`, `attempts`, `answer_records`), but Mastery Challenges run in a parallel, isolated client-side runner ([`mastery-runner.tsx`](file:///platform/app/learn/[moduleId]/mastery/mastery-runner.tsx)).
2. **Missing History Records**: Mastery attempts only save an aggregate integer percentage to `user_module_progress`. No attempt records or individual answer choices are stored in `attempts` or `answer_records`.
3. **Hallucinated AI Debriefs**: When a student clicks "AI Debrief" on a completed mastery challenge, the tutor receives a synthesized payload without individual questions or distractor choices, forcing the LLM to hallucinate what the student missed.
4. **Tutor Modal Coupling**: [`platform/app/tutor/custom-quiz-modal.tsx`](file:///platform/app/tutor/custom-quiz-modal.tsx#L5) directly imports `MasteryRunner` to run ephemeral drills, bypassing the core quiz engine.

---

## 2. Technical Solution & Changes

### A. Database Schema Extension
* **File**: [`platform/lib/db/schema.ts`](file:///platform/lib/db/schema.ts)
* **Implementation**:
  * Update `tierEnum` to include `"mastery"`:
    ```ts
    export const tierEnum = pgEnum("tier", ["diagnostic", "review", "drill", "simulation", "mastery"]);
    ```
  * Add optional `moduleId` column to `questionSets`:
    ```ts
    moduleId: text("module_id"), // e.g. 'math-07-01', 'geas-10-02'
    ```

### B. Ingest All 46 Mastery Sets into Question Sets Engine
* **File**: [`platform/lib/modules.ts`](file:///platform/lib/modules.ts)
* **File**: [`platform/lib/quizzes.ts`](file:///platform/lib/quizzes.ts)
* **Implementation**:
  * Map all 46 disk JSON mastery challenge files (`modules/data/*-mastery.json`) into standard `question_sets` with `tier: "mastery"` and `moduleId: module.id`.
  * Helper function `getMasteryQuestionSetForModule(moduleId)` resolves the exact `questionSetId`.

### C. Server-Side Atomic Grading & Progress Dual-Sync
* **File**: [`platform/lib/grading.ts`](file:///platform/lib/grading.ts)
* **Implementation**:
  * In the grading handler (`/api/attempts/[attemptId]/submit`):
    ```ts
    if (questionSet.tier === "mastery" && questionSet.moduleId) {
      await updateModuleProgress({
        userId: attempt.userId,
        moduleId: questionSet.moduleId,
        topicCode: questionSet.topicCode,
        domain: questionSet.subjectTag,
        isCompleted: scorePct >= 70,
        masteryScorePercent: scorePct,
        confidence: scorePct >= 90 ? "mastered" : scorePct >= 70 ? "confident" : "moderate",
      });
    }
    ```
  * Sync empirical stability ($S_0$) and retrievability ($R = 1.0$) into `user_topic_srs`.

### D. Deprecate `mastery-runner.tsx` & Update Tutor Modal
* **File**: [`platform/app/learn/[moduleId]/mastery/mastery-runner.tsx`](file:///platform/app/learn/[moduleId]/mastery/mastery-runner.tsx)
* **File**: [`platform/app/tutor/custom-quiz-modal.tsx`](file:///platform/app/tutor/custom-quiz-modal.tsx)
* **Implementation**:
  * Replace `mastery-runner.tsx` with a clean redirect or direct launcher linking to `/attempts/[attemptId]`.
  * Update `custom-quiz-modal.tsx` to create an ephemeral quiz set and route to `/attempts/[id]`.
  * In `results-view.tsx`, render a contextual **"Return to Module"** button when `questionSet.moduleId` is present.

---

## 3. Step-by-Step Implementation Steps

1. Run database migration adding `mastery` to `tierEnum` and `module_id` to `question_sets`.
2. Update `lib/modules.ts` and `lib/quizzes.ts` to expose the 46 mastery challenge JSONs as database question sets.
3. Update `lib/grading.ts` to perform the atomic dual-sync to `user_module_progress`.
4. Update `module-reader.tsx` CTA buttons to launch `/attempts/[id]`.
5. Deprecate `mastery-runner.tsx` and refactor `custom-quiz-modal.tsx`.
6. Update `history/page.tsx` and `results-view.tsx` with contextual mastery badges and return links.

---

## 4. Verification & Walkthrough Steps

1. Open `/learn/math-07-01` $\to$ Click **"Take Mastery Challenge (20Q)"**.
2. Verify the exam opens inside `/attempts/[attemptId]`.
3. Submit the exam $\to$ Verify:
   * Record is saved to `attempts` and `answer_records`.
   * Module progress in `user_module_progress` updates with the exact percentage.
   * Attempt appears in `/history` with a **Mastery** pill badge.
4. Click **"AI Debrief"** from the results card $\to$ Verify the AI Tutor receives the real question items and missed choices without hallucinations.
5. Click **"Return to Module"** $\to$ Verify seamless navigation back to `/learn/math-07-01`.
