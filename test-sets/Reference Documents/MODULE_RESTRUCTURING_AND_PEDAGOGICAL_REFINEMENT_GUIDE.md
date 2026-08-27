# Interactive Learning Modules: Restructuring, Pedagogical & Formatting Master Guide

> **Target**: Comprehensive roadmap and authoring specifications for all upcoming learning modules and template refinements.
> **Date**: August 25, 2026

---

## 1. Executive Summary of Core Adjustments

Based on review of actual review center materials (e.g., Excel Review Center) and initial prototypes, seven fundamental shifts are established:

1. **1-to-1 Grounding in Actual Review Center Notes (`Reference Documents/`)**:
   - The primary learning modules are **directly grounded 1-to-1** with the actual review center lecture notes (e.g., Excel Review Center) located in `Reference Documents/`.
   - **Comprehensive Content Transcription**: Every specific concept, definition, classification, property, formula, and nuance in the review notes must be faithfully captured and expanded (e.g., in Algebra 1: Cardinal vs. Ordinal numbers, Arabic vs. Roman numerals, Roman large number multipliers like Bracket $\times 100$, Vinculum $\times 1,000$, Doorframe $\times 1,000,000$, properties of integers/addition/multiplication/equality, powers of $i$, etc.).
   - While test-set topics serve as categorization anchors, the reviewer documents themselves dictate the true scope, order, and pedagogical substance of the modules.

2. **Mandatory Multimodal PDF-to-Image Protocol**:
   - **NEVER USE PDF TEXT EXTRACTION LIBRARIES**. Raw PDF text extraction corrupts column layouts, tables, math symbols, and handwritten annotations.
   - **Image Conversion Rule**: When reading any PDF in `Reference Documents/`, use a lightweight Python script (e.g., `pymupdf` / `fitz` or `pdf2image`) to render PDF pages as PNG images into a scratch directory (`scratch/`).
   - Inspect the rendered page images directly using **multimodal vision capabilities** to ensure 100% fidelity to the original review center diagrams, layouts, and tables.
   - Pace context window usage by converting and inspecting notes in planned batches before authoring each module.
   - Reflect all terms in order of appearance and logical dependency (write prerequisite terms first).

3. **UI & Heading Streamlining**:
   - Replace *"Cross-Subject PRC Board Connections"* with **"Links to Related Topics"**.
   - Replace *"PRC Table of Specifications (TOS) Signatures & Terminology"* with **"Terms and Definitions"**.
   - Replace *"Governing Theory & Mental Anchors"* with **"Lesson Proper"**.
   - Replace *"The Dual-Method Breakdown (Academic vs. ⚡ Shortcut)"* with **"Sample Problems and Solutions"**.
   - Replace *"Calculator Keystroke Guides"* with **"Calculator Techniques"**.

4. **Plain-English Accessibility & Jargon Elimination**:
   - Strip out dense, overly academic phrasing.
   - Explain abstract ideas using clear physical intuition and simple analogies that any student can understand in under 10 seconds.

5. **Atomic Terms & Definitions (Breadth Over Depth)**:
   - The Philippine ECE Licensure Examination rewards broad recall over academic proofs.
   - Keep definitions short, punchy, and "atomic" (1–2 concise sentences maximum).
   - High-yield keyword triggers must be immediately recognizable.

6. **Fluid Narrative Flow with Weaved Concept Checks**:
   - Eliminate rigid, isolated section silos.
   - Flow naturally like an interactive textbook:
     $$\text{Introduction} \longrightarrow \text{Concept 1 + Atomic Terms} \longrightarrow \text{In-line Check 1} \longrightarrow \text{Concept 2 + Visualizer} \longrightarrow \text{In-line Check 2} \longrightarrow \text{Sample Problems and Solutions} \longrightarrow \text{Calculator Techniques} \longrightarrow \text{Paired Quiz CTA} \longrightarrow \text{Next Module Bridge}$$

7. **Markdown & KaTeX Rendering Standards**:
   - Fix broken table and math formatting. All mathematical symbols in term cards and text must be enclosed in `$...$` (e.g., `$\mathbb{Q}$`, `$\text{GCF}(a, b)$`).
   - Use proper Markdown rendering on the frontend so headers (`###`), tables (`| ... |`), and lists render with full typography.

8. **Expanded Concept Checks & Spaced Repetition (SRS) Integration**:
   - Scale concept checks up to 5, 6, or 10+ questions per module/block as required to ensure complete active-recall coverage.
   - **SRS Module Review Tracking**: In future backend implementations, module review timestamps (`last_reviewed_at`) will be tracked in the database to allow the Spaced Repetition engine to recommend both custom sets and specific modules/quizzes due for recall based on memory decay curves (even for topics with high prior scores).


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

## 4. Redesigned Fluid Module Blueprint (Interleaved Reinforcement Structure)

```markdown
# [Module Code]: [Subtopic Title]

### 1. Introduction & Links to Related Topics
- 2–3 friendly sentences connecting prior reviewer concepts to today's lesson.
- 2–3 clean callout cards showing where this topic reappears across Math, Elecs, GEAS, or EST.

### 2. Terms and Definitions (Atomic Standard)
- Short atomic definitions arranged in strict logical dependency order.
- Exact KaTeX symbols (`$...$`) and 1-second keyword triggers.

### 3. Lesson Proper (With Interleaved Reinforcement Micro-Cycles)
For each major concept block in the reviewer notes:
1. **Concept / Core Theory**: Clear plain-English conceptual breakdown with KaTeX formulas.
2. **Immediate In-Line Concept Check**: 1–2 MCQs checking comprehension of this specific concept immediately.
3. **Sample Problems and Solutions**: Authentic PRC board exam worked examples with Dual-Method toggle (`[Formal]` vs `[⚡ Shortcut]`).
4. **Follow-Up Practice Check**: Self-solve problem for examinees to test their application.
5. **Calculator Techniques** (if applicable): Technique title, problem type, sample problem first, mode setup, and step-by-step `<kbd>` button sequences with context.
*(Repeat micro-cycle for each subsequent concept block in the reviewer notes)*

### 4. Interactive Visualizer Sandbox (if applicable)
- Interactive Canvas widget with live sliders demonstrating geometric or dynamic physical intuition.
- Mental Anchor / Rule of Thumb callout box.

### 5. Paired Mastery Challenge & Next Module Bridge
- Direct CTA launch button to paired question set on `/quizzes/[quizSetId]`.
- 1-sentence teaser bridge linking to the next module in the reviewer series.
```

---

## 5. Technical Frontend Updates Checklist for Next Session

- [ ] **Markdown Renderer Upgrade**: Update `platform/components/math-text.tsx` or incorporate a Markdown parser (e.g. `react-markdown` + `remark-math` + `rehype-katex`) so markdown tables, headers, and bullet lists inside `theory.contentMarkdown` and solution markdown render with complete formatting.
- [ ] **Math Symbol Delimiter Fix**: Ensure all symbol fields in `terms` are wrapped in `$...$` or passed through KaTeX rendering in `module-reader.tsx`.
- [ ] **Header Label Updates**: Update `module-reader.tsx` section titles to `"Links to Related Topics"` and `"Terms and Definitions"`.
- [ ] **Module Next Link**: Add a `nextModuleId` link in the footer of `module-reader.tsx` to allow seamless linear reading through the curriculum.
