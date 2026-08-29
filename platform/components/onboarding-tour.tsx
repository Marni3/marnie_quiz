"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  Sparkles,
  BookOpen,
  GitFork,
  GraduationCap,
  Brain,
  Zap,
  ArrowRight,
  ArrowLeft,
  X,
  Compass,
  CheckCircle2,
  Layers,
  KeyRound,
  Calculator,
} from "lucide-react";

interface TourStep {
  badge: string;
  title: string;
  icon: React.ReactNode;
  accentColor: string;
  lead: string;
  bulletPoints: Array<{ icon: React.ReactNode; title: string; desc: string }>;
  tip?: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    badge: "Welcome Tour • Step 1 of 6",
    title: "Welcome to Marnie Quiz!",
    icon: <Sparkles className="w-6 h-6 text-amber-500" />,
    accentColor: "from-amber-500/20 to-orange-500/20 border-amber-500/30",
    lead: "Hey there! Welcome to your personal board exam study companion for the PRC Electronics Engineering (ECE) licensure exam. Let's take a quick 1-minute look around so you know exactly where everything is.",
    bulletPoints: [
      {
        icon: <Layers className="w-4 h-4 text-primary" />,
        title: "Complete 4-Subject Curriculum",
        desc: "Covers all 46 syllabus topics across MATH, ELECS, GEAS, and EST with 5,400+ categorized questions.",
      },
      {
        icon: <Zap className="w-4 h-4 text-emerald-500" />,
        title: "100% Free & Fast",
        desc: "Built to run blazing-fast with zero subscriptions, paywalls, or converting trials.",
      },
    ],
    tip: "You can re-open this tour anytime by tapping the 'Tour' compass in the top navbar.",
  },
  {
    badge: "Quizzes • Step 2 of 6",
    title: "4-Tier Study Questionnaires",
    icon: <BookOpen className="w-6 h-6 text-primary" />,
    accentColor: "from-primary/20 to-blue-500/20 border-primary/30",
    lead: "Every question set is purposefully structured into one of 4 standardized tiers so you can practice according to your study phase:",
    bulletPoints: [
      {
        icon: <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />,
        title: "Diagnostic Check (30 Questions)",
        desc: "Best for baseline knowledge checks and initial retrieval practice before reviewing notes.",
      },
      {
        icon: <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />,
        title: "Topic Review (25 Questions)",
        desc: "Standard topic mastery questionnaire covering all essential concept archetypes.",
      },
      {
        icon: <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />,
        title: "Speed Concept Drill (10–20 Questions)",
        desc: "Rapid-fire targeted drill focusing on proportionalities, traps, and quick recall.",
      },
      {
        icon: <div className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />,
        title: "Board Simulation (50 Questions)",
        desc: "Full-length timed mock simulation mirroring real PRC examination pacing and pressure.",
      },
    ],
  },
  {
    badge: "Curriculum View • Step 3 of 6",
    title: "Library & Gamified Skill Tree",
    icon: <GitFork className="w-6 h-6 text-emerald-500" />,
    accentColor: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30",
    lead: "In the Library tab, you can toggle between two distinct study views depending on how you like to work:",
    bulletPoints: [
      {
        icon: <BookOpen className="w-4 h-4 text-emerald-500" />,
        title: "Structured Library View",
        desc: "Filter by subject pillar (MATH, ELECS, GEAS, EST), search keywords, and jump directly into specific subtopic test sets.",
      },
      {
        icon: <GitFork className="w-4 h-4 text-emerald-500" />,
        title: "Duolingo-Style Skill Tree",
        desc: "A winding stepping-stone progression path with chromatic mastery rings that light up as you master each topic code.",
      },
    ],
  },
  {
    badge: "Theory & Shortcuts • Step 4 of 6",
    title: "Interactive Learning Modules",
    icon: <GraduationCap className="w-6 h-6 text-purple-500" />,
    accentColor: "from-purple-500/20 to-indigo-500/20 border-purple-500/30",
    lead: "Don't just memorize question answers blindly. The Modules tab (/learn) contains deep, intuitive theory lessons written in a friendly Paul's Online Notes style:",
    bulletPoints: [
      {
        icon: <Calculator className="w-4 h-4 text-purple-500" />,
        title: "Single-Column KaTeX Formulas & Keystrokes",
        desc: "Clear mathematical derivations paired with exact Karce KC-S991 and Canon F-789SGA calculator speed tricks.",
      },
      {
        icon: <CheckCircle2 className="w-4 h-4 text-purple-500" />,
        title: "In-Line Concept Checks & Visualizers",
        desc: "Test your intuition right inside the lesson with distractor deconstructions and parameter-sweep visualizers.",
      },
    ],
  },
  {
    badge: "Spaced Repetition • Step 5 of 6",
    title: "Memory Stability & Retention Radar",
    icon: <Brain className="w-6 h-6 text-rose-500" />,
    accentColor: "from-rose-500/20 to-pink-500/20 border-rose-500/30",
    lead: "Memory decays exponentially over time without retrieval. The Retention tab (/analytics) uses the FSRS (Free Spaced Repetition Scheduler) algorithm to keep your knowledge fresh:",
    bulletPoints: [
      {
        icon: <Zap className="w-4 h-4 text-rose-500" />,
        title: "Daily 20-Q Refresher Drills",
        desc: "1-click smart review generated automatically from concepts that are overdue or nearing their forgetting window.",
      },
      {
        icon: <Brain className="w-4 h-4 text-rose-500" />,
        title: "Board Readiness Index (BRI)",
        desc: "A calibrated score measuring your readiness across accuracy, retention stability, and syllabus breadth.",
      },
    ],
  },
  {
    badge: "AI Topnotcher • Step 6 of 6",
    title: "AI Tutor & BYOK Workspace",
    icon: <Sparkles className="w-6 h-6 text-cyan-500" />,
    accentColor: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30",
    lead: "Have a tough derivation or tricky distractor trap you can't figure out? Head over to the AI Tutor tab (/tutor):",
    bulletPoints: [
      {
        icon: <KeyRound className="w-4 h-4 text-cyan-500" />,
        title: "Bring Your Own Free API Key (BYOK)",
        desc: "Plug in a 100% free Google AI Studio or Groq key. Your keys and conversations stay securely in your browser.",
      },
      {
        icon: <Sparkles className="w-4 h-4 text-cyan-500" />,
        title: "FSRS-Aware Debriefs & Custom Modules",
        desc: "The AI automatically knows your weak topics, breaks down test mistakes, and can author customized practice drills.",
      },
    ],
    tip: "You're all set! Pick a subject, test your baseline, and start mastering the board exam.",
  },
];

