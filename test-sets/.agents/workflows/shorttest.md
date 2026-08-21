---
description: Create a rapid 10-item targeted concept drill for quick checks and focused formula recall
---

# Concept Drill Workflow (10 Items)

This workflow defines the procedure for generating a 10-item high-velocity concept drill for rapid recall, formula checks, and focused competency reinforcement for the Philippine ECE Board Exam.

---

## 1. Objectives & Scope
- **Item Count**: Exactly 10 multiple-choice questions.
- **Pedagogical Tier**: `drill` (High-velocity conceptual checks & formula recall).
- **Source of Truth**: Reference files in `Reference Documents/<Subject>/` and schema standards in [schema-output.md](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/test-sets/schema-output.md).
- **Naming Standard**: Follow [naming_convention_specification.md](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/test-sets/naming_convention_specification.md).

---

## 2. Ingestion & Topic Selection
- Focus on high-yield formulas, critical definitions, identities, sign conventions, and fundamental theorems.
- Can be generated for the whole module or scoped to a targeted subset of subtopics.

---

## 3. Schema & Formatting Compliance
- Strict 9-column format per [schema-output.md](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/test-sets/schema-output.md).
- Single-line double-quoted cells with literal `\n` linebreaks in explanations.

---

## 4. File Naming & Organization

Output files must strictly follow [naming_convention_specification.md](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/test-sets/naming_convention_specification.md):

```
[subject]_[topic-code]_[topic-name]_drill_[subtopic-scope]_[set-number].csv
```

- **Full Topic Scope Example**: `Mathematics/Trigonometry/math_05_trigonometry_drill_all_set01.csv`
- **Multiple Sets Example**: `Mathematics/Trigonometry/math_05_trigonometry_drill_all_set02.csv`
- **Subtopic Targeted Scope Example**: `Mathematics/Analytic Geometry/math_09_analytic_geometry_drill_01-03_set01.csv`

---

## 5. Verification & Logging
- Validate row count (1 header + 10 questions) and log to daily changelog.
