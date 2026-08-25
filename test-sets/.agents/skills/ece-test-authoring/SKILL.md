---
name: ece-test-authoring
description: Authoring high-yield PRC Electronics Engineering (ECE) Board Exam test sets, question bank engineering, absolute reference transcription, calculator speed techniques, and RFC4180 CSV compliance.
---

# ECE Test Authoring & Question Bank Engineering Skill

This skill provides comprehensive instructions, standards, and best practices for creating, structuring, transcribing, and formatting high-yield study sets and mock exams for the **Philippine Electronics Engineering (ECE) Licensure Examination**.

---

## 1. PRC ECE Board Exam Curriculum & Style Guide

The Philippine ECE Board Exam administered by the Professional Regulation Commission (PRC) evaluates four major subject domains:

| Subject Domain | Weight | Core Competencies & Subject Topics |
| :--- | :---: | :--- |
| **Mathematics** | 20% | Algebra, Trigonometry, Plane & Solid Geometry, Analytic Geometry, Differential Calculus, Integral Calculus, Differential Equations, Advanced Engineering Math, Probability & Statistics, Discrete Math. |
| **Electronics Engineering (Elecs)** | 30% | Electricity & Magnetism, DC/AC Circuits, Network Theorems, Semiconductor Devices & Diodes, BJT/FET/MOSFET amplifiers, Op-Amps, Power Supplies, Industrial Electronics, Digital Logic, Microelectronics, Test & Instrumentation. |
| **General Engineering & Applied Sciences (GEAS)** | 20% | Chemistry for Engineers, Physics 1 (Statics & Dynamics), Physics 2 (Fluids/Optics/Thermal), Strength of Materials, Thermodynamics, Engineering Economics, Electromagnetics, ECE Laws & Ethics (R.A. 9292), Material Science, Computer Programming, Environmental Engineering, Technopreneurship. |
| **Electronics Systems & Technologies (EST)** | 30% | Fundamentals of Communications, Noise & Signal Analysis, Radiowave Propagation, Analog Modulation (AM/FM/PM), Transmission Lines & Waveguides, Antennas & Radiation, Microwave & Radar, Optical Fiber Communications, Telephony & Switching, Digital Communications, Data Communications & Computer Networking, Satellite & Wireless Systems. |

