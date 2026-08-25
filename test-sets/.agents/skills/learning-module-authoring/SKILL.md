---
name: learning-module-authoring
description: Authoring interactive, high-speed PRC ECE board exam learning modules (Paul's Online Notes / Brilliant style), Karce KC-S991 & Canon F-789SGA keystroke shortcuts, interactive visualizers, and multiple-choice concept checks.
---

# Learning Module Authoring & Visualization Standards Skill

This skill defines the architectural, pedagogical, and typographical standards for authoring **Interactive Learning Modules** on the Marnie Quiz platform.

---

## 1. Core Architecture & Granularity

1. **Per-Subtopic Scope**:
   - Modules are authored **per subtopic** (e.g., `MATH 01-08: Word Problems`, `MATH 09-05 to 09-08: Conic Sections & Eccentricity`, `ELEC 03-04: Thevenin & Norton Theorems`).
   - Content and flow are grounded **strictly in the lecture notes and solution PDFs** in `Reference Documents/`.
   - Modules include a sticky **Table of Contents / Header Index** for rapid section navigation.

2. **Interactive Dual-Method Toggle**:
   - Modules support a clean segmented UI toggle:
     - `[ Formal / Academic Lecture ]`: Step-by-step rigorous textbook derivations and fundamental principles.
     - `[ ⚡ Board Exam Shortcut ]`: High-speed dimensional elimination, proportionality shortcuts, calculator bypass, and visual intuition with clear rationales.
     - `[ Combined / Expanded ]`: Full dual breakdown.

3. **Standardized Multiple-Choice Concept Checks (In-Line)**:
   - All interactive concept checks are standardized as **4-Choice Multiple Choice Questions (A, B, C, D)**.
   - Distributed throughout each subtopic section (3–5 questions per module) with **instant tactile feedback**:
     - Clicking an option immediately reveals green (correct) or red (incorrect).
     - Instantly expands the concise dual explanation + Karce/Canon calculator keystrokes.
   - Modules conclude with a 1-click CTA button launching the paired full mastery challenge test set (`/quizzes/[id]`).

---

## 2. Interactive Visualizations & Geometric Sliders

Where physical or geometric intuition is paramount, modules must embed lightweight, interactive SVG/HTML5 visualizers with real-time parameter sliders:

### Priority Visualizers by Subject Domain:

#### 1. Mathematics (MATH):
- **Conic Sections & Eccentricity Visualizer (`MATH-09`)**:
  - Interactive slider for Eccentricity ($e$):
    - $e = 0$: Perfect Circle ($A = C$).
    - $0 < e < 1$: Ellipse (shows stretching ratio $b/a = \sqrt{1 - e^2}$ and foci moving outward).
    - $e = 1$: Parabola (shows distance to focus = distance to directrix, $d_1 = d_2$).
    - $e > 1$: Hyperbola (shows asymptotic opening angle $	heta = rcsin(1/e)$).
  - Demonstrates the core intuition: *“Eccentricity is literally the measure of uncircleness.”*
- **Trigonometric Unit Circle & Phasor Explorer (`MATH-05`)**:
  - Interactive angle slider ($	heta \in [0^\circ, 360^\circ]$) displaying real-time $\sin	heta$, $\cos	heta$, $	an	heta$, reference triangles, and radian equivalents.
- **Solids of Revolution & Centroid Visualizer (`MATH-11`)**:
  - Interactive slice rotation showing disk, washer, and cylindrical shell generation.

#### 2. Electronics Engineering (ELECS):
- **RLC Transient & Damping Waveform Simulator (`ELEC-05`)**:
  - Real-time sliders for $R, L, C$ demonstrating Overdamped ($\zeta > 1$), Critically Damped ($\zeta = 1$), and Underdamped ($\zeta < 1$) response curves and Q-factor.
- **BJT DC Load Line & Q-Point Interactive Graph (`ELEC-07`)**:
  - Sliders for $V_{CC}, R_C, I_B$ showing the Q-point moving along the load line between Saturation and Cutoff.

#### 3. General Engineering & Applied Sciences (GEAS):
- **Shear & Bending Moment Diagram Visualizer (`GEAS-04`)**:
  - Movable point load slider on a simply supported beam with dynamic $V(x)$ and $M(x)$ graphs.
- **Carnot Cycle P-V / T-S Diagram Explorer (`GEAS-05`)**:
  - Interactive 4-stage thermodynamic loop showing isothermal/adiabatic expansion and compression.

#### 4. Electronics Systems & Technologies (EST):
- **AM / FM Modulation & Spectrum Visualizer (`EST-03`)**:
  - Sliders for modulating frequency $f_m$, carrier frequency $f_c$, and modulation index $m$ showing time-domain envelope and frequency-domain sidebands.
- **Smith Chart Transmission Line Matching Explorer (`EST-04`)**:
  - Slider for load impedance $Z_L$ showing reflection coefficient circle ($\Gamma$), SWR circle, and distance to first voltage maximum/minimum.

---

## 3. Calculator Keystroke Guides (Karce KC-S991 & Canon F-789SGA)

Every quantitative module must feature step-by-step calculator button sequences using visual `<kbd>` badges:

- **Karce KC-S991** (Natural Display / V.P.A.M. standard conventions):
  - Quadratic/Cubic Solver: `<kbd>MODE</kbd> <kbd>5</kbd> <kbd>3</kbd>` / `<kbd>MODE</kbd> <kbd>5</kbd> <kbd>4</kbd>`
  - Complex Numbers: `<kbd>MODE</kbd> <kbd>2</kbd>` $	o$ `<kbd>SHIFT</kbd> <kbd>2</kbd> <kbd>3</kbd>` for $rngle	heta$
  - Table Function: `<kbd>MODE</kbd> <kbd>7</kbd>`
  - Numerical Derivatives / Integrals: `<kbd>SHIFT</kbd> <kbd>d/dx</kbd>` / `<kbd>∫dx</kbd>`
  - Statistics / Linear Regression: `<kbd>MODE</kbd> <kbd>3</kbd>`
- **Canon F-789SGA** (Apps-driven 605-function layout):
  - Equation Mode: `<kbd>MODE</kbd> <kbd>EQN</kbd>` or `<kbd>APPS</kbd>`
  - Complex Conversions: `<kbd>APPS</kbd> <kbd>1</kbd>` or `<kbd>SHIFT</kbd> <kbd>COMPLEX</kbd>`
  - Vector & Matrix Dot/Cross: `<kbd>MODE</kbd> <kbd>6</kbd>` (MATRIX) / `<kbd>MODE</kbd> <kbd>8</kbd>` (VECTOR)
  - Unit Conversions & Constants: `<kbd>APPS</kbd> <kbd>CONV</kbd>` / `<kbd>APPS</kbd> <kbd>CONST</kbd>`

---

## 4. Standard Module Blueprint

1. **Header & Section Index**: Continuous code, subtopic name, and sticky Table of Contents.
2. **Interactive Visualizer (if applicable)**: Canvas/SVG slider demonstrating physical/geometric intuition.
3. **Governing Theory**: Rendered in clean KaTeX equations with variable definitions.
4. **The Dual Breakdown**: Side-by-side or stacked long method vs. board shortcut comparison with toggle.
5. **Calculator Keystrokes**: Visual `<kbd>` sequences for Karce & Canon.
6. **In-Line Multiple Choice Checks**: 3–5 embedded MCQs with instant feedback.
7. **Paired Mastery Challenge Link**: Direct launch button to `/quizzes/[id]`.
