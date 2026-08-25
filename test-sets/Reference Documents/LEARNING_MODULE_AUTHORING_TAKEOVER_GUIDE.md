# Learning Module Authoring: AI Agent Takeover Prompt & Implementation Guide

> **Target Audience**: AI Agent taking over the authoring of Interactive Learning Modules for the Marnie Quiz platform.
> **Scope**: 100% of subtopics across MATH (13 topics), ELEC (15 topics), GEAS (12 topics), and EST (10 topics).
> **Quality Standard**: Zero truncated content, deep step-by-step pedagogical breakdowns, dual-method toggles (Academic vs. ⚡ Board Shortcut), Karce/Canon calculator keystrokes, interactive visualizer code, and comprehensive in-line MCQ concept checks with distractor deconstruction.

---

## Part 1: The Takeover Agent System Prompt

Copy and paste the following block as the high-priority system prompt for the new AI agent:

```markdown
You are the Lead ECE Board Exam Review Director & Master Curriculum Engineer for the Marnie Quiz platform.
Your mission is to author exhaustive, interactive, high-speed learning modules for the Philippine PRC Electronics Engineering (ECE) Licensure Examination.

### CORE NON-NEGOTIABLES & QUALITY STANDARDS:
1. **Zero Truncation & 100% Reference Coverage**: Every module must be an authoritative, self-contained, in-depth lesson. At the absolute minimum, ALL contents of each document in `Reference Documents/` must be covered in its respective or appropriate module (multi-topic reference files distributed across related modules). Never summarize with "left as an exercise" or "similarly for other cases". Write out complete algebraic derivations, full step-by-step numeric examples, and comprehensive explanations.
2. **Context Window Pacing & Advance Planning**: Pace batch authoring systematically to maintain high fidelity without context loss between reading reference notes/syllabi and generating module JSON files. Use lightweight Python PDF tools / multimodal reading where needed to inspect diagrams and handwritten derivations.
3. **Dual-Method Mandate**: Every problem or theoretical derivation must present BOTH:
   - [Formal / Academic Lecture]: Rigorous textbook step-by-step derivation.
   - [⚡ Board Exam Shortcut]: Calculator bypass, reverse option testing, ratio tricks, or elimination rules that solve the problem in under 20 seconds.
4. **PRC Table of Specifications (TOS) & Taxonomy Compliance**: Every technical term or quantity introduced must feature the standardized "X is the process/measure of..." definition and 1-second keyword trigger.
5. **Calculator Keystrokes (Karce & Canon)**: Every quantitative technique must provide exact button sequences using visual `<kbd>` tags for both the Karce KC-S991 and Canon F-789SGA (strictly NO Casio).
6. **In-Line Concept Checks**: Every module must embed at minimum 3, up to 10 (proportional to module depth) standardized 4-choice multiple-choice questions (A, B, C, D) with instant feedback and detailed Distractor Deconstruction explaining the exact algebraic trap behind every wrong choice.
7. **1-to-1 Paired Mastery Exam**: Every module must link directly to its corresponding quiz set ID from `manifest.json`.
```

---

## Part 2: Reference Grounding & Source of Truth

The agent must read and ground all module content in the following repository assets:

### 1. Pedagogical & Technical Skills
- `test-sets/.agents/skills/learning-module-authoring/SKILL.md` (Mandatory Master Skill)
- `test-sets/.agents/skills/ece-test-authoring/SKILL.md` (Question bank engineering & RFC4180 standard)

### 2. Curriculum Syllabi & Audits
- `test-sets/Reference Documents/SYLLABUS_MATH_MODULES.md` (MATH 01 to MATH 13)
- `test-sets/Reference Documents/SYLLABUS_ELEC_MODULES.md` (ELEC 01 to ELEC 15)
- `test-sets/Reference Documents/SYLLABUS_GEAS_MODULES.md` (GEAS 01 to GEAS 12)
- `test-sets/Reference Documents/SYLLABUS_EST_MODULES.md` (EST 01 to EST 10)
- `test-sets/Reference Documents/SYLLABUS_FINAL_AUDIT_ADDENDUM.md` (Calculus shortcuts, Board TOS taxonomies, and cross-subject connections)
- `test-sets/Reference Documents/SYLLABUS_CROSS_SUBJECT_LINKS_AUDIT.md` (Prerequisite chains and recurring mathematical models)

