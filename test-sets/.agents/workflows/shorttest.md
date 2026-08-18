---
description: Create a rapid 10-item quiz for quick conceptual checks and focused recall
---

# Rapid Short Test Workflow (10 Items)

This workflow defines the procedure for generating a 10-item short quiz for rapid concept checks, flash assessment, or quick topic drills for the Philippine ECE Board Exam.

---

## 1. Objectives & Scope
- **Item Count**: Exactly 10 multiple-choice questions.
- **Pedagogical Goal**: Rapid diagnostic check, flashcard-style reinforcement, or targeted sub-topic practice.
- **Source of Truth**: Reference files in `Reference Documents/<Subject>/` and schema standards in [schema-output.md](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/test-sets/schema-output.md).

---

## 2. Ingestion & Reference Document Selection

1. **Locate Reference Files**:
   - Check `Reference Documents/<Subject>/` for specific notes, questionnaires, and solution manuals.
2. **Priority**: Reference documents are the primary authority.
3. **Handling Code-Based Requests & "Absolute Reference"**:
   - If a code (e.g., `MATH-01`) or `"absolute reference"` is specified, extract and transcribe questions directly 1:1 into the schema format.
4. **Large or Complex PDFs**:
   - For short tests, focus directly on high-yield sections of the reference document.

---

## 3. Schema & Formatting Compliance

Follow all rules in [schema-output.md](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/test-sets/schema-output.md):

1. **Header Row (Line 1)**:
   ```csv
   question,choice_a,choice_b,choice_c,choice_d,correct_answer,explanation,image_url,subject_tag
   ```
2. **Cell Wrapping & Delimiters**:
   - Wrap EVERY cell in double quotes (`"..."`).
   - Escape internal double quotes by doubling (`""`).
   - Use comma (`,`) as delimiter.
   - Use literal `\n` tokens for line breaks inside the `explanation` column (never actual newlines).
3. **LaTeX Formatting**:
   - Wrap inline math in `$formula$` and display math in `$$formula$$`.
   - Use LaTeX for all mathematical symbols, units, and expressions.
4. **Columns Breakdown**:
   - `question`: Clean question stem.
   - `choice_a` to `choice_d`: Four plausible options without option letter prefixes.
   - `correct_answer`: Lowercase letter (`a`, `b`, `c`, or `d`).
   - `explanation`: 3–6 sentences explaining the derivation and distractor analysis using literal `\n`.
   - `image_url`: Empty string (`""`) unless a valid public URL is provided.
   - `subject_tag`: Topic label in Title Case (e.g., `"Probability"`).

---

## 4. File Organization & Storage

1. **Directory Placement**:
   - Save to `<Subject>/<Topic>/<topic>_shorttest.csv` (e.g., `Mathematics/Probability/probability_shorttest.csv`).
2. **Subject Categories**:
   - `Mathematics/`
   - `Electronics Engineering/`
   - `General Engineering and Applied Sciences/`
   - `Electronics Systems and Technologies/`

---

## 5. Verification & Logging

1. **Validation**:
   - Verify 11 total lines (1 header + 10 question rows) and 9 columns per row using a validation script.
2. **Changelog**:
   - Log changes in `changelog/YYYY-MM-DD.md`.
