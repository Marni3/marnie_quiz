"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { LearningModule } from "@/lib/modules";
import { MathText } from "@/components/math-text";
import { DeclarativeVisualizer } from "@/components/declarative-visualizer";
import { FeedbackModal } from "@/components/feedback-modal";
import { UserNote, saveStoredNote } from "@/lib/notes";
import { recordStudyActivity } from "@/lib/streak";
import {
  BookOpen,
  Zap,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Calculator,
  Layers,
  Sparkles,
  ArrowRight,
  Share2,
  Bookmark,
  BookMarked,
  Check,
  RotateCcw,
  Sliders,
  Award,
  ExternalLink,
  ShieldCheck,
  Lightbulb,
  MessageSquarePlus,
  Copy,
  Bot,
  X,
  Wrench,
} from "lucide-react";

interface ModuleReaderProps {
  module: LearningModule;
}

export function ModuleReader({ module }: ModuleReaderProps) {
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);
  const [formulaFitMode, setFormulaFitMode] = useState<"scroll" | "fit">("scroll");
  // Solution Toggle per example: 'formal' | 'shortcut' | 'combined'
  const [exampleModes, setExampleModes] = useState<Record<number, "formal" | "shortcut" | "combined">>(() => {
    const initial: Record<number, "formal" | "shortcut" | "combined"> = {};
    module.examples.forEach((_, idx) => {
      initial[idx] = "shortcut"; // default to speed shortcut
    });
    return initial;
  });

  // Calculator Tab: 'karce' | 'canon'
  const [calcTab, setCalcTab] = useState<"karce" | "canon">("karce");

  // In-line MCQ Answers State: { [questionId]: { selectedChoice: 'A'|'B'|'C'|'D', isCorrect: boolean } }
  const [mcqState, setMcqState] = useState<Record<string, { selected: string; isCorrect: boolean }>>({});

  // Active Recall Written Challenge state (persisted locally)
  const [writtenAnswers, setWrittenAnswers] = useState<Record<string, string>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [compactTables, setCompactTables] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (typeof window === "undefined" || !module.writtenChallenges) return;
    const loaded: Record<string, string> = {};
    module.writtenChallenges.forEach((wc) => {
      const saved = localStorage.getItem(`mq_written_recall_${module.id}_${wc.id}`);
      if (saved) loaded[wc.id] = saved;
    });
    setWrittenAnswers(loaded);
  }, [module.id, module.writtenChallenges]);

  const handleWrittenChange = (challengeId: string, text: string) => {
    setWrittenAnswers((prev) => ({ ...prev, [challengeId]: text }));
    try {
      localStorage.setItem(`mq_written_recall_${module.id}_${challengeId}`, text);
    } catch {}
  };

  const toggleRevealAnswer = (challengeId: string) => {
    setRevealedAnswers((prev) => ({ ...prev, [challengeId]: !prev[challengeId] }));
  };

  // Module Completion and Bookmark State synced with API
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);

  // Floating Text Selection Popover & Quick Note
  const [selectionPopover, setSelectionPopover] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);
  const [savedNoteToast, setSavedNoteToast] = useState(false);

  const handleTextSelection = () => {
    if (typeof window === "undefined") return;
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) {
      setSelectionPopover(null);
      return;
    }
    const text = sel.toString().trim();
    if (text.length < 3) {
      setSelectionPopover(null);
      return;
    }
    try {
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        setSelectionPopover(null);
        return;
      }
      setSelectionPopover({
        text,
        x: Math.max(12, Math.min(window.innerWidth - 260, rect.left + rect.width / 2 - 120)),
        y: Math.max(12, rect.top - 46),
      });
    } catch {}
  };

  const handleSaveSelectionToNotes = () => {
    if (!selectionPopover) return;
    const newNote: UserNote = {
      id: `note_${Date.now()}`,
      title: `${module.code || "Module"} Highlight: ${selectionPopover.text.slice(0, 36)}...`,
      domain: (module.domain as any) || "GENERAL",
      topicCode: module.topicCode,
      type: "module_highlight",
      content: selectionPopover.text,
      sourceModuleId: module.id,
      sourceSubtopicTitle: module.subtopicTitle,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    saveStoredNote(newNote);
    setSelectionPopover(null);
    setSavedNoteToast(true);
    setTimeout(() => setSavedNoteToast(false), 2500);
  };

  const handleAskAITutor = () => {
    if (!selectionPopover) return;
    const query = encodeURIComponent(
      `Regarding ${module.subtopicTitle} (${module.code}): "${selectionPopover.text}" - Can you explain this principle and provide board exam shortcuts?`
    );
    window.open(`/tutor?prompt=${query}`, "_blank");
    setSelectionPopover(null);
  };

  const handleCopySelection = () => {
    if (!selectionPopover) return;
    navigator.clipboard.writeText(selectionPopover.text);
    setSelectionPopover(null);
  };

  // Visualizer Slider Values
  const [vizControls, setVizControls] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    module.visualizer?.config.controls.forEach((c) => {
      init[c.id] = c.defaultValue;
    });
    return init;
  });

  // Active TOC Section on scroll
  const [activeSection, setActiveSection] = useState<string>("sec-prereq-bridges");

  // Normalize Concept Checks so both Array and Object schemas across modules work seamlessly
  const normalizedConceptChecks = useMemo(() => {
    if (!module.conceptChecks || !Array.isArray(module.conceptChecks)) return [];
    return module.conceptChecks.map((chk: any, idx: number) => {
      const id = chk.id || `cc-${idx}`;
      const question = chk.question || chk.questionText || "";

      if (Array.isArray(chk.options)) {
        const letters = ["A", "B", "C", "D"] as const;
        const optionsObj: Record<string, string> = {};
        const deconstructionObj: Record<string, string> = {};
        let correctLetter: "A" | "B" | "C" | "D" = "A";

        chk.options.forEach((opt: any, optIdx: number) => {
          if (optIdx < 4) {
            const letter = letters[optIdx];
            const text = typeof opt === "string" ? opt : opt.text || "";
            optionsObj[letter] = text;
            deconstructionObj[letter] =
              opt.distractorReason ||
              (opt.isCorrect ? "Correct answer." : "Incorrect distractor.");
            if (opt.isCorrect) {
              correctLetter = letter;
            }
          }
        });

        return {
          id,
          question,
          options: optionsObj,
          correctAnswer: correctLetter,
          distractorDeconstruction: deconstructionObj,
          shortcutExplanation: chk.shortcutExplanation || chk.directExplanation || "",
        };
      }

      return {
        id,
        question,
        options: chk.options || {},
        correctAnswer: (chk.correctAnswer || "A") as "A" | "B" | "C" | "D",
        distractorDeconstruction: chk.distractorDeconstruction || {},
        shortcutExplanation: chk.shortcutExplanation || "",
      };
    });
  }, [module.conceptChecks]);

  const dynamicToc = useMemo(() => {
    const rawSections: Array<{ id: string; title: string }> = [];

    if (module.prerequisiteBridge || (module.crossSubjectBridges && module.crossSubjectBridges.length > 0)) {
      rawSections.push({ id: "sec-prereq-bridges", title: "Prerequisite Bridges" });
    }
    rawSections.push({ id: "sec-theory", title: "Lesson Proper" });

    if (module.formulas && module.formulas.length > 0) {
      rawSections.push({ id: "sec-formulas", title: "Compilation of Formulas" });
    }
    if (module.comparisonTables && module.comparisonTables.length > 0) {
      rawSections.push({ id: "sec-comparison-tables", title: "Comparison Matrices" });
    }
    if (module.visualizer) {
      rawSections.push({ id: "sec-visualizer", title: "Interactive Sandbox" });
    }
    if (module.terms && module.terms.length > 0) {
      rawSections.push({ id: "sec-terminology", title: "Key Terms & Definitions" });
    }
    if (module.examples && module.examples.length > 0) {
      const isLaw = module.domain === "GEAS" && module.topicCode.startsWith("GEAS-10");
      rawSections.push({ id: "sec-dual-method", title: isLaw ? "Board Exam Case Dilemmas" : "Sample Problems" });
    }
    if (module.calculatorGuides && (module.calculatorGuides.karce || module.calculatorGuides.canon)) {
      rawSections.push({ id: "sec-calculator", title: "Calculator Techniques" });
    }
    if (normalizedConceptChecks.length > 0) {
      rawSections.push({ id: "sec-concept-checks", title: "In-Line Concept Checks" });
    }
    if (module.writtenChallenges && module.writtenChallenges.length > 0) {
      rawSections.push({ id: "sec-written-challenge", title: "Active Recall Written Challenge" });
    }

    return rawSections.map((sec, idx) => ({
      id: sec.id,
      title: `${idx + 1}. ${sec.title}`,
    }));
  }, [module, normalizedConceptChecks]);

  // Fetch initial progress on mount & record study session
  useEffect(() => {
    async function loadAndTrackProgress() {
      try {
        const res = await fetch(`/api/modules/${module.id}/progress`);
        if (res.ok) {
          const data = await res.json();
          if (data.progress) {
            setIsBookmarked(!!data.progress.isBookmarked);
            setIsCompleted(!!data.progress.isCompleted);
          }
        }
        // Touch progress to record lastStudiedAt and update study streak
        recordStudyActivity("module");
        fetch(`/api/modules/${module.id}/progress`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topicCode: module.topicCode,
            domain: module.domain,
          }),
        }).catch(() => {});
      } catch (err) {
        console.warn("Could not load module progress:", err);
      }
    }
    loadAndTrackProgress();
  }, [module.id, module.topicCode, module.domain]);

  // Toggle Bookmark
  const handleToggleBookmark = async () => {
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);
    try {
      await fetch(`/api/modules/${module.id}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicCode: module.topicCode,
          domain: module.domain,
          isBookmarked: nextState,
        }),
      });
    } catch (err) {
      console.warn("Error updating bookmark:", err);
    }
  };

  // Toggle Completed
  const handleToggleCompleted = async () => {
    const nextState = !isCompleted;
    setIsCompleted(nextState);
    try {
      await fetch(`/api/modules/${module.id}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicCode: module.topicCode,
          domain: module.domain,
          isCompleted: nextState,
        }),
      });
    } catch (err) {
      console.warn("Error updating completion:", err);
    }
  };

  // Handle MCQ Answer Select and sync progress
  const handleSelectOption = (qId: string, choice: string, correct: string) => {
    const isCorrect = choice === correct;
    const updated = {
      ...mcqState,
      [qId]: {
        selected: choice,
        isCorrect,
      },
    };
    setMcqState(updated);

    const answeredCount = Object.keys(updated).length;
    const correctCount = Object.values(updated).filter((v) => v.isCorrect).length;
    const accuracy = answeredCount > 0 ? correctCount / answeredCount : 0;

    // Send async progress update
    fetch(`/api/modules/${module.id}/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topicCode: module.topicCode,
        domain: module.domain,
        conceptChecksCompleted: answeredCount,
        conceptChecksTotal: normalizedConceptChecks.length,
        conceptChecksAccuracy: accuracy,
      }),
    }).catch((err) => console.warn("Failed to sync concept check score:", err));
  };

  const domainColors = {
    MATH: {
      badge: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      accent: "text-blue-500",
      bg: "bg-blue-500",
    },
    ELECS: {
      badge: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      accent: "text-amber-500",
      bg: "bg-amber-500",
    },
    GEAS: {
      badge: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      accent: "text-emerald-500",
      bg: "bg-emerald-500",
    },
    EST: {
      badge: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      accent: "text-purple-500",
      bg: "bg-purple-500",
    },
  };

  const domStyle = domainColors[module.domain] || domainColors.MATH;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] pb-24">
      {/* Top Sticky Header */}
      <section className="border-b border-[var(--border)] bg-[var(--surface)] sticky top-16 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-[var(--text3)] min-w-0">
            <Link href="/learn" className="hover:text-[var(--text)] transition-colors shrink-0">
              Modules
            </Link>
            <span>/</span>
            <span className={`px-2 py-0.5 rounded-md font-mono font-semibold border text-[11px] shrink-0 ${domStyle.badge}`}>
              {module.code}
            </span>
            <span className="hidden md:inline">/</span>
            <span className="hidden md:inline truncate font-medium text-[var(--text)] max-w-[200px] lg:max-w-md">
              {module.subtopicTitle}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Formula Fit Mode Toggle */}
            <button
              type="button"
              onClick={() => setFormulaFitMode((prev) => (prev === "scroll" ? "fit" : "scroll"))}
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                formulaFitMode === "fit"
                  ? "bg-primary/15 border-primary/40 text-primary font-bold"
                  : "bg-[var(--surface2)] border-[var(--border)] text-[var(--text2)] hover:text-[var(--text)]"
              }`}
              title={formulaFitMode === "fit" ? "Switch to Scrollable Formulas" : "Fit Formulas to Screen Width"}
            >
              <span>{formulaFitMode === "fit" ? "📐 Fit Math" : "↔️ Scroll Math"}</span>
            </button>

            <button
              onClick={handleToggleBookmark}
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                isBookmarked
                  ? "bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400"
                  : "bg-[var(--surface2)] border-[var(--border)] text-[var(--text2)] hover:text-[var(--text)]"
              }`}
              title={isBookmarked ? "Remove Bookmark" : "Bookmark Module"}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-amber-500" : ""}`} />
              <span className="hidden sm:inline">{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
            </button>

            <button
              onClick={handleToggleCompleted}
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                isCompleted
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                  : "bg-[var(--surface2)] border-[var(--border)] text-[var(--text2)] hover:text-[var(--text)]"
              }`}
              title={isCompleted ? "Mark Incomplete" : "Mark as Completed"}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? "fill-emerald-500 text-white" : ""}`} />
              <span className="hidden sm:inline">{isCompleted ? "Completed" : "Mark Done"}</span>
            </button>

            <Link
              href={`/learn/${module.id}/mastery`}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-[var(--accent)] text-white text-xs font-bold hover:opacity-95 shadow-sm transition-all"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Mastery</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Grid: Sidebar TOC + Reading Canvas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sticky Table of Contents (Desktop Only) */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-36 space-y-6">
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text3)] pb-2 border-b border-[var(--border)]">
                <Layers className="w-4 h-4 text-[var(--accent)]" />
                <span>Table of Contents</span>
              </div>
              <nav className="space-y-1">
                {dynamicToc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--surface2)] transition-colors leading-relaxed truncate"
                  >
                    {item.title}
                  </a>
                ))}
                <a
                  href="#sec-mastery-challenge"
                  className="block px-2.5 py-1.5 rounded-lg text-xs font-bold text-[var(--accent)] hover:bg-[var(--surface2)] transition-colors truncate"
                >
                  ★ Mastery Challenge Exam
                </a>
              </nav>
            </div>

            {/* Quick Stats Pill */}
            <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-2xl p-4 space-y-2 text-xs text-[var(--text3)]">
              <div className="flex justify-between">
                <span>Key Terms:</span>
                <span className="font-semibold text-[var(--text)]">{module.terms?.length || 0} Signatures</span>
              </div>
              <div className="flex justify-between">
                <span>Worked Examples:</span>
                <span className="font-semibold text-[var(--text)]">{module.examples?.length || 0} Dual-Method</span>
              </div>
              <div className="flex justify-between">
                <span>Concept Checks:</span>
                <span className="font-semibold text-[var(--text)]">{module.conceptChecks?.length || 0} MCQs</span>
              </div>
            </div>
          </aside>

          {/* Center Main Content Document */}
          <main
            onMouseUp={handleTextSelection}
            onTouchEnd={handleTextSelection}
            className={`lg:col-span-9 space-y-10 ${
              formulaFitMode === "fit"
                ? "[&_.katex-display]:text-[12px] sm:[&_.katex-display]:text-sm [&_.katex-html]:text-[12px] sm:[&_.katex-html]:text-sm [&_.base]:max-w-full [&_.katex]:overflow-hidden"
                : ""
            }`}
          >
            {/* Title & Domain Banner */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${domStyle.badge}`}>
                  {module.code}
                </span>
                <span className="text-xs text-[var(--text3)] font-medium">
                  {module.topicTitle} • Module #{module.order}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif tracking-tight text-[var(--text)]">
                {module.subtopicTitle}
              </h1>
            </div>

            {/* Figures & Visualizers Under Construction Notice Banner */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start sm:items-center justify-between gap-3 text-xs shadow-2xs">
              <div className="flex items-start sm:items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-amber-800 dark:text-amber-300">
                    Figures and visualizers are under construction!
                  </div>
                  <div className="text-amber-700/90 dark:text-amber-400/90 text-[11px] sm:text-xs mt-0.5">
                    A lot of them might be broken or not work as intended. Submit feedback to support development and fixes in the future!
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFeedbackOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-800 dark:text-amber-200 border border-amber-500/40 text-xs font-semibold shrink-0 transition-all cursor-pointer"
              >
                <span>Feedback</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Mobile First-Card Lesson Outline */}
            <div className="lg:hidden bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text)]">
                  <Layers className="w-4 h-4 text-[var(--accent)]" />
                  <span>Lesson Outline & Sections</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-[var(--text3)] uppercase">
                  {dynamicToc.length} Topics
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {dynamicToc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[var(--surface2)]/80 hover:bg-[var(--surface2)] text-xs font-medium text-[var(--text)] transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0"></span>
                    <span className="line-clamp-1">{item.title}</span>
                  </a>
                ))}
                <a
                  href="#sec-mastery-challenge"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-xs font-bold text-[var(--accent)] hover:bg-[var(--accent)]/20 transition-colors"
                >
                  <span>★</span>
                  <span>Mastery Challenge Exam</span>
                </a>
              </div>
            </div>

            {/* Section 1: Prerequisite & Cross-Subject Bridges */}
            <section id="sec-prereq-bridges" className="space-y-4 pt-2">
              {module.prerequisiteBridge && (
                <div className="bg-[var(--surface)] border-l-4 border-l-blue-500 border border-[var(--border)] rounded-r-2xl p-4 sm:p-5 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-500 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Previously In Skill Tree...</span>
                  </div>
                  <p className="text-sm text-[var(--text2)] leading-relaxed">
                    {module.prerequisiteBridge.text}
                  </p>
                </div>
              )}

              {/* Links to Related Topics */}
              {module.crossSubjectBridges && module.crossSubjectBridges.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--text3)]">
                    Links to Related Topics
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {module.crossSubjectBridges.map((br, idx) => (
                      <div
                        key={idx}
                        className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3.5 space-y-1.5 shadow-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[var(--surface2)] text-[var(--accent)] border border-[var(--border)]">
                            {br.badgeText} ({br.targetTopicCode})
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text2)] leading-relaxed">
                          <MathText text={br.description} />
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Section 2: Lesson Proper (Theory First) */}
            <section id="sec-theory" className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--border)]">
                <BookOpen className="w-5 h-5 text-[var(--accent)]" />
                <h2 className="text-xl font-bold font-serif text-[var(--text)]">
                  Lesson Proper
                </h2>
              </div>

              {/* Mental Anchor Callout Box */}
              {module.theory.mentalAnchor && (
                <div className="bg-amber-500/10 border-l-4 border-l-amber-500 border border-amber-500/20 rounded-r-2xl p-4 sm:p-5 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
                    <Lightbulb className="w-4 h-4" />
                    <span>Core Mental Anchor / Rule of Thumb</span>
                  </div>
                  <p className="text-sm font-semibold text-[var(--text)] leading-relaxed italic">
                    <MathText text={`“${module.theory.mentalAnchor}”`} />
                  </p>
                </div>
              )}

              {/* KaTeX Markdown Theory Body */}
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 sm:p-6 shadow-xs leading-relaxed text-[var(--text)] text-sm sm:text-base">
                <MathText text={module.theory.contentMarkdown} splitParagraphs={true} />
              </div>
            </section>

            {/* Section: Compilation of Formulas */}
            {module.formulas && module.formulas.length > 0 && (
              <section id="sec-formulas" className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[var(--border)]">
                  <Calculator className="w-5 h-5 text-[var(--accent)]" />
                  <h2 className="text-xl font-bold font-serif text-[var(--text)]">
                    Compilation of Formulas
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {module.formulas.map((item, idx) => (
                    <div
                      key={idx}
                      id={`formula-${idx}`}
                      className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3 flex flex-col justify-between hover:border-[var(--accent)]/50 transition-colors"
                    >
                      <div className="space-y-2">
                        <h3 className="font-bold text-sm sm:text-base font-serif text-[var(--text)]">
                          {item.title}
                        </h3>
                        <div className="py-2.5 px-3 bg-[var(--surface2)] rounded-xl border border-[var(--border)] text-center overflow-x-auto text-base sm:text-lg font-medium text-[var(--text)]">
                          <MathText text={item.formula.startsWith("$$") ? item.formula : `$$${item.formula}$$`} />
                        </div>
                      </div>
                      {item.note && (
                        <p className="text-xs text-[var(--text2)] italic leading-relaxed pt-1.5 border-t border-[var(--border)]/40">
                          <MathText text={item.note} />
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Comparison & Statutory Matrices */}
            {module.comparisonTables && module.comparisonTables.length > 0 && (
              <section id="sec-comparison-tables" className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-[var(--border)]">
                  <Layers className="w-5 h-5 text-[var(--accent)]" />
                  <h2 className="text-xl font-bold font-serif text-[var(--text)]">
                    Comparison & Statutory Matrices
                  </h2>
                </div>

                <div className="space-y-6">
                  {module.comparisonTables.map((tbl, tIdx) => {
                    const isCompact = !!compactTables[tIdx];
                    return (
                      <div
                        key={tbl.id || tIdx}
                        className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3 overflow-hidden"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-bold text-sm sm:text-base text-[var(--text)]">
                            {tbl.title}
                          </h3>
                          <button
                            type="button"
                            onClick={() =>
                              setCompactTables((prev) => ({
                                ...prev,
                                [tIdx]: !prev[tIdx],
                              }))
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium bg-[var(--surface2)] hover:bg-[var(--surface)] border border-[var(--border)] text-[var(--text2)] transition-colors cursor-pointer shrink-0"
                            title="Toggle between compact fit view and horizontal scrolling view"
                          >
                            <span>{isCompact ? "📱 Fit Mode" : "↔️ Scroll Mode"}</span>
                          </button>
                        </div>

                        <div className={isCompact ? "w-full overflow-x-hidden" : "overflow-x-auto"}>
                          <table
                            className={`w-full text-left border-collapse ${
                              isCompact ? "text-[10px] leading-tight" : "text-xs sm:text-sm"
                            }`}
                          >
                            <thead>
                              <tr className="border-b border-[var(--border)] bg-[var(--surface2)]/60">
                                {tbl.headers.map((h, hIdx) => (
                                  <th
                                    key={hIdx}
                                    className={`${
                                      isCompact ? "p-1.5 font-bold" : "p-3 font-bold"
                                    } font-mono text-[var(--text)] uppercase tracking-wider`}
                                  >
                                    <MathText text={h} />
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]/60">
                              {tbl.rows.map((row, rIdx) => (
                                <tr
                                  key={rIdx}
                                  className="hover:bg-[var(--surface2)]/40 transition-colors"
                                >
                                  {row.map((cell, cIdx) => (
                                    <td
                                      key={cIdx}
                                      className={`${
                                        isCompact ? "p-1.5 text-[var(--text2)]" : "p-3 text-[var(--text2)] leading-relaxed"
                                      } ${cIdx === 0 ? "font-semibold text-[var(--text)]" : ""}`}
                                    >
                                      <MathText text={cell} />
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Section 3: Interactive Declarative Visualizer */}
            {module.visualizer && (
              <section id="sec-visualizer" className="space-y-4">
                <DeclarativeVisualizer
                  visualizer={module.visualizer}
                  controls={vizControls}
                  onControlChange={(id, value) =>
                    setVizControls((prev) => ({
                      ...prev,
                      [id]: value,
                    }))
                  }
                  onReset={() => {
                    const init: Record<string, number> = {};
                    module.visualizer?.config.controls.forEach((c) => {
                      init[c.id] = c.defaultValue;
                    });
                    setVizControls(init);
                  }}
                />
              </section>
            )}

            {/* Section 4: Terms and Definitions */}
            {module.terms && module.terms.length > 0 && (
              <section id="sec-terminology" className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[var(--border)]">
                  <ShieldCheck className="w-5 h-5 text-[var(--accent)]" />
                  <h2 className="text-xl font-bold font-serif text-[var(--text)]">
                    Terms and Definitions
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {module.terms?.map((item, idx) => {
                    const symbolText = item.symbol
                      ? item.symbol.startsWith("$")
                        ? item.symbol
                        : `$${item.symbol}$`
                      : null;

                    return (
                      <div
                        key={idx}
                        id={`term-${idx}`}
                        className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3 flex flex-col justify-between hover:border-[var(--accent)]/50 transition-colors"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-bold text-base text-[var(--text)]">
                              {item.term}
                            </h3>
                            {symbolText && (
                              <span className="px-2 py-0.5 rounded-md font-mono text-xs bg-[var(--surface2)] border border-[var(--border)] text-[var(--accent)]">
                                <MathText text={symbolText} />
                              </span>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-[var(--text2)] leading-relaxed">
                            <MathText text={item.definition} />
                          </p>
                        </div>

                        <div className="pt-2 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium">
                            <Zap className="w-3.5 h-3.5 shrink-0" />
                            <span>Trigger: <strong>&ldquo;{item.keywordTrigger}&rdquo;</strong></span>
                          </div>
                          {item.unit && (
                            <span className="text-[11px] font-mono text-[var(--text3)]">
                              [{item.unit}]
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Section 5: Worked Sample Problems */}
            <section id="sec-dual-method" className="space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-[var(--accent)]" />
                  <h2 className="text-xl font-bold font-serif text-[var(--text)]">
                    Worked Sample Problems
                  </h2>
                </div>
                <span className="text-xs text-[var(--text3)]">
                  Dual-Method: Formal vs ⚡ Shortcut
                </span>
              </div>

              <div className="space-y-6">
                {module.examples.map((ex, idx) => {
                  const mode = exampleModes[idx] || "shortcut";

                  return (
                    <div
                      key={idx}
                      className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4"
                    >
                      {/* Problem Header & Mode Switcher */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-md bg-[var(--surface2)] border border-[var(--border)] font-mono text-xs font-bold text-[var(--accent)]">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text3)]">
                            Sample Problem #{idx + 1}
                          </span>
                        </div>

                        {/* Switcher Pill */}
                        <div className="flex items-center gap-1 bg-[var(--surface2)] p-1 rounded-xl border border-[var(--border)] text-xs">
                          <button
                            type="button"
                            onClick={() =>
                              setExampleModes((prev) => ({ ...prev, [idx]: "formal" }))
                            }
                            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                              mode === "formal"
                                ? "bg-[var(--accent)] text-white font-bold shadow-xs"
                                : "text-[var(--text2)] hover:text-[var(--text)]"
                            }`}
                          >
                            Formal ({ex.formalTimeSeconds || 90}s)
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setExampleModes((prev) => ({ ...prev, [idx]: "shortcut" }))
                            }
                            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                              mode === "shortcut"
                                ? "bg-[var(--accent)] text-white font-bold shadow-xs"
                                : "text-[var(--text2)] hover:text-[var(--text)]"
                            }`}
                          >
                            ⚡ Shortcut ({ex.shortcutTimeSeconds || 10}s)
                          </button>
                        </div>
                      </div>

                      {/* Problem Statement */}
                      <div className="font-semibold text-base sm:text-lg text-[var(--text)] leading-relaxed">
                        <MathText text={ex.problemStatement} />
                      </div>

                      {/* Solution Block */}
                      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface2)]/40 p-4 sm:p-5 space-y-3">
                        <div className="flex items-center justify-between text-xs font-mono text-[var(--accent)] font-bold uppercase tracking-wider">
                          <span>
                            {mode === "shortcut" ? "⚡ High-Speed Board Shortcut:" : "Step-by-Step Formal Derivation:"}
                          </span>
                          <span className="text-[var(--text3)] font-normal">
                            Estimated Time: ~{mode === "shortcut" ? ex.shortcutTimeSeconds || 10 : ex.formalTimeSeconds || 90}s
                          </span>
                        </div>
                        <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-[var(--text)] leading-relaxed">
                          <MathText
                            text={mode === "shortcut" ? ex.shortcutSolutionMarkdown : ex.formalSolutionMarkdown}
                            splitParagraphs={true}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Section 6: Calculator Speed Techniques */}
            {module.calculatorGuides && (
              <section id="sec-calculator" className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-[var(--accent)]" />
                    <h2 className="text-xl font-bold font-serif text-[var(--text)]">
                      Calculator Techniques
                    </h2>
                  </div>

                  {/* Calculator Brand Tabs */}
                  <div className="flex items-center gap-1 bg-[var(--surface2)] p-1 rounded-xl border border-[var(--border)] text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setCalcTab("karce")}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        calcTab === "karce"
                          ? "bg-[var(--accent)] text-white font-bold"
                          : "text-[var(--text2)] hover:text-[var(--text)]"
                      }`}
                    >
                      Karce KC-S991
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalcTab("canon")}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        calcTab === "canon"
                          ? "bg-[var(--accent)] text-white font-bold"
                          : "text-[var(--text2)] hover:text-[var(--text)]"
                      }`}
                    >
                      Canon F-789SGA
                    </button>
                  </div>
                </div>

                {/* Selected Calculator Guide Box */}
                {(() => {
                  const guide = module.calculatorGuides[calcTab];
                  if (!guide) return null;

                  const cleanMode = guide.mode ? guide.mode.replace(/<\/?kbd>/gi, "") : "";
                  const cleanNotes = guide.notes ? guide.notes.replace(/<\/?kbd>/gi, "") : "";
                  const title = guide.techniqueTitle || (calcTab === "karce" ? "Karce KC-S991 Technique" : "Canon F-789SGA Technique");
                  const problemText = guide.sampleProblem;

                  return (
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[var(--border)]">
                        <div>
                          <span className="text-xs font-mono text-[var(--accent)] font-bold">
                            {calcTab === "karce" ? "Karce KC-S991 Technique" : "Canon F-789SGA Technique"}
                          </span>
                          <h3 className="font-bold text-base text-[var(--text)]">{title}</h3>
                        </div>
                        {guide.problemType && (
                          <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            {guide.problemType}
                          </span>
                        )}
                        {cleanMode && (
                          <span className="text-xs font-mono text-[var(--text3)]">
                            {cleanMode}
                          </span>
                        )}
                      </div>

                      {/* Sample Problem Callout */}
                      {problemText && (
                        <div className="p-3.5 rounded-xl bg-[var(--surface2)] border border-[var(--border)] space-y-1">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent)] font-mono flex items-center gap-1.5">
                            <Lightbulb className="w-3.5 h-3.5" />
                            <span>Sample Problem / Application:</span>
                          </div>
                          <p className="text-xs sm:text-sm font-medium text-[var(--text)] leading-relaxed">
                            <MathText text={problemText} />
                          </p>
                        </div>
                      )}

                      {/* Step-by-Step Button Sequence */}
                      <div className="space-y-2 pt-1">
                        <div className="text-xs font-bold uppercase text-[var(--text3)]">
                          Step-by-Step Button Sequence:
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {guide.keystrokes.map((rawKey, idx) => {
                            const cleanKey = rawKey.replace(/<\/?kbd>/gi, "").trim();
                            return (
                              <span
                                key={idx}
                                className="inline-flex items-center justify-center min-w-[28px] px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-[var(--surface2)] border-b-2 border border-[var(--border)] text-[var(--text)] shadow-xs uppercase active:translate-y-0.5"
                              >
                                <MathText text={cleanKey} />
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {cleanNotes && (
                        <p className="text-xs sm:text-sm text-[var(--text2)] pt-2 border-t border-[var(--border)] leading-relaxed">
                          <MathText text={cleanNotes} />
                        </p>
                      )}
                    </div>
                  );
                })()}
              </section>
            )}

            {/* Section 7: In-Line Concept Checks & Distractor Deconstruction */}
            <section id="sec-concept-checks" className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--border)]">
                <Award className="w-5 h-5 text-[var(--accent)]" />
                <h2 className="text-xl font-bold font-serif text-[var(--text)]">
                  In-Line Concept Checks & Distractor Deconstruction
                </h2>
              </div>

              <div className="space-y-6">
                {normalizedConceptChecks.map((chk, qIdx) => {
                  const state = mcqState[chk.id];
                  const answered = !!state;

                  return (
                    <div
                      key={chk.id}
                      id={`chk-${chk.id}`}
                      className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-mono font-bold text-[var(--accent)] uppercase">
                          Concept Check #{qIdx + 1}
                        </span>
                        {answered && (
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              state.isCorrect
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                            }`}
                          >
                            {state.isCorrect ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" /> Correct!
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5" /> Review Distractor Below
                              </>
                            )}
                          </span>
                        )}
                      </div>

                      {/* Question Stem */}
                      <p className="font-semibold text-base text-[var(--text)]">
                        <MathText text={chk.question} />
                      </p>

                      {/* 4 Choices Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {(["A", "B", "C", "D"] as const).map((letter) => {
                          const optionText = chk.options[letter];
                          const isSelected = state?.selected === letter;
                          const isCorrect = chk.correctAnswer === letter;

                          let btnStyle = "bg-[var(--surface2)] border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)]";
                          if (answered) {
                            if (isCorrect) {
                              btnStyle = "bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold";
                            } else if (isSelected && !isCorrect) {
                              btnStyle = "bg-rose-500/15 border-rose-500 text-rose-600 dark:text-rose-400";
                            } else {
                              btnStyle = "bg-[var(--surface2)]/50 border-[var(--border)] opacity-60";
                            }
                          }

                          return (
                            <button
                              key={letter}
                              type="button"
                              onClick={() => handleSelectOption(chk.id, letter, chk.correctAnswer)}
                              className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all cursor-pointer flex items-start gap-2.5 ${btnStyle}`}
                            >
                              <span className="w-6 h-6 rounded-md font-mono font-bold flex items-center justify-center shrink-0 bg-[var(--surface)] border border-[var(--border)] text-xs">
                                {letter}
                              </span>
                              <span className="pt-0.5 leading-snug">
                                <MathText text={optionText} />
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Expandable Distractor Deconstruction */}
                      {answered && (
                        <div className="pt-4 border-t border-[var(--border)] space-y-3 bg-[var(--surface2)]/50 rounded-xl p-4">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] uppercase tracking-wider">
                            <Lightbulb className="w-4 h-4" />
                            <span>Distractor Deconstruction:</span>
                          </div>

                          <div className="grid grid-cols-1 gap-2 text-xs">
                            {(["A", "B", "C", "D"] as const).map((letter) => {
                              const isCorrect = chk.correctAnswer === letter;
                              const explanation = chk.distractorDeconstruction[letter];
                              return (
                                <div
                                  key={letter}
                                  className={`p-2.5 rounded-lg border ${
                                    isCorrect
                                      ? "bg-emerald-500/10 border-emerald-500/30 text-[var(--text)]"
                                      : "bg-[var(--surface)] border-[var(--border)] text-[var(--text2)]"
                                  }`}
                                >
                                  <span className="font-mono font-bold mr-1.5">
                                    Option {letter} {isCorrect ? "✅" : "❌"}:
                                  </span>
                                  <MathText text={explanation} />
                                </div>
                              );
                            })}
                          </div>

                          {chk.shortcutExplanation && (
                            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-1">
                              <strong>⚡ 10-Second Shortcut Trick:</strong>{" "}
                              <MathText text={chk.shortcutExplanation} />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Active Recall Written Challenge */}
            {module.writtenChallenges && module.writtenChallenges.length > 0 && (
              <section id="sec-written-challenge" className="space-y-6">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[var(--accent)]" />
                    <h2 className="text-xl font-bold font-serif text-[var(--text)]">
                      Active Recall Written Challenge
                    </h2>
                  </div>
                  <span className="text-xs font-mono text-[var(--text3)]">
                    Generative Self-Check
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[var(--text2)] leading-relaxed">
                  Recall from memory concepts and summaries and write it down here or on paper!
                </p>

                <div className="space-y-6">
                  {module.writtenChallenges.map((wc, wIdx) => {
                    const isRevealed = !!revealedAnswers[wc.id];
                    const studentText = writtenAnswers[wc.id] || "";

                    return (
                      <div
                        key={wc.id || wIdx}
                        className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-mono font-bold text-[var(--accent)] uppercase">
                            Synthesis Prompt #{wIdx + 1}
                          </span>
                          <span className="text-[11px] font-mono text-[var(--text3)]">
                            Auto-saved locally
                          </span>
                        </div>

                        <p className="font-semibold text-base text-[var(--text)]">
                          <MathText text={wc.prompt} />
                        </p>

                        <textarea
                          rows={3}
                          value={studentText}
                          onChange={(e) => handleWrittenChange(wc.id, e.target.value)}
                          placeholder="Type your explanation or write key points here (or jot them down in your notebook)..."
                          className="w-full p-3 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-xs sm:text-sm text-[var(--text)] placeholder:text-[var(--text3)] focus:outline-hidden focus:border-[var(--accent)] transition-colors resize-y"
                        />

                        <div className="flex items-center justify-between gap-3 pt-1">
                          <button
                            type="button"
                            onClick={() => toggleRevealAnswer(wc.id)}
                            className="px-4 py-2 rounded-xl bg-[var(--surface2)] hover:bg-[var(--surface)] border border-[var(--border)] text-xs font-bold text-[var(--accent)] transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <Lightbulb className="w-3.5 h-3.5" />
                            <span>{isRevealed ? "Hide Key Answer" : "Reveal Key Answer & Checkpoints"}</span>
                          </button>
                        </div>

                        {isRevealed && (
                          <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-3 bg-[var(--surface2)]/50 rounded-xl p-4 animate-in fade-in duration-200">
                            <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                              ⭐ Key Answer:
                            </div>
                            <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-[var(--text)] leading-relaxed">
                              <MathText text={wc.modelAnswer} splitParagraphs={true} />
                            </div>

                            {wc.keyCheckpoints && wc.keyCheckpoints.length > 0 && (
                              <div className="pt-2 border-t border-[var(--border)]/60 space-y-1.5">
                                <div className="text-[11px] font-mono font-bold text-[var(--text2)] uppercase">
                                  Self-Check Rubric:
                                </div>
                                <ul className="space-y-1 text-xs text-[var(--text2)]">
                                  {wc.keyCheckpoints.map((cp, cpIdx) => (
                                    <li key={cpIdx} className="flex items-start gap-2">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                      <span><MathText text={cp} /></span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Section 8: Paired Mastery Challenge CTA */}
            <section
              id="sec-mastery-challenge"
              className="bg-gradient-to-br from-[var(--surface)] to-[var(--surface2)] border-2 border-[var(--accent)] rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-lg"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)]">
                <Award className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-xl mx-auto">
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-[var(--text)]">
                  Take the {module.code} Mastery Challenge
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text2)]">
                  Cement your speed shortcuts and theoretical mastery on module-exclusive practice questions.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={`/learn/${module.id}/mastery`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--accent)] text-white text-sm font-bold shadow-md hover:opacity-95 transition-all cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>Launch Mastery Challenge</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {module.pairedQuizSetId && (
                  <Link
                    href={`/quizzes/${module.pairedQuizSetId}`}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text2)] hover:text-[var(--text)] text-sm font-medium transition-all"
                  >
                    <span>Browse Syllabus Library Set</span>
                  </Link>
                )}
              </div>
            </section>

            {/* Bottom Feedback Trigger */}
            <div className="flex items-center justify-center pt-2 pb-6">
              <button
                type="button"
                onClick={() => setIsFeedbackOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs text-[var(--text3)] hover:text-amber-500 hover:bg-[var(--surface2)] border border-transparent hover:border-[var(--border)] transition-all cursor-pointer"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" />
                <span>Notice a typo, formula error, or visualizer issue in this module? Leave a note</span>
              </button>
            </div>

            {/* Floating Text-Selection Quick Action Popover */}
            {selectionPopover && (
              <div
                style={{
                  position: "fixed",
                  left: `${selectionPopover.x}px`,
                  top: `${selectionPopover.y}px`,
                }}
                className="z-50 flex items-center gap-1 p-1 bg-[var(--surface)] border border-primary/30 rounded-xl shadow-xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
              >
                <button
                  type="button"
                  onClick={handleSaveSelectionToNotes}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary text-white text-xs font-semibold shadow-xs hover:opacity-95 transition-all cursor-pointer"
                  title="Save highlight to Personal Study Notebook"
                >
                  <BookMarked className="w-3.5 h-3.5" />
                  <span>Save Note</span>
                </button>

                <button
                  type="button"
                  onClick={handleAskAITutor}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--surface2)] text-primary hover:bg-primary/10 border border-[var(--border)] text-xs font-semibold transition-all cursor-pointer"
                  title="Ask AI Tutor about this concept"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Ask AI</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopySelection}
                  className="p-1 rounded-lg text-[var(--text3)] hover:text-[var(--text)] hover:bg-[var(--surface2)] transition-colors cursor-pointer"
                  title="Copy selected text"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Saved Note Toast Notification */}
            {savedNoteToast && (
              <div className="fixed bottom-6 right-6 z-50 p-3 bg-[var(--surface)] border border-emerald-500/40 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-in slide-in-from-bottom-2 fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Saved highlight to Personal Notebook!</span>
                <Link
                  href="/notes"
                  className="ml-2 underline text-[var(--text)] hover:text-emerald-500"
                >
                  View Notebook →
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Floating Outline Button for Mobile Readers */}
      <div className="fixed bottom-20 left-4 z-40 lg:hidden">
        <button
          type="button"
          onClick={() => setIsMobileTocOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[var(--surface)] border-2 border-[var(--accent)] text-[var(--text)] shadow-xl text-xs font-bold hover:bg-[var(--surface2)] active:scale-95 transition-all cursor-pointer backdrop-blur-md"
        >
          <Layers className="w-4 h-4 text-[var(--accent)]" />
          <span>Outline</span>
        </button>
      </div>

      {/* Mobile Slide-Up TOC Drawer */}
      {isMobileTocOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsMobileTocOpen(false)}
          />
          <div className="relative bg-[var(--surface)] border-t border-[var(--border)] rounded-t-3xl p-5 shadow-2xl z-10 max-h-[75vh] flex flex-col space-y-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2 text-sm font-bold font-serif text-[var(--text)]">
                <Layers className="w-4 h-4 text-[var(--accent)]" />
                <span>Jump to Section</span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileTocOpen(false)}
                className="p-1 rounded-lg text-[var(--text2)] hover:text-[var(--text)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-1.5 py-1">
              {dynamicToc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setIsMobileTocOpen(false)}
                  className="block px-3 py-2.5 rounded-xl bg-[var(--surface2)]/60 hover:bg-[var(--surface2)] text-xs font-medium text-[var(--text)] transition-colors leading-relaxed"
                >
                  {item.title}
                </a>
              ))}
              <a
                href="#sec-mastery-challenge"
                onClick={() => setIsMobileTocOpen(false)}
                className="block px-3 py-2.5 rounded-xl bg-[var(--accent)] text-white text-xs font-bold shadow-xs transition-colors"
              >
                ★ Mastery Challenge Exam
              </a>
            </div>
          </div>
        </div>
      )}

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        defaultModuleId={module.id}
      />
    </div>
  );
}
