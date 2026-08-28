# Learning Modules & Mastery Challenges: Authoring Pitfalls & Error Prevention Guide

This document serves as the permanent reference guide for common pitfalls, architectural traps, typographical errors, and pedagogical issues encountered during learning module and mastery challenge authoring, along with their strict standard solutions.

---

## 1. Directory Scanning & Decoupled Architecture

| Pitfall / Bug | Root Cause | Standard Prevention & Fix |
| :--- | :--- | :--- |
| **500 Server Crash on `/quizzes` or `/learn`** | Server-side directory scans in `modules.ts` recursively ingested companion mastery files (`*-mastery.json`) and attempted to sort them without `topicCode` or `domain`. | **Always isolate mastery files** in `test-sets/learning-modules/[subject]/mastery/`. Directory scanners must explicitly ignore `mastery/` directories and `*-mastery.json` files, and all sorting logic must include fallback null checks: `(a.topicCode \|\| "").localeCompare(b.topicCode \|\| "")`. |
| **Mastery Exams Cluttering Syllabus Library** | Placing mastery sets into the 190 `/quizzes` syllabus folders. | Mastery Challenge sets are **module-exclusive companion exams** launched solely from `/learn/[moduleId]/mastery`. They must never be placed in `/quizzes` or mixed with syllabus sets. |

---

## 2. Pedagogical Sequence & Narrative Flow

| Pitfall / Issue | Root Cause | Standard Prevention & Fix |
| :--- | :--- | :--- |
| **Disjointed "Dictionary First" Feeling** | Presenting the Terms & Definitions dictionary or visualizer before explaining the lesson proper. | **Lesson Proper Must Always Come First**: Directly after the Prerequisite Introduction & Bridges, explain the full theory, derivations, physical principles, and mental anchors in complete narrative prose. The **Terms & Definitions** section follows afterward as a quick-reference summary and lookup glossary. |
| **Isolated Concept Checks at the End** | Dumping all MCQs and problems at the bottom of the page. | Weave in-line concept checks and dual-method sample problems directly throughout the lesson to create an active-recall loop. |

---

## 3. Calculator Keystrokes & Keycap Rendering

| Pitfall / Issue | Root Cause | Standard Prevention & Fix |
| :--- | :--- | :--- |
| **Raw `<kbd>` Tags Displayed on Screen** | Inserting literal `<kbd>√</kbd>` strings inside JSON keystroke arrays and note fields where the renderer prints them as raw text. | **Store Clean Plain Tokens in JSON**: Always store keystrokes as clean strings without HTML: `["SHIFT", "Pol", "-", "4", ",", "7", ")", "="]`. The UI reader automatically renders each item as a physical, tactile keycap button badge. In `notes` and `mode` fields, write clean text without embedded HTML tags. |

---

## 4. Declarative Visualizer Archetype Accuracy

| Pitfall / Issue | Root Cause | Standard Prevention & Fix |
| :--- | :--- | :--- |
| **Visualizer Showing Wrong Geometry (e.g. Ellipse on Line topic)** | Reusing a generic archetype name like `"geometric"` that defaulted to `conic_explorer`. | **Use Specific Declarative Archetypes**: Always specify the exact matching archetype: <br>• **`cartesian_line`**: For lines, slopes, angles, and point-to-line distance.<br>• **`polygon_shoelace`**: For coordinate polygons, triangle centers, and centroid $G$.<br>• **`conic_explorer`**: For circles, parabolas, ellipses, and hyperbolas.<br>• **`factor_tree`**: For prime factorization and number theory.<br>• **`rlc_resonance`**: For AC impedance and transient damping.<br>• **`wave_interference`**: For wave propagation and attenuation. |
| **Client-Side `eval()` / `new Function()` Security Risks** | Writing raw executable JavaScript in module JSON files. | **Zero Raw Executable Code**: All visualizers must be pure SVG/Canvas declarative components controlled by typed parameter sliders (`slope`, `yIntercept`, `eccentricity`, `frequency`). |

---

## 5. Solution & Distractor Text Formatting

| Pitfall / Issue | Root Cause | Standard Prevention & Fix |
| :--- | :--- | :--- |
| **Cluttered Boilerplate Labels in Solutions** | Prefixing distractor items with `Option A ❌ (Distractor Trap):` or `(Correct Answer):`. | **Get Straight to the Explanation**: Write clean, concise explanations: <br>`"In $Ax + By + C = 0$, slope $m = -A/B = -4/6 = -2/3$."`<br>`"Forgot the negative sign in the slope formula $m = -A/B$."`<br>The UI automatically renders the correct/incorrect badges and option letters. |

---

## 6. Mastery Challenge Cognitive Balance (4-Quadrant Rule)

| Pitfall / Issue | Root Cause | Standard Prevention & Fix |
| :--- | :--- | :--- |
| **Mastery Exams Lacking Conceptual Depth** | Writing 100% computational word problems while skipping theoretical foundations, invariants, and qualitative understanding. | **Strict 4-Quadrant Balance Protocol (20–25 Questions)**:<br>1. **30% Conceptual Understanding & Theoretical Invariants (6–8 items)**: Definitions, geometric conditions, qualitative properties, and invariant behaviors.<br>2. **35% Standard Formula & Computation (7–9 items)**: Direct parameter evaluations and standard calculations.<br>3. **20% Multi-Step & Applied Word Problems (4–5 items)**: Compound setups and applied geometry/engineering models.<br>4. **15% Speed Shortcuts, Traps & Calculator Bypasses (3–4 items)**: Inspection tricks and calculator shortcuts. |

---

## 7. Pre-Flight Checklist for Every Created Module

Before committing any learning module and companion mastery set:
- [ ] Module JSON is in `test-sets/learning-modules/[subject]/[code].json`.
- [ ] Companion Mastery JSON is in `test-sets/learning-modules/[subject]/mastery/[code]-mastery.json`.
- [ ] Section sequence is strictly: **Bridges $\to$ Lesson Proper (Theory) $\to$ Visualizer $\to$ Terms $\to$ Sample Problems $\to$ Calculator Guides $\to$ Concept Checks $\to$ Mastery CTA**.
- [ ] Keystrokes array contains clean token strings without `<kbd>` tags.
- [ ] Visualizer archetype matches the topic geometry/physics.
- [ ] Distractor explanations have no redundant label prefixes.
- [ ] Mastery Challenge contains 20–25 questions with 30% conceptual items.
- [ ] `npm run build` passes with zero TypeScript/Turbopack errors.
- [ ] Git commit and push completed with descriptive message.
