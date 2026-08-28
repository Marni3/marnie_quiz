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

## 2. Four-Quadrant Question Composition (Balance Protocol)

Every Mastery Challenge must strictly follow this **4-Quadrant pedagogical distribution** to balance deep conceptual understanding with high-speed problem solving:

| Quadrant | Percentage | Target (for 20–25 items) | Focus & Cognitive Objective |
| :--- | :---: | :---: | :--- |
| **Q1: Conceptual Understanding & Theoretical Invariants** | **30%** | **6–8 Questions** | Tests foundational definitions, conditions, geometric invariants, qualitative comparisons, and physical meaning (e.g. *Why does eccentricity determine conic type? Under what condition is a slope undefined?*). |
| **Q2: Standard Formula & Direct Computation** | **35%** | **7–9 Questions** | Direct application of core formulas, equation conversions, and parameter evaluations standard in PRC licensure exams. |
| **Q3: Multi-Step & Applied Problem Solving** | **20%** | **4–5 Questions** | Compound setups, coordinate intersections, geometric area/distance combinations, and real-world engineering contexts. |
| **Q4: Speed Shortcuts, Traps & Calculator Bypasses** | **15%** | **3–4 Questions** | Questions designed to reward 5-second inspection tricks, calculator mode shortcuts (e.g., `Pol` function, matrix determinants), and common algebraic sign traps. |

---

## 3. Solution Writing Protocol: Direct & Crisp

Solutions must get **straight to the point** without fluff or redundant label clutter:

### Rules:
1. **No Redundant Boilerplate**:
   - Do **NOT** prefix explanations with `"(Correct Answer)"`, `"(Distractor Trap)"`, or `Option A is incorrect because...`.
   - Write direct, elegant mathematical derivations and physical insights.
2. **Formula State & Substitution**:
   - State the governing equation in KaTeX: `$$d = \frac{|Ax_1 + By_1 + C|}{\sqrt{A^2 + B^2}}$$`.
   - Show the primary substitution step and the exact final evaluated result.
3. **Mandatory ⚡ Speed Shortcut Callout**:
   - Include a 1–2 sentence `⚡ Board Exam Shortcut:` or `⚡ Calculator Shortcut:` demonstrating the 5–10 second bypass whenever applicable.

---

## 4. Mastery Challenge JSON Schema

Saved at: `test-sets/learning-modules/[subject]/mastery/[moduleId]-mastery.json`

```json
{
  "id": "math-12-01-mastery",
  "moduleId": "math-12-01",
  "title": "Mastery Challenge: Lines, Slopes, Angles & Distance",
  "topicCode": "MATH-12",
  "domain": "MATH",
  "timeLimitMinutes": 35,
  "passingScorePercent": 70,
  "questions": [
    {
      "id": "m12-01-q01",
      "questionNumber": 1,
      "promptText": "If the angle of inclination of a straight line is obtuse ($\\frac{\\pi}{2} < \\theta < \\pi$), what can be definitively concluded regarding its slope $m$?",
      "choiceA": "$m > 0$",
      "choiceB": "$m < 0$",
      "choiceC": "$m = 0$",
      "choiceD": "$m$ is undefined",
      "correctChoice": "B",
      "explanation": "Since slope is defined as $m = \\tan\\theta$, and the tangent function is strictly negative in the second quadrant ($90^\\circ < \\theta < 180^\\circ$), an obtuse angle of inclination always produces a negative slope ($m < 0$).",
      "category": "conceptual",
      "difficulty": "easy"
    },
    {
      "id": "m12-01-q02",
      "questionNumber": 2,
      "promptText": "Find the perpendicular distance from point $P(3, -2)$ to the line $5x - 12y + 10 = 0$.",
      "choiceA": "$3.77$",
      "choiceB": "$2.54$",
      "choiceC": "$4.12$",
      "choiceD": "$1.85$",
      "correctChoice": "A",
      "explanation": "Apply the point-to-line distance formula:\n$$d = \\frac{|Ax_1 + By_1 + C|}{\\sqrt{A^2 + B^2}} = \\frac{|5(3) + (-12)(-2) + 10|}{\\sqrt{5^2 + (-12)^2}} = \\frac{49}{13} \\approx 3.77$$\n\n⚡ Board Exam Shortcut: Numerator is $15 + 24 + 10 = 49$. Denominator is the 5-12-13 Pythagorean triple ($13$). $49/13 = 3.77$.",
      "category": "computational",
      "difficulty": "medium"
    }
  ]
}
```
