"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MathText } from "@/components/math-text";
import { Navbar } from "@/components/navbar";
import {
  RotateCcw,
  BookOpen,
  CheckCircle2,
  XCircle,
  MinusCircle,
  ExternalLink,
  Code,
  Sparkles,
} from "lucide-react";
import { QuestionResultDetail } from "@/lib/grading";

function formatDuration(sec: number | null) {
  if (!sec) return "0s";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

interface ResultsViewProps {
  attempt: {
    id: string;
    questionSetId: string;
    score: number | null;
    totalQuestions: number;
    durationSeconds: number | null;
    completedAt: Date | null;
  };
  questionSet: {
    id: string;
    title: string;
    subjectTag: string | null;
  };
  questions: QuestionResultDetail[];
  score: number;
  total: number;
  percentage: number;
}

export function ResultsView({
  attempt,
  questionSet,
  questions,
  score,
  total,
  percentage,
}: ResultsViewProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "wrong" | "correct" | "skipped">("all");
  const [retaking, setRetaking] = useState(false);

  const correctCount = questions.filter((q) => q.isCorrect).length;
  const wrongCount = questions.filter((q) => q.selectedChoice !== null && !q.isCorrect).length;
  const skippedCount = questions.filter((q) => q.selectedChoice === null).length;

  const filteredQuestions = questions.filter((q) => {
    if (filter === "correct") return q.isCorrect;
    if (filter === "wrong") return q.selectedChoice !== null && !q.isCorrect;
    if (filter === "skipped") return q.selectedChoice === null;
    return true;
  });

  const handleRetake = async () => {
    setRetaking(true);
    try {
      const res = await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionSetId: questionSet.id,
          mode: "untimed",
        }),
      });
      const data = await res.json();
      if (data.success && data.attempt) {
        router.push(`/attempts/${data.attempt.id}`);
      }
    } catch (err) {
      console.error(err);
      setRetaking(false);
    }
  };

  const handleReviewWithAI = () => {
    try {
      const missedQuestions = questions
        .filter((q) => !q.isCorrect)
        .slice(0, 10)
        .map((q, idx) => ({
          questionNumber: idx + 1,
          promptText: q.promptText,
          selectedChoice: q.selectedChoice || "Unanswered / Skipped",
          correctChoice: q.correctChoice,
          explanation: q.explanation || "",
        }));

      sessionStorage.setItem(
        "marnie_tutor_pending_review_context",
        JSON.stringify({
          attemptId: attempt.id,
          examTitle: questionSet.title,
          subjectTag: questionSet.subjectTag || undefined,
          score,
          total,
          percentage,
          totalMissed: questions.filter((q) => !q.isCorrect).length,
          missedQuestions,
        })
      );
    } catch (err) {
      console.error(err);
    }
    router.push("/tutor?mode=review_exam");
  };

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      <Navbar breadcrumb={`${questionSet.title} — Results`} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Score Summary Card */}
        <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 sm:p-10 shadow-[var(--shadow-lg)] text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--accent)]" />

          <div className="text-xs font-bold font-mono text-[var(--text3)] uppercase tracking-wider mb-2">
            Session Graded Results
          </div>

          <div className="text-5xl sm:text-6xl font-bold font-serif text-[var(--accent)] tracking-tight">
            {percentage}%
          </div>
          <div className="text-sm font-medium text-[var(--text2)] mt-2">
            {score} out of {total} questions correct
          </div>

          {/* Stat Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[var(--border)]">
            <div className="p-3 rounded-xl bg-[var(--surface2)]">
              <div className="text-xl font-bold font-serif text-[var(--green)]">
                {correctCount}
              </div>
              <div className="text-[11px] font-mono text-[var(--text3)] uppercase tracking-wider mt-0.5">
                Correct
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--surface2)]">
              <div className="text-xl font-bold font-serif text-[var(--red)]">
                {wrongCount}
              </div>
              <div className="text-[11px] font-mono text-[var(--text3)] uppercase tracking-wider mt-0.5">
                Incorrect
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--surface2)]">
              <div className="text-xl font-bold font-serif text-[var(--text2)]">
                {skippedCount}
              </div>
              <div className="text-[11px] font-mono text-[var(--text3)] uppercase tracking-wider mt-0.5">
                Skipped
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--surface2)]">
              <div className="text-xl font-bold font-serif text-[var(--accent)]">
                {formatDuration(attempt.durationSeconds)}
              </div>
              <div className="text-[11px] font-mono text-[var(--text3)] uppercase tracking-wider mt-0.5">
                Time Spent
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
            <button
              type="button"
              onClick={handleReviewWithAI}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 via-amber-500 to-primary text-white font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg hover:shadow-primary/20 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
              <span>Review Exam with AI Debrief</span>
            </button>

            <button
              type="button"
              onClick={handleRetake}
              disabled={retaking}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--accent)] text-white font-semibold text-xs hover:brightness-110 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{retaking ? "Starting..." : "Retake This Quiz"}</span>
            </button>

            <Link
              href="/quizzes"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--surface2)] border border-[var(--border2)] text-[var(--text2)] font-semibold text-xs hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Back to Library</span>
            </Link>
          </div>
        </section>

        {/* Review Filters Header */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-xl font-bold font-serif text-[var(--text)]">
              Detailed Question Review
            </h2>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--surface)] border border-[var(--border)] self-start sm:self-auto">
              {(["all", "wrong", "correct", "skipped"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilter(tab)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                    filter === tab
                      ? "bg-[var(--accent)] text-white shadow-sm"
                      : "text-[var(--text3)] hover:text-[var(--text)]"
                  }`}
                >
                  {tab === "all" ? `All (${questions.length})` : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Review Questions List */}
          <div className="space-y-4">
            {filteredQuestions.map((q) => {
              return (
                <div
                  key={q.id}
                  className={`bg-[var(--surface)] border rounded-2xl p-6 shadow-[var(--shadow)] space-y-4 border-l-4 ${
                    q.isCorrect
                      ? "border-l-[var(--green)] border-[var(--border)]"
                      : q.selectedChoice === null
                      ? "border-l-[var(--text3)] border-[var(--border)]"
                      : "border-l-[var(--red)] border-[var(--border)]"
                  }`}
                >
                  {/* Header Row */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[var(--surface2)] text-[var(--text2)] border border-[var(--border)]">
                        Q{q.orderIndex + 1}
                      </span>

                      {q.isCorrect ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[rgba(40,107,74,0.12)] text-[var(--green)]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Correct
                        </span>
                      ) : q.selectedChoice === null ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[rgba(100,95,88,0.12)] text-[var(--text3)]">
                          <MinusCircle className="w-3.5 h-3.5" />
                          Skipped
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[rgba(184,50,40,0.12)] text-[var(--red)]">
                          <XCircle className="w-3.5 h-3.5" />
                          Incorrect
                        </span>
                      )}
                    </div>

                    {/* Phase 2: Interactive Module Buttons */}
                    <div className="flex items-center gap-2">
                      {q.interactiveHtml && (
                        <Link
                          href={`/modules/${q.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[rgba(40,107,74,0.12)] border border-[rgba(40,107,74,0.3)] text-[var(--green)] hover:brightness-110"
                        >
                          <Code className="w-3.5 h-3.5" />
                          <span>Interactive Module</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}

                      {q.interactiveUrl && (
                        <a
                          href={q.interactiveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[rgba(217,119,87,0.12)] border border-[rgba(217,119,87,0.3)] text-[var(--accent)] hover:brightness-110"
                        >
                          <span>Tool Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Optional Image */}
                  {q.imageUrl && (
                    <div className="text-center pt-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={q.imageUrl}
                        alt="Question visual"
                        className="max-h-56 mx-auto rounded-lg border border-[var(--border)] object-contain"
                      />
                    </div>
                  )}

                  {/* Prompt Text */}
                  <div className="text-base font-serif font-medium text-[var(--text)] leading-relaxed">
                    <MathText text={q.promptText} />
                  </div>

                  {/* Choices Breakdown */}
                  <div className="space-y-2 pt-2">
                    {(["a", "b", "c", "d"] as const).map((letter) => {
                      const isCorrectChoice = q.correctChoice === letter;
                      const isUserChoice = q.selectedChoice === letter;
                      const choiceText =
                        letter === "a"
                          ? q.choiceA
                          : letter === "b"
                          ? q.choiceB
                          : letter === "c"
                          ? q.choiceC
                          : q.choiceD;

                      return (
                        <div
                          key={letter}
                          className={`flex items-start gap-3 p-3 rounded-xl border text-xs sm:text-sm ${
                            isCorrectChoice
                              ? "bg-[rgba(40,107,74,0.08)] border-[rgba(40,107,74,0.35)] text-[var(--green)] font-semibold"
                              : isUserChoice
                              ? "bg-[rgba(184,50,40,0.08)] border-[rgba(184,50,40,0.3)] text-[var(--red)] font-semibold"
                              : "bg-[var(--surface2)] border-[var(--border)] text-[var(--text2)] opacity-80"
                          }`}
                        >
                          <span className="font-mono font-bold shrink-0 pt-0.5">
                            {letter.toUpperCase()}.
                          </span>
                          <div className="flex-1 leading-normal">
                            <MathText text={choiceText} />
                          </div>
                          {isCorrectChoice && (
                            <span className="text-[11px] font-mono shrink-0 text-[var(--green)] font-bold">
                              ✓ Correct Answer
                            </span>
                          )}
                          {isUserChoice && !isCorrectChoice && (
                            <span className="text-[11px] font-mono shrink-0 text-[var(--red)] font-bold">
                              ✗ Your Choice
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Solution Explanation Box */}
                  {q.explanation && (
                    <div className="mt-4 p-4 rounded-xl bg-[var(--surface2)] border border-[var(--border)] border-l-4 border-l-[var(--accent)] space-y-2">
                      <div className="text-xs font-bold font-mono text-[var(--accent)] uppercase tracking-wider">
                        📖 Solution &amp; Educational Explanation
                      </div>
                      <div className="text-xs sm:text-sm text-[var(--text2)] leading-relaxed">
                        <MathText text={q.explanation} splitParagraphs={true} />
                      </div>
                    </div>
                  )}

                  {/* Phase 2: Inline Sandboxed Interactive Module iframe preview */}
                  {q.interactiveHtml && (
                    <div className="mt-4 p-4 rounded-xl bg-[var(--surface2)] border border-[var(--border)] space-y-2">
                      <div className="text-xs font-bold font-mono text-[var(--text3)] uppercase tracking-wider">
                        Interactive Diagram / Module
                      </div>
                      <div className="rounded-lg overflow-hidden border border-[var(--border)] bg-white aspect-video max-h-80">
                        <iframe
                          title={`Module Q${q.orderIndex + 1}`}
                          srcDoc={q.interactiveHtml}
                          sandbox="allow-scripts"
                          className="w-full h-full border-0"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
