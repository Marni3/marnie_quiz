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

  const [moduleSaved, setModuleSaved] = useState(false);
  const [quizSaved, setQuizSaved] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSaveModule = (mod: any) => {
    try {
      const raw = localStorage.getItem("marnie_tutor_custom_modules");
      const list = raw ? JSON.parse(raw) : [];
      const idx = list.findIndex((m: any) => m.id === mod.id);
      if (idx >= 0) list[idx] = mod;
      else list.unshift(mod);
      localStorage.setItem("marnie_tutor_custom_modules", JSON.stringify(list));
      setModuleSaved(true);
      setTimeout(() => setModuleSaved(false), 2500);
    } catch {}
  };

  // Check if message ends with the Review Exam next-step prompt
  const isExamReviewResponse =
    message.functionMode === "review_exam" ||
    message.content.includes("Create Targeted Learning Module") ||
    message.content.includes("Practice Exam Remix");

  // Attempt to detect embedded JSON module or quiz in assistant responses
  let detectedModule: any = null;
  let detectedQuiz: any = null;
  let rawJsonBlock = "";

  if (!isUser && message.content.includes("```json")) {
    try {
      const jsonMatch = message.content.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        rawJsonBlock = jsonMatch[1].trim();
        const parsed = JSON.parse(rawJsonBlock);
        if (parsed) {
          if (parsed.subtopicTitle && (parsed.theory || parsed.formulas)) {
            detectedModule = parsed;
          } else if (parsed.questions && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
            detectedQuiz = parsed;
          }
        }
      }
    } catch {}
  }

  // Strip JSON code block from chat text so conversational prose is clean and readable
  let displayContent = message.content;
  if (!isUser && (detectedModule || detectedQuiz)) {
    displayContent = message.content.replace(/```json[\s\S]*?```/g, "").trim();
    if (!displayContent) {
      displayContent = detectedModule
        ? `Here is your customized, high-yield learning module for **${detectedModule.subtopicTitle || detectedModule.topicTitle || "this topic"}**. You can preview, study, and launch it directly in the interactive Module Reader below!`
        : `Here is your targeted practice quiz set with **${detectedQuiz.questions?.length || 0} questions**. You can download or practice it below.`;
    }
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

        {/* Content with KaTeX & Markdown with splitParagraphs=true for proper spacing */}
        <div className="max-w-none text-xs sm:text-sm leading-relaxed overflow-x-auto space-y-3">
          <MathText text={displayContent} splitParagraphs={true} />
        </div>

        {/* Detected Module Interactive Launch Banner */}
        {detectedModule && (
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border border-primary/25 space-y-3 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Rocket className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[var(--text)]">
                    Interactive Learning Module Ready!
                  </div>
                  <div className="text-[11px] text-[var(--text2)] truncate max-w-xs sm:max-w-sm">
                    {detectedModule.subtopicTitle} ({detectedModule.code || "CUSTOM"})
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowRawJson((prev) => !prev)}
                  className="px-2.5 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text2)] hover:text-[var(--text)] text-xs font-mono font-medium transition-all shrink-0 cursor-pointer"
                  title="Toggle raw JSON code view"
                >
                  {showRawJson ? "Hide Code" : "View Code"}
                </button>

                <button
                  onClick={() =>
                    handleDownloadJson(
                      detectedModule,
                      `${detectedModule.id || "custom-module"}.json`
                    )
                  }
                  className="p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text2)] hover:text-[var(--text)] text-xs font-semibold transition-all shrink-0 cursor-pointer"
                  title="Download Module JSON"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleSaveModule(detectedModule)}
                  className="px-3 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-primary/40 text-[var(--text)] text-xs font-semibold transition-all shrink-0 cursor-pointer"
                >
                  {moduleSaved ? "Saved!" : "Save"}
                </button>

                <button
                  onClick={() => setPreviewModule(detectedModule)}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:opacity-95 transition-all cursor-pointer shrink-0"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Launch Reader</span>
                </button>
              </div>
            </div>

            {/* Collapsible Raw JSON Code Block */}
            {showRawJson && rawJsonBlock && (
              <div className="pt-2 border-t border-primary/20">
                <pre className="p-3 bg-[var(--surface)] rounded-xl border border-[var(--border)] text-[11px] font-mono text-[var(--text)] overflow-x-auto max-h-60 leading-relaxed">
                  {rawJsonBlock}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Detected Quiz Interactive Launch Banner */}
        {detectedQuiz && (
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-accent/10 border border-emerald-500/25 space-y-3 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[var(--text)]">
                    Custom Practice Drill Generated ({detectedQuiz.questions?.length || 0} Questions)
                  </div>
                  <div className="text-[11px] text-[var(--text2)] truncate max-w-xs sm:max-w-sm">
                    {detectedQuiz.title || "Targeted Topic Practice"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowRawJson((prev) => !prev)}
                  className="px-2.5 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text2)] hover:text-[var(--text)] text-xs font-mono font-medium transition-all shrink-0 cursor-pointer"
                  title="Toggle raw JSON code view"
                >
                  {showRawJson ? "Hide Code" : "View Code"}
                </button>

                <button
                  onClick={() =>
                    handleDownloadJson(
                      detectedQuiz,
                      `custom-drill-${Date.now()}.json`
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-emerald-500/40 text-[var(--text)] text-xs font-semibold transition-all shrink-0 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download JSON</span>
                </button>
              </div>
            </div>

            {/* Collapsible Raw JSON Code Block */}
            {showRawJson && rawJsonBlock && (
              <div className="pt-2 border-t border-emerald-500/20">
                <pre className="p-3 bg-[var(--surface)] rounded-xl border border-[var(--border)] text-[11px] font-mono text-[var(--text)] overflow-x-auto max-h-60 leading-relaxed">
                  {rawJsonBlock}
                </pre>
              </div>
            )}
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
