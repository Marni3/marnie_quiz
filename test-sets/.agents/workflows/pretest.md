---
description: Create a 30-item pre-test focused on assessing current ability and achieving retrieval-first studying
---

# Pre-Test Workflow (30 Items)

This workflow defines the procedure for generating a 30-item diagnostic study set designed for retrieval-first studying and baseline assessment for the Philippine ECE Board Exam.

---

## 1. Objectives & Scope
- **Item Count**: Exactly 30 multiple-choice questions.
- **Pedagogical Goal**: Diagnostic assessment and retrieval practice. Questions must span broad fundamental concepts, foundational definitions, standard problem types, common exam traps, and core formulas for the chosen topic.
- **Source of Truth**: Reference files in `Reference Documents/<Subject>/` and schema standards in [schema-output.md](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/test-sets/schema-output.md).

---

## 2. Ingestion & Reference Document Selection

1. **Locate Reference Files**:
   - Navigate to `Reference Documents/<Subject>/` (e.g., `Reference Documents/Math/`).
   - Identify relevant lecture notes, formula sheets, questionnaires, and solution manuals matching the requested topic (e.g., `Notes - Trigonometry 1.pdf` to `4.pdf`, `Math XX-XX Questionnaire.pdf`, and `Math XX-XX Solutions.pdf`).
2. **Priority**: Reference documents are the primary source material. Use established Board Exam question styles and conventions found in these documents.
3. **Handling Code-Based Requests & "Absolute Reference"**:
   - If invoked with a specific code (e.g., `MATH-05`) or the instruction `"absolute reference"`, locate the exact questionnaire and paired solution PDF.
   - Transcribe questions and solutions 1:1 directly into the standardized CSV format.
4. **Large or Complex PDFs**:
   - If the reference document contains scanned pages, difficult-to-parse formulas, diagrams, or is too long for a single prompt, formulate an implementation plan to process the document in discrete, verifiable chunks.

---

## 3. Schema & Formatting Compliance

All output must strictly conform to [schema-output.md](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/test-sets/schema-output.md):

1. **Header Row (Line 1)**:
   ```csv
   question,choice_a,choice_b,choice_c,choice_d,correct_answer,explanation,image_url,subject_tag
   ```
2. **Cell Wrapping & Delimiters**:
   - Wrap EVERY cell in double quotes (`"..."`).
   - Escape internal double quotes by doubling them (`""`).
   - Use comma (`,`) as the delimiter.
   - Do NOT use actual newlines inside cells. Use literal `\n` characters for line breaks within the `explanation` field.
3. **LaTeX Formatting**:
   - Wrap inline math in single dollar signs (`$formula$`).
   - Wrap standalone/display equations in double dollar signs (`$$formula$$`).
   - Use LaTeX for all symbols, Greek letters, powers, and units (e.g., `$30^\circ$`, `$\theta$`, `$\pi$`, `$9.8\text{ m/s}^2$`). No Unicode mathematical symbols.
4. **Columns Breakdown**:
   - `question`: Unambiguous stem without numbering or prefixes.
   - `choice_a` to `choice_d`: Four plausible options without option letters inside the cell.
   - `correct_answer`: Lowercase single letter (`a`, `b`, `c`, or `d`).
   - `explanation`: 3–6 sentences explaining why the correct option is right and why key distractors are incorrect, using literal `\n` for formatting.
   - `image_url`: Empty string (`""`) unless a valid public URL is available.
   - `subject_tag`: Consistent Title Case topic name (e.g., `"Trigonometry"`).

---

## 4. File Organization & Storage

1. **Directory Placement**:
   - Place output in the corresponding subject and topic folder:
     `Mathematics/<Topic>/<topic>_pretest.csv`
     (e.g., `Mathematics/Trigonometry/trigonometry_pretest.csv`).
2. **Subject Root Folders**:
   - `Mathematics/`
   - `Electronics Engineering/`
   - `General Engineering and Applied Sciences/`
   - `Electronics Systems and Technologies/`

---

## 5. Verification & Logging

1. **Validation**:
   - Verify that the CSV contains exactly 31 lines (1 header + 30 questions) and 9 columns per row using a validation script.
   - Check that all LaTeX formulas render correctly and all quotes are properly escaped.
2. **Changelog Entry**:
   - Append development progress and item summary to `changelog/YYYY-MM-DD.md`.
