"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LearningModule, MasteryChallengeSet } from "@/lib/modules";
import { MathText } from "@/components/math-text";
import {
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  Flag,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Sparkles,
} from "lucide-react";

interface MasteryRunnerProps {
  module: LearningModule;
  mastery: MasteryChallengeSet;
}

export function MasteryRunner({ module, mastery }: MasteryRunnerProps) {
  const router = useRouter();
  const totalQuestions = mastery.questions.length;
  const initialTimeSeconds = (mastery.timeLimitMinutes || 30) * 60;

  // Quiz State
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, "A" | "B" | "C" | "D">>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState<number>(initialTimeSeconds);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [reviewFilter, setReviewFilter] = useState<"all" | "incorrect" | "correct" | "flagged">("all");

  const currentQuestion = mastery.questions[currentIndex];

  // Countdown Timer
  useEffect(() => {
    if (isSubmitted || timeRemaining <= 0) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted, timeRemaining]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Toggle Flag
  const toggleFlag = (qId: string) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(qId)) {
        next.delete(qId);
      } else {
        next.add(qId);
      }
      return next;
    });
  };

  // Select Option
  const handleSelectChoice = (choice: "A" | "B" | "C" | "D") => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: choice,
    }));
  };

  // Score Calculation
  const results = useMemo(() => {
    let correctCount = 0;
    let answeredCount = 0;

    mastery.questions.forEach((q) => {
      const ans = answers[q.id];
      if (ans) {
        answeredCount++;
        if (ans === q.correctChoice) {
          correctCount++;
        }
      }
    });

    const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const timeSpent = initialTimeSeconds - timeRemaining;
    const isPassed = scorePercent >= 70;

    return {
      correctCount,
      answeredCount,
      unansweredCount: totalQuestions - answeredCount,
      scorePercent,
      timeSpent,
      isPassed,
    };
  }, [answers, mastery.questions, totalQuestions, initialTimeSeconds, timeRemaining]);

  // Submit Exam and Sync Progress to SRS
  const handleSubmitExam = async () => {
    setIsSubmitted(true);
    setShowSubmitModal(false);

    let correctCount = 0;
    mastery.questions.forEach((q) => {
      if (answers[q.id] === q.correctChoice) correctCount++;
    });
    const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    try {
      await fetch(`/api/modules/${module.id}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicCode: module.topicCode,
          domain: module.domain,
          isCompleted: scorePercent >= 70,
          masteryScorePercent: scorePercent,
          confidence: scorePercent >= 90 ? "mastered" : scorePercent >= 70 ? "confident" : "moderate",
        }),
      });
    } catch (err) {
      console.warn("Failed to sync mastery score:", err);
    }
  };

  // Retake
  const handleRetake = () => {
    setAnswers({});
    setFlagged(new Set());
    setTimeRemaining(initialTimeSeconds);
    setIsSubmitted(false);
    setCurrentIndex(0);
  };

  // Filtered Questions for Review
  const filteredQuestions = useMemo(() => {
    if (!isSubmitted) return [];
    return mastery.questions.filter((q) => {
      const userAns = answers[q.id];
      const isCorrect = userAns === q.correctChoice;
      const isFlag = flagged.has(q.id);

      if (reviewFilter === "incorrect") return !isCorrect;
      if (reviewFilter === "correct") return isCorrect;
      if (reviewFilter === "flagged") return isFlag;
      return true;
    });
  }, [isSubmitted, mastery.questions, answers, flagged, reviewFilter]);

  // ================= RESULTS SCREEN =================
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--text)] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header Score Card */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-10 shadow-lg text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)] mx-auto">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-primary/10 text-primary border border-primary/20">
                {module.code} MASTERY RESULTS
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[var(--text)]">
                {results.isPassed ? "Mastery Achieved! 🎉" : "Keep Reinforcing! 💪"}
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text2)] max-w-lg mx-auto">
                {results.isPassed
                  ? `Outstanding! You scored ${results.scorePercent}%, exceeding the 70% board passing benchmark for ${module.code}.`
                  : `You scored ${results.scorePercent}%. Review the worked explanations below to patch your knowledge gaps.`}
              </p>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto pt-2">
              <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-2xl p-4">
                <div className="text-2xl sm:text-3xl font-bold font-mono text-[var(--accent)]">
                  {results.scorePercent}%
                </div>
                <div className="text-xs text-[var(--text3)]">Final Score</div>
              </div>
              <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-2xl p-4">
                <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-500">
                  {results.correctCount}/{totalQuestions}
                </div>
                <div className="text-xs text-[var(--text3)]">Correct Answers</div>
              </div>
              <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-2xl p-4">
                <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan-500">
                  {formatTime(results.timeSpent)}
                </div>
                <div className="text-xs text-[var(--text3)]">Time Spent</div>
              </div>
              <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-2xl p-4">
                <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-500">
                  {flagged.size}
                </div>
                <div className="text-xs text-[var(--text3)]">Flagged Items</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  try {
                    sessionStorage.setItem(
                      "marnie_tutor_pending_review_context",
                      JSON.stringify({
                        attemptId: `mastery_${module.id}_${Date.now()}`,
                        examTitle: `${module.code} Mastery Challenge: ${module.subtopicTitle}`,
                        subjectTag: module.domain,
                        score: results.correctCount,
                        total: totalQuestions,
                        percentage: results.scorePercent,
                        questions: mastery.questions.map((q) => {
                          const selected = answers[q.id] || null;
                          return {
                            id: q.id,
                            promptText: q.promptText,
                            selectedChoice: selected,
                            correctChoice: q.correctChoice,
                            isCorrect: selected === q.correctChoice,
                            explanation: q.explanation || "",
                          };
                        }),
                      })
                    );
                  } catch (err) {
                    console.error(err);
                  }
                  router.push("/tutor?mode=review_exam");
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-sm font-bold shadow-md hover:opacity-95 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
                <span>Review Exam with AI</span>
              </button>

              <Link
                href={`/learn/${module.id}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--accent)] text-white text-sm font-bold shadow-md hover:opacity-95 transition-all"
              >
                <BookOpen className="w-4 h-4" />
                <span>Return to Module Reader</span>
              </Link>
              <button
                onClick={handleRetake}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-[var(--text)] text-sm font-medium hover:bg-[var(--border)] transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Challenge</span>
              </button>
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[var(--border)] text-[var(--text2)] hover:text-[var(--text)] text-sm font-medium transition-all"
              >
                <span>Modules Hub</span>
              </Link>
            </div>
          </div>

          {/* Detailed Question Review Tabs */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
              <h2 className="text-lg font-bold text-[var(--text)]">Item Breakdown & Deconstruction</h2>
              <div className="flex items-center gap-1.5 bg-[var(--surface)] p-1 rounded-xl border border-[var(--border)] text-xs">
                <button
                  onClick={() => setReviewFilter("all")}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    reviewFilter === "all" ? "bg-[var(--accent)] text-white font-bold" : "text-[var(--text2)]"
                  }`}
                >
                  All ({totalQuestions})
                </button>
                <button
                  onClick={() => setReviewFilter("incorrect")}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    reviewFilter === "incorrect" ? "bg-[var(--accent)] text-white font-bold" : "text-[var(--text2)]"
                  }`}
                >
                  Incorrect ({totalQuestions - results.correctCount})
                </button>
                <button
                  onClick={() => setReviewFilter("correct")}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    reviewFilter === "correct" ? "bg-[var(--accent)] text-white font-bold" : "text-[var(--text2)]"
                  }`}
                >
                  Correct ({results.correctCount})
                </button>
                <button
                  onClick={() => setReviewFilter("flagged")}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    reviewFilter === "flagged" ? "bg-[var(--accent)] text-white font-bold" : "text-[var(--text2)]"
                  }`}
                >
                  Flagged ({flagged.size})
                </button>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {filteredQuestions.map((q, idx) => {
                const userChoice = answers[q.id];
                const isCorrect = userChoice === q.correctChoice;
                const origIndex = mastery.questions.findIndex((orig) => orig.id === q.id) + 1;

                return (
                  <div
                    key={q.id}
                    className={`rounded-2xl border p-5 sm:p-6 space-y-4 ${
                      isCorrect
                        ? "bg-[var(--surface)] border-emerald-500/30"
                        : "bg-[var(--surface)] border-rose-500/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-7 h-7 rounded-lg font-mono font-bold text-xs bg-[var(--surface2)] border border-[var(--border)]">
                          {origIndex}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            isCorrect
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          <span>{isCorrect ? "Correct" : "Incorrect"}</span>
                        </span>
                        {flagged.has(q.id) && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            <Flag className="w-3 h-3 fill-amber-500" />
                            <span>Flagged</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-sm sm:text-base font-medium text-[var(--text)] leading-relaxed">
                      <MathText text={q.promptText} />
                    </div>

                    {/* Choices Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {(["A", "B", "C", "D"] as const).map((choiceKey) => {
                        const choiceText = q[`choice${choiceKey}` as "choiceA" | "choiceB" | "choiceC" | "choiceD"];
                        const isSelected = userChoice === choiceKey;
                        const isKeyCorrect = q.correctChoice === choiceKey;

                        let style = "bg-[var(--surface2)] border-[var(--border)] text-[var(--text2)]";
                        if (isKeyCorrect) {
                          style = "bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-semibold";
                        } else if (isSelected && !isKeyCorrect) {
                          style = "bg-rose-500/15 border-rose-500 text-rose-600 dark:text-rose-400";
                        }

                        return (
                          <div
                            key={choiceKey}
                            className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs sm:text-sm ${style}`}
                          >
                            <span className="font-mono font-bold">{choiceKey}.</span>
                            <div className="flex-1">
                              <MathText text={choiceText} />
                            </div>
                            {isKeyCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
                            {isSelected && !isKeyCorrect && (
                              <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Solution Explanation Box */}
                    <div className="pt-3 border-t border-[var(--border)] bg-muted/20 rounded-xl p-4 space-y-1.5 text-xs">
                      <div className="font-bold text-foreground flex items-center gap-1.5 text-primary">
                        <Zap className="w-3.5 h-3.5" />
                        <span>Official Solution & Derivation:</span>
                      </div>
                      <div className="text-muted-foreground leading-relaxed">
                        <MathText text={q.explanation} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ================= ACTIVE EXAM RUNNER =================
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] pb-24">
      {/* Top Fixed Exam Banner */}
      <section className="sticky top-16 z-30 bg-[var(--surface)] border-b border-[var(--border)] backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="px-2 py-0.5 rounded-md font-mono text-xs font-bold bg-primary/10 text-primary border border-primary/20 shrink-0">
              {module.code}
            </span>
            <span className="text-xs font-semibold truncate max-w-[140px] sm:max-w-sm text-[var(--text)]">
              {mastery.title}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Timer Badge */}
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border text-xs font-mono font-bold ${
                timeRemaining < 300
                  ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 animate-pulse"
                  : "bg-[var(--surface2)] border-[var(--border)] text-[var(--text)]"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(timeRemaining)}</span>
            </div>

            {/* Finish Button */}
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-xl bg-[var(--accent)] text-white text-xs font-bold shadow-sm hover:opacity-95 transition-all"
            >
              Finish
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Quick-Jump Question Strip (Visible on < lg screens) */}
        <div className="lg:hidden px-3 py-2 border-t border-[var(--border)]/60 bg-[var(--surface2)]/50 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
          {mastery.questions.map((q, idx) => {
            const isCurrent = currentIndex === idx;
            const isAnswered = !!answers[q.id];
            const isFlagged = flagged.has(q.id);

            let bgStyle = "bg-[var(--surface)] border-[var(--border)] text-[var(--text3)]";
            if (isCurrent) {
              bgStyle = "ring-2 ring-[var(--accent)] bg-[var(--accent)] text-white font-bold";
            } else if (isAnswered) {
              bgStyle = "bg-primary/15 border-primary/40 text-primary font-semibold";
            }

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-8 h-8 rounded-lg border text-xs font-mono flex items-center justify-center shrink-0 relative transition-all cursor-pointer ${bgStyle}`}
              >
                <span>{idx + 1}</span>
                {isFlagged && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-500" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Runner Layout */}
      <div className="max-w-6xl mx-auto px-3 sm:px-6 pt-4 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left / Main Question Area */}
          <main className="lg:col-span-8 space-y-4 sm:space-y-6">
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm space-y-5 sm:space-y-6">
              {/* Question Header Status */}
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase text-[var(--text3)]">
                    Question {currentIndex + 1} of {totalQuestions}
                  </span>
                </div>
                <button
                  onClick={() => toggleFlag(currentQuestion.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl text-xs font-medium border transition-all ${
                    flagged.has(currentQuestion.id)
                      ? "bg-amber-500/15 border-amber-500/40 text-amber-500 font-bold"
                      : "bg-[var(--surface2)] border-[var(--border)] text-[var(--text3)] hover:text-[var(--text)]"
                  }`}
                >
                  <Flag className={`w-3.5 h-3.5 ${flagged.has(currentQuestion.id) ? "fill-amber-500" : ""}`} />
                  <span>{flagged.has(currentQuestion.id) ? "Flagged" : "Flag"}</span>
                </button>
              </div>

              {/* Question Prompt */}
              <div className="text-sm sm:text-lg font-medium text-[var(--text)] leading-relaxed">
                <MathText text={currentQuestion.promptText} />
              </div>

              {/* Choices Options */}
              <div className="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2">
                {(["A", "B", "C", "D"] as const).map((choiceKey) => {
                  const choiceText = currentQuestion[`choice${choiceKey}` as "choiceA" | "choiceB" | "choiceC" | "choiceD"];
                  const isSelected = answers[currentQuestion.id] === choiceKey;

                  return (
                    <button
                      key={choiceKey}
                      onClick={() => handleSelectChoice(choiceKey)}
                      className={`w-full text-left p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all flex items-start gap-3 cursor-pointer active:scale-[0.99] ${
                        isSelected
                          ? "bg-[var(--accent)]/10 border-[var(--accent)] text-[var(--text)] shadow-xs ring-1 ring-[var(--accent)]"
                          : "bg-[var(--surface2)] border-[var(--border)] text-[var(--text2)] hover:border-[var(--accent)]/40 hover:text-[var(--text)]"
                      }`}
                    >
                      <span
                        className={`flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl font-mono font-bold text-xs shrink-0 transition-colors ${
                          isSelected
                            ? "bg-[var(--accent)] text-white"
                            : "bg-[var(--surface)] border border-[var(--border)] text-[var(--text)]"
                        }`}
                      >
                        {choiceKey}
                      </span>
                      <div className="flex-1 text-xs sm:text-base pt-0.5 overflow-x-auto">
                        <MathText text={choiceText} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Pagination Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                <button
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--border)] transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="text-xs font-mono text-[var(--text3)] hidden sm:block">
                  {Object.keys(answers).length}/{totalQuestions} Answered
                </div>

                {currentIndex < totalQuestions - 1 ? (
                  <button
                    onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                    className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl bg-[var(--accent)] text-white text-xs font-bold shadow-sm hover:opacity-95 transition-all"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowSubmitModal(true)}
                    className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-sm hover:opacity-95 transition-all"
                  >
                    <span>Finish Exam</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </main>

          {/* Right Sidebar Question Grid Navigator (Desktop Only) */}
          <aside className="hidden lg:block lg:col-span-4 space-y-5">
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">Question Navigator</h3>
                <span className="text-xs font-mono text-[var(--accent)] font-semibold">
                  {Object.keys(answers).length}/{totalQuestions} Answered
                </span>
              </div>


              {/* Jump Grid */}
              <div className="grid grid-cols-5 gap-2">
                {mastery.questions.map((q, idx) => {
                  const isCurrent = currentIndex === idx;
                  const isAnswered = !!answers[q.id];
                  const isFlagged = flagged.has(q.id);

                  let bgStyle = "bg-[var(--surface2)] border-[var(--border)] text-[var(--text3)]";
                  if (isCurrent) {
                    bgStyle = "ring-2 ring-[var(--accent)] bg-[var(--accent)] text-white font-bold";
                  } else if (isAnswered) {
                    bgStyle = "bg-primary/15 border-primary/40 text-primary font-semibold";
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-10 rounded-xl border text-xs font-mono flex items-center justify-center relative transition-all cursor-pointer ${bgStyle}`}
                    >
                      <span>{idx + 1}</span>
                      {isFlagged && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-500 border border-[var(--surface)]" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Grid Legend */}
              <div className="pt-2 border-t border-[var(--border)] grid grid-cols-2 gap-2 text-[11px] text-[var(--text3)]">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-primary/20 border border-primary/40" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-[var(--surface2)] border border-[var(--border)]" />
                  <span>Unanswered</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md ring-2 ring-[var(--accent)] bg-[var(--accent)]" />
                  <span>Current</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span>Flagged</span>
                </div>
              </div>
            </div>

            {/* Back to Module CTA */}
            <div className="text-center">
              <Link
                href={`/learn/${module.id}`}
                className="text-xs text-[var(--text3)] hover:text-[var(--text)] transition-colors underline"
              >
                ← Exit back to Module Reader
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* Confirmation Modal before Submit */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--text)]">Submit Mastery Challenge?</h3>
                <p className="text-xs text-[var(--text3)]">Review your progress before finalizing.</p>
              </div>
            </div>

            <div className="bg-[var(--surface2)] rounded-2xl p-4 border border-[var(--border)] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--text2)]">Total Questions:</span>
                <span className="font-mono font-bold text-[var(--text)]">{totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text2)]">Questions Answered:</span>
                <span className="font-mono font-bold text-emerald-500">{Object.keys(answers).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text2)]">Unanswered Questions:</span>
                <span className="font-mono font-bold text-rose-500">
                  {totalQuestions - Object.keys(answers).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text2)]">Time Remaining:</span>
                <span className="font-mono font-bold text-primary">{formatTime(timeRemaining)}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-xs font-semibold hover:bg-[var(--border)] transition-all"
              >
                Continue Test
              </button>
              <button
                onClick={handleSubmitExam}
                className="px-5 py-2 rounded-xl bg-[var(--accent)] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