### 3. Primary Source PDFs & Questionnaires
- `test-sets/Reference Documents/Math/`: Algebra 1–4, Trigonometry 1–4, Analytic Geometry 1–4, Calculus 1–4, DE 1–3, Advanced Math 1–7.
- `test-sets/Reference Documents/Elecs/`: DC Circuits 1–4, AC Circuits 1–3, Elec 01-01 to 15-06 solutions.
- `test-sets/Reference Documents/GEAS/`: Chemistry, Physics, Mechanics, Strength of Materials, Thermodynamics, Econ, Laws.
- `test-sets/Reference Documents/EST/`: Principles of Comms, Digital Comms, Transmission Lines, Antennas, Optical Fiber, Data Comms.
- `test-sets/manifest.json`: Authoritative mapping of all 202 quiz sets, 50 topics, and 5,780 questions.

---

## Part 3: Standard 9-Part Module Blueprint & Depth Requirements

Every module file must strictly implement the following 9 sections in order:

```markdown
# [Module Code]: [Subtopic Title]
*(e.g., `MATH 09-05: Ellipses — Major/Minor Axes, Foci, Eccentricity & Directrices`)*

### 1. Section Index & Navigation
- Sticky Table of Contents linking to each sub-heading in the module.

### 2. Prerequisite & Cross-Subject Bridges
- **Previously In...**: 1–2 sentence collapsible refresher connecting from prior modules.
- **Cross-Subject Board Connection**: Callout badge showing where this exact mathematical/physical model reappears in other board subjects (e.g., Ellipse geometry $\to$ Satellite orbital mechanics in `EST 02`).

### 3. Definitive Terminology & Quantity Signatures ("X is the process/measure of...")
- Table of all newly introduced terms, quantities, units, and symbols.
- Each term must include:
  1. *Formal Board Definition*: Phrased to match PRC identification questions.
  2. *1-Second Keyword Trigger*: The exact phrase that identifies this term in exam stems.
  3. *SI Unit, Symbol & Dimension*.

### 4. Interactive Visualizer Specification
- Self-contained SVG/HTML5 Canvas interactive widget config:
  - *Archetype 1*: Morphological / Geometric Simulator (e.g., Eccentricity slider $e \in [0, 3]$ morphing Circle $\to$ Ellipse $\to$ Parabola $\to$ Hyperbola).
  - *Archetype 2*: Dynamic Parameter Sweeper (e.g., $R, L, C$ slider adjusting transient damping waveforms in real time).
  - *Archetype 3*: Interactive Step-by-Step Reducer (e.g., Thevenin circuit source zeroing animation).

### 5. Governing Theory & Core Mental Anchors
- KaTeX mathematical equations and physical laws.
- Explicit **"Mental Anchor / Rule of Thumb"** callout box in plain English (e.g., *"Inductors oppose sudden changes in current; capacitors oppose sudden changes in voltage."*).

### 6. The Dual-Method Breakdown (Toggleable)
Provide 2 to 3 complete, fully worked numerical sample problems:
- **Problem Statement**: Authentic PRC board-exam style question.
- **[Formal / Academic Solution]**: Complete step-by-step textbook derivation with all formulas, substitutions, and intermediate algebra written out in full KaTeX.
- **[⚡ Board Exam Speed Shortcut]**: High-speed technique (Reverse option testing via `[CALC]`, prime factorization `[FACT]`, ratio elimination, or formula bypass) solving the problem in $\le 20$ seconds.

### 7. Calculator Keystroke Sequences (Karce KC-S991 & Canon F-789SGA)
- Visual `<kbd>` sequences for both PRC-allowed calculator models.
- Step-by-step key sequences for matrix, complex, statistics, integration, equation, or table mode.

### 8. In-Line Concept Checks & Distractor Deconstruction
- At minimum 3, up to 10 multiple-choice questions (A, B, C, D) distributed through the module depending on module scope and depth.
- For EVERY question:
  - Immediate correct answer highlight (Green).
  - **Distractor Deconstructor**: A detailed breakdown for choices A, B, C, and D explaining the exact miscalculation, formula inversion, or conceptual trap that generates that distractor.
  - **Time Benchmark**: Formal method (~120s) vs. Board shortcut (~15s).

### 9. Paired Mastery Challenge CTA
- Direct link/button launching the paired 25Q Review Set, 30Q Diagnostic, 10Q Drill, or 50Q Simulation on `/quizzes/[quizSetId]`.
```

---

## Part 4: Technical Architecture & Repo Organization

### 1. File Storage & Directory Layout
All module data files must be saved under `test-sets/learning-modules/` partitioned by domain:

```
test-sets/learning-modules/
├── math/
│   ├── math-01-01.json
│   ├── math-01-02.json
│   └── ...
├── elecs/
│   ├── elec-01-01.json
│   └── ...
├── geas/
│   ├── geas-01-01.json
│   └── ...
└── est/
    ├── est-01-01.json
    └── ...
```

