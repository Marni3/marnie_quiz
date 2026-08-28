"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MathText } from "@/components/math-text";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Flag,
  CheckCircle,
  AlertCircle,
  Timer as TimerIcon,
  Send,
} from "lucide-react";
import { SanitizedQuestionForTaking } from "@/lib/attempts";

interface QuizRunnerProps {
  attempt: {
    id: string;
    mode: "untimed" | "timed_per_question" | "timed_whole_exam";
    startedAt: Date;
    totalQuestions: number;
  };
  questionSet: {
    id: string;
    title: string;
    subjectTag: string | null;
  };
  questions: SanitizedQuestionForTaking[];
}

export function QuizRunner({ attempt, questionSet, questions }: QuizRunnerProps) {
  const router = useRouter();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, "a" | "b" | "c" | "d" | null>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [timerRemaining, setTimerRemaining] = useState<number>(0);
  const [feedbackMode, setFeedbackMode] = useState<"deferred" | "immediate">("deferred");

  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load client options from sessionStorage
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(`attempt_opts_${attempt.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.feedbackMode) setFeedbackMode(parsed.feedbackMode);
        if (attempt.mode === "timed_per_question" && parsed.secondsPerQ) {
          setTimerRemaining(parsed.secondsPerQ);
        } else if (attempt.mode === "timed_whole_exam" && parsed.totalMinutes) {
          setTimerRemaining(parsed.totalMinutes * 60);
        }
      }
    } catch {
      // defaults
    }
  }, [attempt.id, attempt.mode]);

  // Timer logic
  useEffect(() => {
    if (attempt.mode === "untimed") return;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimerRemaining((prev) => {
        if (prev <= 1) {
          if (attempt.mode === "timed_per_question") {
            // Auto advance or submit
            if (currentIdx < questions.length - 1) {
              setCurrentIdx((i) => i + 1);
              return 60; // reset
            } else {
              handleSubmit();
              return 0;
            }
          } else {
            // Whole exam timeout
            handleSubmit();
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [attempt.mode, currentIdx, questions.length]);

  const currentQ = questions[currentIdx];
  const answeredCount = Object.values(answers).filter(Boolean).length;
  const progressPct = (answeredCount / questions.length) * 100;

  const handleSelectChoice = (choice: "a" | "b" | "c" | "d") => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: choice,
    }));
  };

  const toggleFlag = () => {
    setFlagged((prev) => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id],
    }));
  };

  const handleSubmit = async () => {
    if (submitting) return;

    const unAns = questions.length - answeredCount;
    if (unAns > 0 && attempt.mode === "untimed") {
      if (!confirm(`You have ${unAns} unanswered question(s). Are you sure you want to submit?`)) {
        return;
      }
    }

    setSubmitting(true);
    const durationSeconds = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));

    const formattedAnswers = questions.map((q) => ({
      questionId: q.id,
      selectedChoice: answers[q.id] || null,
      timeSpentSeconds: 0,
    }));

    try {
      const res = await fetch(`/api/attempts/${attempt.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: formattedAnswers,
          durationSeconds,
        }),
      });

      if (res.ok) {
        router.push(`/attempts/${attempt.id}/results`);
      } else {
        alert("Failed to submit exam. Please try again.");
        setSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      {/* Top Runner Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-[var(--surface)] border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/quizzes"
              onClick={(e) => {
                if (!confirm("Exit this session? Current progress will be lost.")) {
                  e.preventDefault();
                }
              }}
              className="text-xs font-semibold text-[var(--text2)] hover:text-[var(--accent)] flex items-center gap-1 shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Exit</span>
            </Link>

            <span className="text-[var(--text3)]">/</span>
            <span className="text-xs sm:text-sm font-bold text-[var(--text)] font-serif truncate">
              {questionSet.title}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1 rounded-full bg-[rgba(217,119,87,0.12)] border border-[rgba(217,119,87,0.3)] text-xs font-bold font-mono text-[var(--accent)]">
              Q {currentIdx + 1} / {questions.length}
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 w-full bg-[var(--border)] overflow-hidden">
          <div
            className="h-full bg-[var(--accent)] transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Mobile Horizontal Quick-Jump Question Strip (Visible on < lg screens) */}
        <div className="lg:hidden px-3 py-2 border-t border-[var(--border)] bg-[var(--surface2)]/60 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
          {questions.map((q, idx) => {
            const isCurrent = currentIdx === idx;
            const isAnswered = !!answers[q.id];
            const isFlagged = !!flagged[q.id];

            let bgStyle = "border-[var(--border)] bg-[var(--surface)] text-[var(--text3)]";
            if (isCurrent) {
              bgStyle = "border-[var(--accent)] bg-[rgba(217,119,87,0.18)] text-[var(--accent)] ring-2 ring-[var(--accent)]";
            } else if (isFlagged) {
              bgStyle = "border-[var(--yellow)] bg-[rgba(212,160,58,0.12)] text-[var(--yellow)]";
            } else if (isAnswered) {
              bgStyle = "border-[var(--accent)] bg-[rgba(217,119,87,0.1)] text-[var(--accent)] font-semibold";
            }

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIdx(idx)}
                className={`w-8 h-8 rounded-lg font-mono text-xs font-bold flex items-center justify-center shrink-0 transition-all cursor-pointer border ${bgStyle}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Question Column */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            {/* Meta bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {currentQ.subjectTag && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--surface2)] text-[var(--accent)] border border-[var(--border)]">
                    {currentQ.subjectTag}
                  </span>
                )}
                {attempt.mode !== "untimed" && (
                  <span className="lg:hidden text-xs font-mono font-bold text-[var(--accent)] px-2 py-0.5 rounded bg-[var(--surface2)] border border-[var(--border)]">
                    ⏳ {formatTime(timerRemaining)}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={toggleFlag}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
                  flagged[currentQ.id]
                    ? "bg-[rgba(212,160,58,0.12)] border-[var(--yellow)] text-[var(--yellow)]"
                    : "bg-[var(--surface2)] border-[var(--border)] text-[var(--text3)] hover:text-[var(--yellow)]"
                }`}
              >
                <Flag className={`w-3.5 h-3.5 ${flagged[currentQ.id] ? "fill-current" : ""}`} />
                <span>{flagged[currentQ.id] ? "Flagged" : "Flag"}</span>
              </button>
            </div>

            {/* Question Card */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 sm:p-8 shadow-[var(--shadow-lg)] space-y-5 sm:space-y-6">
              {currentQ.imageUrl && (
                <div className="text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentQ.imageUrl}
                    alt="Question visual"
                    className="max-h-60 mx-auto rounded-lg border border-[var(--border)] object-contain"
                  />
                </div>
              )}

              {/* Prompt Stem */}
              <div className="text-sm sm:text-lg font-serif font-medium text-[var(--text)] leading-relaxed">
                <MathText text={currentQ.promptText} />
              </div>

              {/* Choices A, B, C, D */}
              <div className="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2">
                {(["a", "b", "c", "d"] as const).map((letter) => {
                  const isSelected = answers[currentQ.id] === letter;
                  const choiceText =
                    letter === "a"
                      ? currentQ.choiceA
                      : letter === "b"
                      ? currentQ.choiceB
                      : letter === "c"
                      ? currentQ.choiceC
                      : currentQ.choiceD;

                  return (
                    <div
                      key={letter}
                      onClick={() => handleSelectChoice(letter)}
                      className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border-2 transition-all cursor-pointer active:scale-[0.99] ${
                        isSelected
                          ? "border-[var(--accent)] bg-[rgba(217,119,87,0.08)] shadow-sm"
                          : "border-[var(--border)] hover:border-[var(--accent)] bg-[var(--surface2)]"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono shrink-0 transition-colors ${
                          isSelected
                            ? "bg-[var(--accent)] text-white"
                            : "bg-[var(--surface)] border border-[var(--border2)] text-[var(--text2)]"
                        }`}
                      >
                        {letter.toUpperCase()}
                      </div>
                      <div className="text-xs sm:text-sm text-[var(--text)] pt-0.5 leading-normal flex-1 overflow-x-auto">
                        <MathText text={choiceText} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4 pt-2">
              <button
                type="button"
                onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                disabled={currentIdx === 0}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[var(--surface2)] border border-[var(--border2)] text-[var(--text2)] font-semibold text-xs hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all disabled:opacity-30 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-2">
                {currentIdx < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))}
                    className="inline-flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-[var(--accent)] text-white font-semibold text-xs hover:brightness-110 shadow-sm transition-all cursor-pointer"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-[var(--green)] text-white font-semibold text-xs hover:brightness-110 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? "Grading..." : "Submit Exam"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Navigator Sidebar (Desktop Only) */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-[var(--shadow)] sticky top-24 space-y-5">
              {/* Timer Display */}
              {attempt.mode !== "untimed" && (
                <div className="p-3.5 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-[var(--text3)] uppercase tracking-wider font-mono mb-1">
                    <TimerIcon className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span>Time Remaining</span>
                  </div>
                  <div
                    className={`text-2xl font-bold font-mono ${
                      timerRemaining <= 30 ? "text-[var(--red)] animate-pulse" : "text-[var(--text)]"
                    }`}
                  >
                    {formatTime(timerRemaining)}
                  </div>
                </div>
              )}

              {/* Grid of Questions */}
              <div>
                <div className="text-xs font-bold font-mono text-[var(--text3)] uppercase tracking-wider mb-3">
                  Question Navigator
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {questions.map((q, idx) => {
                    const isCurrent = currentIdx === idx;
                    const isAnswered = !!answers[q.id];
                    const isFlagged = !!flagged[q.id];

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setCurrentIdx(idx)}
                        className={`aspect-square rounded-lg font-mono text-xs font-bold flex items-center justify-center transition-all cursor-pointer border ${
                          isCurrent
                            ? "border-[var(--accent)] bg-[rgba(217,119,87,0.18)] text-[var(--accent)] ring-2 ring-[var(--accent)]"
                            : isFlagged
                            ? "border-[var(--yellow)] bg-[rgba(212,160,58,0.12)] text-[var(--yellow)]"
                            : isAnswered
                            ? "border-[var(--accent)] bg-[rgba(217,119,87,0.1)] text-[var(--accent)]"
                            : "border-[var(--border)] bg-[var(--surface2)] text-[var(--text3)] hover:text-[var(--text)]"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-1.5 pt-4 border-t border-[var(--border)] text-[11px] text-[var(--text2)]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[rgba(217,119,87,0.2)] border border-[var(--accent)]" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[var(--surface2)] border border-[var(--border)]" />
                  <span>Unanswered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[rgba(212,160,58,0.2)] border border-[var(--yellow)]" />
                  <span>Flagged for review</span>
                </div>
              </div>

              {/* Submit Button in Sidebar */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-2.5 rounded-xl border border-[var(--green)] text-[var(--green)] hover:bg-[rgba(40,107,74,0.08)] font-semibold text-xs transition-colors cursor-pointer disabled:opacity-40"
              >
                {submitting ? "Submitting..." : "Submit All Questions"}
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
