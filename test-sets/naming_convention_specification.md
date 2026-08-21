# Test Set Naming Convention Specification

This document defines the standardized file naming architecture, token grammar, categorization tiers, and subtopic scoping rules for all test sets across the ECE Board Exam review repository.

---

## 1. Core Architecture & Grammar

Every test set file is formatted as an RFC4180 CSV and follows a deterministic 5-part token structure:

```
[subject]_[topic-code]_[topic-name]_[test-type]_[subtopic-scope]_[set-number].csv
```

### Grammar Component Breakdown

| Token | Description | Format / Allowed Values | Examples |
| :--- | :--- | :--- | :--- |
| **`[subject]`** | PRC Board Exam Subject Area | Lowercase 3–4 letter code | `math`, `elec`, `geas`, `est` |
| **`[topic-code]`** | Canonical Module Number or Code | 2-digit number or shorthand code | `01`, `02`, `03_04`, `05`, `07_08`, `09`, `10`, `11`, `de`, `adv` |
| **`[topic-name]`** | Human-readable topic identifier | Lowercase snake_case | `algebra`, `probability`, `trigonometry`, `analytic_geometry`, `differential_calculus`, `integral_calculus`, `differential_equations`, `advanced_math` |
| **`[test-type]`** | Non-literal pedagogical tier | Fixed 4-tier taxonomy (see Section 2) | `diagnostic`, `review`, `drill`, `simulation` |
| **`[subtopic-scope]`** | Granular subtopic coverage range | `all` for full spectrum, or range `XX-YY` | `all`, `01-03`, `01-07`, `04-06`, `08-14`, `11-21` |
| **`[set-number]`** | Disambiguation & sequence number | `setXX` (2-digit zero-padded index) | `set01`, `set02`, `set03`, `set04` |

---

## 2. Test Type Taxonomy (Pedagogical Tiers)

To avoid overly literal labels like *"short test"* or *"long test"*, all assessments are classified into four distinct educational tiers:

| Tier | Standard Token | Item Count | Pedagogical Objective | Source Material / Methodology |
| :--- | :--- | :---: | :--- | :--- |
| **1. Diagnostic** | `diagnostic` | **30 items** | Pre-assessment & retrieval baseline before studying | Formulated across all topic competencies for diagnostic calibration |
| **2. Review** | `review` | **25 items** | Canonical syllabus mastery & official question recall | 1:1 Absolute Reference transcription of official review questionnaires & solutions |
| **3. Drill** | `drill` | **10 items** | High-velocity conceptual & formula checks | Rapid targeted recall focusing on core formulas, properties, and definitions |
| **4. Simulation** | `simulation` | **50 items** | Full topic endurance & mixed problem-solving exam | Comprehensive mock exam simulating board exam difficulty and pacing |

---

## 3. Subtopic Scoping Rules

When a test set is constructed to assess a **specific subset** of subtopics rather than the entire module spectrum, the `[subtopic-scope]` token explicitly records the covered range:

### Rule 3.1: Full Spectrum Tests (`all`)
When the test draws questions across all subtopics in the module (e.g. all 19 subtopics of Math 01):
- `math_01_algebra_diagnostic_all_set01.csv`
- `math_01_algebra_review_all_set01.csv`
- `math_01_algebra_drill_all_set01.csv`
- `math_01_algebra_simulation_all_set01.csv`

### Rule 3.2: Subtopic-Targeted Tests (`XX-YY`)
When a test specifically covers a focused subset of lectures (e.g., Analytic Geometry lines and circles `Math 09-01` to `Math 09-03`):
- `math_09_analytic_geometry_drill_01-03_set01.csv`
- `math_09_analytic_geometry_review_01-03_set01.csv`
- `math_09_analytic_geometry_diagnostic_04-07_set01.csv`
- `math_11_integral_calculus_drill_01-07_set01.csv`
- `math_11_integral_calculus_drill_08-14_set01.csv`
- `math_11_integral_calculus_drill_15-21_set01.csv`

---

## 4. Multiplicity & Versioning Rules (`setXX`)

When multiple distinct test sets of the same type and scope are created for a single topic (e.g., multiple 10-item drills or multiple 50-item mock simulations):
- The `[set-number]` increments sequentially starting from `set01`.
- Example of multiple drill sets for Trigonometry:
  - `math_05_trigonometry_drill_all_set01.csv` (Drill Set 1)
  - `math_05_trigonometry_drill_all_set02.csv` (Drill Set 2)
  - `math_05_trigonometry_drill_all_set03.csv` (Drill Set 3)
- Example of multiple simulation exams for Differential Calculus:
  - `math_10_differential_calculus_simulation_all_set01.csv` (Mock Exam 1)
  - `math_10_differential_calculus_simulation_all_set02.csv` (Mock Exam 2)

---

## 5. Subject & Directory Mapping

All test files are stored in their respective subject and topic subdirectories:

```
test-sets/
├── Mathematics/
│   ├── Algebra/
│   │   ├── math_01_algebra_diagnostic_all_set01.csv
│   │   ├── math_01_algebra_review_all_set01.csv
│   │   ├── math_01_algebra_drill_all_set01.csv
│   │   └── math_01_algebra_simulation_all_set01.csv
│   ├── Probability/
│   │   ├── math_02_probability_diagnostic_all_set01.csv
│   │   ├── math_02_probability_review_all_set01.csv
│   │   ├── math_02_probability_drill_all_set01.csv
│   │   └── math_02_probability_simulation_all_set01.csv
│   ├── Statistics and Discrete Math/
│   ├── Trigonometry/
│   ├── Geometry/
│   ├── Analytic Geometry/
│   ├── Differential Calculus/
│   ├── Integral Calculus/
│   ├── Differential Equations/
│   └── Advanced Math/
├── Electronics Engineering/
├── General Engineering and Applied Sciences/
└── Electronics Systems and Technologies/
```

---

## 6. Legacy to New Naming Translation Table

| Legacy File Pattern | New Standard File Pattern | Test Type Tier |
| :--- | :--- | :--- |
| `[topic]_pretest.csv` | `[subj]_[code]_[topic]_diagnostic_all_set01.csv` | Diagnostic (30 items) |
| `[code]_[topic]_test.csv` | `[subj]_[code]_[topic]_review_all_set01.csv` | Review (25 items) |
| `[topic]_shorttest.csv` | `[subj]_[code]_[topic]_drill_all_set01.csv` | Drill (10 items) |
| `[topic]_longtest.csv` | `[subj]_[code]_[topic]_simulation_all_set01.csv` | Simulation (50 items) |
