---
name: learning-module-authoring
description: Authoring interactive, high-speed PRC ECE board exam learning modules (Paul's Online Notes / Brilliant style), 1-to-1 review note page multimodal transcription, lesson-first pedagogy, Karce KC-S991 & Canon F-789SGA keystroke shortcuts, interactive declarative visualizers, declarative inline SVG diagrams, cross-subject conceptual bridges, and multiple-choice concept checks.
---

# Learning Module Authoring & Visualization Standards Skill

This skill defines the architectural, pedagogical, typographical, and cross-subject connection standards for authoring **Interactive Learning Modules** on the Marnie Quiz platform.

---

## 1. Absolute Source of Truth: 1-to-1 Page-by-Page Note Inspection

Every learning module MUST be generated directly from its respective rendered note page PNG in:
`test-sets/scratch/pdf-renders/[subject]/notes___[topic]_[n]/page_01.png`

### Non-Negotiable Extraction Invariants:
1. **Direct Visual Inspection**: The agent must call `view_file` on `page_01.png` before authoring the module.
2. **Complete Transcription**: Every single formula, definition, condition table, geometric relationship, and shortcut note on the page must be transcribed into the module. Never omit or summarize away detailed formulas.
3. **Dedicated Subtopic Granularity**: If a subject has multiple note sheets (e.g. 5 sheets for Plane Geometry), each sheet is authored as its own dedicated subtopic module (e.g. `MATH-10-01` through `MATH-10-05`) with its own companion mastery challenge.

---

## 2. Pedagogical Flow: Lesson-First Architecture

Modules are structured as an engaging, cohesive educational lesson rather than a dry list of isolated definitions. Always follow this strict section sequence:

```
[1. Prerequisite & Cross-Subject Bridges] 
     ↓
[2. Lesson Proper (Deep Narrative Theory, Equations, Inline Diagrams & Derivations)]
     ↓
[3. Compilation of Formulas (High-Visibility Reference Cards)]
     ↓
[4. Interactive Declarative Visualizer (Topic-Accurate Simulation & Hardware Sliders)]
     ↓
[5. Key Terms, Definitions & Symbol Quick-Reference (Lookup Glossary)]
     ↓
[6. Worked Sample Problems & Solutions (Dual-Method Toggle: Formal vs. ⚡ Shortcut)]
     ↓
[7. Calculator Speed Techniques (Karce KC-S991 & Canon F-789SGA Keystrokes)]
     ↓
[8. In-Line Concept Checks & Direct Distractor Deconstruction]
     ↓
[9. Paired Mastery Challenge Exam (20–25 Decoupled Questions)]
```

### Key Pedagogical Guidelines:

1. **Deep Narrative Lesson Proper (4-Layer Concept Framework)**:
   Never present a dry list of bare equations or isolated bullet points. Every topic, theorem, or governing law in the **Lesson Proper** must be weaved into a 4-layer explanatory flow (Paul's Online Notes / Cisco Networking Academy style):
   - **Layer 1: Intuitive Motivation / The "Why" (1–2 sentences)**: What physical intuition or geometric problem does this solve? Connect it to a tangible mental model.
   - **Layer 2: Governing Formula & Variable Breakdown**: State the clean KaTeX equation and immediately define what each symbol represents in context.
   - **Layer 3: Specific Cases & Boundaries**: Explain the physical/mathematical behavior across boundaries (e.g. what happens when slope is $0$ vs. undefined $\theta = 90^\circ$, why perpendicular slopes multiply to $-1$). Always use natural phrasing like **"Specific Cases"** or **"Cases"** (never academic jargon like *"Key Behavioral Conditions"*).
   - **Layer 4: Board Exam Trap Alert & Practical Anchor**: Directly highlight the common algebraic trap or exam misconception.

2. **Compilation of Formulas Section (High-Visibility Formula Cards)**:
   - Every module must include a dedicated `"formulas"` array.
   - Each card features:
     - `title`: Clean, bold name of the formula (e.g. `"Distance from Point to Line"`).
     - `formula`: Prominent centered KaTeX expression in display math (e.g. `"$$d = \\frac{|Ax_1 + By_1 + C|}{\\sqrt{A^2 + B^2}}$$"`).
     - `note` (Optional): Very minimal context, sign convention, or boundary condition.

3. **Inline Declarative Vector Diagrams (`InlineFigure`)**:
   Whenever a geometric setup, vector triangle, or waveform would benefit from visual clarification, embed a declarative JSON block inside `contentMarkdown` using the ` ```diagram ` fence:
   ```diagram
   {
     "caption": "Figure 1: Slope m = tan(θ) = Δy / Δx with angle of inclination θ measured counter-clockwise from +X",
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
   - **Supported Primitives**: `axes`, `grid`, `line`, `segment`, `arrow`, `point`, `arc`, `right_angle`, `projection`, `polygon`, `text`.

4. **Natural Phrasing Standard (No Overly Academic Jargon)**:
   - Use straightforward language standard in Philippine engineering review.
   - Use *"Hypotenuse"* instead of *"Euclidean hypotenuse"*.
   - In denominator descriptions: *"Dividing by the magnitude of the line's normal vector converts the scalar value into regular distance units."*

5. **Terms Section as an Indexed Reference Glossary**:
   - High-density vocabulary summary with explicit symbols, SI units, and **1-Second Keyword Trigger Associations**.

6. **Dual-Method Problem Solving**:
   - Every worked example demonstrates both the **Academic Derivation** (full rigor, ~60–120s) and the **⚡ Board Exam Shortcut** (elimination, ratio inspection, calculator shortcut, ~5–15s).

7. **Clean Calculator Keystrokes**:
   - Store calculator button sequences as clean, plain token arrays in JSON (e.g. `["SHIFT", "Pol", "4", ",", "7", ")", "="]`), NOT raw `<kbd>` strings.

8. **Direct Distractor Deconstruction**:
   - Explain the specific algebra trap or misconception directly. Avoid redundant label prefixes like `"Option A ❌ (Distractor Trap):"` in the text.

---

## 3. Standard JSON Module Schema

Every learning module is stored in `test-sets/learning-modules/[subject]/[code].json`:

```json
{
  "id": "math-12-01",
  "code": "MATH 12-01",
  "domain": "MATH",
  "topicCode": "MATH-12",
  "topicTitle": "Analytic Geometry: Lines, Slopes, and Distance",
  "subtopicTitle": "Lines, Slopes, Angles, and Distance Formulas",
  "order": 1,
  "pairedQuizSetId": "math-12-01-mastery",
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
    "mentalAnchor": "Slope is vertical rise over horizontal run ($m = \\tan\\theta$). Perpendicular lines always multiply to -1 ($m_1 m_2 = -1$). To find distance from a point to a line, evaluate the line equation at $(x_1, y_1)$ and divide by $\\sqrt{A^2 + B^2}$.",
    "contentMarkdown": "### 1. Cartesian Coordinates & Fundamental Distance\n\nIn a 2D Cartesian plane established by René Descartes...\n\n```diagram\n{\n  \"caption\": \"Figure 1: Distance between two points\",\n  \"xRange\": [-2, 6],\n  \"yRange\": [-2, 5],\n  \"elements\": [\n    { \"type\": \"grid\" },\n    { \"type\": \"axes\" }\n  ]\n}\n```\n\n#### Specific Cases:\n- **Horizontal Lines**: Rise is zero...\n\n### 2. Parallelism, Perpendicularity & Angle Between Lines\n\n..."
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
      "definition": "The ratio of vertical change (rise) to horizontal change (run), equal to the tangent of the angle of inclination: $m = \\tan\\theta$.",
      "keywordTrigger": "tangent of inclination / rise over run"
    }
  ],
  "examples": [
    {
      "problemStatement": "Find the perpendicular distance from the point P(3, -2) to the line 5x - 12y + 10 = 0.",
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
      "keystrokes": ["√", "(", "(", "-", "1", "-", "3", ")", "x²", "+", "(", "5", "-", "(", "-", "2", ")", ")", "x²", ")", "="],
      "notes": "Or use Pol(Δx, Δy) for direct distance r and angle θ in 1 step."
    },
    "canon": {
      "techniqueTitle": "High-Speed Pol(Δx, Δy) Distance Shortcut",
      "problemType": "Distance between (x1, y1) and (x2, y2)",
      "sampleProblem": "Find the distance between (3, -2) and (-1, 5).",
      "mode": "COMP Mode (MODE 1)",
      "keystrokes": ["SHIFT", "Pol", "-", "4", ",", "7", ")", "="],
      "notes": "The display directly yields r = 8.06225... = √65, instantly solving Euclidean coordinate distance."
    }
  ],
  "conceptChecks": [
    {
      "id": "chk-01",
      "question": "What is the slope of the straight line defined by the general equation $4x + 6y - 15 = 0$?",
      "options": [
        "$-2/3$",
        "$2/3$",
        "$-3/2$",
        "$3/2$"
      ],
      "correctAnswer": 0,
      "explanation": "In general form $Ax + By + C = 0$, slope $m = -A/B = -4/6 = -2/3$."
    }
  ]
}
```
