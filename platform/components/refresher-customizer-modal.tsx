"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Zap,
  X,
  Sparkles,
  Layers,
  Clock,
  Target,
  Brain,
  CheckCircle2,
  Sliders,
  Play,
  RotateCcw,
  AlertCircle,
} from "lucide-react";

interface RefresherCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDomain?: string;
}

const DOMAINS = [
  { id: "ALL", label: "All Subjects", desc: "Balanced syllabus mix", color: "text-primary" },
  { id: "MATH", label: "Mathematics", desc: "Algebra to Transforms", color: "text-blue-500" },
  { id: "ELEC", label: "Electronics", desc: "Semiconductors to Digital", color: "text-amber-500" },
  { id: "GEAS", label: "GEAS", desc: "Physics, Econ, R.A. 9292", color: "text-emerald-500" },
  { id: "EST", label: "EST", desc: "Comms, Antennas, Radar", color: "text-purple-500" },
];

const TARGET_MODES = [
  {
    id: "due_srs",
    label: "Due for Recovery",
    desc: "FSRS items reaching their forgetting threshold",
    icon: Brain,
  },
  {
    id: "weak_topics",
    label: "Weakest Topics (< 70%)",
    desc: "Prioritize lowest accuracy syllabus areas",
    icon: Target,
  },
  {
    id: "random_mix",
    label: "Random Quick Mix",
    desc: "Broad coverage across entire question bank",
    icon: Layers,
  },
];

const QUESTION_COUNTS = [10, 20, 30];

const TIMING_MODES = [
  { id: "untimed", label: "Untimed", desc: "Immediate worked explanations" },
  { id: "timed_per_question", label: "60s / Item", desc: "Board exam speed drill" },
  { id: "timed_whole_exam", label: "Full Timer", desc: "Real exam simulation" },
];

export function RefresherCustomizerModal({
  isOpen,
  onClose,
  defaultDomain = "ALL",
}: RefresherCustomizerModalProps) {
  const router = useRouter();
  const [domain, setDomain] = useState(defaultDomain);
  const [targetMode, setTargetMode] = useState<"due_srs" | "weak_topics" | "random_mix">("due_srs");
  const [count, setCount] = useState<number>(20);
  const [mode, setMode] = useState<"untimed" | "timed_per_question" | "timed_whole_exam">("untimed");
  const [launching, setLaunching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Mobile-First Standard: Lock body scroll while modal is active
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLaunch = async () => {
    setLaunching(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/srs/daily-drill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: domain !== "ALL" ? domain : undefined,
          targetMode,
          count,
          mode,
        }),
      });

      const data = await res.json();
      if (data.success && data.attemptId) {
        onClose();
        router.push(`/attempts/${data.attemptId}`);
      } else {
        throw new Error(data.error || "Failed to assemble refresher drill.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || "Failed to assemble drill. Please try again.");
      setLaunching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90dvh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] bg-[var(--surface2)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center border border-[var(--accent)]/25">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[var(--text)]">
                Customize Refresher Drill
              </h2>
              <p className="text-[11px] text-[var(--text2)]">
                Configure your spaced repetition recovery drill before launching.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Subject Domain */}
          <div>
            <label className="text-xs font-semibold text-[var(--text2)] uppercase tracking-wider block mb-2">
              1. Subject Domain
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DOMAINS.map((d) => {
                const isSelected = domain === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDomain(d.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "bg-primary/10 border-primary/40 font-semibold shadow-xs"
                        : "bg-[var(--surface2)] border-[var(--border)] text-[var(--text2)] hover:border-primary/20"
                    }`}
                  >
                    <div className={`text-xs font-bold ${isSelected ? "text-[var(--text)]" : d.color}`}>
                      {d.label}
                    </div>
                    <div className="text-[10px] text-[var(--text3)] mt-0.5">{d.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Mode */}
          <div>
            <label className="text-xs font-semibold text-[var(--text2)] uppercase tracking-wider block mb-2">
              2. Target Queue Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {TARGET_MODES.map((t) => {
                const Icon = t.icon;
                const isSelected = targetMode === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTargetMode(t.id as any)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? "bg-primary/10 border-primary/40 font-semibold shadow-xs"
                        : "bg-[var(--surface2)] border-[var(--border)] text-[var(--text2)] hover:border-primary/20"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-[var(--text)]">
                      <Icon className="w-3.5 h-3.5 text-primary" />
                      <span>{t.label}</span>
                    </div>
                    <div className="text-[10px] text-[var(--text3)] leading-tight">{t.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Count & Timing Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[var(--text2)] uppercase tracking-wider block mb-2">
                3. Question Length
              </label>
              <div className="flex items-center gap-2">
                {QUESTION_COUNTS.map((c) => {
                  const isSelected = count === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCount(c)}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-mono font-bold transition-all ${
                        isSelected
                          ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-xs"
                          : "bg-[var(--surface2)] border-[var(--border)] text-[var(--text2)] hover:text-[var(--text)]"
                      }`}
                    >
                      {c} Qs
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--text2)] uppercase tracking-wider block mb-2">
                4. Timer Mode
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as any)}
                className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-xs text-[var(--text)] font-medium focus:outline-none focus:border-primary"
              >
                {TIMING_MODES.map((tm) => (
                  <option key={tm.id} value={tm.id}>
                    {tm.label} — {tm.desc}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        {errorMessage && (
          <div className="mx-5 mb-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-2 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        <div className="px-5 py-3 border-t border-[var(--border)] bg-[var(--surface2)] flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs text-[var(--text2)] hover:text-[var(--text)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleLaunch}
            disabled={launching}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--accent)] text-white text-xs font-bold shadow-md hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{launching ? "Assembling Drill..." : `Start ${count}-Q Refresher`}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
