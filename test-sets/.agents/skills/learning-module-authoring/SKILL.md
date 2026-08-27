---
name: learning-module-authoring
description: Authoring interactive, high-speed PRC ECE board exam learning modules (Paul's Online Notes / Brilliant style), Karce KC-S991 & Canon F-789SGA keystroke shortcuts, interactive visualizers, cross-subject conceptual bridges, and multiple-choice concept checks.
---

# Learning Module Authoring & Visualization Standards Skill

This skill defines the architectural, pedagogical, typographical, and cross-subject connection standards for authoring **Interactive Learning Modules** on the Marnie Quiz platform.

---

## 1. Core Architecture & Interconnected Learning

Modules are designed as a **compounding, cohesive learning journey** through the Skill Tree, avoiding isolated silos:

1. **V1 Master Goal: 100% 1-to-1 Transcription of Reviewer Notes (`Reference Documents/`)**:
   - The primary learning modules for V1 are **complete, faithful transcriptions** of all lecture notes in `Reference Documents/` (e.g., Excel Review Center for MATH, ELECS, GEAS, EST).
   - **No Artificial Length Limits**: Modules should be as long, comprehensive, and detailed as the source reviewer notes require, ensuring 100% syllabus fidelity without skipping nuances, classifications, or tables.

2. **Interleaved Pedagogical Reinforcement Flow**:
   - Do not isolate all concept checks or sample problems at the end of the module.
   - Weave them continuously throughout the lesson proper following this micro-cycle:
     $$\text{Concept / Idea} \longrightarrow \text{Immediate In-line Concept Check} \longrightarrow \text{Worked Sample Problem \& Solution} \longrightarrow \text{Follow-up Practice Check} \longrightarrow \text{Calculator Technique (if applicable)}$$
   - This active-recall loop cements understanding immediately before moving on to the next concept.

3. **Mandatory Multimodal PDF-to-Image Protocol**:
   - **NEVER USE PDF TEXT EXTRACTION LIBRARIES**. Raw PDF text extraction corrupts column layouts, tables, math symbols, and handwritten annotations.
   - Render PDF pages as PNG images into `scratch/` using Python (`pymupdf`/`fitz`) and inspect them visually using multimodal capabilities.
   - Reflect all terms in order of appearance and logical dependency (prerequisite terms first).

4. **Introduction & Prerequisite Bridges ("Previously In...")**:
   - Every module begins with an accessible 1–2 sentence bridge connecting earlier lessons to today's topic.
   - Ensures smooth continuity while remaining fully self-contained.

5. **Links to Related Topics (Callout Badges)**:
   - Highlight where the same mathematical or physical model reappears in other exam subjects in plain, direct language:
     - *Math $\to$ Elecs*: Complex numbers (`MATH-13`) $\to$ AC Phasors (`ELEC-04`).
     - *Math $\to$ EST*: Logarithms (`MATH-01`) $\to$ Decibels & Friis Formula (`EST-01`).
     - *Math $\to$ GEAS*: Conic Parabolas (`MATH-09`) $\to$ Satellite Antenna Dishes (`EST-05`) & Optical Mirrors (`GEAS-03`).
     - *DE $\to$ Elecs/EST*: 1st Order ODEs (`MATH-12`) $\to$ RC Transients (`ELEC-05`) & Radiowave Attenuation (`EST-02`).

6. **Plain-English Accessibility & Jargon Elimination**:
   - Strip out dense academic phrasing. Explain concepts with clear physical intuition, analogies, and a crisp **"Mental Anchor / Rule of Thumb"**.

7. **Terms and Definitions (Atomic Standard — Breadth Over Depth)**:
   - Every term features a short, atomic definition (1–2 punchy sentences maximum) arranged in strict dependency order.
   - All symbols formatted in KaTeX `$...$` with 1-second keyword trigger associations.
     - Example (Math): *"**Eccentricity ($e$)**: The constant ratio of the distance from a point on the curve to the focus, to its perpendicular distance to the directrix — the fundamental **'measure of uncircleness'**."*
     - Example (Elecs): *"**Slew Rate ($SR$)**: The **maximum rate of change of output voltage per unit time** ($\text{V}/\mu\text{s}$) an operational amplifier can deliver without distortion."*
     - Example (EST): *"**Capture Effect**: The phenomenon in FM receivers where the **stronger of two co-channel signals completely suppresses the weaker signal** at the limiter/discriminator."*
     - Example (GEAS): *"**Frenkel Defect**: A point defect in an ionic crystal where a **cation leaves its normal lattice site and lodges into a nearby interstitial position**."*
   - **1-Second Trigger Association**: Explicitly highlight the unique identifier keyword so students instantly recognize the exact term being tested upon reading the exam question stem.
   - **Units, Symbols & Dimensions**: Always state the exact SI unit, symbol, and dimension for every physical quantity introduced.

8. **Sample Problems and Solutions (Dual-Method Toggle)**:
   - Segmented UI switcher:
     - `[ Formal / Academic Lecture ]`: Step-by-step textbook derivations.
     - `[ ⚡ Board Exam Shortcut ]`: High-speed elimination, proportionality tricks, calculator bypass, and visual intuition.
     - `[ Combined / Expanded ]`: Full dual breakdown.

---

## 2. Interactive Visualizer Framework

Where physical or geometric intuition is paramount, modules embed lightweight, self-contained SVG/HTML5 canvas visualizers with interactive sliders across 3 functional archetypes:

### Visualizer Archetypes:
1. **Morphological / Geometric Simulators**: Real-time shape morphing (e.g. Conic eccentricity *"measure of uncircleness"*, 3D Antenna radiation patterns, Mohr's stress circle).
2. **Dynamic Parameter Sweepers**: Control knobs live-updating waveforms or spectra (e.g. RLC transient damping curves, AM/FM sideband power, BJT DC load lines, Bode gain/phase plots).
3. **Step-by-Step Interactive Steppers**: User steps through multi-stage reductions (e.g. Thevenin source conversions, Karnaugh map grouping loops).

---

## 3. In-Line Concept Checks & Distractor Analysis

1. **Standardized 4-Choice Multiple Choice (A, B, C, D)**:
   - **Expanded Capacity (5 to 10+ MCQs)**: Scale concept checks per block/module up to 5, 6, or 10+ questions as needed to ensure exhaustive active-recall coverage of all transcribed reviewer concepts.
   - **Instant Tactile Feedback**: Tapping an option highlights green (correct) or red (incorrect) immediately with `<MathText />` formula rendering.
2. **Distractor Deconstructor**:
   - Expands to explain *why* each distractor is wrong and the exact algebra trap that produces it (e.g., *"Choice B is the classic trap of forgetting the $1/2$ factor in triangle area"*).
3. **Time Benchmark & Shortcut Callout**:
   - Contrasts estimated solving time: *Formal Solution (~180s)* vs. *Board Shortcut (~15s)*.
4. **1-to-1 Paired Mastery Challenge & Spaced Repetition (SRS)**:
   - Every module concludes with a direct CTA launch button to its paired full quiz set on `/quizzes/[id]`.
   - **SRS Retention Tracking Roadmap**: Modules will track review timestamps in the database (`last_reviewed_at`) so the Spaced Repetition algorithm can recommend modules or paired quizzes for refresher reviews based on forgetting curves (even for previously mastered topics).

---

## 4. Calculator Techniques (Karce KC-S991 & Canon F-789SGA)

Every quantitative module features dedicated **Calculator Techniques** tailored to PRC-allowed calculator models:
1. **Technique Title & Problem Type**: Name the specific technique (e.g., *"Prime Factor Decomposition & GCD Bypass"*, *"Option Testing via Numerical Substitution"*, *"Complex Matrix Impedance Inversion"*).
2. **Sample Problem First**: Show an authentic PRC board exam sample problem that this technique specifically solves.
3. **Step-by-Step Keystroke Guide with Context**:
   - Exact button sequences with visual `<kbd>` badges.
   - Specific mode setup (e.g., `COMP Mode [MODE] [1]`, `CMPLX Mode [MODE] [2]`, `EQN Mode [MODE] [5]`).
   - Contextual pro-tips explaining calculator memory management, syntax shortcuts, and common execution traps.

- **Karce KC-S991** (Natural Display / V.P.A.M. standard conventions):
  - Quadratic/Cubic: `<kbd>MODE</kbd> <kbd>5</kbd> <kbd>3</kbd>` / `<kbd>MODE</kbd> <kbd>5</kbd> <kbd>4</kbd>`
  - Complex Numbers: `<kbd>MODE</kbd> <kbd>2</kbd>` $\to$ `<kbd>SHIFT</kbd> <kbd>2</kbd> <kbd>3</kbd>` for $r\angle\theta$
  - Table Function: `<kbd>MODE</kbd> <kbd>7</kbd>` (Reverse option testing)
  - Numerical Derivatives / Integrals: `<kbd>SHIFT</kbd> <kbd>d/dx</kbd>` / `<kbd>∫dx</kbd>`
  - Statistics / Linear Regression: `<kbd>MODE</kbd> <kbd>3</kbd>`
- **Canon F-789SGA** (Apps-driven 605-function layout):
  - Equation Mode: `<kbd>MODE</kbd> <kbd>EQN</kbd>` or `<kbd>APPS</kbd>`
  - Complex Conversions: `<kbd>APPS</kbd> <kbd>1</kbd>` or `<kbd>SHIFT</kbd> <kbd>COMPLEX</kbd>`
  - Vector & Matrix: `<kbd>MODE</kbd> <kbd>6</kbd>` (Matrix) / `<kbd>MODE</kbd> <kbd>8</kbd>` (Vector)
  - Unit Conversions & Constants: `<kbd>APPS</kbd> <kbd>CONV</kbd>` / `<kbd>APPS</kbd> <kbd>CONST</kbd>`

---

## 5. Standard Module Blueprint

1. **Header & Section Index**: Continuous code, subtopic name, and sticky Table of Contents.
2. **Introduction & Links to Related Topics**: Friendly introductory hook + cross-subject board connections.
3. **Terms and Definitions**: Atomic definitions in logical dependency order with 1-second keyword trigger associations, units, and KaTeX symbols.
4. **Lesson Proper & Interactive Visualizer (if applicable)**: Clear plain-English conceptual breakdown, core mental anchor callout box, and interactive Canvas simulation.
5. **Sample Problems and Solutions**: Dual-method solutions comparing rigorous step-by-step textbook derivations against $\le 20\text{s}$ board shortcuts.
6. **Calculator Techniques**: Technique title, problem type, sample problem, mode, and step-by-step keystroke guide with context.
7. **In-Line Concept Checks & Distractor Deconstruction**: Multiple choice questions with instant grading, distractor analysis, and 10-second shortcut tricks.
8. **Paired Mastery Challenge & Next Module Bridge**: Direct launch button to paired question set on `/quizzes/[id]` and teaser link to next module.

