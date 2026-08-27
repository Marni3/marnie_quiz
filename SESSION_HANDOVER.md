# Antigravity Agent Handover & Takeover Guide

> **Project**: Philippine PRC Electronics Engineering (ECE) Board Exam Review Platform (Marnie Quiz & Learning Modules)  
> **Source of Truth**: [`implementation-plan.md`](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/implementation-plan.md) & [`AGENTS.md`](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/AGENTS.md)  
> **Handover Timestamp**: August 28, 2026

---

## 1. Quick Orientation: What We Are Building

This is a **free, small-scale personal review platform** ($0 cost, local-first / Next.js 16 + Neon PostgreSQL + Drizzle ORM) for Philippine PRC Electronics Engineering Licensure Examination review.

It has two core pillars:
1. **The Quiz Engine & Question Library (`/quizzes`)**: 201 authentic question sets across 50 syllabus topics with diagnostic, review, drill, and simulation tiers, topic SRS tracking, and custom quiz generation.
2. **Interactive Learning Modules (`/learn` and `/learn/[moduleId]`)**: Rich, full-page interactive lessons transcribing review center materials with plain-English theory, atomic definitions, interactive HTML5 canvas simulators, dual-method derivations (Textbook vs. $\le 20\text{s}$ Board Shortcut), Karce/Canon calculator techniques, and instant in-line concept checks with distractor breakdowns.

---

## 2. Where We Are Right Now (Completed Work)

1. **Test-Set Database & Taxonomy Fixes**:
   - Synchronized canonical `topic_code` (`MATH-01` to `MATH-13`, `ELEC-01` to `ELEC-15`, `GEAS-01` to `GEAS-12`, `EST-01` to `EST-10`) across all 201 question sets in live Neon PostgreSQL.
   - Built `TOPIC_CATALOG` and `inferSubjectAndTopicCode` in [`platform/lib/constants.ts`](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/platform/lib/constants.ts).
   - Subject tabs (MATH, ELECS, GEAS, EST) and topic accordions sort sequentially by syllabus order, with quiz cards sorted by tier (Diagnostic $\to$ Review $\to$ Drill $\to$ Simulation).

2. **Full-Page Interactive Learning Module System**:
   - [`platform/lib/modules.ts`](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/platform/lib/modules.ts): Server-side loader scanning `test-sets/learning-modules/` JSON files.
   - [`platform/app/learn/[moduleId]/page.tsx`](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/platform/app/learn/[moduleId]/page.tsx) & [`module-reader.tsx`](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/platform/app/learn/[moduleId]/module-reader.tsx): Full-page reader featuring sticky TOC sidebar, interactive canvas sandboxes, dual-method solution switcher, calculator techniques cards with sample problems, and in-line MCQ grading.
   - [`platform/app/learn/page.tsx`](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/platform/app/learn/page.tsx) & [`learn-catalog.tsx`](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/platform/app/learn/learn-catalog.tsx): Searchable, filterable catalog.
   - [`platform/components/navbar.tsx`](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/platform/components/navbar.tsx): "Modules" navigation link.
   - [`platform/app/quizzes/library-view.tsx`](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/platform/app/quizzes/library-view.tsx): Displays companion interactive module cards inside topic accordions.

3. **Markdown & KaTeX Parser Upgrade**:
   - Upgraded [`platform/components/math-text.tsx`](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/platform/components/math-text.tsx) to a full Markdown parser supporting headers (`#`, `##`, `###`, `####`), tables (`| ... |`), unordered/ordered lists, bolding, horizontal rules, display math (`$$...$$`), and inline math (`$...$`).

4. **Benchmark Module Redesigned**:
   - [`test-sets/learning-modules/math/math-01-01.json`](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/test-sets/learning-modules/math/math-01-01.json) fully updated to reflect all new pedagogical and formatting standards.

---

## 3. Mandatory Instructions for the Next Agent

