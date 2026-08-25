# Interactive Learning Modules: Restructuring, Pedagogical & Formatting Master Guide

> **Target**: Comprehensive roadmap and authoring specifications for all upcoming learning modules and template refinements.
> **Date**: August 25, 2026

---

## 1. Executive Summary of Core Adjustments

Based on review of the initial prototype modules, five fundamental shifts are required across all 50 topics (MATH, ELECS, GEAS, EST):

1. **UI & Heading Streamlining**:
   - Replace *"Cross-Subject PRC Board Connections"* with **"Links to Related Topics"**.
   - Replace *"PRC Table of Specifications (TOS) Signatures & Terminology"* with **"Terms and Definitions"**.

2. **Plain-English Accessibility & Jargon Elimination**:
   - Strip out dense, overly academic phrasing.
   - Explain abstract ideas using clear physical intuition and simple analogies that any student can understand in under 10 seconds.

3. **Atomic Terms & Definitions (Breadth Over Depth)**:
   - The Philippine ECE Licensure Examination rewards broad recall over academic proofs.
   - Keep definitions short, punchy, and "atomic" (1–2 concise sentences maximum).
   - High-yield keyword triggers must be immediately recognizable.

4. **Fluid Narrative Flow with Weaved Concept Checks**:
   - Eliminate rigid, isolated section silos.
   - Flow naturally like an interactive textbook:
   - Example (not to be strictly followed section per section but more to provide as a reference to the flow of the module):
     $$\text{Introduction} \longrightarrow \text{Concept 1 + Atomic Terms} \longrightarrow \text{In-line Check 1} \longrightarrow \text{Concept 2 + Visualizer} \longrightarrow \text{In-line Check 2} \longrightarrow \text{Dual-Method Examples} \longrightarrow \text{Calculator Keystrokes} \longrightarrow \text{Paired Quiz CTA} \longrightarrow \text{Next Module Bridge}$$

5. **Markdown & KaTeX Rendering Standards**:
   - Fix broken table and math formatting. All mathematical symbols in term cards and text must be enclosed in `$...$` (e.g., `$\mathbb{Q}$`, `$\text{GCF}(a, b)$`).
   - Use proper Markdown rendering on the frontend so headers (`###`), tables (`| ... |`), and lists render with full typography.

---

## 2. Pedagogical Tone & Plain-English Style Guide

### ❌ What to Avoid (Dense Academic Jargon)
> *"The axiomatic foundation of real numbers, prime factor decomposition, and polynomial factoring identities upon which all subsequent algebraic manipulations, calculus derivations, and circuit network equations depend."*

### ✅ What to Write (Accessible & Direct)
> *"Algebra is the language of engineering. In this module, we'll master the real number line, rapid prime factoring, and polynomial shortcuts that will save you minutes on calculus and circuit problems."*

### ❌ What to Avoid (Complex Connection Jargon)
> *"Factoring high-degree characteristic auxiliary equations into distinct, repeated, or irreducible quadratic roots directly determines the complementary solutions."*

### ✅ What to Write (Clear Board Connection)
> *"In **MATH 12 (Differential Equations)**, factoring polynomials is used to find whether an RLC circuit oscillates or settles smoothly."*

---

## 3. Atomic Terms & Definitions Standard

Every term card must be designed for rapid flashcard-style memorization:

| Field | Requirement | Good Example |
| :--- | :--- | :--- |
| **Term** | Plain standard name | Rational Number |
| **Symbol** | Valid KaTeX math string | `$\mathbb{Q}$` |
| **Atomic Definition** | Max 1–2 punchy sentences | A number that can be written as a fraction of two integers $\frac{p}{q}$ ($q \neq 0$), with decimals that either terminate or repeat. |
| **1-Second Trigger** | Exact exam stem phrase | `"ratio of two integers / repeating decimal"` |
| **Unit / Dimension** | Standard SI unit or category | Dimensionless |

---

## 4. Redesigned Fluid Module Blueprint (For Reference Only - Tweak lengths and section order or quantity depending on topic.)

```markdown
# [Module Code]: [Subtopic Title]

### 1. Introduction & Intuitive Hook
- 2–3 friendly sentences connecting previous subtopics to today's lesson.

### 2. Links to Related Topics
- 2–3 clean callout cards showing where this topic reappears across Math, Elecs, GEAS, or EST.

### 3. Core Concepts & Atomic Terms (Part 1)
- Plain-English theory breakdown with formulas in KaTeX.
- Short atomic term cards embedded right alongside the relevant concept.

### 4. In-Line Concept Check #1
- 1–2 embedded multiple-choice questions with instant feedback and distractor analysis.

### 5. Deep-Dive Theory & Interactive Simulation (Part 2)
- Visualizer / Canvas simulation with interactive parameter sliders.
- Mental Anchor / Rule of Thumb callout box.

### 6. In-Line Concept Check #2
- 1–2 embedded multiple-choice questions checking the deep-dive concepts.

### 7. Problems and solutions
- 2–3 authentic PRC board exam sample problems.
- Interactive toggle: `[⚡ Board Shortcut (<20s)]` vs `[Formal Academic Derivation]` vs `[Side-by-Side]`.

### 8. Calculator Techniques (Karce KC-S991 & Canon F-789SGA)
- Technique title, problem type, sample problem, and step-by-step keystroke guide with context.

### 9. Paired Mastery Challenge & Next Steps
- Direct launch button to paired question set on `/quizzes/[quizSetId]`.
- 1-sentence teaser bridge linking to the next module in the syllabus.
```

---

## 5. Technical Frontend Updates Checklist for Next Session

- [ ] **Markdown Renderer Upgrade**: Update `platform/components/math-text.tsx` or incorporate a Markdown parser (e.g. `react-markdown` + `remark-math` + `rehype-katex`) so markdown tables, headers, and bullet lists inside `theory.contentMarkdown` and solution markdown render with complete formatting.
- [ ] **Math Symbol Delimiter Fix**: Ensure all symbol fields in `terms` are wrapped in `$...$` or passed through KaTeX rendering in `module-reader.tsx`.
- [ ] **Header Label Updates**: Update `module-reader.tsx` section titles to `"Links to Related Topics"` and `"Terms and Definitions"`.
- [ ] **Module Next Link**: Add a `nextModuleId` link in the footer of `module-reader.tsx` to allow seamless linear reading through the curriculum.