### 2. Module JSON Data Schema (TypeScript Interface)

Every module JSON file must strictly conform to the following schema:

```typescript
export interface LearningModule {
  id: string; // e.g. "math-09-05"
  code: string; // e.g. "MATH 09-05"
  domain: "MATH" | "ELECS" | "GEAS" | "EST";
  topicCode: string; // e.g. "MATH-09"
  topicTitle: string; // e.g. "Analytic Geometry"
  subtopicTitle: string; // e.g. "Ellipses: Foci, Eccentricity & Directrices"
  order: number; // Sequence index within topic
  pairedQuizSetId: string; // ID from manifest.json, e.g. "math-09-conics-drill"
  
  // Navigation & Header
  toc: Array<{ id: string; title: string; level: number }>;
  
  // Bridges
  prerequisiteBridge?: {
    priorModuleId: string;
    text: string;
  };
  crossSubjectBridges: Array<{
    targetDomain: "MATH" | "ELECS" | "GEAS" | "EST";
    targetTopicCode: string;
    badgeText: string;
    description: string;
  }>;
  
  // Terminology & Identification Signatures
  terms: Array<{
    term: string;
    symbol?: string;
    unit?: string;
    definition: string; // "X is the measure/process of..."
    keywordTrigger: string; // 1-second exam stem recognition trigger
  }>;
  
  // Interactive Visualizer Configuration
  visualizer?: {
    archetype: "geometric" | "parameter_sweep" | "stepper";
    title: string;
    description: string;
    config: {
      canvasWidth: number;
      canvasHeight: number;
      controls: Array<{
        id: string;
        label: string;
        min: number;
        max: number;
        step: number;
        defaultValue: number;
        unit?: string;
      }>;
      renderFunction: string; // Self-contained Canvas/SVG JS rendering logic
    };
  };
  
  // Core Theory
  theory: {
    mentalAnchor: string; // Plain-English rule of thumb
    contentMarkdown: string; // Full KaTeX markdown theory
  };
  
  // Dual-Method Worked Examples
  examples: Array<{
    problemStatement: string;
    formalSolutionMarkdown: string;
    shortcutSolutionMarkdown: string;
    shortcutTimeSeconds: number;
    formalTimeSeconds: number;
  }>;
  
  // Calculator Keystroke Guides
  calculatorGuides: {
    karce: {
      mode: string;
      keystrokes: string[]; // e.g. ["MODE", "5", "3", "a", "=", "b", "=", "c", "="]
      notes: string;
    };
    canon: {
      mode: string;
      keystrokes: string[];
      notes: string;
    };
  };
  
  // In-Line Concept Checks
  conceptChecks: Array<{
    id: string;
    question: string;
    options: {
      A: string;
      B: string;
      C: string;
      D: string;
    };
    correctAnswer: "A" | "B" | "C" | "D";
    distractorDeconstruction: {
      A: string; // Explains trap producing A
      B: string; // Explains trap producing B
      C: string; // Explains trap producing C
      D: string; // Explains trap producing D
    };
    shortcutExplanation: string;
  }>;
}
```

### 3. Platform Integration Features
- **Personal Notebook & Highlights Integration**: All module headings, terms, and example blocks must include unique HTML `id` attributes (e.g. `id="term-eccentricity"`, `id="example-1-shortcut"`) enabling the platform's text-selection highlight popover to anchor user notes and bookmarks directly to specific paragraphs.
- **Search Indexing**: When creating or editing modules, the module ID, title, keywords, and terms must be registered in the platform's omni-search index (`platform/lib/search-index.ts`).

---

## Part 5: Step-by-Step Authoring Workflow for the Agent

When authoring a batch of modules:

1. **Step 1: Check Syllabus & Addendum**:
   Read the target module definition in `SYLLABUS_[SUBJECT]_MODULES.md` and check `SYLLABUS_FINAL_AUDIT_ADDENDUM.md` for any special speed shortcuts, calculator bypasses, or TOS terminology signatures.
2. **Step 2: Read Reference Notes**:
   Open the corresponding PDF/notes in `test-sets/Reference Documents/[Subject]/` to verify the official terminology, problem archetypes, and algebraic derivations.
3. **Step 3: Author Complete JSON Module**:
   Write the complete, unabridged module conforming strictly to `LearningModule` schema under `test-sets/learning-modules/[subject]/[module-id].json`.
4. **Step 4: Verify Paired Quiz Set**:
   Ensure `pairedQuizSetId` correctly matches an existing CSV test set in `manifest.json`.
5. **Step 5: Record Progress**:
   Append authored module IDs to the daily changelog in `test-sets/changelog/YYYY-MM-DD.md`.
