"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChatMessage, TutorFunctionMode } from "@/lib/tutor/types";
import { MathText } from "@/components/math-text";
import { CustomModuleModal } from "./custom-module-modal";
import { CustomQuizModal } from "./custom-quiz-modal";
import { saveStoredNote } from "@/lib/notes";
import { recordStudyActivity } from "@/lib/streak";
import { saveCustomModule, saveCustomQuiz } from "@/lib/tutor/storage";
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
  BookMarked,
  CheckCircle2,
  Zap,
} from "lucide-react";

import { safeParseLlmJson } from "@/lib/tutor/json-parser";

interface ChatMessageProps {
  message: ChatMessage;
  onTriggerAction?: (mode: TutorFunctionMode, promptText: string) => void;
}

function extractArtifactFromMessage(content: string): { module: any | null; quiz: any | null; rawJson: string } {
  if (!content || typeof content !== "string") return { module: null, quiz: null, rawJson: "" };

  // 1. Try extracting all fenced code blocks (```json ... ```)
  const matches = Array.from(content.matchAll(/```(?:json)?\s*([\s\S]*?)(?:```|$)/gi));
  for (const m of matches) {
    if (m[1]) {
      const candidate = m[1].trim();
      const parsed = safeParseLlmJson(candidate);
      if (parsed && typeof parsed === "object") {
        const isModule =
          Boolean(parsed.subtopicTitle || parsed.topicTitle || parsed.id || parsed.code) &&
          Boolean(
            parsed.toc || parsed.theory || parsed.sections || parsed.formulas ||
            parsed.comparisonTables || parsed.sampleProblems || parsed.conceptChecks ||
            parsed.terms || parsed.examples || parsed.learningObjectives || parsed.calculatorGuides
          );

        if (isModule) {
          return { module: parsed, quiz: null, rawJson: candidate };
        }

        const isQuiz =
          (Array.isArray(parsed.questions) && parsed.questions.length > 0) ||
          (Array.isArray(parsed.items) && parsed.items.length > 0);

        if (isQuiz) {
          return { module: null, quiz: parsed, rawJson: candidate };
        }
      }
    }
  }

  // 2. Try whole-message parser fallback
  const parsed = safeParseLlmJson(content);
  if (parsed && typeof parsed === "object") {
    const isModule =
      Boolean(parsed.subtopicTitle || parsed.topicTitle || parsed.id || parsed.code) &&
      Boolean(
        parsed.toc || parsed.theory || parsed.sections || parsed.formulas ||
        parsed.comparisonTables || parsed.sampleProblems || parsed.conceptChecks ||
        parsed.terms || parsed.examples || parsed.learningObjectives || parsed.calculatorGuides
      );

    if (isModule) {
      return { module: parsed, quiz: null, rawJson: content };
    }

    const isQuiz =
      (Array.isArray(parsed.questions) && parsed.questions.length > 0) ||
      (Array.isArray(parsed.items) && parsed.items.length > 0);

    if (isQuiz) {
      return { module: null, quiz: parsed, rawJson: content };
    }
  }

  return { module: null, quiz: null, rawJson: "" };
}

