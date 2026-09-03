# Implementation Plan 03: Module Reader Navigation & Sandbox Guest Access

**Target Issue**: Broken navigation links in learning modules (`/learn/math%2007-01` and `/quizzes/*-mastery` 404s), guest lockout on interactive question visualizers, and missing Onboarding Tour compass in navbar.  
**Governing Standards**:  
* [Software Standards SKILL.md §3](file:///.agents/skills/software-standards/SKILL.md) (Sandboxed Interactive Content & Safe Guest Fallbacks)  
* [Software Standards SKILL.md §6](file:///.agents/skills/software-standards/SKILL.md) (Interactive Functionality: Eliminate 404 Dead-Ends)

---

## 1. Root-Cause Summary

1. **Space-Slug Bug in Module Reader**: [`platform/app/learn/[moduleId]/module-reader.tsx`](file:///platform/app/learn/[moduleId]/module-reader.tsx#L1484) links the "Continue Last Module" button to `/learn/${module.code.toLowerCase()}`. Because `module.code` has spaces (e.g. `MATH 07-01`), it requests `/learn/math%2007-01`, producing a 404. It must use `module.id` (`math-07-01`).
2. **Missing Syllabus Quiz Set Link**: Line 1550 links "Browse Syllabus Library Set" to `/quizzes/${module.pairedQuizSetId}`. In all 46 module JSONs, `pairedQuizSetId` is set to `${moduleId}-mastery` which is not present in `question_sets`.
3. **Guest Lockout on Interactive Visualizers**: [`platform/app/modules/[questionId]/page.tsx`](file:///platform/app/modules/[questionId]/page.tsx#L14) enforces `if (!session?.user) notFound()`. Guest students clicking **[ Interactive Module ]** on `/attempts/[id]/results` receive an immediate 404.
4. **Missing Tour Button in Navbar**: Step 1 of [`platform/components/onboarding-tour.tsx`](file:///platform/components/onboarding-tour.tsx#L51) instructs users that the tour can be re-opened via the "Compass button in the top navbar", but the `Compass` button was removed from [`platform/components/navbar.tsx`](file:///platform/components/navbar.tsx).

---

## 2. Technical Solution & Changes

### A. Module Reader URL Slug Fix
* **File**: [`platform/app/learn/[moduleId]/module-reader.tsx`](file:///platform/app/learn/[moduleId]/module-reader.tsx)
* **Implementation**:
  * Replace:
    ```tsx
    href={`/learn/${module.code ? module.code.toLowerCase() : ""}`}
    ```
    With:
    ```tsx
    href={`/learn/${module.id}`}
    ```
  * Update "Browse Syllabus Library Set" to navigate to the topic's filtered library view:
    ```tsx
    href={`/quizzes?search=${encodeURIComponent(module.code || module.id)}`}
    ```

### B. Interactive Sandbox Guest Access
* **File**: [`platform/app/modules/[questionId]/page.tsx`](file:///platform/app/modules/[questionId]/page.tsx)
* **Implementation**:
  * Allow unauthenticated or guest users to load the sandboxed question iframe:
    ```tsx
    const session = await auth();
    const userId = session?.user?.id || "guest";
    ```
  * Ensure the sandboxed iframe strictly preserves `sandbox="allow-scripts"` (strictly prohibiting `allow-same-origin`) as mandated by Software Standards §3.

### C. Restore Onboarding Tour Trigger
* **File**: [`platform/components/navbar.tsx`](file:///platform/components/navbar.tsx)
* **Implementation**:
  * Add a discreet Compass icon button in the navbar right actions bar that dispatches the `open-onboarding-tour` custom event:
    ```tsx
    <button
      onClick={() => window.dispatchEvent(new CustomEvent("open-onboarding-tour"))}
      className="p-2 rounded-xl text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--surface2)]"
      title="Open Onboarding Tour"
    >
      <Compass className="w-4 h-4" />
    </button>
    ```

---

## 3. Step-by-Step Implementation Steps

1. Edit `module-reader.tsx`: Correct the `module.id` link and replace the `pairedQuizSetId` link with `/quizzes?search=...`.
2. Edit `modules/[questionId]/page.tsx`: Remove `if (!session?.user) notFound()`; permit guest access to interactive question visualizers.
3. Edit `navbar.tsx`: Import `Compass` from `lucide-react` and render the tour launch button.

---

## 4. Verification & Walkthrough Steps

1. Navigate to `/learn/math-07-01` $\to$ Scroll to bottom $\to$ Click "Continue Next Module" $\to$ Verify it navigates to `/learn/math-07-02` without 404.
2. Click "Browse Syllabus Library Set" $\to$ Verify it opens `/quizzes?search=MATH-07-01`.
3. Open an exam result card as a guest $\to$ Click **[ Interactive Module ]** $\to$ Verify the interactive visualizer loads inside the sandboxed iframe without 404.
4. Click the Compass icon in the top navbar $\to$ Verify the Onboarding Tour modal opens.