Before writing code or authoring modules, you **MUST** read the following source files in order:

1. [`implementation-plan.md`](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/implementation-plan.md) — Single source of truth for architecture, schema, features, and non-negotiables.
2. [`AGENTS.md`](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/AGENTS.md) — Working principles, $0 budget constraint, and daily changelog rules.
3. [`test-sets/.agents/skills/learning-module-authoring/SKILL.md`](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/test-sets/.agents/skills/learning-module-authoring/SKILL.md) — The authoring skill containing master rules.
4. [`test-sets/Reference Documents/MODULE_RESTRUCTURING_AND_PEDAGOGICAL_REFINEMENT_GUIDE.md`](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/test-sets/Reference%20Documents/MODULE_RESTRUCTURING_AND_PEDAGOGICAL_REFINEMENT_GUIDE.md) — Authoring blueprint, naming standards, and visual guidelines.
5. [`test-sets/Reference Documents/LEARNING_MODULE_AUTHORING_TAKEOVER_GUIDE.md`](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/test-sets/Reference%20Documents/LEARNING_MODULE_AUTHORING_TAKEOVER_GUIDE.md) — Schema definitions and module blueprints.
6. The latest changelog entries in [`test-sets/changelog/`](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/test-sets/changelog/) (specifically [`2026-08-25.md`](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/test-sets/changelog/2026-08-25.md) and [`2026-08-26.md`](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/test-sets/changelog/2026-08-26.md)).

---

## 4. Non-Negotiable V1 Authoring Standards

When writing or generating learning modules, strictly follow these core rules:

### A. 1-to-1 Grounding in Actual Reviewer Notes (`Reference Documents/`)
- The primary learning modules are **directly grounded 1-to-1** with the actual review center lecture notes (e.g., Excel Review Center) in `Reference Documents/`.
- **No artificial length limits**: Modules must be as detailed and comprehensive as the source material requires. Transcribe every specific classification, table, property, and formula (e.g., in Algebra 1: Cardinal vs. Ordinal numbers, Arabic vs. Roman numerals, Roman multipliers Bracket $\times 100$, Vinculum $\times 1,000$, Doorframe $\times 1,000,000$, properties of integers/addition/multiplication/equality, powers of $i$, etc.).

### B. Mandatory Multimodal PDF-to-Image Protocol
- **NEVER USE PDF TEXT EXTRACTION LIBRARIES**. Raw PDF text extraction corrupts column layouts, tables, math symbols, and handwritten annotations.
- **Conversion Rule**: Use a lightweight Python script (`pymupdf`/`fitz` or `pdf2image`) to render PDF pages as PNG images into `scratch/`.
- Inspect the page images directly using **multimodal vision capabilities** to guarantee 100% transcription fidelity.

### C. Interleaved Reinforcement Micro-Cycle
Within the **Lesson Proper**, do not dump all theory first and all questions at the end. Follow this continuous active-recall loop:
$$\text{Concept Block} \longrightarrow \text{Immediate In-line Concept Check} \longrightarrow \text{Worked Sample Problem \& Solution} \longrightarrow \text{Follow-up Self-Practice Check} \longrightarrow \text{Calculator Technique (if applicable)}$$

- **Concept Checks Capacity**: Scale concept checks per block/module up to 5, 6, or 10+ multiple-choice questions as needed for exhaustive active-recall coverage.

