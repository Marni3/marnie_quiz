---
name: learning-module-authoring
description: Authoring interactive, high-speed PRC ECE board exam learning modules (Paul's Online Notes / Brilliant style), Karce KC-S991 & Canon F-789SGA keystroke shortcuts, and dual-method pedagogical breakdowns.
---

# Learning Module Authoring & Subtopic Standards Skill

This skill defines the architectural, pedagogical, and typographical standards for authoring **Interactive Learning Modules** on the Marnie Quiz platform.

---

## 1. Core Architecture & Granularity

1. **Per-Subtopic Scope**:
   - Modules are authored **per subtopic** (e.g., `MATH 01-08: Word Problems`, `MATH 09-05: Parabolas`, `ELEC 03-04: Thevenin & Norton Theorems`).
   - Content and pedagogical flow are grounded **strictly in the lecture notes and solution PDFs** in `Reference Documents/` (e.g., `Notes - Algebra 1–4.pdf`, `Notes - Plane Geometry.pdf`).
   - For broader subtopics with multiple sub-archetypes, modules include a sticky **Table of Contents / Header Index** for rapid section jumping.

2. **Interactive Long Method vs. Speed Shortcut Toggle**:
   - Modules support an interactive UI toggle (`[ Formal / Academic Lecture ]` vs. `[ ⚡ Board Exam Shortcut ]` vs. `[ Both / Expanded ]`).
   - **Formal Lecture**: Complete mathematical foundation, definitions, and step-by-step rigorous derivation.
   - **Board Exam Shortcut**: High-speed dimensional elimination, proportionality tricks, calculator bypass, and visual intuition with clear rationales.

3. **In-Line Active Retrieval (Micro-Checks Throughout)**:
   - Rather than only placing 1–2 checks at the very end, each conceptual sub-section contains **in-line practical problems** with immediate reveal toggles and Karce/Canon keystroke steps.
   - Every module concludes with a 1-to-1 launch button to its paired mastery challenge test set (`/quizzes/[id]`).

---

## 2. Standard Subtopic Module Structure

Every learning module follows this blueprint:

### 1. Header & Blueprint
- Continuous Course Code & Subtopic Name (e.g. `MATH 01-08: Age, Motion & Mixture Problems`).
- PRC Exam Yield: Estimated question frequency and high-yield rating.
- Sticky Section Index (Table of Contents).

### 2. Core Governing Principles
- Foundational theory and formulas rendered in clean KaTeX display blocks.
- Variable definitions, units, and geometric/circuit diagrams.

### 3. Dual-Method Breakdown (Toggleable)
- **Standard Phrasing**:
  - *"This is the typical solution or long method."*
  - *"When in the boards, the following technique or solution would be faster."*
- Includes concise physical intuition explaining *why* the shortcut works.

### 4. Calculator Keystroke Guides (Karce KC-S991 & Canon F-789SGA)
- Step-by-step button sequences with `<kbd>` badges:
  - **Karce KC-S991**: `[MODE] [5] [3]`, `[MODE] [2]`, `[SHIFT] [2] [3]`, `[MODE] [7]`, `[SHIFT] [d/dx]`, `[∫dx]`, `[MODE] [3]`.
  - **Canon F-789SGA**: `[APPS]`, `[MODE] [EQN]`, `[MODE] [6]` (Matrix), `[MODE] [8]` (Vector), `[APPS] [CONV]`.

### 5. In-Line Practical Problems & Traps
- 3–5 embedded board exam problems distributed across sections.
- Keystroke gotchas: Degree vs. Radian mode, complex angle modes ($rngle	heta$ vs. $a+bi$), table step-size selection.

### 6. Paired Mastery Challenge Link
- Direct 1-click CTA button launching the paired full quiz set on `/quizzes/[id]`.

---

## 3. Typographical & KaTeX Standards

- Inline math: `$x = rac{-b \pm \sqrt{b^2 - 4ac}}{2a}$`
- Polar complex numbers: `$120	ext{ V}ngle 30^\circ$` (use `ngle` and `^\circ`)
- Units: Always formatted with `	ext{}` (e.g. `$25	ext{ m/s}$`, `$50	ext{ \Omega}$`, `$10	ext{ \mu F}$`).
