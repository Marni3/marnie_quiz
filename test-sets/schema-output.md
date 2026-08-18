You are an expert question writer. Generate a set of high-quality multiple-choice study questions based on the topic or material I provide. Output ONLY a valid CSV — no explanation, no markdown fences, no preamble, no commentary before or after. The file must be ready to save and import as-is.

REQUIRED CSV COLUMNS (exact header row, comma-separated):
question,choice_a,choice_b,choice_c,choice_d,correct_answer,explanation,image_url,subject_tag

COLUMN RULES:
- question: A clear, unambiguous question or scenario stem. Do not number it or add a label.
- choice_a through choice_d: Four answer options. Make distractors plausible and of similar length and style. Do not include A., B., C., D. labels inside the cell — just the option text.
- correct_answer: Lowercase single letter — exactly one of: a, b, c, or d.
- explanation: A thorough explanation (3–6 sentences) of WHY the correct answer is right, and briefly why each key distractor is wrong. This is the most educational column — prioritize depth and clarity. To add a line break inside the explanation, write the two characters \n (backslash followed by n) as a literal separator — do NOT use an actual newline, which would break the CSV. Example: "The answer is A.\nOption B is incorrect because...\nOption C is wrong because..."
- image_url: Leave completely blank (empty cell, still quoted) unless you have a real, publicly reachable image URL.
- subject_tag: A short topic label using consistent title casing (e.g., Organic Chemistry, Constitutional Law, Microeconomics, Cardiology).

LATEX AND MATH FORMATTING RULES:
- Use LaTeX for ALL mathematical expressions, formulas, chemical notation, units, and Greek letters — never Unicode substitutes.
- Inline math: wrap in single dollar signs → E=mc2, α-blocker, K+, ΔG
- Display (block) math for standalone equations: wrap in double dollar signs → PV=nRT
- Do NOT use Unicode math symbols (α, β, →, ×, °, μ, Δ, etc.) — use LaTeX instead (α, β, →, ×, ∘, μ, Δ).
- Numeric values with units: 9.8 m/s2, 37∘C, 6.02×1023
- Never use markdown bold (**text**), italics (*text*), or headers (##) inside any CSV cell.

CSV FORMATTING RULES:
- Wrap EVERY cell in double quotes, including cells that are empty or contain only simple text.
- If a cell's content contains a double-quote character, escape it by doubling it: ""like this""
- Do NOT use actual newlines inside any cell — use the \n literal token described above for the explanation column instead.
- Use a comma (,) as the field delimiter. Do not use semicolons or tabs.
- The header row must be exactly line 1, verbatim as shown above.
- Every data row must have exactly 9 comma-separated fields.

OUTPUT: Header on line 1, then one row per question. Nothing else — no intro, no summary, no code fences.