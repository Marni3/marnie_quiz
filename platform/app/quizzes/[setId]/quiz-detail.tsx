"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MathText } from "@/components/math-text";
import {
  Play,
  Lock,
  Globe,
  Folder as FolderIcon,
  CheckCircle2,
  Edit,
  Trash2,
  Code,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Question } from "@/lib/db/schema";
import { FolderWithCount } from "@/lib/folders";

interface QuizDetailProps {
  quiz: {
    id: string;
    title: string;
    subjectTag: string | null;
    visibility: "shared" | "private";
    folderId: string | null;
    folderName: string | null;
    uploadedByUserId: string;
    createdAt: Date;
    uploader: {
      id: string;
      name: string | null;
      image: string | null;
    };
    questions: Question[];
  };
  folders: FolderWithCount[];
  currentUserId: string;
}

export function QuizDetail({ quiz, folders, currentUserId }: QuizDetailProps) {
  const router = useRouter();

  const [mode, setMode] = useState<"untimed" | "timed_per_question" | "timed_whole_exam">("untimed");
  const [secondsPerQ, setSecondsPerQ] = useState(60);
  const [totalMinutes, setTotalMinutes] = useState(60);
  const [feedbackMode, setFeedbackMode] = useState<"deferred" | "immediate">("deferred");
  const [starting, setStarting] = useState(false);

  // Phase 2: Question module attachment state
  const [expandedQId, setExpandedQId] = useState<string | null>(null);
  const [interactiveUrlInput, setInteractiveUrlInput] = useState("");
  const [interactiveHtmlInput, setInteractiveHtmlInput] = useState("");
  const [savingModule, setSavingModule] = useState(false);

  // Phase 2: Edit Quiz state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(quiz.title);
  const [editTag, setEditTag] = useState(quiz.subjectTag || "");
  const [editFolder, setEditFolder] = useState(quiz.folderId || "");
  const [editVisibility, setEditVisibility] = useState<"shared" | "private">(quiz.visibility);

  const isOwner = quiz.uploadedByUserId === currentUserId;

  const handleStart = async () => {
    setStarting(true);
    try {
      const res = await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionSetId: quiz.id,
          mode,
        }),
      });
      const data = await res.json();
      if (data.success && data.attempt) {
        // Store client options (like feedback mode, timer settings) in sessionStorage for runner
        sessionStorage.setItem(
          `attempt_opts_${data.attempt.id}`,
          JSON.stringify({
            feedbackMode,
            secondsPerQ,
            totalMinutes,
          })
        );
        router.push(`/attempts/${data.attempt.id}`);
      }
    } catch (err) {
      console.error(err);
      setStarting(false);
    }
  };

  const handleSaveModule = async (questionId: string) => {
    setSavingModule(true);
    try {
      const res = await fetch(`/api/questions/${questionId}/interactive`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interactiveHtml: interactiveHtmlInput || null,
          interactiveUrl: interactiveUrlInput || null,
        }),
      });
      if (res.ok) {
        alert("Interactive module saved successfully!");
        router.refresh();
        setExpandedQId(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingModule(false);
    }
  };

  const handleDeleteQuiz = async () => {
    if (!confirm("Are you sure you want to delete this question set? This action cannot be undone.")) {
      return;
    }
    try {
      const res = await fetch(`/api/quizzes/${quiz.id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/quizzes");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Quiz Header Card */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 shadow-[var(--shadow-lg)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              {quiz.subjectTag && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[rgba(217,119,87,0.12)] text-[var(--accent)] border border-[rgba(217,119,87,0.25)]">
                  {quiz.subjectTag}
                </span>
              )}
              {quiz.folderName && (
                <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-[var(--surface2)] text-[var(--text2)] flex items-center gap-1">
                  <FolderIcon className="w-3 h-3" />
                  {quiz.folderName}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-[var(--text3)]">
                {quiz.visibility === "private" ? (
                  <>
                    <Lock className="w-3.5 h-3.5 text-[var(--yellow)]" />
                    <span>Private</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-3.5 h-3.5" />
                    <span>Shared with group</span>
                  </>
                )}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[var(--text)]">
              {quiz.title}
            </h1>

            <div className="flex items-center gap-2 text-xs text-[var(--text3)] pt-1">
              <span>Uploaded by {quiz.uploader.name || "Anonymous"}</span>
              <span>•</span>
              <span>{quiz.questions.length} Questions</span>
              <span>•</span>
              <span>{new Date(quiz.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {isOwner && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 rounded-lg bg-[var(--surface2)] border border-[var(--border)] text-[var(--text2)] hover:border-[var(--accent)] hover:text-[var(--accent)] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={handleDeleteQuiz}
                className="p-2 rounded-lg bg-[var(--surface2)] border border-[var(--border)] text-[var(--text3)] hover:text-[var(--red)] hover:border-[var(--red)] text-xs font-semibold transition-colors cursor-pointer"
                title="Delete quiz"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Start Quiz Setup Section */}
        <div className="pt-6 border-t border-[var(--border)] space-y-6">
          {/* Feedback mode choice */}
          <div>
            <label className="block text-xs font-bold text-[var(--text3)] uppercase tracking-wider font-mono mb-2">
              Answer Feedback
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFeedbackMode("deferred")}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  feedbackMode === "deferred"
                    ? "bg-[rgba(217,119,87,0.08)] border-[var(--accent)] text-[var(--text)] shadow-sm"
                    : "bg-[var(--surface2)] border-[var(--border)] text-[var(--text2)] hover:border-[var(--accent)]"
                }`}
              >
                <div className="font-bold text-xs">📝 At End of Quiz</div>
                <div className="text-[11px] text-[var(--text3)] mt-0.5">
                  Standard exam simulation. Explanations shown after submit.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFeedbackMode("immediate")}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  feedbackMode === "immediate"
                    ? "bg-[rgba(217,119,87,0.08)] border-[var(--accent)] text-[var(--text)] shadow-sm"
                    : "bg-[var(--surface2)] border-[var(--border)] text-[var(--text2)] hover:border-[var(--accent)]"
                }`}
              >
                <div className="font-bold text-xs">⚡ Instant Feedback</div>
                <div className="text-[11px] text-[var(--text3)] mt-0.5">
                  Shows correctness &amp; full solution immediately on answer.
                </div>
              </button>
            </div>
          </div>

          {/* Timer mode choice */}
          <div>
            <label className="block text-xs font-bold text-[var(--text3)] uppercase tracking-wider font-mono mb-2">
              Timer Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setMode("untimed")}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  mode === "untimed"
                    ? "bg-[rgba(217,119,87,0.08)] border-[var(--accent)] text-[var(--text)] shadow-sm"
                    : "bg-[var(--surface2)] border-[var(--border)] text-[var(--text2)] hover:border-[var(--accent)]"
                }`}
              >
                <div className="font-bold text-xs">⏸ Untimed</div>
                <div className="text-[11px] text-[var(--text3)] mt-0.5">
                  No time pressure
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode("timed_per_question")}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  mode === "timed_per_question"
                    ? "bg-[rgba(217,119,87,0.08)] border-[var(--accent)] text-[var(--text)] shadow-sm"
                    : "bg-[var(--surface2)] border-[var(--border)] text-[var(--text2)] hover:border-[var(--accent)]"
                }`}
              >
                <div className="font-bold text-xs">⏱ Per Question</div>
                <div className="text-[11px] text-[var(--text3)] mt-0.5">
                  Countdown per Q
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode("timed_whole_exam")}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  mode === "timed_whole_exam"
                    ? "bg-[rgba(217,119,87,0.08)] border-[var(--accent)] text-[var(--text)] shadow-sm"
                    : "bg-[var(--surface2)] border-[var(--border)] text-[var(--text2)] hover:border-[var(--accent)]"
                }`}
              >
                <div className="font-bold text-xs">🕐 Whole Exam</div>
                <div className="text-[11px] text-[var(--text3)] mt-0.5">
                  Total exam cap
                </div>
              </button>
            </div>

            {mode === "timed_per_question" && (
              <div className="flex items-center gap-3 mt-3 text-xs text-[var(--text2)]">
                <span>Seconds per question:</span>
                <input
                  type="number"
                  min="10"
                  max="600"
                  value={secondsPerQ}
                  onChange={(e) => setSecondsPerQ(Number(e.target.value) || 60)}
                  className="w-20 px-2 py-1 rounded bg-[var(--surface2)] border border-[var(--border)] font-mono text-center"
                />
              </div>
            )}

            {mode === "timed_whole_exam" && (
              <div className="flex items-center gap-3 mt-3 text-xs text-[var(--text2)]">
                <span>Total minutes for set:</span>
                <input
                  type="number"
                  min="1"
                  max="600"
                  value={totalMinutes}
                  onChange={(e) => setTotalMinutes(Number(e.target.value) || 60)}
                  className="w-20 px-2 py-1 rounded bg-[var(--surface2)] border border-[var(--border)] font-mono text-center"
                />
              </div>
            )}
          </div>

          {/* Launch Button */}
          <button
            type="button"
            onClick={handleStart}
            disabled={starting || quiz.questions.length === 0}
            className="w-full py-3.5 rounded-xl bg-[var(--accent)] text-white font-bold text-base hover:brightness-110 shadow-md transition-all cursor-pointer disabled:opacity-40 flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>{starting ? "Starting session..." : "Start Study Session →"}</span>
          </button>
        </div>
      </div>

      {/* Questions Preview & Interactive Modules (Phase 2) */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 shadow-[var(--shadow)] space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-serif text-[var(--text)]">
            Questions in this set ({quiz.questions.length})
          </h2>
          <span className="text-xs text-[var(--text3)]">
            Click question to attach interactive modules
          </span>
        </div>

        <div className="divide-y divide-[var(--border)]">
          {quiz.questions.map((q, idx) => {
            const isExpanded = expandedQId === q.id;
            return (
              <div key={q.id} className="py-3.5">
                <div
                  onClick={() => {
                    if (isExpanded) {
                      setExpandedQId(null);
                    } else {
                      setExpandedQId(q.id);
                      setInteractiveUrlInput(q.interactiveUrl || "");
                      setInteractiveHtmlInput(q.interactiveHtml || "");
                    }
                  }}
                  className="flex items-start justify-between gap-3 cursor-pointer hover:text-[var(--accent)] transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="text-xs font-mono font-bold text-[var(--text3)] pt-0.5 shrink-0">
                      Q{idx + 1}.
                    </span>
                    <div className="text-xs font-medium text-[var(--text)] line-clamp-2">
                      <MathText text={q.promptText} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {q.interactiveHtml && (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-[rgba(40,107,74,0.12)] text-[var(--green)] border border-[rgba(40,107,74,0.25)] flex items-center gap-1">
                        <Code className="w-3 h-3" />
                        HTML
                      </span>
                    )}
                    {q.interactiveUrl && (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-[rgba(217,119,87,0.12)] text-[var(--accent)] border border-[rgba(217,119,87,0.25)] flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        Link
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-[var(--text3)]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[var(--text3)]" />
                    )}
                  </div>
                </div>

                {/* Expanded Interactive Module Attachment Form */}
                {isExpanded && (
                  <div className="mt-4 p-4 rounded-xl bg-[var(--surface2)] border border-[var(--border)] space-y-4">
                    <div className="text-xs font-bold font-mono text-[var(--text3)] uppercase">
                      Attach Interactive Visualization / Tool (Phase 2)
                    </div>

                    <div>
                      <label className="block text-xs text-[var(--text2)] mb-1">
                        External Tool URL (e.g. Claude Artifact link)
                      </label>
                      <input
                        type="url"
                        placeholder="https://claude.site/artifacts/..."
                        value={interactiveUrlInput}
                        onChange={(e) => setInteractiveUrlInput(e.target.value)}
                        className="w-full px-3 py-2 rounded bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--text)]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-[var(--text2)] mb-1">
                        Self-Contained Interactive HTML / SVG / JS (Max 300 KB)
                      </label>
                      <textarea
                        rows={5}
                        placeholder="<svg ...> or <canvas ...> or <div>...</div>"
                        value={interactiveHtmlInput}
                        onChange={(e) => setInteractiveHtmlInput(e.target.value)}
                        className="w-full px-3 py-2 rounded bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--text)] font-mono"
                      />
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => handleSaveModule(q.id)}
                        disabled={savingModule}
                        className="px-3.5 py-1.5 rounded-lg bg-[var(--accent)] text-white text-xs font-semibold hover:brightness-110 disabled:opacity-50"
                      >
                        {savingModule ? "Saving..." : "Save Module"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