### D. Atomic Terms in Strict Dependency Order
- Keep definitions short, punchy, and "atomic" (1–2 concise sentences maximum). The board rewards breadth over depth.
- Terms must appear in strict order of appearance and logical dependency (e.g., $\mathbb{N} \to \mathbb{W} \to \mathbb{Z} \to \mathbb{Q} \to \mathbb{Q}' \to \mathbb{R}$). Never introduce a term before defining its prerequisite.
- All math symbols must be wrapped in `$...$` (e.g., `$\mathbb{Q}$`, `$\text{GCF}(a, b)$`).

### E. Standardized Section Titles
1. `1. Introduction & Links to Related Topics`
2. `2. Terms and Definitions`
3. `3. Lesson Proper` (with interleaved concept checks)
4. `4. Interactive Visualizer Sandbox` (if applicable)
5. `5. Sample Problems and Solutions` (Dual-Method toggle: `[Formal]` vs `[⚡ Shortcut]`)
6. `6. Calculator Techniques` (Karce KC-S991 & Canon F-789SGA — show technique title, problem type, and sample problem first)
7. `7. In-Line Concept Checks & Distractor Deconstruction`
8. `8. Paired Mastery Challenge & Next Module Bridge`

### F. Future Spaced Repetition (SRS) Integration & Module Recall System
- **Database Module Review Tracking**: In future backend implementations, add a mechanism (e.g. `user_module_progress` table with `last_reviewed_at`, `confidence_level`, `next_due_date`) to track when each module was last studied.
- **Dual Recall Recommendations**: The Spaced Repetition System will be expanded beyond just generating dynamic/custom review sets to **recommend specific learning modules and/or their paired quiz sets** for periodic review.
- **Forgetting Curve Refresher (Even for High Scores)**: Items and modules will be scheduled for recall based on retention decay curves—ensuring that topics examinees previously mastered or scored well on are still resurfaced at optimal intervals before long-term memory fades.

---

## 5. Directory & Codebase Layout

```
marnie_quiz/
├── implementation-plan.md          # Architecture & non-negotiables single source of truth
├── AGENTS.md                       # Agent working rules & constraints
├── SESSION_HANDOVER.md             # This takeover document
├── platform/                       # Next.js 16 web application
│   ├── app/
│   │   ├── learn/                  # Module catalog & full-page interactive reader
│   │   │   ├── page.tsx            # /learn catalog server page
│   │   │   ├── learn-catalog.tsx   # /learn interactive catalog client component
│   │   │   └── [moduleId]/
│   │   │       ├── page.tsx        # /learn/[moduleId] server page
│   │   │       └── module-reader.tsx # Full interactive reader client component
│   │   ├── quizzes/                # Question library & quiz runner
│   │   │   ├── page.tsx            # /quizzes server page
│   │   │   └── library-view.tsx    # Topic accordions & library browser
│   │   └── api/                    # Quiz grading, submission, and auth endpoints
│   ├── components/
│   │   ├── math-text.tsx           # Full Markdown + KaTeX math rendering engine
│   │   └── navbar.tsx              # Main navigation header (Library, Modules, Retention, History)
│   └── lib/
│       ├── constants.ts            # TOPIC_CATALOG (50 topics) & inferSubjectAndTopicCode
│       ├── modules.ts              # Server filesystem loader for learning module JSON files
│       ├── quizzes.ts              # Quiz queries & database handlers
│       └── db/schema.ts            # Drizzle ORM schema for Neon PostgreSQL
└── test-sets/                      # Curriculum assets & authoring tools
    ├── .agents/skills/             # Authoring skill definitions
    │   └── learning-module-authoring/SKILL.md
    ├── changelog/                  # Daily running changelogs (YYYY-MM-DD.md)
    ├── learning-modules/           # Master JSON Learning Modules
    │   ├── math/                   # e.g., math-01-01.json, math-01-02.json, math-01-03.json
    │   ├── elecs/
    │   ├── geas/
    │   └── est/
    ├── Reference Documents/        # Syllabus notes, review center PDFs & authoring guides
    └── scratch/                    # Scratchpad for python scripts & PDF-to-PNG renders
```

---

## 6. Daily Changelog Reminder

Remember to maintain daily development changelogs in [`test-sets/changelog/`](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/test-sets/changelog/). Always check if a file for the current date (`YYYY-MM-DD.md`) exists before starting; if it exists, append your progress; if not, create a new one.