export function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Auto-open on first visit if not yet seen
    const hasSeen = localStorage.getItem("has_seen_onboarding_tour");
    if (!hasSeen) {
      // Small timeout to allow the initial UI to settle
      const t = setTimeout(() => {
        setIsOpen(true);
      }, 700);
      return () => clearTimeout(t);
    }
  }, []);

  // Listen for global open event dispatched from Navbar or settings
  useEffect(() => {
    const handleOpen = () => {
      setCurrentStep(0);
      setIsOpen(true);
    };

    window.addEventListener("open-onboarding-tour", handleOpen);
    return () => window.removeEventListener("open-onboarding-tour", handleOpen);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    localStorage.setItem("has_seen_onboarding_tour", "true");
  }, []);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Keyboard navigation listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentStep, handleClose]);

  if (!mounted || !isOpen) return null;

  const step = TOUR_STEPS[currentStep];
  const isLast = currentStep === TOUR_STEPS.length - 1;

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Dialog Body */}
      <div className="relative w-full max-w-lg bg-[var(--surface)] border border-[var(--border)] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 max-h-[85vh] transition-all">
        {/* Top Header Card Banner */}
        <div
          className={`p-4 sm:p-6 bg-gradient-to-br ${step.accentColor} border-b flex items-start justify-between gap-3 sm:gap-4`}
        >
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center shrink-0 shadow-sm">
              {step.icon}
            </div>
            <div>
              <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text2)]">
                {step.badge}
              </span>
              <h2 className="text-lg sm:text-2xl font-bold font-serif text-[var(--text)] tracking-tight mt-0.5">
                {step.title}
              </h2>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-full text-[var(--text3)] hover:text-[var(--text)] hover:bg-[var(--surface2)] transition-colors cursor-pointer shrink-0"
            aria-label="Close Tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Body */}
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto max-h-[55vh] text-xs sm:text-sm">
          <p className="text-[var(--text2)] leading-relaxed">{step.lead}</p>

          {/* Bullet Points */}
          <div className="space-y-2.5 pt-1">
            {step.bulletPoints.map((bp, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-2xl bg-[var(--surface2)] border border-[var(--border)]/60 text-xs sm:text-sm"
              >
                <div className="mt-0.5 shrink-0">{bp.icon}</div>
                <div>
                  <div className="font-bold text-[var(--text)]">{bp.title}</div>
                  <div className="text-[11px] sm:text-xs text-[var(--text2)] mt-0.5 leading-relaxed">
                    {bp.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Optional Pro-Tip Box */}
          {step.tip && (
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 text-[11px] text-[var(--text2)]">
              <Compass className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>{step.tip}</span>
            </div>
          )}
        </div>

        {/* Footer / Pagination Controls */}
        <div className="px-6 py-4 border-t border-[var(--border)] bg-[var(--surface2)]/50 flex items-center justify-between gap-4">
          {/* Step Dots */}
          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentStep
                    ? "w-6 bg-[var(--accent)]"
                    : "w-2 bg-[var(--border)] hover:bg-[var(--text3)]"
                }`}
              />
            ))}
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-3.5 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-all cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Back</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-xl bg-[var(--accent)] text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>{isLast ? "Get Started" : "Next"}</span>
              {isLast ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <ArrowRight className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
