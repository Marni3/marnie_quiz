"use client";

import { useState } from "react";
import { ChatMessage, TutorFunctionMode } from "@/lib/tutor/types";
import { MathText } from "@/components/math-text";
import { CustomModuleModal } from "./custom-module-modal";
import {
  Copy,
  Check,
  Sparkles,
  User,
  BookOpen,
  RotateCcw,
  Target,
  Rocket,
  Download,
} from "lucide-react";

interface ChatMessageProps {
  message: ChatMessage;
  onTriggerAction?: (mode: TutorFunctionMode, promptText: string) => void;
}

export function ChatMessageItem({ message, onTriggerAction }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const [previewModule, setPreviewModule] = useState<any | null>(null);
  const isUser = message.role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Check if message ends with the Review Exam next-step prompt
  const isExamReviewResponse =
    message.functionMode === "review_exam" ||
    message.content.includes("Create Targeted Learning Module") ||
    message.content.includes("Practice Exam Remix");

  // Attempt to detect embedded JSON module in assistant responses
  let detectedModule: any = null;
  if (!isUser && message.content.includes("```json")) {
    try {
      const jsonMatch = message.content.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        const parsed = JSON.parse(jsonMatch[1]);
        if (parsed && parsed.subtopicTitle && parsed.theory) {
          detectedModule = parsed;
        }
      }
    } catch {}
  }

  return (
    <div
      className={`flex items-start gap-3 w-full animate-in fade-in duration-200 ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center border text-xs font-bold ${
          isUser
            ? "bg-primary text-white border-primary"
            : "bg-primary/10 text-primary border-primary/20"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
      </div>

      {/* Message Body */}
      <div
        className={`flex-1 max-w-[88%] sm:max-w-[82%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed border space-y-3 relative group ${
          isUser
            ? "bg-primary text-white border-primary/30 rounded-tr-none shadow-xs"
            : "bg-[var(--surface)] border-[var(--border)] text-[var(--text)] rounded-tl-none shadow-xs"
        }`}
      >
        {/* Context or Function Mode Badge */}
        {!isUser && message.functionMode && (
          <div className="flex items-center gap-2 pb-1 border-b border-[var(--border)] text-[10px] uppercase font-mono font-bold text-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span>
              {message.functionMode === "chat" && "AI Tutor"}
              {message.functionMode === "custom_module" && "Custom Module & Tests"}
              {message.functionMode === "tricky_questions" && "Tricky Question Practice"}
              {message.functionMode === "formula_sheet" && "Formula Sheet Generator"}
              {message.functionMode === "review_exam" && "Exam Diagnostic Review"}
            </span>
          </div>
        )}

        {/* Content with KaTeX & Markdown */}
        <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed overflow-x-auto">
          <MathText text={message.content} />
        </div>

        {/* Detected Module Interactive Launch Banner */}
        {detectedModule && (
          <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 border border-primary/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-xs">
                <Rocket className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[var(--text)]">
                  Interactive Module Ready!
                </div>
                <div className="text-[11px] text-[var(--text2)] truncate max-w-xs sm:max-w-sm">
                  {detectedModule.subtopicTitle} ({detectedModule.code || "CUSTOM"})
                </div>
              </div>
            </div>

            <button
              onClick={() => setPreviewModule(detectedModule)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:opacity-95 transition-all cursor-pointer shrink-0"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Launch Module Reader</span>
            </button>
          </div>
        )}

        {/* Interactive Dual-Choice Action Card for Exam Reviews */}
        {!isUser && isExamReviewResponse && onTriggerAction && (
          <div className="mt-4 pt-3 border-t border-[var(--border)] bg-[var(--surface2)]/60 -mx-4 -mb-4 p-4 rounded-b-2xl space-y-2">
            <div className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
              <Target className="w-4 h-4 text-primary" />
              <span>Recommended Next Steps:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                onClick={() =>
                  onTriggerAction(
                    "custom_module",
                    "Please generate a complete learning module and mastery challenge focused specifically on the weak subtopics identified in our exam review."
                  )
                }
                className="p-3 rounded-xl bg-[var(--surface)] border border-emerald-500/30 hover:border-emerald-500 hover:bg-emerald-500/5 text-left flex items-start gap-2.5 transition-all group/btn"
              >
                <BookOpen className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-[var(--text)] group-hover/btn:text-emerald-500 transition-colors">
                    📘 Create Targeted Module
                  </div>
                  <div className="text-[10px] text-[var(--text2)] leading-tight mt-0.5">
                    Generate an in-depth lesson on your exact missed concepts.
                  </div>
                </div>
              </button>

              <button
                onClick={() =>
                  onTriggerAction(
                    "tricky_questions",
                    "Please generate an isomorphic 10-question practice remix testing the exact concepts and distractor traps from my missed questions."
                  )
                }
                className="p-3 rounded-xl bg-[var(--surface)] border border-amber-500/30 hover:border-amber-500 hover:bg-amber-500/5 text-left flex items-start gap-2.5 transition-all group/btn"
              >
                <RotateCcw className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-[var(--text)] group-hover/btn:text-amber-500 transition-colors">
                    ⚡ Practice Exam Remix
                  </div>
                  <div className="text-[10px] text-[var(--text2)] leading-tight mt-0.5">
                    Retest similar questions right now to verify mastery.
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Copy Button */}
        <div className="flex items-center justify-end pt-1">
          <button
            onClick={handleCopy}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all ${
              isUser
                ? "text-white/80 hover:text-white hover:bg-white/10"
                : "text-[var(--text3)] hover:text-[var(--text)] hover:bg-[var(--surface2)]"
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="text-[10px]">{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>

      {/* Interactive Custom Module Modal */}
      {previewModule && (
        <CustomModuleModal
          isOpen={!!previewModule}
          onClose={() => setPreviewModule(null)}
          module={previewModule}
        />
      )}
    </div>
  );
}
