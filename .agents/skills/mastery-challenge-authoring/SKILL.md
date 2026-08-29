---
name: mastery-challenge-authoring
description: Authoring 20-25 question decoupled companion Mastery Challenge test sets for ECE board exam learning modules, with balanced 4-quadrant conceptual and computational depth, direct solutions, and calculator speed shortcuts.
---

# Mastery Challenge Test Authoring Skill

This skill defines the authoring standards, question balance, and schema for **Decoupled Mastery Challenge Sets** companioning each Learning Module on the Marnie Quiz platform.

---

## 1. Architectural Role & Decoupling Model

1. **Decoupled Architecture**:
   - Mastery Challenge sets are **self-contained, module-exclusive exams** stored in `test-sets/learning-modules/[subject]/mastery/[moduleId]-mastery.json`.
   - They launch directly from `/learn/[moduleId]/mastery` and do **not** clutter the primary 190 syllabus question sets in the `/quizzes` library.
2. **Target Length**:
   - Exactly **20 to 25 questions** per mastery set (standard timed exam: 30–45 minutes).
3. **SRS Integration**:
   - Submitting the mastery challenge automatically updates the user's Spaced Repetition (SRS) memory stability for the module's topic code.

---

## 2. Four-Quadrant Question Composition by Archetype

Every Mastery Challenge follows a balanced 4-quadrant distribution adapted to the subject's domain archetype:

### A. 📐 Computational & 📡 Hybrid Archetypes (MATH, Circuits, Signals, Comms)
| Quadrant | Percentage | Target (20–25 Qs) | Focus & Cognitive Objective |
| :--- | :---: | :---: | :--- |
| **Q1: Conceptual Invariants** | **30%** | **6–8 Qs** | Definitions, conditions, physical meaning, and qualitative behavior. |
| **Q2: Standard Computation** | **35%** | **7–9 Qs** | Direct application of core governing formulas and standard numerical solves. |
| **Q3: Multi-Step Solves** | **20%** | **4–5 Qs** | Compound circuit loops, cascade stages, parameter transformations. |
| **Q4: Speed Shortcuts & Traps** | **15%** | **3–4 Qs** | 5-second inspection tricks, calculator shortcuts (`Pol`, mode tricks), sign traps. |

### B. 📜 Qualitative & Statutory Archetypes (RA 9292, Ethics, Materials Science, Env Laws)
| Quadrant | Percentage | Target (20–25 Qs) | Focus & Cognitive Objective |
| :--- | :---: | :---: | :--- |
| **Q1: Statutory & Threshold Recall** | **35%** | **7–9 Qs** | Exact fine schedules, imprisonment ranges, board term limits, enactment dates, quorum requirements. |
| **Q2: Scope of Practice & Classifications** | **30%** | **6–8 Qs** | Distinguishing PECE vs ECE vs ECT duties, seal requirements, foreign reciprocity rules. |
| **Q3: Applied Ethical Dilemmas & Scenarios** | **20%** | **4–5 Qs** | Real-world engineering scenarios testing code of ethics violations, conflict of interest, and liability. |
| **Q4: Wording Traps & Distractor Deconstructions** | **15%** | **3–4 Qs** | *"Shall"* vs *"May"*, negative stem questions (*"which is NOT required"*), tricky legal phrasing. |

---

## 3. Solution Writing Protocol: Direct & Crisp

Solutions must get **straight to the point** without fluff or redundant label clutter:

### Rules:
1. **No Redundant Boilerplate**:
   - Do **NOT** prefix explanations with `"(Correct Answer)"`, `"(Distractor Trap)"`, or `Option A is incorrect because...`.
   - Write direct, rigorous derivations, statutory citations, and physical insights.
2. **Formula / Legal Citation State**:
   - In math: State the formula in KaTeX (`$$d = \frac{|Ax_1 + By_1 + C|}{\sqrt{A^2 + B^2}}$$`).
   - In law: State the exact statutory article (`Under Section 29 of RA 9292...`).
3. **Mandatory ⚡ Speed Shortcut Callout**:
   - Include a 1–2 sentence `⚡ Board Exam Shortcut:` or `⚡ 1-Second Keyword Trigger:` bypass.

---

## 4. Mastery Challenge JSON Schema

Saved at: `test-sets/learning-modules/[subject]/mastery/[moduleId]-mastery.json`

```json
{
  "id": "geas-10-01-mastery",
  "moduleId": "geas-10-01",
  "title": "Mastery Challenge: RA 9292 & ECE Law",
  "topicCode": "GEAS-10",
  "domain": "GEAS",
  "timeLimitMinutes": 35,
  "passingScorePercent": 70,
  "questions": [
    {
      "id": "g10-01-q01",
      "questionNumber": 1,
      "promptText": "Under Section 35 of RA 9292, what is the statutory penalty for any person who engages in the illegal practice of electronics engineering without a valid Certificate of Registration?",
      "choiceA": "Fine of not less than ₱50,000 nor more than ₱500,000",
      "choiceB": "Fine of not less than ₱100,000 nor more than ₱1,000,000, or imprisonment from 6 months to 6 years",
      "choiceC": "Fine of not less than ₱20,000 and 1 year imprisonment",
      "choiceD": "Revocation of business permit and fine of ₱200,000",
      "correctChoice": "B",
      "explanation": "Section 35 of RA 9292 imposes a fine of not less than ₱100,000 nor more than ₱1,000,000, or imprisonment of not less than six (6) months nor more than six (6) years, or both, at the discretion of the court.\n\n⚡ 1-Second Exam Rule: RA 9292 Penal Schedule = ₱100k to ₱1M fine / 6 months to 6 years prison.",
      "category": "statutory",
      "difficulty": "medium"
    }
  ]
}
```
