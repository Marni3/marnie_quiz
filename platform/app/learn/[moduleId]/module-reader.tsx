"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { LearningModule } from "@/lib/modules";
import { MathText } from "@/components/math-text";
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
  Check,
  RotateCcw,
  Sliders,
  Award,
  ExternalLink,
  ShieldCheck,
  Lightbulb,
} from "lucide-react";

interface ModuleReaderProps {
  module: LearningModule;
}

export function ModuleReader({ module }: ModuleReaderProps) {
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

  // In-line MCQ Answers State: { [questionId]: { selectedChoice: 'A'|'B'|'C'|'D', revealed: boolean } }
  const [mcqState, setMcqState] = useState<Record<string, { selected: string; isCorrect: boolean }>>({});

  // Visualizer Slider Values
  const [vizControls, setVizControls] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    module.visualizer?.config.controls.forEach((c) => {
      init[c.id] = c.defaultValue;
    });
    return init;
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Active TOC Section on scroll
  const [activeSection, setActiveSection] = useState<string>("sec-prereq-bridges");

  // Visualizer Canvas Render Effect
  useEffect(() => {
    if (!module.visualizer || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = module.visualizer.config.canvasWidth || 640;
    const height = module.visualizer.config.canvasHeight || 320;

    canvas.width = width;
    canvas.height = height;

    try {
      // Execute the module's self-contained rendering logic
      const renderFn = new Function(
        "ctx",
        "width",
        "height",
        "state",
        `"use strict"; (${module.visualizer.config.renderFunction})(ctx, width, height, state);`
      );
      renderFn(ctx, width, height, vizControls);
    } catch (err) {
      console.warn("Visualizer rendering function error:", err);
    }
  }, [module.visualizer, vizControls]);

  // Handle MCQ Answer Select
  const handleSelectOption = (qId: string, choice: string, correct: string) => {
    setMcqState((prev) => ({
      ...prev,
      [qId]: {
        selected: choice,
        isCorrect: choice === correct,
      },
    }));
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
      {/* Top Breadcrumb Header */}
      <section className="border-b border-[var(--border)] bg-[var(--surface)] sticky top-16 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[var(--text3)] min-w-0">
            <Link href="/learn" className="hover:text-[var(--text)] transition-colors">
              Modules
            </Link>
            <span>/</span>
            <span className={`px-2 py-0.5 rounded-md font-mono font-semibold border text-[11px] ${domStyle.badge}`}>
              {module.code}
            </span>
            <span>/</span>
            <span className="truncate font-medium text-[var(--text)] max-w-[200px] sm:max-w-md">
              {module.subtopicTitle}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/quizzes/${module.pairedQuizSetId}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[var(--accent)] text-white text-xs font-semibold hover:opacity-95 shadow-sm transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Launch Paired Quiz</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Grid: Sidebar TOC + Reading Canvas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sticky Table of Contents */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-36 space-y-6">
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text3)] pb-2 border-b border-[var(--border)]">
                <Layers className="w-4 h-4 text-[var(--accent)]" />
                <span>Table of Contents</span>
              </div>
              <nav className="space-y-1">
                {module.toc?.map((item) => (
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
                  ★ Paired Quiz Challenge
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
          <main className="lg:col-span-9 space-y-10">
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

            {/* Section 2: Terms and Definitions */}
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

            {/* Section 3: Interactive Visualizer Sandbox */}
            {module.visualizer && (
              <section id="sec-visualizer" className="space-y-4">
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-[var(--accent)]" />
                    <h2 className="text-xl font-bold font-serif text-[var(--text)]">
                      {module.visualizer.title}
                    </h2>
                  </div>
                  <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full bg-[var(--surface2)] border border-[var(--border)] text-[var(--text3)]">
                    {module.visualizer.archetype} Simulator
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[var(--text2)]">
                  {module.visualizer.description}
                </p>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
                  {/* Canvas Viewport */}
                  <div className="flex justify-center items-center bg-[#0f172a] p-2">
                    <canvas
                      ref={canvasRef}
                      className="max-w-full h-auto block rounded-lg shadow-inner"
                    />
                  </div>

                  {/* Interactive Parameter Controls */}
                  <div className="p-4 sm:p-5 bg-slate-900/90 border-t border-slate-800 space-y-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Live Parameter Sliders:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {module.visualizer.config.controls.map((c) => (
                        <div key={c.id} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-medium text-slate-300">
                            <span>{c.label}</span>
                            <span className="font-mono text-cyan-400">
                              {vizControls[c.id]} {c.unit || ""}
                            </span>
                          </div>
                          <input
                            type="range"
                            min={c.min}
                            max={c.max}
                            step={c.step}
                            value={vizControls[c.id] ?? c.defaultValue}
                            onChange={(e) =>
                              setVizControls((prev) => ({
                                ...prev,
                                [c.id]: parseFloat(e.target.value),
                              }))
                            }
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                          />
                          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                            <span>{c.min}</span>
                            <span>{c.max}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Section 4: Lesson Proper */}
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
                    &ldquo;{module.theory.mentalAnchor}&rdquo;
                  </p>
                </div>
              )}

              {/* KaTeX Markdown Theory Body */}
              <div className="prose dark:prose-invert max-w-none bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 sm:p-6 shadow-xs leading-relaxed text-sm sm:text-base">
                <MathText text={module.theory.contentMarkdown} splitParagraphs={true} />
              </div>
            </section>

            {/* Section 5: Sample Problems and Solutions */}
            <section id="sec-dual-method" className="space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[var(--accent)]" />
                  <h2 className="text-xl font-bold font-serif text-[var(--text)]">
                    Sample Problems and Solutions
                  </h2>
                </div>
              </div>

              <div className="space-y-6">
                {module.examples.map((ex, idx) => {
                  const mode = exampleModes[idx] || "shortcut";
                  return (
                    <div
                      key={idx}
                      id={`example-${idx}`}
                      className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-xs"
                    >
                      {/* Problem Statement Header */}
                      <div className="p-4 sm:p-5 border-b border-[var(--border)] bg-[var(--surface2)] space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold font-mono uppercase tracking-wider text-[var(--accent)]">
                            Sample Problem #{idx + 1}
                          </span>
                          <div className="flex items-center gap-2 text-xs text-[var(--text3)]">
                            <span className="flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3" /> Formal: {ex.formalTimeSeconds}s
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                              <Zap className="w-3 h-3" /> Shortcut: {ex.shortcutTimeSeconds}s
                            </span>
                          </div>
                        </div>
                        <p className="font-semibold text-base text-[var(--text)]">
                          <MathText text={ex.problemStatement} />
                        </p>
                      </div>

                      {/* Method Segmented Switcher */}
                      <div className="px-4 pt-3 flex items-center justify-between gap-2 border-b border-[var(--border)] bg-[var(--surface)]">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              setExampleModes((prev) => ({ ...prev, [idx]: "shortcut" }))
                            }
                            className={`px-3 py-1.5 rounded-t-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                              mode === "shortcut"
                                ? "bg-[var(--accent)] text-white shadow-sm"
                                : "text-[var(--text3)] hover:text-[var(--text)] hover:bg-[var(--surface2)]"
                            }`}
                          >
                            <Zap className="w-3.5 h-3.5" />
                            <span>⚡ Board Exam Shortcut ({ex.shortcutTimeSeconds}s)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setExampleModes((prev) => ({ ...prev, [idx]: "formal" }))
                            }
                            className={`px-3 py-1.5 rounded-t-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                              mode === "formal"
                                ? "bg-[var(--surface2)] text-[var(--text)] border-t border-x border-[var(--border)]"
                                : "text-[var(--text3)] hover:text-[var(--text)] hover:bg-[var(--surface2)]"
                            }`}
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Academic Derivation ({ex.formalTimeSeconds}s)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setExampleModes((prev) => ({ ...prev, [idx]: "combined" }))
                            }
                            className={`px-3 py-1.5 rounded-t-lg text-xs font-bold transition-all cursor-pointer hidden sm:flex items-center gap-1.5 ${
                              mode === "combined"
                                ? "bg-[var(--surface2)] text-[var(--text)] border-t border-x border-[var(--border)]"
                                : "text-[var(--text3)] hover:text-[var(--text)] hover:bg-[var(--surface2)]"
                            }`}
                          >
                            <Layers className="w-3.5 h-3.5" />
                            <span>Side-by-Side</span>
                          </button>
                        </div>
                      </div>

                      {/* Solution Body */}
                      <div className="p-4 sm:p-6 bg-[var(--surface)] text-sm sm:text-base leading-relaxed">
                        {mode === "shortcut" && (
                          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 sm:p-5 space-y-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                              <Zap className="w-4 h-4" />
                              <span>20-Second Board Speed Solution</span>
                            </div>
                            <MathText text={ex.shortcutSolutionMarkdown} splitParagraphs={true} />
                          </div>
                        )}

                        {mode === "formal" && (
                          <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-4 sm:p-5 space-y-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-[var(--text2)] uppercase tracking-wider">
                              <BookOpen className="w-4 h-4" />
                              <span>Rigorous Step-by-Step Textbook Derivation</span>
                            </div>
                            <MathText text={ex.formalSolutionMarkdown} splitParagraphs={true} />
                          </div>
                        )}

                        {mode === "combined" && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-4 space-y-2">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text2)] uppercase">
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>Academic Method</span>
                              </div>
                              <MathText text={ex.formalSolutionMarkdown} splitParagraphs={true} />
                            </div>
                            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 space-y-2">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                                <Zap className="w-3.5 h-3.5" />
                                <span>⚡ Speed Shortcut</span>
                              </div>
                              <MathText text={ex.shortcutSolutionMarkdown} splitParagraphs={true} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Section 6: Calculator Techniques */}
            {module.calculatorGuides && (
              <section id="sec-calculator" className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-[var(--accent)]" />
                    <h2 className="text-xl font-bold font-serif text-[var(--text)]">
                      Calculator Techniques
                    </h2>
                  </div>
                  {/* Model Switcher */}
                  <div className="flex items-center p-1 rounded-xl bg-[var(--surface2)] border border-[var(--border)]">
                    <button
                      type="button"
                      onClick={() => setCalcTab("karce")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        calcTab === "karce"
                          ? "bg-[var(--accent)] text-white shadow-xs"
                          : "text-[var(--text3)] hover:text-[var(--text)]"
                      }`}
                    >
                      Karce KC-S991
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalcTab("canon")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        calcTab === "canon"
                          ? "bg-[var(--accent)] text-white shadow-xs"
                          : "text-[var(--text3)] hover:text-[var(--text)]"
                      }`}
                    >
                      Canon F-789SGA
                    </button>
                  </div>
                </div>

                {(() => {
                  const guide = calcTab === "karce" ? module.calculatorGuides.karce : module.calculatorGuides.canon;
                  const problemText = guide.sampleProblem || guide.problemContext;

                  return (
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <span className="text-xs font-mono font-bold text-[var(--accent)]">
                            {calcTab === "karce" ? "Karce KC-S991 Technique" : "Canon F-789SGA Technique"}
                          </span>
                          {guide.techniqueTitle && (
                            <h3 className="text-sm font-bold text-[var(--text)]">
                              {guide.techniqueTitle}
                            </h3>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {guide.problemType && (
                            <span className="text-[11px] px-2 py-0.5 rounded-md bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 font-mono">
                              {guide.problemType}
                            </span>
                          )}
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--surface2)] border border-[var(--border)] text-[var(--text2)] font-mono">
                            {guide.mode}
                          </span>
                        </div>
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

                      {/* Step-by-Step Keystrokes Sequence */}
                      <div className="space-y-2 pt-1">
                        <div className="text-xs font-bold uppercase text-[var(--text3)]">
                          Step-by-Step Button Sequence:
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {guide.keystrokes.map((key, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[var(--surface2)] border border-[var(--border)] text-[var(--text)] shadow-xs"
                            >
                              <MathText text={key} />
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-[var(--text2)] pt-2 border-t border-[var(--border)] leading-relaxed">
                        {guide.notes}
                      </p>
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
                {module.conceptChecks?.map((chk, qIdx) => {
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
                            <span>Distractor Deconstructor & Algebraic Traps:</span>
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
                                    Option {letter} {isCorrect ? "✅ (Correct Answer)" : "❌ (Distractor Trap)"}:
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
                  Ready for the Paired Board Exam Quiz?
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text2)]">
                  Cement your speed shortcuts and theoretical mastery on authentic PRC board questions.
                </p>
              </div>

              <div>
                <Link
                  href={`/quizzes/${module.pairedQuizSetId}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--accent)] text-white text-sm font-bold shadow-md hover:opacity-95 transition-all cursor-pointer"
                >
                  <span>Launch Paired Quiz Set</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
