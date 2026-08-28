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

## 7. Natural Phrasing & Avoiding Overly Academic Jargon

| Pitfall / Issue | Root Cause | Standard Prevention & Fix |
| :--- | :--- | :--- |
| **Overly Academic / Daunting Terminology** | Using terms like *"Key Behavioral Conditions"*, *"Euclidean hypotenuse"*, or *"normal vector normalization"*. | **Use Natural, Direct Phrasing**: Use phrasing common in Philippine board exam review:<br>• Use **"Specific Cases"** or **"Cases"** instead of *"Key Behavioral Conditions"*.<br>• Use **"Hypotenuse"** instead of *"Euclidean hypotenuse"*.<br>• For point-to-line distance denominator: *"Dividing by the magnitude of the line's normal vector converts the scalar value into regular distance units."* |

---

## 8. High-Contrast Typography & Visualizer Hardware Sliders

| Pitfall / Issue | Root Cause | Standard Prevention & Fix |
| :--- | :--- | :--- |
| **Washed-out / Faded Body Text** | Using dim secondary text classes (`text-[var(--text2)]`, `text-muted-foreground`, `prose-neutral`) for paragraphs and lists. | **Always Use High-Contrast Body Text**: Render all lesson paragraphs, lists, and table cells in `text-[var(--text)]` (crisp cream/white in dark mode, deep charcoal in light mode). Bold keywords pop naturally without making surrounding sentences faded. |
| **Invisible Slider Tracks (Floating Blue Dots)** | Unstyled `input[type="range"]` losing its default browser track background under custom CSS / dark mode. | **Explicit Hardware Slider Track Styling**: Range sliders must have a solid, visible track rail (`background: var(--surface3)`, `border: 1px solid var(--border)`, `border-radius: 9999px`) and a prominent circular thumb knob with grab feedback. |
| **Inline Vector Diagrams in Lesson Proper** | Relying solely on text descriptions for geometric concepts like angles of inclination or perpendicular drop lines. | **Use Fenced ```diagram Blocks**: Embed lightweight declarative SVG figures directly inside lesson markdown using the `InlineFigure` JSON primitive schema (`axes`, `grid`, `line`, `arc`, `point`, `projection`, `right_angle`). |

---

## 9. Formula Sizing & Compilation of Formulas Section

| Pitfall / Issue | Root Cause | Standard Prevention & Fix |
| :--- | :--- | :--- |
| **Formulas Buried or Rendered Too Small** | Relying solely on the Terms & Definitions dictionary or inline equation snippets where mathematical expressions get tiny and cramped. | **Dedicated Compilation of Formulas Section (`formulas`)**: Every module must include a dedicated `"formulas"` array rendered as high-visibility formula cards featuring bold titles, large centered KaTeX display math (`py-2.5 px-3 rounded-xl`), and very minimal optional notes (e.g. sign conventions or boundary limits). |

---

## 10. 1-to-1 Review Note Page Inspection & Zero-Omission Standard

| Pitfall / Issue | Root Cause | Standard Prevention & Fix |
| :--- | :--- | :--- |
| **Omission of Key Formulas & Over-Summarization** | Batch-generating generic modules from high-level curriculum bullet points rather than inspecting the actual review note pages. | **Strict 1-to-1 Page Inspection Protocol**:<br>• The authoring agent must open and view the specific note PNG (`test-sets/scratch/pdf-renders/[subject]/notes___[topic]_[n]/page_01.png`) before authoring.<br>• Every formula, theorem, condition, and table on that note page must be transcribed and explained in the module.<br>• Author one page at a time (Inspect Page PNG $\to$ Author Module $\to$ Author Paired Mastery $\to$ Verify). |

---

## 11. Pre-Flight Checklist for Every Created Module

Before committing any learning module and companion mastery set:
- [ ] Rendered note page image (`test-sets/scratch/pdf-renders/.../page_01.png`) was inspected with `view_file` and 100% of formulas are transcribed.
- [ ] Module JSON is in `test-sets/learning-modules/[subject]/[code].json`.
- [ ] Companion Mastery JSON is in `test-sets/learning-modules/[subject]/mastery/[code]-mastery.json`.
- [ ] Section sequence is strictly: **Bridges $\to$ Lesson Proper (Theory) $\to$ Compilation of Formulas $\to$ Visualizer $\to$ Terms $\to$ Sample Problems $\to$ Calculator Guides $\to$ Concept Checks $\to$ Mastery CTA**.
- [ ] Body text uses natural phrasing ("Specific Cases") without academic jargon.
- [ ] Fenced ` ```diagram ` blocks have valid JSON with clean $(x, y)$ coordinate bounds.
- [ ] `"formulas"` array includes all primary governing equations with clean KaTeX and minimal notes.
- [ ] Keystrokes array contains clean token strings without `<kbd>` tags.
- [ ] Visualizer archetype matches the topic geometry/physics with visible slider tracks.
- [ ] Distractor explanations have no redundant label prefixes.
- [ ] Mastery Challenge contains 20–25 questions with strict 4-quadrant balance (30% conceptual, 35% computational, 20% applied, 15% shortcuts/traps).
- [ ] `npm run build` passes with zero TypeScript/Turbopack errors and zero JSON syntax warnings.
- [ ] Git commit and push completed with descriptive message.
