"use client";

import React from "react";
import { X, Sparkles, Target, Download, Check } from "lucide-react";
import { MasteryRunner } from "@/app/learn/[moduleId]/mastery/mastery-runner";
import { LearningModule, MasteryChallengeSet } from "@/lib/modules";
import { saveCustomQuiz } from "@/lib/tutor/storage";
import { recordStudyActivity } from "@/lib/streak";

interface CustomQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz: any;
  module?: LearningModule | null;
}

export function CustomQuizModal({
  isOpen,
  onClose,
  quiz,
  module,
}: CustomQuizModalProps) {
  const [saved, setSaved] = React.useState(false);

  if (!isOpen || !quiz) return null;

  const rawQuestions = Array.isArray(quiz.questions)
    ? quiz.questions
    : Array.isArray(quiz.items)
    ? quiz.items
    : [];

  const normalizedQuestions = rawQuestions.map((q: any, idx: number) => ({
    id: q.id || `q-${idx + 1}`,
    promptText: q.promptText || q.question || q.stem || `Question #${idx + 1}`,
    choiceA: q.choiceA || (q.options ? q.options.A || q.options[0] : "Choice A"),
    choiceB: q.choiceB || (q.options ? q.options.B || q.options[1] : "Choice B"),
    choiceC: q.choiceC || (q.options ? q.options.C || q.options[2] : "Choice C"),
    choiceD: q.choiceD || (q.options ? q.options.D || q.options[3] : "Choice D"),
    correctChoice: (q.correctChoice || q.correctAnswer || "A") as "A" | "B" | "C" | "D",
    explanation: q.explanation || q.solution || "Comprehensive worked explanation.",
  }));

  const normalizedMastery: MasteryChallengeSet = {
    moduleId: quiz.moduleId || module?.id || `custom-mod-${Date.now()}`,
    moduleCode: quiz.moduleCode || module?.code || "CUSTOM",
    title: quiz.title || module?.subtopicTitle || "Targeted Topic Mastery Challenge",
    description: quiz.description || "Interactive Custom Board Exam Practice Drill",
    totalQuestions: normalizedQuestions.length,
    timeLimitMinutes: quiz.timeLimitMinutes || Math.max(10, normalizedQuestions.length * 2),
    questions: normalizedQuestions,
  };

  const syntheticModule: LearningModule = (module || {
    id: normalizedMastery.moduleId,
    code: normalizedMastery.moduleCode,
    domain: (quiz.domain || quiz.subjectTag || "EST") as any,
    topicCode: quiz.topicCode || "CUSTOM-01",
    topicTitle: quiz.topicTitle || "Custom Exam Practice",
    subtopicTitle: normalizedMastery.title,
    order: 1,
    pairedQuizSetId: `${normalizedMastery.moduleId}-mastery`,
    theory: {
      mentalAnchor: "Practice drill focused on board exam mastery.",
      contentMarkdown: "Practice drill session.",
    },
    formulas: [],
    examples: [],
    toc: [],
    crossSubjectBridges: [],
    terms: [],
    conceptChecks: [],
  }) as unknown as LearningModule;

  const handleSaveToLibrary = () => {
    saveCustomQuiz(quiz);
    recordStudyActivity("quiz");
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl w-full max-w-5xl h-[94vh] shadow-2xl overflow-hidden flex flex-col">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)] bg-[var(--surface2)] shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
              <Target className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                  {normalizedMastery.totalQuestions} Questions
                </span>
                <h2 className="text-sm sm:text-base font-bold text-[var(--text)] truncate">
                  {normalizedMastery.title}
                </h2>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleSaveToLibrary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:opacity-95 transition-all cursor-pointer"
            >
              {saved ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
              <span>{saved ? "Saved to Quizzes!" : "Save to My Quizzes"}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-all cursor-pointer"
              title="Close Quiz"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Mastery Runner */}
        <div className="flex-1 overflow-y-auto">
          <MasteryRunner module={syntheticModule} mastery={normalizedMastery} />
        </div>
      </div>
    </div>
  );
}
