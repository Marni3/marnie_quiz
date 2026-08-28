# End-to-End Learning Module & Paired Mastery Challenge Authoring Workflow

This workflow document defines the exact standard operating procedure (SOP) for authoring a complete, high-yield PRC ECE Board Exam **Interactive Learning Module** and its **Paired Mastery Challenge Exam** on the Marnie Quiz platform.

---

## 1. Required Skills & Reference Documents

Before generating any module and paired mastery challenge, the authoring agent MUST review:

1. **Learning Module Authoring Skill**:
   - Path: `.agents/skills/learning-module-authoring/SKILL.md`
   - Purpose: Enforces lesson-first hierarchy, the 4-layer theory framework, declarative vector SVG diagrams, clean calculator keycap tokens, and dual-method sample problems.

2. **Mastery Challenge Authoring Skill**:
   - Path: `.agents/skills/mastery-challenge-authoring/SKILL.md`
   - Purpose: Enforces the 20–25 question 4-Quadrant Balance Protocol (30% conceptual, 35% computational, 20% applied, 15% shortcuts/traps) and direct solution explanations.

3. **Permanent Authoring Pitfalls & Error Prevention Guide**:
   - Path: `test-sets/Reference Documents/learning-modules-authoring-pitfalls.md`
   - Purpose: Pre-flight checklist covering contrast rules, natural review phrasing, JSON directory decoupling, and slider track styling.

4. **Master Topic Blueprint**:
   - Mathematics: `test-sets/Reference Documents/modules-plan-math.md`
   - Electronics Engineering: `test-sets/Reference Documents/modules-plan-elecs.md`
   - Electronic Systems: `test-sets/Reference Documents/modules-plan-est.md`
   - General Engineering: `test-sets/Reference Documents/modules-plan-geas.md`

---

## 2. Standard Authoring Prompt Template (Invocation Pattern)

When authoring a module for a specific topic/subtopic, use this prompt structure:

```markdown
Author the complete Learning Module and Paired Mastery Challenge for:
- Subject: [Mathematics / Electronics / EST / GEAS]
- Topic Code: [e.g. MATH-01, ELECS-03, EST-02, GEAS-17]
- Module ID: [e.g. math-01-01]
- Subtopic: [Exact title from modules-plan-[subject].md]
- Reference Notes: [Matching review center lecture note PDF in test-sets/Reference Documents/]

Follow the standards in:
1. `.agents/skills/learning-module-authoring/SKILL.md`
2. `.agents/skills/mastery-challenge-authoring/SKILL.md`
3. `test-sets/Reference Documents/learning-modules-authoring-pitfalls.md`

Output Files:
1. `test-sets/learning-modules/[subject]/[moduleId].json`
2. `test-sets/learning-modules/[subject]/mastery/[moduleId]-mastery.json`
```

---

## 3. Step-by-Step Generation Pipeline

### Step 1: Multimodal / Text Extraction of Review Notes
- Read the corresponding review center PDF notes for the topic.
- Extract all governing formulas, physical constants, historical figures, classifications, and exact board exam mnemonic shortcuts.

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
4. **Interactive Declarative Visualizer**:
   - Select the topic-accurate archetype (`cartesian_line`, `polygon_shoelace`, `conic_explorer`, `factor_tree`, `rlc_resonance`, `wave_interference`).
   - Define bounded, typed parameters with step intervals.
5. **Key Terms & Definitions**:
   - Atomic definitions with SI units and **1-Second Keyword Trigger Associations**.
6. **Worked Sample Problems (Dual-Method Toggle)**:
   - Provide 2–3 board problems showing both **Academic Derivation** (~60s) and **⚡ Board Exam Shortcut** (~5–10s).
7. **Calculator Speed Guides**:
   - Keystrokes for Karce KC-S991 and Canon F-789SGA stored as **clean string token arrays** (no `<kbd>` tags).
8. **In-Line Concept Checks**:
   - 3–4 multiple-choice checks with direct distractor deconstructions (no boilerplate label clutter).

### Step 3: Write the Companion Mastery Challenge (`mastery/[moduleId]-mastery.json`)
Construct the 20–25 question companion exam strictly following the **4-Quadrant Balance Protocol**:
- **Quadrant 1 (30% -> 6–8 items)**: Conceptual understanding, invariants, definitions, qualitative properties.
- **Quadrant 2 (35% -> 7–9 items)**: Standard formula computation and parameter evaluations.
- **Quadrant 3 (20% -> 4–5 items)**: Multi-step geometric/engineering word problems.
- **Quadrant 4 (15% -> 3–4 items)**: Speed shortcuts, calculator mode bypasses, and sign trap deconstructions.
- **Solutions**: Direct step-by-step mathematical reasoning with KaTeX and ⚡ Speed Shortcut callouts.

### Step 4: Verification & Quality Assurance
1. **JSON Validation**: Run a node script to verify valid JSON parsing and required field completeness.
2. **Build Validation**: Run `npm run build` in `platform/` to verify zero TypeScript errors.
3. **Commit & Push**: Commit with a clean semantic message (`git commit -am "feat(module): ..."` and `git push origin main`).
4. **Changelog Logging**: Append newly authored modules to `changelog/[date].md`.
