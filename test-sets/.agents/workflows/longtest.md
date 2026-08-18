---
description: Create a comprehensive 50-item long exam based on reference documents
---

# Comprehensive Long Test Workflow (50 Items)

This workflow defines the procedure for generating a comprehensive 50-item mock exam for full-topic coverage and board exam simulation.

---

## 1. Objectives & Scope
- **Item Count**: Exactly 50 multiple-choice questions.
- **Pedagogical Goal**: Full-depth subject coverage, endurance practice, and comprehensive examination simulation matching PRC ECE board exam scope and difficulty.
- **Source of Truth**: Reference files in `Reference Documents/<Subject>/` and schema standards in [schema-output.md](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/test-sets/schema-output.md).

---

## 2. Ingestion & Reference Document Selection

1. **Locate Reference Files**:
   - Check `Reference Documents/<Subject>/` for topic modules, questionnaires, and solution sets.
2. **Priority**: Reference documents are the primary authority.
3. **Handling Code-Based Requests & "Absolute Reference"**:
   - For multi-part modules (e.g., `MATH 01-01 to Math 01-07`, `MATH 01-08 to Math 01-19`, `MATH-05`), extract and transcribe questionnaires and paired solutions 1:1 into the standardized CSV format.
4. **Large or Complex PDFs**:
   - For 50-item sets, creating an implementation plan is strongly recommended to extract, format, and verify the questions in structured batches before writing the final CSV.

---

## 3. Schema & Formatting Compliance

Conform strictly to [schema-output.md](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/test-sets/schema-output.md):

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
   - Use LaTeX for all mathematical expressions, variables, Greek letters, powers, and units (e.g., `$\lambda$`, `$\Omega$`, `$\text{V}_{\text{rms}}$`).
4. **Columns Breakdown**:
   - `question`: Clear stem without numbering.
   - `choice_a` to `choice_d`: Four plausible options without option letter prefixes.
   - `correct_answer`: Lowercase letter (`a`, `b`, `c`, or `d`).
   - `explanation`: 3–6 sentences containing detailed step-by-step calculations and distractor analysis using literal `\n`.
   - `image_url`: Empty string (`""`) unless a valid public URL is provided.
   - `subject_tag`: Topic label in Title Case (e.g., `"Differential Equations"`).

---

## 4. File Organization & Storage

1. **Directory Placement**:
   - Save to `<Subject>/<Topic>/<topic>_longtest.csv` (e.g., `Mathematics/Differential Equations/differential_equations_longtest.csv`).
2. **Subject Categories**:
   - `Mathematics/`
   - `Electronics Engineering/`
   - `General Engineering and Applied Sciences/`
   - `Electronics Systems and Technologies/`

---

## 5. Verification & Logging

1. **Validation**:
   - Verify 51 total lines (1 header + 50 question rows) and 9 columns per row using a validation script.
2. **Changelog**:
   - Log changes and item breakdown in `changelog/YYYY-MM-DD.md`.