### ECE Question Styles & Patterns
1. **Direct Conceptual & Definition Items**:
   - Exact definitions, component classifications, unit associations, and historical milestones (e.g. Napier vs. Briggs logarithms, Bézout's theorem, Shockley diode equations, Barkhausen criterion).
2. **Formula-Driven Computational Items**:
   - Problems requiring straightforward application of core formulas (e.g. Friis transmission, Shannon channel capacity, Vieta's roots, Op-Amp gain, parallel resonant impedance).
3. **Multi-Step Word Problems**:
   - Mixture/work/rate problems, projectile motion with elevation, antenna radiation efficiency with ground losses, cascade noise figure calculations.
4. **Plausible Distractor Traps**:
   - Sign inversions ($-A/B$ vs. $A/B$), radius vs. diameter confusion, linear ratio vs. decibel conversion ($10\log$ vs. $20\log$), radians vs. degrees, and unscaled trigonometric/parallelogram factors ($1/2$).

---

## 2. When to Use Absolute Reference vs. Synthetic Test Generation

### A. Absolute Reference (1:1 Transcription)
Use **Absolute Reference** when:
- The user requests a **`review`** test set or uses the workflow `/test`.
- The user explicitly instructs `"absolute reference"` or provides an exact module code (e.g. `MATH-05`, `Elec 03-01 to 03-06`, `GEAS 06`).
- You are converting official review center questionnaires and solution manuals into the standardized platform format.

**Absolute Reference Execution Rules**:
1. Locate the paired Questionnaire and Solution PDF in `Reference Documents/<Subject>/`.
2. Inspect the pages using **multimodal visual rendering** to preserve complex mathematical structures, piecewise notations, and diagrams without text degradation.
3. Transcribe question stems and answer choices with **1:1 fidelity**.
4. Standardize and expand solutions: Convert terse handwritten steps into structured, educational 3–6 sentence explanations with literal `\n` linebreaks.
5. Augment problem-solving solutions with **⚡ Calculator Techniques and Speed Shortcuts**.

### B. Synthetic Generation (Diagnostic, Drill & Simulation)
Use **Synthetic Generation** when:
- Creating a **`diagnostic`** pre-test (30 items): Broad diagnostic sampling to test baseline knowledge and activate retrieval prior to studying.
- Creating a **`drill`** (10 items): High-velocity conceptual and formula checkpoints on a specific subtopic or module.
- Creating a **`simulation`** (50 items): Comprehensive full-topic mock exams designed for endurance and mixed-difficulty problem solving.

**Synthetic Authoring Rules**:
1. Ground questions strictly in the topic's lecture notes in `Reference Documents/` (e.g. `Notes - Algebra 1.pdf` to `4.pdf`).
2. Span all secondary topic codes (e.g. `Math 01-01` through `Math 01-19`).
3. Maintain realistic difficulty distributions (40% Easy/Recall, 40% Moderate/Application, 20% Hard/Multi-step).

---

## 3. Reference Library Hierarchy & Supplemental Sources

When searching for source material, definitions, or standard question patterns, follow this priority hierarchy:

1. **Primary Workspace Sources**:
   - `Reference Documents/Math/`: All 10 Mathematics review questionnaires, solution manuals, and formula note sheets.
   - `Reference Documents/Elecs/`: Electronics review questionnaires (Elec 01 to 15) and circuit notes.
   - `Reference Documents/GEAS/`: GEAS review questionnaires (GEAS 01 to 14), R.A. 9292, Engineering Economics, and Physics notes.
   - `Reference Documents/EST/`: EST review questionnaires (EST 01 to 10), Digital Communications, and Transmission line notes.
2. **Canonical ECE Board Textbooks (Secondary References)**:
   - *Mathematics*: Love & Rainville (*Differential and Integral Calculus*), Peterson (*Calculus*), Spiegel (*Advanced Mathematics*).
   - *Electronics*: Boylestad & Nashelsky (*Electronic Devices and Circuit Theory*), Floyd (*Electronic Devices*), Sedra & Smith (*Microelectronic Circuits*).
   - *GEAS*: Hibbeler (*Engineering Mechanics: Statics and Dynamics*), Singer (*Strength of Materials*), Blank & Tarquin (*Engineering Economy*), Brown & LeMay (*Chemistry: The Central Science*).
   - *EST*: Wayne Tomasi (*Electronic Communications Systems: Fundamentals Through Advanced*), Louis Frenzel (*Principles of Electronic Communication Systems*), Behrouz Forouzan (*Data Communications and Networking*).
3. **Philippine Regulatory Standards**:
   - Republic Act No. 9292 (The Electronics Engineering Law of 2004).
   - NTC (National Telecommunications Commission) Memorandum Circulars & Frequency Allocations.
   - KBP (Kapisanan ng mga Brodkaster ng Pilipinas) Broadcast Code of the Philippines.

---

## 4. Solution Writing Protocol: Speed, Foundations & Calculator Techniques

Every problem-solving question must have an educational, high-speed solution formatted in the `explanation` column following this exact 3-part anatomy:

```
[Formal Derivation (2–3 sentences)]
\n⚡ Calculator Technique / Shortcut: [Exact keystrokes, shortcuts, or heuristics (1–2 sentences)]
\n[Distractor Analysis (1 sentence)]
```

### Key Principles for Solution Authoring:
1. **Concise Yet Complete Foundations**:
   - State the governing formula in LaTeX.
   - Show the primary substitution step and final evaluated value.
   - Avoid lengthy algebraic prose; let clean math expressions do the work.
2. **Mandatory Calculator Techniques & Speed Shortcuts**:
   - Provide concrete Karce KC-S991 / Canon F-789SGA calculator keystrokes:
     - `Pol(x2 - x1, y2 - y1)` for 2-second distance and inclination angle computation.
     - `COMPLEX` Mode (MODE 2) for vector addition, coordinate interpolation, and parallelogram vertices ($D = A + C - B$).
     - `STAT` Mode (MODE 3 2) for linear regression, collinearity prediction, and arithmetic progression terms.
     - `EQN` Mode (MODE 5) for simultaneous systems, quadratic roots, and polynomial intercepts.
     - `CALC` Mode for rapid algebraic evaluation without re-typing complex formulas.
     - `Shift-to-Origin` shortcut for reducing polygonal coordinate area to a $2 \times 2$ determinant: $\frac{1}{2}|x_1 y_2 - x_2 y_1|$.
     - 3-Second Line Shortcuts:
       - Parallel to $Ax + By + C = 0$ through $(h, k) \implies Ax + By = Ah + Bk$.
       - Perpendicular to $Ax + By + C = 0$ through $(h, k) \implies Bx - Ay = Bh - Ak$.
3. **Observational & Elimination Heuristics**:
   - Highlight boundary conditions, symmetry, parity, dimensional analysis, and common distractor signs that allow instant elimination of 2 out of 4 choices.

---

## 5. CSV Schema & Naming Compliance

All generated test sets must strictly adhere to repository standards:

### Standard File Naming Format
Follow [naming_convention_specification.md](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/test-sets/naming_convention_specification.md):

```
[subject]_[topic-code]_[topic-name]_[test-type]_[subtopic-scope]_[set-number].csv
```

- **Subject Codes**: `math`, `elec`, `geas`, `est`
- **Test Types**: `diagnostic` (30 items), `review` (25 items), `drill` (10 items), `simulation` (50 items), `conceptual_drill` (15–20 items)
- **Subtopic Scope**: `all` for full spectrum, or range `01-03`, `04-07`, `08-14`, etc.
- **Set Number**: `set01`, `set02`, `set03`, etc.

---

## 6. Conceptual & Qualitative Reasoning Archetypes (PRC Board Style)

When authoring qualitative/conceptual exams (via `/conceptdrill`), utilize the **8 Cognitive Archetypes** to evaluate deep physical mechanics without numerical rote memorization:

1. **Scaling Laws & Proportionality (Laws of Variation)**: Dimensional scaling, inverse-square laws, constant-volume deformation ($R \propto L/r^2 \propto 1/r^4$).
2. **Boundary & Asymptotic Limiting Conditions**: Extreme limits ($f \to 0$ vs $f \to \infty$, $R \to 0$ vs $R \to \infty$, $t \to \infty$ steady state).
3. **Qualitative Phase, Directionality & Sign Relationships**: Leading/lagging relationships, Lenz's law, transistor phase shifts ($180^\circ$ CE vs $0^\circ$ CB/CC), curvature signs ($f''$).
4. **Circuit & System Fault / Topology Modification**: Cascading current/voltage shifts under open/short conditions or feedback loop alterations.
5. **Thermodynamic, Material & Quantum Transitions**: Temperature vs carrier mobility, Fermi levels, stress-strain yield criteria, magnetic hysteresis.
6. **Information Theory, Modulation & Protocol Trade-offs**: Shannon capacity (SNR vs Bandwidth), BER vs constellation order, dispersion limits.
7. **Theorem Invariants & Conservation Duality**: Thevenin/Norton duality, Maximum Power Transfer efficiency (50%), Vector Calculus identities ($\nabla \times \nabla \phi = 0$).
8. **Counter-Intuitive Traps & Fallacy Dissection**: Questions exposing common naive misconceptions (e.g. capacitor charging 50% thermal dissipation invariant).

### CSV Formatting Rules
Per [schema-output.md](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/test-sets/schema-output.md):
- **Exact 9-Column Header Row**:
  `question,choice_a,choice_b,choice_c,choice_d,correct_answer,explanation,image_url,subject_tag`
- **Double-Quote Wrapping**: Wrap EVERY cell in double quotes (`"..."`).
- **Quote Escaping**: Double any internal quotes (`""`).
- **No Literal Newlines**: Use literal `\n` inside explanations.
- **Strict LaTeX Formatting**: Inline `$formula$` and display `$$formula$$`. No Unicode mathematical symbols.
