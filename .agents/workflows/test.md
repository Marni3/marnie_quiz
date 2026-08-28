---
description: Create a 25-item standard topic review questionnaire based on reference documents
---

# Review Questionnaire Workflow (25 Items)

This workflow defines the procedure for creating a standard 25-item topic review questionnaire for the Philippine ECE Board Exam based on official reference documents and questionnaires.

---

## 1. Objectives & Scope
- **Item Count**: Exactly 25 multiple-choice questions (unless overridden by specific questionnaire length).
- **Pedagogical Tier**: `review` (Topic review & canonical question mastery).
- **Source of Truth**: Reference files in `Reference Documents/<Subject>/` and schema standards in [schema-output.md](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/test-sets/schema-output.md).
- **Naming Standard**: Follow [naming_convention_specification.md](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/test-sets/naming_convention_specification.md).

---

## 2. Ingestion & Absolute Reference Transcription

1. **Locate Questionnaire & Solutions**:
   - In `Reference Documents/<Subject>/`, locate the official questionnaire and solution PDF matching the topic code (e.g., `Math 05-01 to Math 05-04 - Questionnaire.pdf` and `Solutions.pdf`).
2. **Absolute Reference Processing**:
   - Transcribe questions and options with 1:1 fidelity.
   - Format solutions into comprehensive 3–6 sentence educational explanations with literal `\n` linebreaks.
   - Standardize all formulas into LaTeX notation.

---

## 3. Schema & Formatting Compliance

All output must strictly conform to [schema-output.md](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/test-sets/schema-output.md):
- 9 required columns: `question,choice_a,choice_b,choice_c,choice_d,correct_answer,explanation,image_url,subject_tag`
- RFC4180 double-quote wrapping on all cells.
- Clean LaTeX mathematical markup.

---

## 4. File Naming & Organization

Output files must strictly follow [naming_convention_specification.md](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/test-sets/naming_convention_specification.md):

```
[subject]_[topic-code]_[topic-name]_review_[subtopic-scope]_[set-number].csv
```

- **Full Topic Scope Example**: `Mathematics/Trigonometry/math_05_trigonometry_review_all_set01.csv`
- **Subtopic Targeted Scope Example**: `Mathematics/Analytic Geometry/math_09_analytic_geometry_review_01-03_set01.csv`

---

## 5. Verification & Logging

1. **Validation**: Run CSV parser to verify exact line count and 9-column compliance.
2. **Changelog Entry**: Update `changelog/YYYY-MM-DD.md`.