export function ChatMessageItem({ message, onTriggerAction }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const [savedToNotebook, setSavedToNotebook] = useState(false);
  const [previewModule, setPreviewModule] = useState<any | null>(null);
  const [previewQuiz, setPreviewQuiz] = useState<any | null>(null);
  const isUser = message.role === "user";

  const [showRawJson, setShowRawJson] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToNotebook = (contentToSave: string) => {
    let title = "AI Study Note";
    const headingMatch = contentToSave.match(/^#+\s+(.*)$/m);
    if (headingMatch && headingMatch[1]) {
      title = headingMatch[1].trim();
    } else if (message.functionMode === "custom_module") {
      title = `AI Custom Module Summary`;
    } else if (message.functionMode === "tricky_questions") {
      title = `AI Tricky Questions & Traps`;
    } else if (message.functionMode === "formula_sheet") {
      title = `AI Formula Compilation`;
    } else if (message.functionMode === "review_exam") {
      title = `AI Exam Diagnostic Note`;
    } else {
      title = `AI Tutor Note (${new Date().toLocaleDateString()})`;
    }

    try {
      const newNote = {
        id: `note_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        title,
        type: "custom_note" as const,
        content: contentToSave,
        tags: ["AI Tutor", message.functionMode || "General"],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      saveStoredNote(newNote);
      recordStudyActivity("note");
      setSavedToNotebook(true);
      setTimeout(() => setSavedToNotebook(false), 3000);
    } catch (err) {
      console.error("Save note failed:", err);
    }
  };

  const handleDownloadMarkdown = (contentToDownload: string) => {
    const blob = new Blob([contentToDownload], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `marnie-ai-note-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

  // Attempt to extract module or quiz artifact from message
  const { module: detectedModule, quiz: detectedQuiz, rawJson: rawJsonBlock } = !isUser
    ? extractArtifactFromMessage(message.content)
    : { module: null, quiz: null, rawJson: "" };

  // Automatically persist any generated module or quiz to localStorage with unique ID deduplication
  useEffect(() => {
    if (detectedModule && typeof window !== "undefined") {
      saveCustomModule(detectedModule);
    }
    if (detectedQuiz && typeof window !== "undefined") {
      saveCustomQuiz(detectedQuiz);
    }
  }, [detectedModule, detectedQuiz]);

  // Check if message ends with the Review Exam next-step prompt
  const isExamReviewResponse =
    message.functionMode === "review_exam" ||
    message.content.includes("Create Targeted Learning Module") ||
    message.content.includes("Practice Exam Remix");

  // Cleanly strip raw JSON from conversational prose
  let displayContent = message.content;
  if (!isUser && (detectedModule || detectedQuiz)) {
    displayContent = message.content
      .replace(/```(?:json)?[\s\S]*?```/g, "")
      .replace(/\{[\s\S]*"subtopicTitle"[\s\S]*\}/g, "")
      .trim();

    if (!displayContent) {
      displayContent = detectedModule
        ? `Here is your customized, high-yield learning module for **${detectedModule.subtopicTitle || detectedModule.topicTitle || "this topic"}**. You can launch it directly in the interactive Module Reader below or find it anytime in your Learn library!`
        : `Here is your targeted practice quiz set with **${detectedQuiz.questions?.length || 0} questions**. You can practice or download it below.`;
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
              {message.functionMode === "low_friction" && "☕ Low-Energy Study Coach"}
            </span>
          </div>
        )}

        {/* Content with KaTeX & Markdown with splitParagraphs=true for proper spacing */}
        <div className="max-w-none text-xs sm:text-sm leading-relaxed overflow-x-auto space-y-3">
          <MathText text={displayContent} splitParagraphs={true} />
        </div>

        {/* Detected Module Interactive Launch Banner */}
        {detectedModule && (
          <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border border-primary/25 space-y-3.5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Rocket className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-[var(--text)]">
                    Interactive Learning Module Ready!
                  </div>
                  <div className="text-[11px] text-[var(--text2)] truncate max-w-xs sm:max-w-md">
                    {detectedModule.subtopicTitle} ({detectedModule.code || "CUSTOM"})
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Check className="w-3 h-3" />
                  <span>Auto-Saved</span>
                </span>

                <button
                  onClick={() => setShowRawJson((prev) => !prev)}
                  className="px-2.5 py-1 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text2)] hover:text-[var(--text)] text-xs font-mono font-medium transition-all cursor-pointer"
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
                  className="p-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text2)] hover:text-[var(--text)] text-xs font-semibold transition-all cursor-pointer"
                  title="Download Module JSON"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-2 pt-2.5 border-t border-primary/20">
              <button
                onClick={() => setPreviewModule(detectedModule)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Open Module Reader</span>
              </button>
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
          <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-accent/10 border border-emerald-500/25 space-y-3.5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Target className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-[var(--text)]">
                    Custom Practice Drill Generated ({detectedQuiz.questions?.length || 0} Questions)
                  </div>
                  <div className="text-[11px] text-[var(--text2)] truncate max-w-xs sm:max-w-md">
                    {detectedQuiz.title || "Targeted Topic Practice Drill"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Check className="w-3 h-3" />
                  <span>Auto-Saved</span>
                </span>

                <button
                  onClick={() => setShowRawJson((prev) => !prev)}
                  className="px-2.5 py-1 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text2)] hover:text-[var(--text)] text-xs font-mono font-medium transition-all cursor-pointer"
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
                  className="p-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text2)] hover:text-[var(--text)] text-xs font-semibold transition-all cursor-pointer"
                  title="Download Drill JSON"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-2 pt-2.5 border-t border-emerald-500/20">
              <button
                onClick={() => setPreviewQuiz(detectedQuiz)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <Rocket className="w-4 h-4" />
                <span>Launch Quiz Runner</span>
              </button>
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

        {/* Message Actions Toolbar */}
        <div className="flex items-center justify-between pt-1 border-t border-[var(--border)]/40 mt-2">
          {!isUser ? (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleSaveToNotebook(displayContent)}
                className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all cursor-pointer ${
                  savedToNotebook
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30"
                    : "text-[var(--text3)] hover:text-primary hover:bg-[var(--surface2)]"
                }`}
                title="Save this explanation to your Personal Study Notebook"
              >
                {savedToNotebook ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <BookMarked className="w-3.5 h-3.5" />
                )}
                <span className="text-[10px]">{savedToNotebook ? "Saved to Notes!" : "Save Note"}</span>
              </button>

              {savedToNotebook && (
                <Link
                  href="/notes"
                  className="text-[10px] text-primary underline hover:opacity-80 ml-1"
                >
                  View Vault →
                </Link>
              )}

              <button
                type="button"
                onClick={() => handleDownloadMarkdown(displayContent)}
                className="p-1.5 rounded-lg text-xs flex items-center gap-1 text-[var(--text3)] hover:text-[var(--text)] hover:bg-[var(--surface2)] transition-all cursor-pointer"
                title="Download as Markdown file (.md)"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="text-[10px]">.md</span>
              </button>
            </div>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleCopy}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all cursor-pointer ${
              isUser
                ? "text-white/80 hover:text-white hover:bg-white/10"
                : "text-[var(--text3)] hover:text-[var(--text)] hover:bg-[var(--surface2)]"
            }`}
            title="Copy message content"
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

      {/* Interactive Custom Quiz Modal */}
      {previewQuiz && (
        <CustomQuizModal
          isOpen={!!previewQuiz}
          onClose={() => setPreviewQuiz(null)}
          quiz={previewQuiz}
          module={detectedModule}
        />
      )}
    </div>
  );
}
