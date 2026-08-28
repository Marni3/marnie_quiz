"use client";

import React, { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { InlineFigure, InlineFigureConfig } from "./inline-figure";

interface MathTextProps {
  text: string | null | undefined;
  className?: string;
  splitParagraphs?: boolean;
}

export function MathText({
  text,
  className = "",
  splitParagraphs = false,
}: MathTextProps) {
  if (!text) return null;

  if (splitParagraphs) {
    return <div className={`space-y-4 ${className}`}>{renderMarkdownBlocks(text)}</div>;
  }

  return (
    <span className={className}>
      <InlineFormattedText content={text} />
    </span>
  );
}

// Parses multiline markdown blocks: headers, lists, horizontal rules, tables, diagrams, and paragraphs
function renderMarkdownBlocks(markdown: string): React.ReactNode {
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
          <InlineFormattedText content={quoteLines.join(" ")} />
        </div>
      );
      continue;
    }

    // Horizontal Rule
    if (/^---+$|^\*\*\*+$/.test(trimmed)) {
      elements.push(
        <hr key={`hr-${i}`} className="my-4 border-[var(--border)] border-t" />
      );
      i++;
      continue;
    }

    // Headings
    if (trimmed.startsWith("#### ")) {
      elements.push(
        <h4 key={`h4-${i}`} className="text-sm sm:text-base font-bold text-[var(--text)] mt-4 mb-1">
          <InlineFormattedText content={trimmed.slice(5)} />
        </h4>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-base sm:text-lg font-bold font-serif text-[var(--text)] mt-5 mb-2 pb-1 border-b border-[var(--border)]/40">
          <InlineFormattedText content={trimmed.slice(4)} />
        </h3>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 key={`h2-${i}`} className="text-lg sm:text-xl font-bold font-serif text-[var(--text)] mt-6 mb-2">
          <InlineFormattedText content={trimmed.slice(3)} />
        </h2>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith("# ")) {
      elements.push(
        <h1 key={`h1-${i}`} className="text-xl sm:text-2xl font-extrabold font-serif text-[var(--text)] mt-7 mb-3">
          <InlineFormattedText content={trimmed.slice(2)} />
        </h1>
      );
      i++;
      continue;
    }

    // Table detection (starts with |)
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const tableLines: string[] = [];
      while (i < rawLines.length && rawLines[i].trim().startsWith("|") && rawLines[i].trim().endsWith("|")) {
        tableLines.push(rawLines[i].trim());
        i++;
      }
      elements.push(renderMarkdownTable(`tbl-${i}`, tableLines));
      continue;
    }

    // Unordered List
    if (/^[-*]\s+/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < rawLines.length && /^[-*]\s+/.test(rawLines[i].trim())) {
        listItems.push(rawLines[i].trim().replace(/^[-*]\s+/, ""));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc list-inside space-y-2 pl-2 text-sm sm:text-base text-[var(--text)]">
          {listItems.map((item, lIdx) => (
            <li key={lIdx} className="leading-relaxed">
              <InlineFormattedText content={item} />
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
              <InlineFormattedText content={item} />
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Display Math block ($$...$$)
    if (trimmed.startsWith("$$") && trimmed.endsWith("$$") && trimmed.length >= 4) {
      elements.push(
        <div key={`math-${i}`} className="my-3 text-center overflow-x-auto">
          <RenderMathBlock math={trimmed.slice(2, -2).trim()} display={true} />
        </div>
      );
      i++;
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={`p-${i}`} className="leading-relaxed text-sm sm:text-base text-[var(--text)]">
        <InlineFormattedText content={trimmed} />
      </p>
    );
    i++;
  }

  return elements;
}

function renderMarkdownTable(key: string, lines: string[]): React.ReactNode {
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
                <InlineFormattedText content={cell} />
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
                    <InlineFormattedText content={cell} />
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

// In-line formatter for Math ($...$, $$...$$), Bold (**...**), and Italics (*...*)
function InlineFormattedText({ content }: { content: string }) {
  const parts = useMemo(() => {
    // Tokenize on $$...$$, $...$, and **...**
    const regex = /(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$|\*\*[\s\S]*?\*\*)/g;
    const tokens = content.split(regex);

    return tokens.map((token, i) => {
      if (token.startsWith("$$") && token.endsWith("$$") && token.length >= 4) {
        return (
          <span key={i} className="block my-2.5 text-center overflow-x-auto max-w-full py-0.5">
            <RenderMathBlock math={token.slice(2, -2).trim()} display={true} />
          </span>
        );
      } else if (token.startsWith("$") && token.endsWith("$") && token.length >= 2) {
        return (
          <span key={i} className="inline-math px-0.5 max-w-full">
            <RenderMathBlock math={token.slice(1, -1).trim()} display={false} />
          </span>
        );
      } else if (token.startsWith("**") && token.endsWith("**") && token.length >= 4) {
        return (
          <strong key={i} className="font-bold text-[var(--text)]">
            <InlineFormattedText content={token.slice(2, -2)} />
          </strong>
        );
      } else {
        return <React.Fragment key={i}>{token}</React.Fragment>;
      }
    });
  }, [content]);

  return <>{parts}</>;
}

function RenderMathBlock({ math, display }: { math: string; display: boolean }) {
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

  return (
    <span
      className={display ? "block max-w-full overflow-x-auto overflow-y-hidden" : "inline-block max-w-full overflow-x-auto overflow-y-hidden align-middle"}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

