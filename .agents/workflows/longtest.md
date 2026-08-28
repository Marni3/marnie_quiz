---
description: Create a comprehensive 50-item mock simulation exam based on reference documents
---

# Simulation Exam Workflow (50 Items)

This workflow defines the procedure for generating a comprehensive 50-item mock simulation exam designed for deep retention, endurance testing, and full topic coverage for the Philippine ECE Board Exam.

---

## 1. Objectives & Scope
- **Item Count**: Exactly 50 multiple-choice questions.
- **Pedagogical Tier**: `simulation` (Comprehensive full-spectrum mock exam & endurance testing).
- **Source of Truth**: Reference files in `Reference Documents/<Subject>/` and schema standards in [schema-output.md](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/test-sets/schema-output.md).
- **Naming Standard**: Follow [naming_convention_specification.md](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/test-sets/naming_convention_specification.md).

---

## 2. Ingestion & Curriculum Coverage
- Questions must be balanced across all subtopics in the module according to board exam difficulty distributions.

---

## 3. Schema & Formatting Compliance
- Strict 9-column format per [schema-output.md](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/test-sets/schema-output.md).
- Complete LaTeX mathematical markup.

---

## 4. File Naming & Organization

Output files must strictly follow [naming_convention_specification.md](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/test-sets/naming_convention_specification.md):

```
[subject]_[topic-code]_[topic-name]_simulation_[subtopic-scope]_[set-number].csv
```

- **Full Topic Scope Example**: `Mathematics/Trigonometry/math_05_trigonometry_simulation_all_set01.csv`
- **Multiple Simulations Example**: `Mathematics/Trigonometry/math_05_trigonometry_simulation_all_set02.csv`
- **Subtopic Targeted Scope Example**: `Mathematics/Analytic Geometry/math_09_analytic_geometry_simulation_01-05_set01.csv`

---

## 5. Verification & Logging
- Validate line count (1 header + 50 questions) and log to daily changelog.
