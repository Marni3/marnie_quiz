---
name: learning-module-authoring
description: Authoring interactive, high-speed PRC ECE board exam learning modules (Paul's Online Notes / Brilliant style), lesson-first pedagogy, Karce KC-S991 & Canon F-789SGA keystroke shortcuts, interactive declarative visualizers, declarative inline SVG diagrams, cross-subject conceptual bridges, and multiple-choice concept checks.
---

# Learning Module Authoring & Visualization Standards Skill

This skill defines the architectural, pedagogical, typographical, and cross-subject connection standards for authoring **Interactive Learning Modules** on the Marnie Quiz platform.

---

## 1. Pedagogical Flow: Lesson-First Architecture

Modules are structured as an engaging, cohesive educational lesson rather than a dry list of isolated definitions. Always follow this strict section sequence:

```
[1. Prerequisite & Cross-Subject Bridges] 
     ↓
[2. Lesson Proper (Deep Narrative Theory, Equations, Inline Diagrams & Derivations)]
     ↓
[3. Interactive Declarative Visualizer (Topic-Accurate Simulation & Hardware Sliders)]
     ↓
[4. Key Terms, Definitions & Symbol Quick-Reference (Lookup Glossary)]
     ↓
[5. Worked Sample Problems & Solutions (Dual-Method Toggle: Formal vs. ⚡ Shortcut)]
     ↓
[6. Calculator Speed Techniques (Karce KC-S991 & Canon F-789SGA Keystrokes)]
     ↓
[7. In-Line Concept Checks & Direct Distractor Deconstruction]
     ↓
[8. Paired Mastery Challenge Exam (20–25 Decoupled Questions)]
```

### Key Pedagogical Guidelines:

1. **Deep Narrative Lesson Proper (4-Layer Concept Framework)**:
   Never present a dry list of bare equations or isolated bullet points. Every topic, theorem, or governing law in the **Lesson Proper** must be weaved into a 4-layer explanatory flow (Paul's Online Notes / Cisco Networking Academy style):
   - **Layer 1: Intuitive Motivation / The "Why" (1–2 sentences)**: What physical intuition or geometric problem does this solve? Connect it to a tangible mental model (e.g. slope as elevation gained per step forward).
   - **Layer 2: Governing Formula & Variable Breakdown**: State the clean KaTeX equation and immediately define what each symbol represents in context.
   - **Layer 3: Specific Cases & Boundaries**: Explain the physical/mathematical behavior across boundaries (e.g. what happens when slope is $0$ vs. undefined $\theta = 90^\circ$, why perpendicular slopes multiply to $-1$). Always use natural phrasing like **"Specific Cases"** or **"Cases"** (never academic jargon like *"Key Behavioral Conditions"*).
   - **Layer 4: Board Exam Trap Alert & Practical Anchor**: Directly highlight the common algebraic trap or exam misconception (e.g. forgetting the negative sign in $m = -A/B$, or failing to scale parallel line coefficients $A, B$ to match).

2. **Inline Declarative Vector Diagrams (`InlineFigure`)**:
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
   - **Zero External Dependencies**: Renders via pure React SVG with theme-aware palettes.

3. **Natural Phrasing Standard (No Overly Academic Jargon)**:
   - Use straightforward language standard in Philippine engineering review.
   - Use *"Hypotenuse"* instead of *"Euclidean hypotenuse"*.
   - In denominator descriptions: *"Dividing by the magnitude of the line's normal vector converts the scalar value into regular distance units."*

4. **Terms Section as an Indexed Reference Glossary**:
   - The **Terms and Definitions** section follows the lesson proper as a high-density summary and quick-reference lookup.
   - Keep definitions atomic (1–2 crisp sentences) with explicit symbols, SI units, and **1-Second Keyword Trigger Associations** to train instant pattern recognition for board questions.

5. **Dual-Method Problem Solving**:
   - Every worked example demonstrates both the **Academic Derivation** (full rigor, ~60–120s) and the **⚡ Board Exam Shortcut** (elimination, ratio inspection, calculator shortcut, ~5–15s).

6. **Clean Calculator Keystrokes**:
   - Store calculator button sequences as clean, plain token arrays in JSON (e.g. `["SHIFT", "Pol", "4", ",", "7", ")", "="]`), NOT raw `<kbd>` strings.
   - The UI automatically renders each token into tactile, physical keycap badges.

7. **Direct Distractor Deconstruction**:
   - Explain the specific algebra trap or misconception directly (e.g. `"Forgot the negative sign in the slope formula $m = -A/B$."`).
   - Avoid redundant label prefixes like `"Option A ❌ (Distractor Trap):"` or `"(Correct Answer):"` in the text strings.

---

## 2. Standard JSON Module Schema

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
      "notes": "Or use the built-in Polar conversion function: Pol(Δx, Δy) which directly outputs distance r and angle θ in 1 step."
    },
    "canon": {
      "techniqueTitle": "High-Speed Pol(Δx, Δy) Distance Shortcut",
      "problemType": "Distance between (x1, y1) and (x2, y2)",
      "sampleProblem": "Find the distance between (3, -2) and (-1, 5).",
      "mode": "COMP Mode (MODE 1)",
      "keystrokes": ["SHIFT", "Pol", "-", "4", ",", "7", ")", "="],
      "notes": "The display directly yields r = 8.06225... = √65, instantly solving Euclidean coordinate distance."
    }
  },
  "conceptChecks": [
    {
      "id": "chk-01",
      "question": "What is the slope of the straight line defined by the general equation $4x + 6y - 15 = 0$?",
      "options": {
        "A": "$\\frac{2}{3}$",
        "B": "$-\\frac{2}{3}$",
        "C": "$\\frac{3}{2}$",
        "D": "$-\\frac{3}{2}$"
      },
      "correctAnswer": "B",
      "distractorDeconstruction": {
        "A": "Forgot the negative sign in the slope formula $m = -A/B$.",
        "B": "In $Ax + By + C = 0$, slope $m = -A/B = -4/6 = -2/3$.",
        "C": "Inverted the fraction to $B/A$ and dropped the negative sign.",
        "D": "Inverted the fraction to $-B/A$."
      },
      "shortcutExplanation": "Use $m = -A/B = -4/6 = -2/3$ in 1 second."
    }
  ]
}
```

---

## 3. Declarative Visualizer Archetypes

All visualizers must use pure declarative archetypes with zero client-side `eval()` or unvetted scripts:

| Archetype Name | Core Topic Domains | Key Interactive Parameters |
| :--- | :--- | :--- |
| **`cartesian_line`** | Analytic Geometry (Lines, Distance, Angles) | `slope` ($m$), `yIntercept` ($b$), `pointX` ($x_1$), `pointY` ($y_1$) |
| **`polygon_shoelace`** | Triangle Centers, Polygon Area, Centroids | `x1, y1, x2, y2, x3, y3` (Vertex coordinates) |
| **`conic_explorer`** | Circles, Parabolas, Ellipses, Hyperbolas | `eccentricity` ($e$), `semiMajor` ($a$), `semiMinor` ($b$) |
| **`factor_tree`** | Number Theory, Prime Factorization, Radicals | `number` ($n$) |
| **`rlc_resonance`** | AC Circuits, Transient Oscillations | `resistance` ($R$), `inductance` ($L$), `capacitance` ($C$) |
| **`wave_interference`** | Radiowave Propagation, Fiber Optics | `frequency` ($f$), `phaseShift` ($\\phi$), `attenuation` ($\\alpha$) |

---

## 4. Writing Pitfalls & Quality Checklist

Always cross-check against `learning-modules-authoring-pitfalls.md` located at:
`test-sets/Reference Documents/learning-modules-authoring-pitfalls.md`
