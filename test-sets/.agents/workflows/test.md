---
description: Create a standard 25-item topic mastery test based on reference documents
---

# Topic Mastery Test Workflow (25 Items)

This workflow defines the procedure for generating a standard 25-item topic test for the Philippine ECE Board Exam.

---

## 1. Objectives & Scope
- **Item Count**: Exactly 25 multiple-choice questions.
- **Pedagogical Goal**: Comprehensive topic mastery and problem-solving evaluation. Balances analytical calculations, formula applications, and conceptual theory matching standard board exam distributions.
- **Source of Truth**: Reference files in `Reference Documents/<Subject>/` and schema standards in [schema-output.md](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/test-sets/schema-output.md).

---

## 2. Ingestion & Reference Document Selection

1. **Locate Reference Files**:
   - Check `Reference Documents/<Subject>/` for topic notes, questionnaires, and solution manuals.
2. **Priority**: Reference documents are the primary authority for question styles, terminology, and typical PRC board problems.
3. **Handling Code-Based Requests & "Absolute Reference"**:
   - If a code (e.g., `MATH-02`) or `"absolute reference"` is specified, perform 1:1 transcription from the questionnaires and paired solutions directly into schema-compliant CSV format.
4. **Large or Complex PDFs**:
   - If the source material is dense, image-heavy, or long, create an implementation plan to process and verify the set in manageable chunks.

---

## 3. Schema & Formatting Compliance

Follow all guidelines in [schema-output.md](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/test-sets/schema-output.md):

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
   - Use LaTeX for all mathematical expressions, variables, Greek letters, powers, and units (e.g., `$\alpha$`, `$45^\circ$`, `$\text{kHz}$`).
4. **Columns Breakdown**:
   - `question`: Clean question stem without question numbers or labels.
   - `choice_a` to `choice_d`: Four plausible options without `A.`, `B.`, `C.`, `D.` prefixes.
   - `correct_answer`: Lowercase letter (`a`, `b`, `c`, or `d`).
   - `explanation`: 3–6 sentences with step-by-step solution derivation and distractor analysis using literal `\n`.
   - `image_url`: Empty string (`""`) unless a valid public URL is provided.
   - `subject_tag`: Topic label in Title Case (e.g., `"Algebra"`).

---

## 4. File Organization & Storage

1. **Directory Placement**:
   - Save to `<Subject>/<Topic>/<topic>_test.csv` (e.g., `Mathematics/Calculus/differential_calculus_test.csv`).
2. **Subject Categories**:
   - `Mathematics/`
   - `Electronics Engineering/`
   - `General Engineering and Applied Sciences/`
   - `Electronics Systems and Technologies/`

---

## 5. Verification & Logging

1. **Validation**:
   - Verify 26 total lines (1 header + 25 question rows) and 9 columns per row using a validation script.
2. **Changelog**:
   - Log changes and coverage in `changelog/YYYY-MM-DD.md`.
