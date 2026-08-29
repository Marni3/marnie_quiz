---
name: learning-module-authoring
description: Authoring interactive, high-speed PRC ECE board exam learning modules (Paul's Online Notes / Brilliant style), 1-to-1 review note page multimodal transcription, lesson-first pedagogy, Karce KC-S991 & Canon F-789SGA keystroke shortcuts, interactive declarative visualizers, declarative inline SVG diagrams, cross-subject conceptual bridges, and multiple-choice concept checks.
---

# Learning Module Authoring & Visualization Standards Skill

This skill defines the architectural, pedagogical, typographical, and domain-adapted standards for authoring **Interactive Learning Modules** on the Marnie Quiz platform.

---

## 1. Absolute Source of Truth: 1-to-1 Page-by-Page Note Inspection

Every learning module MUST be generated directly from its respective rendered note page PNG in:
`test-sets/scratch/pdf-renders/[subject]/notes___[topic]_[n]/page_01.png`

### Non-Negotiable Extraction Invariants:
1. **Direct Visual Inspection**: The agent must call `view_file` on `page_01.png` before authoring the module.
2. **Complete Transcription**: Every single formula, statutory provision, definition, condition table, geometric relationship, and shortcut note on the page must be transcribed into the module. Never omit or summarize away detailed formulas or legal articles.
3. **Dedicated Subtopic Granularity**: If a subject has multiple note sheets (e.g. 5 sheets for Plane Geometry), each sheet is authored as its own dedicated subtopic module (e.g. `MATH-10-01` through `MATH-10-05`) with its own companion mastery challenge.

---

## 2. The 3-Tier Topic Classification Engine

Before writing JSON, evaluate the subject material and classify it into one of **three distinct archetypes**:

```
                                  Domain Evaluation
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        ▼                                ▼                                ▼
[ 📐 Computational ]            [ 📡 Hybrid Systems ]          [ 📜 Qualitative/Statutory ]
  (MATH, AC/DC Circuits,         (Digital Comms, Fiber,          (RA 9292, Ethics, Contracts,
   Calculus, DE, Signals)         Radar, Microelectronics)        Material Science, Env Laws)
        │                                │                                │
  • Heavy KaTeX Derivations       • System Architecture & Tables   • Statutory / Comparison Tables
  • Formal vs ⚡ Shortcuts        • Governing Equations (KaTeX)    • 5–10 Realistic Case Scenarios
  • Karce / Canon Keystrokes      • 5–8 Dual Solves + Block Diag   • 1-Second Keyword Triggers
  • 2D Continuous Sandbox         • Karce/Canon Shortcuts          • Threshold & Penalty Traps
  • 4–6 Concept Checks            • 8–12 Concept Checks            • 12–20 Concept Checks
  • Optional Written Challenges   • 3 Written Challenges           • 3–5 Written Challenges
```

---

## 3. Universal Pedagogical Invariants (All Modules)

1. **Approachable Peer-Tutor Tone (Paul's Online Notes / Brilliant style)**:
   - Direct, intuitive, first-principles explanations. Use natural phrasing (e.g. *"Hypotenuse"*, *"Specific Cases"*). Avoid dry, overly stiff academic jargon.
2. **Strict KaTeX Math Formatting**:
   - Inline expressions: `$x^2 + y^2 = r^2$`
   - Display equations: `$$d = \frac{|Ax_1 + By_1 + C|}{\sqrt{A^2 + B^2}}$$`
   - In JSON strings, ALWAYS double-escape backslashes: `"$$\\frac{a}{b}$$"`, `"\\tau"`, `"\\sqrt{x}"`.
3. **Clean Dynamic Table of Contents (No Hardcoded Numbers in Titles)**:
   - NEVER write hardcoded numbers in JSON TOC titles:
     - ✅ `"title": "Lesson Proper"`, `"title": "Compilation of Formulas"`, `"title": "Active Recall Written Challenge"`
     - ❌ `"title": "2. Lesson Proper"`, `"title": "8. Concept Checks"`
   - The UI automatically renders continuous sequential numbers (`1.`, `2.`, `3.`, `4.`) for whichever sections are present.
4. **In-Line Concept Checks with Immediate Distractor Deconstructions**:
   - Every MCQ choice must include a crisp explanation of why it is correct or why it is a trap.
5. **Decoupled Companion Mastery Challenge**:
   - Every module has a paired 20–25 question exam stored in `test-sets/learning-modules/[subject]/mastery/[moduleId]-mastery.json`.

---

## 4. Playbook A: Computational & Hybrid Modules (Math, Circuits, EST, Waves)

### 1. 4-Layer Concept Explanatory Flow
Every mathematical concept in the **Lesson Proper** follows a 4-layer flow:
- **Layer 1: Intuitive Motivation / The "Why" (1–2 sentences)**: What physical or geometric problem does this solve?
- **Layer 2: Governing Formula & Variable Breakdown**: Clean KaTeX formula with all variables defined in context.
- **Layer 3: Specific Cases & Boundaries**: Physical/mathematical behavior at boundaries ($t=0, t=\infty, \theta=90^\circ$).
- **Layer 4: Board Exam Trap Alert**: Highlight the exact algebraic, sign, or unit mistake PRC examinees make.

### 2. Declarative Inline Vector Diagrams (` ```diagram `)
Embed vector geometry, circuit setups, or waveforms using declarative JSON diagrams inside `contentMarkdown`:
```diagram
{
  "caption": "Figure 1: Slope m = tan(θ) = Δy / Δx with inclination angle θ from +X",
  "xRange": [-2, 6],
  "yRange": [-2, 5],
  "elements": [
    { "type": "grid" },
    { "type": "axes" },
    { "type": "line", "from": [-1, -0.75], "to": [5, 3.75], "color": "#d97757", "width": 2.5 },
    { "type": "point", "at": [4, 3], "label": "P(4, 3)", "color": "#fbbf24" },
    { "type": "projection", "from": [4, 3], "to": [4, 0], "label": "Δy = 3", "color": "#f43f5e" },
    { "type": "segment", "from": [0, 0], "to": [4, 0], "label": "Δx = 4", "color": "#38bdf8" },
    { "type": "right_angle", "at": [4, 0], "size": 8 },
    { "type": "arc", "center": [0, 0], "radius": 24, "startAngle": 0, "endAngle": 36.87, "label": "θ = 36.9°", "color": "#38bdf8" }
  ]
}
```
*Supported Primitives*: `axes`, `grid`, `line`, `segment`, `arrow`, `point`, `arc`, `right_angle`, `projection`, `polygon`, `text`.

### 3. Interactive Continuous Visualizer Sandbox
For topics with continuous parameter sweeps (e.g. phasors, RLC resonance, conic sections, coordinate lines):
- Include a `visualizer` object with `archetype`, `title`, `description`, and `controls` array (`min`, `max`, `step`, `defaultValue`).

### 4. Dual-Method Problem Solving
Every worked example features:
- **Formal Derivation** (full rigor, ~60–120s).
- **⚡ Board Exam Shortcut** (elimination, ratio inspection, calculator shortcut, ~5–15s).

### 5. Contextualized Scientific Calculator Techniques (Karce & Canon)
Never output bare, context-free button sequences. Always follow the **3-part structure**:
1. **`whyItWorks`**: 1–2 sentence explanation of the underlying numerical shortcut (e.g. reverse derivative matching, STAT regression interpolation, complex polar conversion).
2. **`keystrokes`**: Clean token array (e.g. `["SHIFT", "d/dx", "(", "2", "x", ")", ",", "2", ")", "="]`).
3. **`notes` & `searchAdvisory`**:
   - `notes`: Specific test value rules (e.g. *"Pick test point x=2; avoid x=0 or x=1 where exponential terms degenerate"*).
   - `searchAdvisory`: Specific YouTube/web search query for video walkthroughs (e.g. *"Search 'Reverse Derivative CALC Technique Canon F-789SGA' for full video walkthroughs on higher-order equations"*).

---

## 5. Playbook B: Qualitative & Statutory Modules (Laws, Ethics, Materials, Standards)

### 1. Statutory & Classification Comparison Matrices (`comparisonTables`)
Dense qualitative topics rely on structured comparison tables. Include as many as needed without limit:
- Professional categories (PECE vs ECE vs ECT scope, seal, qualifications, penal provisions).
- Environmental standards (RA 8749 Clean Air vs RA 9275 Clean Water vs PD 1586 EIS).
- Material crystalline lattices (BCC vs FCC vs HCP coordination numbers, atomic packing factors).

### 2. Applied Case Dilemmas & Scenarios (5–10 Samples)
Replace numerical calculation problems with **5 to 10 realistic board exam scenario dilemmas**:
- Dilemmas on signing plans without personal supervision (Sec. 29 & 32).
- Foreign reciprocity and temporary special permit conditions (Sec. 23 & 26).
- CPD point compliance thresholds and license renewal rules.
- Distinguishing illegal practice penalties (fines + imprisonment) from administrative sanctions.

### 3. 1-Second Keyword Trigger Glossary
Include vocabulary terms with explicit **1-Second Keyword Trigger Associations** for rapid identification.

### 4. Scaled In-Line Concept Checks (12 to 20 MCQs)
Dense conceptual modules require deeper active retrieval coverage. Provide **12–20 concept checks** with full distractor deconstructions.

### 5. Active Recall Written Challenges (`writtenChallenges`)
Include **3 to 5 open-ended generative recall prompts** testing knowledge without cues:
- Prompt text asking the examinee to synthesize or list provisions from memory.
- `modelAnswer`: Topnotcher model explanation.
- `keyCheckpoints`: 3–5 bullet point grading rubric for instant self-checking.

### 6. Clean Omission of Irrelevant Sections
In pure qualitative modules:
- **Omit** `formulas`.
- **Omit** `calculatorGuides`.
- **Omit** `visualizer`.

---

## 6. Complete Reference JSON Schemas

### Template A: Computational & Analytical Module (e.g. `MATH 12-01`)

```json
{
  "id": "math-12-01",
  "code": "MATH 12-01",
  "domain": "MATH",
  "topicCode": "MATH-12",
  "topicTitle": "Analytic Geometry: Lines & Angles",
  "subtopicTitle": "Lines, Slopes, Angles, and Distance Formulas",
  "order": 1,
  "pairedQuizSetId": "math-12-01-mastery",
  "toc": [
    { "id": "sec-prereq-bridges", "title": "Prerequisite Bridges", "level": 2 },
    { "id": "sec-theory", "title": "Lesson Proper", "level": 2 },
    { "id": "sec-formulas", "title": "Compilation of Formulas", "level": 2 },
    { "id": "sec-visualizer", "title": "Interactive Sandbox", "level": 2 },
    { "id": "sec-terminology", "title": "Key Terms & Definitions", "level": 2 },
    { "id": "sec-dual-method", "title": "Sample Problems", "level": 2 },
    { "id": "sec-calculator", "title": "Calculator Techniques", "level": 2 },
    { "id": "sec-concept-checks", "title": "In-Line Concept Checks", "level": 2 },
    { "id": "sec-mastery-challenge", "title": "Paired Mastery Challenge", "level": 2 }
  ],
  "prerequisiteBridge": {
    "text": "In Plane Trigonometry and Algebra, we evaluated angles and linear relations algebraically. Now, we place these straight lines onto the Cartesian coordinate plane..."
  },
  "crossSubjectBridges": [
    {
      "badgeText": "Math → Elecs",
      "targetTopicCode": "ELEC-01",
      "description": "DC Load Lines and Q-point calculations use linear general equations $V_{CC} - I_C R_C - V_{CE} = 0$ with slope $m = -1/R_C$."
    }
  ],
  "theory": {
    "mentalAnchor": "Slope is vertical rise over horizontal run ($m = \\tan\\theta$). Perpendicular lines always multiply to -1 ($m_1 m_2 = -1$). Point-to-line distance divides the evaluated line equation by $\\sqrt{A^2 + B^2}$.",
    "contentMarkdown": "### 1. Cartesian Coordinates & Fundamental Distance\n\nIn a 2D Cartesian plane...\n\n```diagram\n{\n  \"caption\": \"Figure 1: Distance between two points P1 and P2\",\n  \"xRange\": [-2, 6],\n  \"yRange\": [-2, 5],\n  \"elements\": [\n    { \"type\": \"grid\" },\n    { \"type\": \"axes\" },\n    { \"type\": \"line\", \"from\": [-1, -0.75], \"to\": [5, 3.75], \"color\": \"#d97757\", \"width\": 2.5 }\n  ]\n}\n```\n\n#### Specific Cases:\n- **Horizontal Lines**: Slope is zero ($m = 0$)...\n\n### 2. Parallelism, Perpendicularity & Angle Between Lines\n\n..."
  },
  "formulas": [
    {
      "id": "f-1201-01",
      "title": "Distance Between Two Points",
      "formula": "$$d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$",
      "note": "Derived directly from the Pythagorean theorem."
    },
    {
      "id": "f-1201-02",
      "title": "Slope of a Straight Line",
      "formula": "$$m = \\frac{y_2 - y_1}{x_2 - x_1} = \\tan\\theta = -\\frac{A}{B}$$",
      "note": "For vertical lines, slope is undefined (tan 90°)."
    }
  ],
  "visualizer": {
    "archetype": "cartesian_line",
    "title": "Interactive Line Slope & Distance Explorer",
    "description": "Adjust slope and point coordinates to observe live normal distance and angles.",
    "config": {
      "canvasWidth": 640,
      "canvasHeight": 320,
      "controls": [
        { "id": "slope", "label": "Slope (m)", "min": -2.5, "max": 2.5, "step": 0.25, "defaultValue": 0.75 },
        { "id": "yIntercept", "label": "y-Intercept (b)", "min": -40, "max": 40, "step": 5, "defaultValue": 20 }
      ]
    }
  },
  "terms": [
    {
      "term": "Slope of a Line",
      "symbol": "$m$",
      "unit": "Dimensionless",
      "definition": "The ratio of vertical change (rise) to horizontal change (run), equal to the tangent of inclination: $m = \\tan\\theta$.",
      "keywordTrigger": "tangent of inclination / rise over run"
    }
  ],
  "examples": [
    {
      "problemStatement": "Find the perpendicular distance from point P(3, -2) to the line 5x - 12y + 10 = 0.",
      "formalSolutionMarkdown": "#### Step 1: Identify coefficients\n$A = 5, B = -12, C = 10$...\n$$d = \\frac{|Ax_1 + By_1 + C|}{\\sqrt{A^2 + B^2}} = \\frac{49}{13} \\approx 3.77$$",
      "shortcutSolutionMarkdown": "#### ⚡ 5-Second Direct Calculation\n1. Evaluate numerator: $5(3) - 12(-2) + 10 = 49$.\n2. Denominator is the 5-12-13 triple ($13$).\n3. $d = 49/13 \\approx 3.77$.",
      "formalTimeSeconds": 60,
      "shortcutTimeSeconds": 5
    }
  ],
  "calculatorGuides": {
    "karce": {
      "techniqueTitle": "Direct Vector Distance & Angle Evaluation",
      "problemType": "Points, Distance and Angle between Slopes",
      "sampleProblem": "Find the distance between P1(3, -2) and P2(-1, 5).",
      "mode": "COMP Mode (MODE 1)",
      "whyItWorks": "The calculator's Pol function converts Cartesian differences (Δx, Δy) into polar vector magnitude r and angle θ in a single operation, bypassing the square root expansion.",
      "keystrokes": ["SHIFT", "Pol", "-", "4", ",", "7", ")", "="],
      "notes": "💡 Keystroke Rule: Input Δx = x2 - x1 and Δy = y2 - y1. The display directly yields r = 8.06225 (√65).",
      "searchAdvisory": "For advanced coordinate geometry speed tricks, search 'Pol function coordinate geometry Karce KC-S991'."
    },
    "canon": {
      "techniqueTitle": "High-Speed Pol(Δx, Δy) Distance Shortcut",
      "problemType": "Distance between (x1, y1) and (x2, y2)",
      "sampleProblem": "Find the distance between (3, -2) and (-1, 5).",
      "mode": "COMP Mode (MODE 1)",
      "whyItWorks": "Uses internal rectangular-to-polar conversion to solve Euclidean distance in 1 step.",
      "keystrokes": ["SHIFT", "Pol", "-", "4", ",", "7", ")", "="],
      "notes": "💡 Display yields r = 8.06225... = √65 instantly.",
      "searchAdvisory": "Search 'Canon F-789SGA Pol rectangular coordinate technique' for video breakdowns."
    }
  },
  "conceptChecks": [
    {
      "id": "chk-01",
      "question": "What is the slope of the straight line defined by $4x + 6y - 15 = 0$?",
      "options": {
        "A": "$-2/3$",
        "B": "$2/3$",
        "C": "$-3/2$",
        "D": "$3/2$"
      },
      "correctAnswer": "A",
      "distractorDeconstruction": {
        "A": "Correct: $m = -A/B = -4/6 = -2/3$.",
        "B": "Sign error: forgot the negative sign in $-A/B$.",
        "C": "Reciprocal error: computed $-B/A$ instead of $-A/B$.",
        "D": "Inverted sign and reciprocal."
      },
      "shortcutExplanation": "In general form $Ax + By + C = 0$, slope is always $-A/B$."
    }
  ]
}
```

---

### Template B: Qualitative & Statutory Module (e.g. `GEAS 10-01`)

```json
{
  "id": "geas-10-01",
  "code": "GEAS 10-01",
  "domain": "GEAS",
  "topicCode": "GEAS-10",
  "topicTitle": "ECE Laws, Ethics, Contracts & RA 9292",
  "subtopicTitle": "Republic Act No. 9292: The Electronics Engineering Law of 2004",
  "order": 1,
  "pairedQuizSetId": "geas-10-01-mastery",
  "toc": [
    { "id": "sec-prereq-bridges", "title": "Prerequisite Bridges", "level": 2 },
    { "id": "sec-theory", "title": "Lesson Proper", "level": 2 },
    { "id": "sec-comparison-tables", "title": "Statutory Comparison Matrices", "level": 2 },
    { "id": "sec-terminology", "title": "Key Terms & Definitions", "level": 2 },
    { "id": "sec-dual-method", "title": "Board Exam Case Dilemmas", "level": 2 },
    { "id": "sec-concept-checks", "title": "In-Line Concept Checks", "level": 2 },
    { "id": "sec-written-challenge", "title": "Active Recall Written Challenge", "level": 2 },
    { "id": "sec-mastery-challenge", "title": "Paired Mastery Challenge", "level": 2 }
  ],
  "prerequisiteBridge": {
    "text": "Before RA 9292 was enacted on April 17, 2004, the profession was governed by RA 5734 (The Electronics and Communications Engineering Act of 1969)..."
  },
  "crossSubjectBridges": [
    {
      "badgeText": "GEAS → EST",
      "targetTopicCode": "EST-01",
      "description": "NTC broadcast station permits, telecommunications franchise requirements, and commercial spectrum management all require certified PECE sign-offs under Section 5."
    }
  ],
  "theory": {
    "mentalAnchor": "RA 9292 created 3 distinct categories: PECE (Full practice, seal, sole authority to sign/seal plans), ECE (General practice, no seal), and ECT (Non-engineering technical support under supervision).",
    "contentMarkdown": "### 1. Legislative Background & Repealing Clause\n\nRepublic Act No. 9292 was signed into law on **April 17, 2004**...\n\n### 2. Categories of Practice & Scope\n\n..."
  },
  "comparisonTables": [
    {
      "id": "tbl-categories",
      "title": "Comparison of Professional Categories under RA 9292",
      "headers": ["Feature", "PECE", "ECE", "ECT"],
      "rows": [
        ["Scope of Practice", "Full authority across all domains", "General engineering practice", "Technical, non-engineering tasks"],
        ["Official Seal", "Mandatory official dry seal", "No seal allowed", "No seal allowed"],
        ["Signing of Plans", "Sole legal authority to sign/seal", "Not permitted to sign/seal", "Not permitted"],
        ["Experience Required", "Valid ECE + 7 years active practice", "Passed ECE Licensure Exam", "Passed ECT Licensure Exam or 3-yr grad"]
      ]
    }
  ],
  "terms": [
    {
      "term": "Professional Electronics Engineer (PECE)",
      "definition": "A person registered with the Board and PRC with full authority to sign, seal, and provide sole certification for all electronics plans and specs.",
      "keywordTrigger": "sole authority to sign and seal / 7 years active practice"
    }
  ],
  "examples": [
    {
      "problemStatement": "Case Scenario: An ECE licensee with 5 years experience prepares a telecommunication tower antenna design and affixes an official dry seal to the engineering drawings. Is this valid?",
      "formalSolutionMarkdown": "#### Legal Assessment:\nUnder **Section 5 and Section 29 of RA 9292**, only a registered **Professional Electronics Engineer (PECE)** with a valid Certificate of Registration is legally authorized to sign and seal electronics plans. A registered ECE without PECE upgrade does NOT possess a seal and is strictly prohibited from sealing plans.",
      "shortcutSolutionMarkdown": "#### ⚡ 1-Second Exam Rule\nECE = No seal. Only PECE can sign and seal plans. Action is an illegal practice violation under Sec. 35.",
      "formalTimeSeconds": 60,
      "shortcutTimeSeconds": 5
    }
  ],
  "conceptChecks": [
    {
      "id": "chk-01",
      "question": "Which of the following professional ranks possesses the sole statutory authority to sign and seal electronics engineering plans under RA 9292?",
      "options": {
        "A": "Registered Electronics Engineer (ECE)",
        "B": "Professional Electronics Engineer (PECE)",
        "C": "Electronics Technician (ECT)",
        "D": "Chief Telecommunications Engineer"
      },
      "correctAnswer": "B",
      "distractorDeconstruction": {
        "A": "ECEs have general practice rights but are strictly barred from sealing plans.",
        "B": "PECE holds sole authority under Section 5 and Section 29.",
        "C": "ECTs are sub-professionals performing technician-level work.",
        "D": "Not a statutory title under RA 9292."
      }
    }
  ],
  "writtenChallenges": [
    {
      "id": "wc-01",
      "prompt": "List the three (3) professional categories created by RA 9292 and identify which category has the sole authority to seal engineering documents.",
      "modelAnswer": "1. Professional Electronics Engineer (PECE) — Holds sole statutory authority to sign and seal plans.\n2. Electronics Engineer (ECE) — General professional practice, no seal.\n3. Electronics Technician (ECT) — Non-engineering technical support.",
      "keyCheckpoints": [
        "PECE (sole authority to seal)",
        "ECE (general practice, no seal)",
        "ECT (technician level)"
      ]
    }
  ]
}
```
