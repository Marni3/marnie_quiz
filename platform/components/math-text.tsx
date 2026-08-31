"use client";

import React, { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { InlineFigure, InlineFigureConfig } from "./inline-figure";

interface MathTextProps {
  text: string | null | undefined;
  className?: string;
  splitParagraphs?: boolean;
  fitMode?: "scroll" | "fit";
}

export function MathText({
  text,
  className = "",
  splitParagraphs = false,
  fitMode = "scroll",
}: MathTextProps) {
  if (!text) return null;

  const fitClasses =
    fitMode === "fit"
      ? "[&_.katex-display]:text-[12px] sm:[&_.katex-display]:text-sm [&_.katex-html]:text-[12px] sm:[&_.katex-html]:text-sm [&_.base]:max-w-full [&_.katex]:leading-normal"
      : "";

  if (splitParagraphs) {
    return (
      <div className={`space-y-4 ${fitClasses} ${className}`}>
        {renderMarkdownBlocks(text, fitMode)}
      </div>
    );
  }

  return (
    <span className={`${fitClasses} ${className}`}>
      <InlineFormattedText content={text} fitMode={fitMode} />
    </span>
  );
}

// Parses multiline markdown blocks: headers, lists, horizontal rules, tables, diagrams, and paragraphs
function renderMarkdownBlocks(markdown: string, fitMode: "scroll" | "fit" = "scroll"): React.ReactNode {
  // Normalize line endings
  const clean = markdown.replace(/\r\n/g, "\n");
  const rawLines = clean.split("\n");
  const elements: React.ReactNode[] = [];

  let i = 0;
  while (i < rawLines.length) {
    const line = rawLines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // Fenced Diagram / Figure block (```diagram ... ``` or ```figure ... ```)
    if (
      trimmed.startsWith("```diagram") ||
      trimmed.startsWith("```figure") ||
      trimmed.startsWith("```json-diagram")
    ) {
      i++;
      const jsonLines: string[] = [];
      while (i < rawLines.length && !rawLines[i].trim().startsWith("```")) {
        jsonLines.push(rawLines[i]);
        i++;
      }
      if (i < rawLines.length && rawLines[i].trim().startsWith("```")) {
        i++; // consume closing ```
      }
      try {
        const jsonStr = jsonLines.join("\n").trim();
        const config: InlineFigureConfig = JSON.parse(jsonStr);
        elements.push(<InlineFigure key={`fig-${i}`} config={config} />);
      } catch (err: any) {
        console.warn("Failed to parse inline figure JSON:", err);
        elements.push(
          <div key={`fig-err-${i}`} className="my-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-500">
            Diagram Parse Error: {err?.message || "Invalid JSON"}
          </div>
        );
      }
      continue;
    }

    // Generic Fenced Code Block (``` ... ```)
    if (trimmed.startsWith("```")) {
      const lang = trimmed.slice(3).trim();
      i++;
      const codeLines: string[] = [];
      while (i < rawLines.length && !rawLines[i].trim().startsWith("```")) {
        codeLines.push(rawLines[i]);
        i++;
      }
      if (i < rawLines.length && rawLines[i].trim().startsWith("```")) {
        i++; // consume closing ```
      }
      elements.push(
        <div
          key={`code-${i}`}
          className="my-3 rounded-xl bg-[var(--surface2)] border border-[var(--border)] overflow-hidden font-mono text-xs shadow-2xs"
        >
          {lang && (
            <div className="px-3.5 py-1.5 bg-[var(--surface)] text-[10px] text-[var(--text3)] uppercase border-b border-[var(--border)] font-bold tracking-wider">
              {lang}
            </div>
          )}
          <pre className="p-3.5 overflow-x-auto text-[var(--text)] leading-relaxed whitespace-pre font-mono">
            {codeLines.join("\n")}
          </pre>
        </div>
      );
      continue;
    }

    // Blockquote (> ...)
    if (trimmed.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < rawLines.length && rawLines[i].trim().startsWith(">")) {
        quoteLines.push(rawLines[i].trim().replace(/^>\s*/, ""));
        i++;
      }
      elements.push(
        <div
          key={`quote-${i}`}
          className="bg-amber-500/10 border-l-4 border-l-amber-500 border border-amber-500/20 rounded-r-xl p-3.5 my-3 text-sm sm:text-base text-[var(--text)] leading-relaxed"
        >
          {quoteLines.map((q, qIdx) => (
            <p key={qIdx} className="leading-relaxed">
              <InlineFormattedText content={q} fitMode={fitMode} />
            </p>
          ))}
        </div>
      );
      continue;
    }

    // Horizontal Rule (---, ***, ___)
    if (/^(---|___|\*\*\*)$/.test(trimmed)) {
      elements.push(<hr key={`hr-${i}`} className="my-6 border-[var(--border)]" />);
      i++;
      continue;
    }

    // Markdown Table (| ... |)
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const tableLines: string[] = [];
      while (i < rawLines.length && rawLines[i].trim().startsWith("|") && rawLines[i].trim().endsWith("|")) {
        tableLines.push(rawLines[i].trim());
        i++;
      }
      const tableEl = renderMarkdownTable(`tbl-${i}`, tableLines, fitMode);
      if (tableEl) elements.push(tableEl);
      continue;
    }

    // Headers (# ...)
    if (trimmed.startsWith("#")) {
      const match = trimmed.match(/^(#{1,6})\s+(.*)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2];
        if (level === 1) {
          elements.push(
            <h1 key={`h1-${i}`} className="text-xl sm:text-2xl font-bold font-serif text-[var(--text)] pt-4 pb-1 border-b border-[var(--border)]">
              <InlineFormattedText content={text} fitMode={fitMode} />
            </h1>
          );
        } else if (level === 2) {
          elements.push(
            <h2 key={`h2-${i}`} className="text-lg sm:text-xl font-bold font-serif text-[var(--text)] pt-3 pb-1">
              <InlineFormattedText content={text} fitMode={fitMode} />
            </h2>
          );
        } else if (level === 3) {
          elements.push(
            <h3 key={`h3-${i}`} className="text-sm sm:text-base font-bold font-serif text-primary pt-2">
              <InlineFormattedText content={text} fitMode={fitMode} />
            </h3>
          );
        } else {
          elements.push(
            <h4 key={`h4-${i}`} className="text-xs sm:text-sm font-semibold text-[var(--text2)] pt-1">
              <InlineFormattedText content={text} fitMode={fitMode} />
            </h4>
          );
        }
        i++;
        continue;
      }
    }

    // Unordered List (- or *)
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const listItems: string[] = [];
      while (i < rawLines.length && (rawLines[i].trim().startsWith("- ") || rawLines[i].trim().startsWith("* "))) {
        listItems.push(rawLines[i].trim().slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-1.5 pl-2 text-sm sm:text-base text-[var(--text)]">
          {listItems.map((item, lIdx) => (
            <li key={lIdx} className="flex items-start gap-2 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0 mt-2" />
              <span>
                <InlineFormattedText content={item} fitMode={fitMode} />
              </span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered List
    if (/^\d+\.\s+/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < rawLines.length && /^\d+\.\s+/.test(rawLines[i].trim())) {
        listItems.push(rawLines[i].trim().replace(/^\d+\.\s+/, ""));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="list-decimal list-inside space-y-2 pl-2 text-sm sm:text-base text-[var(--text)]">
          {listItems.map((item, lIdx) => (
            <li key={lIdx} className="leading-relaxed">
              <InlineFormattedText content={item} fitMode={fitMode} />
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Display Math block ($$...$$)
    if (trimmed.startsWith("$$") && trimmed.endsWith("$$") && trimmed.length >= 4) {
      elements.push(
        <div key={`math-${i}`} className={`my-3 text-center ${fitMode === "fit" ? "max-w-full overflow-hidden" : "overflow-x-auto"}`}>
          <RenderMathBlock math={trimmed.slice(2, -2).trim()} display={true} fitMode={fitMode} />
        </div>
      );
      i++;
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={`p-${i}`} className="leading-relaxed text-sm sm:text-base text-[var(--text)]">
        <InlineFormattedText content={trimmed} fitMode={fitMode} />
      </p>
    );
    i++;
  }

  return elements;
}

function renderMarkdownTable(key: string, lines: string[], fitMode: "scroll" | "fit" = "scroll"): React.ReactNode {
  if (lines.length < 2) return null;
  const headerCells = lines[0].slice(1, -1).split("|").map((c) => c.trim());
  const rowLines = lines.slice(2); // skip header and separator row

  return (
    <div key={key} className="overflow-x-auto my-3 rounded-xl border border-[var(--border)]">
      <table className="w-full text-xs sm:text-sm text-left border-collapse">
        <thead className="bg-[var(--surface2)] text-[var(--text)] font-semibold border-b border-[var(--border)]">
          <tr>
            {headerCells.map((cell, idx) => (
              <th key={idx} className="px-3 py-2 border-r border-[var(--border)] last:border-r-0">
                <InlineFormattedText content={cell} fitMode={fitMode} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
          {rowLines.map((r, rIdx) => {
            const cells = r.slice(1, -1).split("|").map((c) => c.trim());
            return (
              <tr key={rIdx} className="hover:bg-[var(--surface2)]/50 transition-colors">
                {cells.map((cell, cIdx) => (
                  <td key={cIdx} className="px-3 py-2 border-r border-[var(--border)] last:border-r-0 text-[var(--text)]">
                    <InlineFormattedText content={cell} fitMode={fitMode} />
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// In-line formatter for Math ($...$, $$...$$), Bold (**...**), Code Spans (`...`), and Italics (*...*)
function InlineFormattedText({ content, fitMode = "scroll" }: { content: string; fitMode?: "scroll" | "fit" }) {
  const parts = useMemo(() => {
    // 1. Normalize ($$...$$) -> ($ ... $) so display math doesn't break parentheses onto new lines
    const normalized = content
      .replace(/\(\s*\$\$([\s\S]*?)\$\$\s*\)/g, "($$$1$)")
      .replace(/\[\s*\$\$([\s\S]*?)\$\$\s*\]/g, "[$$$1$]");

    // Tokenize on $$...$$, $...$ (single-line), **...**, and `...`
    const regex = /(\$\$[\s\S]*?\$\$|\$[^\$\n\r]+?\$|\*\*[^\*]+?\*\*|`[^`\n\r]+?`)/g;
    const tokens = normalized.split(regex);

    return tokens.map((token, i) => {
      if (token.startsWith("$$") && token.endsWith("$$") && token.length >= 4) {
        return (
          <span key={i} className={`block my-2.5 text-center max-w-full py-0.5 ${fitMode === "fit" ? "overflow-hidden" : "overflow-x-auto"}`}>
            <RenderMathBlock math={token.slice(2, -2).trim()} display={true} fitMode={fitMode} />
          </span>
        );
      } else if (token.startsWith("$") && token.endsWith("$") && token.length >= 2) {
        const inner = token.slice(1, -1);
        // Guard against LLM hallucinations where whole English paragraphs with markdown were wrapped in $...$
        if (inner.includes("**") || (inner.split(" ").length > 8 && !inner.includes("\\"))) {
          return (
            <React.Fragment key={i}>
              <InlineFormattedText content={inner} fitMode={fitMode} />
            </React.Fragment>
          );
        }
        return (
          <span key={i} className="inline-math px-0.5 max-w-full">
            <RenderMathBlock math={inner.trim()} display={false} fitMode={fitMode} />
          </span>
        );
      } else if (token.startsWith("`") && token.endsWith("`") && token.length >= 2) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded-md bg-[var(--surface2)] border border-[var(--border)] font-mono text-xs text-[var(--accent)] font-semibold">
            {token.slice(1, -1)}
          </code>
        );
      } else if (token.startsWith("**") && token.endsWith("**") && token.length >= 4) {
        return (
          <strong key={i} className="font-bold text-[var(--text)]">
            <InlineFormattedText content={token.slice(2, -2)} fitMode={fitMode} />
          </strong>
        );
      } else {
        // Auto-detect unwrapped math patterns (e.g. i^{2026}, \sqrt{...}, \frac{...}) in raw text tokens
        const unwrappedMathRegex = /([a-zA-Z0-9_]+\^\{[a-zA-Z0-9\+\-\*\/\s,.]+\}|[a-zA-Z0-9_]+\^[a-zA-Z0-9]|\\(?:frac|sqrt|Omega|Gamma|tau|alpha|beta|Delta|theta|phi|times|cdot|approx|le|ge|pm|infty|pi|mu|lambda|sigma)\b(?:\s*\{[^}]*\})*)/g;
        if (unwrappedMathRegex.test(token)) {
          const subTokens = token.split(unwrappedMathRegex);
          return (
            <React.Fragment key={i}>
              {subTokens.map((sub, sIdx) => {
                if (unwrappedMathRegex.test(sub)) {
                  return (
                    <span key={sIdx} className="inline-math px-0.5 max-w-full">
                      <RenderMathBlock math={sub} display={false} fitMode={fitMode} />
                    </span>
                  );
                }
                return <React.Fragment key={sIdx}>{sub}</React.Fragment>;
              })}
            </React.Fragment>
          );
        }
        return <React.Fragment key={i}>{token}</React.Fragment>;
      }
    });
  }, [content, fitMode]);

  return <>{parts}</>;
}

function RenderMathBlock({ math, display, fitMode = "scroll" }: { math: string; display: boolean; fitMode?: "scroll" | "fit" }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: display,
        throwOnError: false,
      });
    } catch {
      return null;
    }
  }, [math, display]);

  if (!html) {
    return <code className="break-all font-mono text-xs">{math}</code>;
  }

  const fitStyle = fitMode === "fit"
    ? "[&_.katex-display]:text-[12px] sm:[&_.katex-display]:text-sm [&_.katex-html]:text-[12px] sm:[&_.katex-html]:text-sm [&_.base]:max-w-full"
    : "";

  return (
    <span
      className={`${fitStyle} ${
        display
          ? fitMode === "fit"
            ? "block max-w-full overflow-hidden"
            : "block max-w-full overflow-x-auto overflow-y-hidden"
          : "inline-block max-w-full overflow-x-auto overflow-y-hidden align-middle"
      }`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

