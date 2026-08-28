# End-to-End Learning Module & Paired Mastery Challenge Authoring Workflow

This workflow document defines the exact standard operating procedure (SOP) for authoring a complete, high-yield PRC ECE Board Exam **Interactive Learning Module** and its **Paired Mastery Challenge Exam** on the Marnie Quiz platform.

---

## 1. Core Source of Truth & Page-by-Page Inspection Rule

1. **The Absolute Reference Source**:
   - Every module MUST be transcribed and engineered directly from the rendered review note page image located in:
     `test-sets/scratch/pdf-renders/[subject]/notes___[topic]_[n]/page_01.png`
   - **Zero-Skipping Rule**: The authoring agent MUST call `view_file` on the specific `page_01.png` image first, read every single formula, table, theorem, diagram, and condition on that page, and ensure **100% of the page's contents** are woven into the module.
   - **No Batching**: Modules must be authored one page at a time (Inspect Page PNG $\to$ Author Module JSON $\to$ Author Paired Mastery JSON $\to$ Verify). Never batch-generate or summarize multiple distinct note pages into a single generic module.

2. **Required Skills & Guides**:
   - `.agents/skills/learning-module-authoring/SKILL.md`: Lesson-first hierarchy, 4-layer theory flow, compilation of formulas cards, inline SVG diagrams (`InlineFigure`), clean keycap token arrays, and dual-method sample problems.
   - `.agents/skills/mastery-challenge-authoring/SKILL.md`: Decoupled 20–25 question companion exams with strict **4-Quadrant Balance Protocol** (30% conceptual, 35% computational, 20% applied, 15% shortcuts/traps).
   - `test-sets/Reference Documents/learning-modules-authoring-pitfalls.md`: Pre-flight checklist covering contrast rules, natural review phrasing, directory structure, and range slider styling.
   - `test-sets/Reference Documents/modules-authoring-plan.md`: Master phased roadmap and 1-to-1 page-to-module mapping.

---

## 2. Standard Authoring Prompt Template (Invocation Pattern)

When authoring a module for a specific note page:

```markdown
Author the complete Learning Module and Paired Mastery Challenge for:
- Subject: [Mathematics / GEAS / EST / Electronics]
- Topic Code: [e.g. MATH-01-01, MATH-10-03, ELECS-05-02]
- Module ID: [e.g. math-01-01, math-10-03]
- Reference Note Page Image: test-sets/scratch/pdf-renders/[subject]/notes___[topic]_[n]/page_01.png

Execution Steps:
1. Call `view_file` on the `page_01.png` image and extract all formulas, definitions, special cases, and shortcuts.
2. Author `test-sets/learning-modules/[subject]/[moduleId].json`.
3. Author `test-sets/learning-modules/[subject]/mastery/[moduleId]-mastery.json`.
4. Verify with `npm run build` in `platform/`.
```

---

## 3. Step-by-Step Generation Pipeline

### Step 1: Multimodal Page Inspection
- Call `view_file` directly on `test-sets/scratch/pdf-renders/[subject]/notes___[topic]_[n]/page_01.png`.
- Record all equations, definitions, geometric relationships, physical constants, historical figures, and calculator shortcuts on the sheet.

### Step 2: Write the Learning Module (`[moduleId].json`)
Construct the JSON module according to `.agents/skills/learning-module-authoring/SKILL.md`:
1. **Prerequisite & Cross-Subject Bridges**:
   - Connect the topic forward to real-world engineering or other board subjects (e.g. Math conic optics $\to$ EST satellite parabolic dishes).
2. **Mental Anchor**:
   - 1–2 high-density sentences summarizing the core intuition, governing relation, and shortcut rule in KaTeX.
3. **Lesson Proper (`contentMarkdown`) — 4-Layer Narrative Standard**:
   - **Layer 1: Intuition**: Physical or geometric motivation (*Why does this exist?*).
   - **Layer 2: Governing Formula**: Clean KaTeX equation with explicit symbol breakdown.
   - **Layer 3: Specific Cases & Boundaries**: Physical behavior at limits (e.g. $\theta = 0^\circ, 90^\circ, 180^\circ$, resonance limits, asymptotes). Always use natural phrasing (**"Specific Cases"** or **"Cases"**).
   - **Layer 4: Board Exam Trap Alert**: Highlight algebraic sign errors or scaling pitfalls.
   - **Inline Vector SVG Diagrams**: Embed ` ```diagram ` JSON blocks using `axes`, `grid`, `line`, `arc`, `projection`, `right_angle`, `point`, and `text`.
4. **Compilation of Formulas (`formulas`)**:
   - High-visibility formula reference cards with bold titles, display math KaTeX, and minimal contextual notes.
5. **Interactive Declarative Visualizer**:
   - Select the topic-accurate archetype (`cartesian_line`, `polygon_shoelace`, `conic_explorer`, `parameter_sweep`, etc.).
   - Define bounded, typed parameters with step intervals.
6. **Key Terms & Definitions**:
   - Atomic definitions with SI units and **1-Second Keyword Trigger Associations**.
7. **Worked Sample Problems (Dual-Method Toggle)**:
   - Provide 2–3 board problems showing both **Academic Derivation** (~60s) and **⚡ Board Exam Shortcut** (~5–10s).
8. **Calculator Speed Guides**:
   - Keystrokes for Karce KC-S991 and Canon F-789SGA stored as **clean string token arrays** (no `<kbd>` tags).
9. **In-Line Concept Checks**:
   - 3–4 multiple-choice checks with direct distractor deconstructions (no boilerplate label clutter).

### Step 3: Write the Companion Mastery Challenge (`mastery/[moduleId]-mastery.json`)
Construct the 20–25 question companion exam strictly following the **4-Quadrant Balance Protocol**:
- **Quadrant 1 (30% -> 6–8 items)**: Conceptual understanding, invariants, definitions, qualitative properties.
- **Quadrant 2 (35% -> 7–9 items)**: Standard formula computation and parameter evaluations.
- **Quadrant 3 (20% -> 4–5 items)**: Multi-step geometric/engineering word problems.
- **Quadrant 4 (15% -> 3–4 items)**: Speed shortcuts, calculator mode bypasses, and sign trap deconstructions.
- **Solutions**: Direct step-by-step mathematical reasoning with KaTeX and ⚡ Speed Shortcut callouts.

### Step 4: Verification & Quality Assurance
1. **JSON Validation**: Verify valid JSON parsing and double-escaped backslashes (`\\frac`, `\\sin`).
2. **Build Validation**: Run `npm run build` in `platform/` to verify zero TypeScript errors and zero JSON warnings.
3. **Commit & Push**: Commit with a clean semantic message (`git commit -am "feat(module): ..."` and `git push origin main`).
4. **Changelog Logging**: Append newly authored modules to `changelog/[date].md`.
