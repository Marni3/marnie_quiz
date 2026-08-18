"use client";

import React, { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

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
    const paragraphs = text.split(/\\n/);
    return (
      <div className={`space-y-2 ${className}`}>
        {paragraphs.map((para, idx) => {
          const trimmed = para.trim();
          if (!trimmed) return null;
          return (
            <p key={idx} className="leading-relaxed">
              <RenderMathSegment content={trimmed} />
            </p>
          );
        })}
      </div>
    );
  }

  return (
    <span className={className}>
      <RenderMathSegment content={text} />
    </span>
  );
}

function RenderMathSegment({ content }: { content: string }) {
  const parts = useMemo(() => {
    // Match $$...$$ for display math, or $...$ for inline math
    const regex = /(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g;
    const tokens = content.split(regex);

    return tokens.map((token, i) => {
      if (token.startsWith("$$") && token.endsWith("$$") && token.length >= 4) {
        const math = token.slice(2, -2).trim();
        try {
          const html = katex.renderToString(math, {
            displayMode: true,
            throwOnError: false,
          });
          return (
            <span
              key={i}
              className="block my-2"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return <code key={i}>{token}</code>;
        }
      } else if (
        token.startsWith("$") &&
        token.endsWith("$") &&
        token.length >= 2
      ) {
        const math = token.slice(1, -1).trim();
        try {
          const html = katex.renderToString(math, {
            displayMode: false,
            throwOnError: false,
          });
          return (
            <span
              key={i}
              className="inline-math px-0.5"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return <code key={i}>{token}</code>;
        }
      } else {
        return <React.Fragment key={i}>{token}</React.Fragment>;
      }
    });
  }, [content]);

  return <>{parts}</>;
}
