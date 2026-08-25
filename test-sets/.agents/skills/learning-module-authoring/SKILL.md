---
name: learning-module-authoring
description: Authoring interactive, high-speed PRC ECE board exam learning modules (Paul's Online Notes / Brilliant style), Karce KC-S991 & Canon F-789SGA keystroke shortcuts, interactive visualizers, cross-subject conceptual bridges, and multiple-choice concept checks.
---

# Learning Module Authoring & Visualization Standards Skill

This skill defines the architectural, pedagogical, typographical, and cross-subject connection standards for authoring **Interactive Learning Modules** on the Marnie Quiz platform.

---

## 1. Core Architecture & Interconnected Learning

Modules are designed as a **compounding, cohesive learning journey** through the Skill Tree, avoiding isolated silos:

1. **Per-Subtopic Scope Grounded in Reference Documents**:
   - Modules are authored **per subtopic** (e.g., `MATH 01-08: Word Problems`, `MATH 09-05 to 09-08: Conic Sections & Eccentricity`, `ELEC 03-04: Thevenin & Norton Theorems`).
   - Content and pedagogical flow are strictly derived from lecture notes and solutions in `Reference Documents/`.
   - Includes a sticky **Table of Contents / Header Index** for rapid section navigation.

2. **Prerequisite Bridges ("Previously In...")**:
   - Every module begins with an optional, collapsible 1–2 sentence bridge referencing earlier Skill Tree concepts (e.g., *"In MATH 05, we defined $e^{j	heta} = \cos	heta + j\sin	heta$. Here in ELEC 04, we apply this rotating phasor to represent AC complex impedance $Z = R + jX_L$."*).
   - Ensures accessibility for examinees following the tree sequentially while remaining fully self-contained.

3. **Cross-Subject Board Connections (Callout Badges)**:
   - Highlight where the same mathematical or physical model reappears in other exam subjects:
     - *Math $	o$ Elecs*: Complex numbers (`MATH-13`) $	o$ AC Phasors (`ELEC-04`).
     - *Math $	o$ EST*: Logarithms (`MATH-01`) $	o$ Decibels & Friis Formula (`EST-01`).
     - *Math $	o$ GEAS*: Conic Parabolas (`MATH-09`) $	o$ Satellite Antenna Dishes (`EST-05`) & Optical Mirrors (`GEAS-03`).
     - *DE $	o$ Elecs/EST*: 1st Order ODEs (`MATH-12`) $	o$ RC Transients (`ELEC-05`) & Radiowave Attenuation (`EST-02`).

4. **Accessible "Soft Intuition" & Physical Anchors**:
   - Provide plain-English, intuitive explanations that avoid dense academic jargon for students who struggle with abstract theory.
   - Always summarize with a crisp **"Mental Anchor / Rule of Thumb"** (e.g., *"Inductors oppose sudden changes in current; capacitors oppose sudden changes in voltage."*).

5. **Interactive Dual-Method Toggle**:
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
   - 3–5 embedded MCQs distributed throughout the subtopic sections.
   - **Instant Tactile Feedback**: Tapping an option highlights green (correct) or red (incorrect) immediately.
2. **Distractor Deconstructor**:
   - Expands to explain *why* each distractor is wrong and the exact algebra trap that produces it (e.g., *"Choice B is the classic trap of forgetting the $1/2$ factor in triangle area"*).
3. **Time Benchmark**:
   - Contrasts estimated solving time: *Formal Solution (~180s)* vs. *Board Shortcut (~15s)*.
4. **1-to-1 Paired Mastery Challenge**:
   - Every module concludes with a direct CTA launch button to its paired full quiz set on `/quizzes/[id]`.

---

## 4. Calculator Keystroke Guides (Karce KC-S991 & Canon F-789SGA)

Every quantitative module features exact button sequences with visual `<kbd>` badges:

- **Karce KC-S991** (Natural Display / V.P.A.M. standard conventions):
  - Quadratic/Cubic: `<kbd>MODE</kbd> <kbd>5</kbd> <kbd>3</kbd>` / `<kbd>MODE</kbd> <kbd>5</kbd> <kbd>4</kbd>`
  - Complex Numbers: `<kbd>MODE</kbd> <kbd>2</kbd>` $	o$ `<kbd>SHIFT</kbd> <kbd>2</kbd> <kbd>3</kbd>` for $rngle	heta$
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
2. **Prerequisite & Cross-Subject Bridges**: Collapsible recall bridge + cross-subject board connections.
3. **Interactive Visualizer (if applicable)**: Canvas/SVG slider demonstrating physical intuition.
4. **Governing Theory & Mental Anchor**: KaTeX formulas with plain-English rules of thumb.
5. **The Dual Breakdown**: Side-by-side or stacked long method vs. board shortcut comparison with toggle.
6. **Calculator Keystrokes**: Visual `<kbd>` sequences for Karce & Canon.
7. **In-Line Multiple Choice Checks & Distractor Deconstruction**: 3–5 embedded MCQs with instant feedback.
8. **Paired Mastery Challenge Link**: Direct launch button to paired question set.
