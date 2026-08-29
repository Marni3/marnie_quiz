"use client";

import { TutorFunctionMode } from "@/lib/tutor/types";
import {
  MessageSquare,
  BookOpen,
  Target,
  FileSpreadsheet,
  CheckSquare,
  Sparkles,
} from "lucide-react";

interface QuickActionsProps {
  onSelectAction: (mode: TutorFunctionMode, defaultPrompt: string) => void;
  hasAttachedExam?: boolean;
}

const ACTIONS: Array<{
  mode: TutorFunctionMode;
  label: string;
  desc: string;
  icon: any;
  colorClass: string;
  defaultPrompt: string;
  requireExam?: boolean;
}> = [
  {
    mode: "chat",
    label: "AI Chat",
    desc: "Conceptual tutor, problem solver & speed shortcuts",
    icon: MessageSquare,
    colorClass: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    defaultPrompt: "Explain how to solve impedance matching and Smith Chart problems from first principles with Karce calculator shortcuts.",
  },
  {
    mode: "custom_module",
    label: "Custom Learning Module & Tests",
    desc: "Generate an interactive lesson + paired mastery test",
    icon: BookOpen,
    colorClass: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    defaultPrompt: "Generate a comprehensive, interactive learning module with 5-10 case scenarios, calculator speed shortcuts, and a 5-question companion mastery test for my highest priority weak topic (or specified topic below): ",
  },
  {
    mode: "tricky_questions",
    label: "Practice Tricky Questions",
    desc: "Board exam trap variants with cognitive distractor analysis",
    icon: Target,
    colorClass: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    defaultPrompt: "Generate 3 tricky PRC board exam trap multiple-choice questions with cognitive distractor deconstructions on my weakest topic based on my FSRS profile: ",
  },
  {
    mode: "formula_sheet",
    label: "Formula Sheet Generator",
    desc: "Dense KaTeX formula cheat-sheet & memory triggers",
    icon: FileSpreadsheet,
    colorClass: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    defaultPrompt: "Generate a dense, high-yield KaTeX formula cheat-sheet with 1-second keyword memory anchors for: ",
  },
  {
    mode: "review_exam",
    label: "Review Exam with AI",
    desc: "Step-by-step diagnostic review of exam misses",
    icon: CheckSquare,
    colorClass: "text-rose-500 bg-rose-500/10 border-rose-500/20",
    defaultPrompt: "Please analyze my exam attempt results step-by-step, deconstruct my missed questions, and teach me how to avoid these traps.",
  },
];

export function QuickActions({ onSelectAction, hasAttachedExam }: QuickActionsProps) {
  return (
    <div className="w-full space-y-2 py-2">
      <div className="flex items-center gap-1.5 px-1 text-xs font-semibold text-[var(--text2)] uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5 text-primary" />
        <span>Core AI Functions</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {ACTIONS.map((a) => {
          const Icon = a.icon;
          const isExamAction = a.mode === "review_exam";
          return (
            <button
              key={a.mode}
              onClick={() => onSelectAction(a.mode, a.defaultPrompt)}
              className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] group ${
                isExamAction && hasAttachedExam
                  ? "bg-rose-500/10 border-rose-500/40 shadow-sm"
                  : "bg-[var(--surface2)] border-[var(--border)] hover:border-primary/30"
              }`}
            >
              <div className={`p-2 rounded-xl border shrink-0 ${a.colorClass}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-[var(--text)] group-hover:text-primary transition-colors truncate">
                  {a.label}
                </div>
                <div className="text-[11px] text-[var(--text2)] line-clamp-2 leading-snug mt-0.5">
                  {a.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
