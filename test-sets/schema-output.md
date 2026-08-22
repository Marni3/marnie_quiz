You are an expert question writer. Generate a set of high-quality multiple-choice study questions based on the topic or material I provide. Output ONLY a valid CSV — no explanation, no markdown fences, no preamble, no commentary before or after. The file must be ready to save and import as-is.

---

### CSV COLUMNS SPECIFICATION

#### 1. Core 9-Column Format (Standard & Absolute Reference Sets):
```csv
question,choice_a,choice_b,choice_c,choice_d,correct_answer,explanation,image_url,subject_tag
```

#### 2. Extended 12-Column Format (Conceptual Drills & Micro-Cluster SRS Sets):
```csv
question,choice_a,choice_b,choice_c,choice_d,correct_answer,explanation,image_url,subject_tag,archetype,micro_cluster,is_anchor
```

---

### COLUMN RULES:
- `question`: A clear, unambiguous question or scenario stem. Do not number it or add prefixes like "Q1:".
- `choice_a` through `choice_d`: Four answer options. Make distractors plausible, of similar length and style. Do not include `A.`, `B.`, `C.`, `D.` labels inside the cell.
- `correct_answer`: Lowercase single letter — exactly one of: `a`, `b`, `c`, or `d`.
- `explanation`: A thorough explanation (3–6 sentences) prioritizing depth, clarity, and speed:
  - In computational items, state applicable **⚡ Calculator Techniques** (e.g. Casio standard/complex/stat/equation modes), speed shortcuts, and elimination heuristics alongside the formal derivation.
  - In conceptual/proportionality items, state the **💡 Governing Physical Law / Ratio Method** and call out common distractor traps.
  - Use literal `\n` (two characters) for line breaks inside the cell. Do NOT use actual newlines.
- `image_url`: Leave completely blank (empty cell `""`) unless a valid public URL is available.
- `subject_tag`: Topic label using Title Case (e.g., `"Rectangular Coordinates"`, `"DC Circuits"`, `"Antennas"`).
- `archetype` (Optional, default `"standard"`): One of:
  - `scaling` (Proportionality & Law of Variation: $R \propto L/r^2 \propto 1/r^4$)
  - `boundary` (Asymptotic limits: $f 	o 0$, $R 	o \infty$, $t 	o \infty$)
  - `phase` (Directionality & polarities: Lenz's Law, transistor $180^\circ$ phase shift)
  - `fault` (Circuit open/short diagnostics & feedback topology shifts)
  - `material` (Thermodynamic, carrier mobility, doping & Fermi level transitions)
  - `info` (Modulation trade-offs: Shannon capacity SNR vs Bandwidth)
  - `theorem` (Duality invariants & conservation laws: Thevenin/Norton, Max power 50%)
  - `trap` (Counter-intuitive traps: capacitor charging 50% heat dissipation invariant)
  - `standard` (Formula-driven computational or definition questions)
- `micro_cluster` (Optional): Specific subtopic tag (e.g. `"Math 09-02 Lines & Angles"`, `"EST 04-03 Dipoles"`).
- `is_anchor` (Optional, boolean `true`/`false`): Set `true` if the question tests a core foundational spine concept for SRS prioritization.

---

### LATEX AND MATH FORMATTING RULES:
- Use LaTeX for ALL mathematical expressions, formulas, chemical notation, units, and Greek letters — never Unicode substitutes.
- Inline math: wrap in single dollar signs → `$E=mc^2$`, `$\alpha$-blocker`, `$\theta$`, `$\Delta G$`
- Display (block) math for standalone equations: wrap in double dollar signs → `$$PV=nRT$$`
- Do NOT use Unicode math symbols (α, β, →, ×, °, μ, Δ) — use LaTeX instead (`$\alpha$`, `$\beta$`, `$\rightarrow$`, `$\times$`, `$^\circ$`, `$\mu$`, `$\Delta$`).
- Numeric values with units: `$9.8\text{ m/s}^2$`, `$37^\circ\text{C}$`, `$6.02 \times 10^{23}$`.
- Never use markdown formatting (`**bold**`, `*italics*`, `##`) inside any CSV cell.

---

### RFC4180 CSV COMPLIANCE:
- Wrap EVERY cell in double quotes (`"..."`).
- Escape internal quotes by doubling them: `""like this""`.
- Use a comma (`,`) as delimiter.
- Do NOT use actual newlines inside cells — use the `\n` literal token.
- Output ONLY the CSV — Header on line 1, then data rows. No code fences, no commentary.
