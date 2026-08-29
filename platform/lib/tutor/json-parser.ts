/**
 * Robust JSON parser specifically designed for LLM outputs containing LaTeX KaTeX math formulas.
 *
 * Problem: LLMs output LaTeX with single backslashes (e.g. \frac, \lambda, \Omega, \tau, \beta, \unit).
 * In standard JSON:
 * - \f, \t, \b, \n, \r are interpreted as control characters (formfeed, tab, backspace, newline, carriage return)
 * - \u without 4 hex digits throws "Invalid Unicode escape sequence"
 * - \l, \O, \a, \s, \g throw "Bad escaped character in JSON"
 */

export function sanitizeLlmJsonString(raw: string): string {
  if (!raw) return "";

  let cleaned = raw.trim();

  // Strip markdown code fences if wrapped
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

  // Extract outer-most { ... } or [ ... ]
  const firstBrace = cleaned.indexOf("{");
  const firstBracket = cleaned.indexOf("[");
  let startIdx = -1;
  let isObject = true;

  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIdx = firstBrace;
    isObject = true;
  } else if (firstBracket !== -1) {
    startIdx = firstBracket;
    isObject = false;
  }

  if (startIdx !== -1) {
    const endChar = isObject ? "}" : "]";
    const lastIdx = cleaned.lastIndexOf(endChar);
    if (lastIdx !== -1 && lastIdx > startIdx) {
      cleaned = cleaned.substring(startIdx, lastIdx + 1);
    }
  }

  // 1. Protect already escaped backslashes (\\\\ -> __ESC_BS__)
  let processed = cleaned.replace(/\\\\/g, "__DOUBLE_BS__");

  // 2. Protect valid standard JSON escape sequences (\", \/, \b, \f, \n, \r, \t, \uXXXX)
  // But be careful: \frac, \tau, \beta, \nu, \rho, \unit are LaTeX commands that start with \f, \t, \b, \n, \r, \u!
  const LATEX_COLLISIONS = [
    "frac", "flat", "forall", "fbox", "footnotesize",
    "tau", "theta", "tan", "times", "text", "tilde", "top", "to", "triangle",
    "beta", "bullet", "bar", "binom", "bold", "begin", "bmatrix", "bot",
    "nu", "nabla", "neq", "not", "neg", "natural", "null", "normalsize",
    "rho", "rangle", "rightarrow", "Rightarrow", "rfloor", "rceil", "right", "real",
    "unit", "upsilon", "underline", "underbrace", "uparrow", "Uparrow", "utilde"
  ];

  for (const cmd of LATEX_COLLISIONS) {
    // If preceded by a single backslash, double it
    const regex = new RegExp(`\\\\(${cmd})`, "g");
    processed = processed.replace(regex, "__LATEX_$1__");
  }

  // 3. Any remaining valid escape sequences (like \n, \t, \", \\)
  processed = processed.replace(/\\"/g, "__ESC_QUOTE__");
  processed = processed.replace(/\\n/g, "__ESC_NL__");
  processed = processed.replace(/\\r/g, "__ESC_CR__");
  processed = processed.replace(/\\t/g, "__ESC_TAB__");
  processed = processed.replace(/\\u([0-9a-fA-F]{4})/g, "__ESC_U_$1__");

  // 4. Any remaining stray single backslashes (LaTeX \lambda, \Omega, \alpha, \sum, \int, \sqrt, \cdot, etc.)
  processed = processed.replace(/\\/g, "\\\\");

  // 5. Restore protected tokens
  processed = processed.replace(/__LATEX_([a-zA-Z]+)__/g, "\\\\$1");
  processed = processed.replace(/__ESC_U_([0-9a-fA-F]{4})__/g, "\\u$1");
  processed = processed.replace(/__ESC_TAB__/g, "\\t");
  processed = processed.replace(/__ESC_CR__/g, "\\r");
  processed = processed.replace(/__ESC_NL__/g, "\\n");
  processed = processed.replace(/__ESC_QUOTE__/g, '\\"');
  processed = processed.replace(/__DOUBLE_BS__/g, "\\\\");

  // 6. Fix trailing commas before closing braces/brackets
  processed = processed.replace(/,\s*([}\]])/g, "$1");

  return processed;
}

/**
 * Attempts to repair truncated JSON by closing open quotes and balancing open brackets/braces
 */
export function repairTruncatedJson(str: string): string {
  if (!str) return "{}";

  let sanitized = sanitizeLlmJsonString(str);
  if (!sanitized) return "{}";

  // Step 1: Scan string character by character to detect if we ended inside an open string
  let inString = false;
  let isEscaped = false;
  const stack: string[] = [];

  for (let i = 0; i < sanitized.length; i++) {
    const char = sanitized[i];

    if (inString) {
      if (char === "\\" && !isEscaped) {
        isEscaped = true;
      } else if (char === '"' && !isEscaped) {
        inString = false;
      } else {
        isEscaped = false;
      }
    } else {
      if (char === '"') {
        inString = true;
      } else if (char === "{") {
        stack.push("}");
      } else if (char === "[") {
        stack.push("]");
      } else if (char === "}" || char === "]") {
        if (stack.length > 0 && stack[stack.length - 1] === char) {
          stack.pop();
        }
      }
    }
  }

  let repaired = sanitized.trim();

  // If ended inside a string literal, close the quote
  if (inString) {
    repaired += '"';
  }

  // Remove any trailing comma or dangling colon before closing
  repaired = repaired.replace(/,\s*$/, "");
  repaired = repaired.replace(/:\s*$/, ': ""');

  // Close all remaining open brackets/braces in reverse order
  while (stack.length > 0) {
    const closingChar = stack.pop();
    repaired += closingChar;
  }

  // Remove any newly created trailing commas before closing braces/brackets
  repaired = repaired.replace(/,\s*([}\]])/g, "$1");

  return repaired;
}

/**
 * Safely parses LLM JSON outputs containing LaTeX, formatting quirks, and handles truncated streams
 */
export function safeParseLlmJson<T = any>(raw: string): T | null {
  if (!raw || typeof raw !== "string") return null;

  // 1. Direct parse attempt
  try {
    return JSON.parse(raw);
  } catch {}

  // 2. Sanitized parse attempt
  try {
    const sanitized = sanitizeLlmJsonString(raw);
    return JSON.parse(sanitized);
  } catch {}

  // 3. Fallback: Relaxed JSON-like cleanup (fix literal unescaped newlines inside strings)
  try {
    const sanitized = sanitizeLlmJsonString(raw)
      .replace(/(["'])(?:(?=(\\?))\2[\s\S])*?\1/g, (match) =>
        match.replace(/\r?\n/g, "\\n")
      );
    return JSON.parse(sanitized);
  } catch {}

  // 4. Truncation Repair Fallback: Auto-close open strings, arrays, and object braces
  try {
    const repaired = repairTruncatedJson(raw);
    return JSON.parse(repaired);
  } catch {}

  return null;
}

