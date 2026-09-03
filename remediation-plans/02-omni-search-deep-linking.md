# Implementation Plan 02: Omni-Search & Global Deep-Linking Synchronization

**Target Issue**: Selecting search suggestions in the `⌘K` global search modal navigates to the library without applying filters, expanding matching topics, or focusing on target questions. 45 out of 46 learning modules are missing from Omni-Search.  
**Governing Standards**:  
* [Software Standards SKILL.md §6](file:///.agents/skills/software-standards/SKILL.md) (Interactive Functionality: All buttons & links must work end-to-end)  
* [Mobile-First Development SKILL.md §4](file:///.agents/skills/mobile-first-development/SKILL.md) (Navigation & Screen Structure)

---

## 1. Root-Cause Summary

1. **Unread URL Search Parameters**: [`platform/app/quizzes/library-view.tsx`](file:///platform/app/quizzes/library-view.tsx#L102-L140) lacks `useSearchParams()`. When Omni-Search pushes `/quizzes?domain=MATH` or `/quizzes?search=MATH-07`, the state remains at defaults: "All Subjects" selected, search string empty, and all 46 topic accordions collapsed.
2. **Missing 45 Active Modules in Omni-Search**: [`platform/components/omni-search.tsx`](file:///platform/components/omni-search.tsx#L216-L225) only hardcoded `geas-10-01`. The other 45 active learning modules (`math-01-01` through `math-13-03`, `geas-10-02`, etc.) are absent from search results.
3. **Generic Routes for Notes & Custom Modules**: Notes and custom modules point to generic `/notes` and `/learn` instead of specific item anchors.

---

## 2. Technical Solution & Changes

### A. URL State Synchronization in Library View
* **File**: [`platform/app/quizzes/library-view.tsx`](file:///platform/app/quizzes/library-view.tsx)
* **File**: [`platform/app/quizzes/page.tsx`](file:///platform/app/quizzes/page.tsx)
* **Implementation**:
  1. Wrap `LibraryView` in a `<Suspense>` boundary in `app/quizzes/page.tsx` to prevent Next.js client-side de-optimization.
  2. In `LibraryView`, import and initialize `const searchParams = useSearchParams()`.
  3. Synchronize `selectedSubject` with `searchParams.get("domain")` or `searchParams.get("subject")`.
  4. Synchronize `search` with `searchParams.get("search")` or `searchParams.get("q")`.
  5. Auto-expand matching topic accordions when `searchParams.get("topic")` or `searchParams.get("search")` is present:
     ```tsx
     useEffect(() => {
       const domainParam = searchParams.get("domain") || searchParams.get("subject");
       const searchParam = searchParams.get("search") || searchParams.get("q");
       const topicParam = searchParams.get("topic");

       if (domainParam) setSelectedSubject(domainParam.toUpperCase());
       if (searchParam) {
         setSearch(searchParam);
         setAllCollapsed(false);
       }
       if (topicParam) {
         setCollapsedTopics((prev) => ({ ...prev, [topicParam]: false }));
       }
     }, [searchParams]);
     ```

### B. Dynamic Module Indexing in Omni-Search
* **File**: [`platform/components/omni-search.tsx`](file:///platform/components/omni-search.tsx)
* **Implementation**:
  1. Dynamically ingest all 46 learning modules from `getAllLearningModules()` or an API endpoint `/api/modules/catalog`.
  2. Map module items directly to `/learn/${module.id}`.
  3. Map topic search results to `/quizzes?domain=${domain}&topic=${topicCode}&search=${encodeURIComponent(title)}`.
  4. Map student notes to `/notes#note-${note.id}` with smooth scrolling.

---

## 3. Step-by-Step Implementation Steps

1. In `platform/app/quizzes/page.tsx`, wrap `LibraryView` inside `<Suspense fallback={<LibrarySkeleton />}>`.
2. In `platform/app/quizzes/library-view.tsx`, connect `useSearchParams` and add the parameter-sync `useEffect`.
3. In `platform/components/omni-search.tsx`, replace static `STATIC_TOPICS` with dynamic module search results.
4. Ensure target topic accordions auto-expand and scroll into view when matching parameters are detected.

---

## 4. Verification & Walkthrough Steps

1. Open Omni-Search via `⌘K` or `/`.
2. Search for `"Analytic Geometry"` and click the result.
3. Verify the browser navigates to `/quizzes?domain=MATH&search=Analytic%20Geometry`.
4. Verify the Mathematics subject ribbon is selected, the search bar is filled, and the Analytic Geometry topic accordion is expanded showing all question sets.
5. Search for `"GEAS 10-02"` in Omni-Search $\to$ Click the result $\to$ Verify it navigates directly to `/learn/geas-10-02`.
