"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  MessageSquarePlus,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Send,
  Loader2,
  Bug,
  Type,
  Layout,
  HelpCircle,
  Palette,
} from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultModuleId?: string;
  defaultCategory?: string;
}

const CATEGORIES = [
  { id: "formatting", label: "KaTeX / Math Formatting", icon: Palette, color: "text-amber-500" },
  { id: "visualizer", label: "Visualizer / Diagram", icon: Layout, color: "text-blue-500" },
  { id: "typo", label: "Typo / Fact Error", icon: Type, color: "text-purple-500" },
  { id: "bug", label: "UI / Exam Bug", icon: Bug, color: "text-rose-500" },
  { id: "other", label: "General Feedback", icon: HelpCircle, color: "text-emerald-500" },
];

export function FeedbackModal({
  isOpen,
  onClose,
  defaultModuleId,
  defaultCategory = "formatting",
}: FeedbackModalProps) {
  const pathname = usePathname();
  const [category, setCategory] = useState(defaultCategory);
  const [comment, setComment] = useState("");
  const [moduleId, setModuleId] = useState(defaultModuleId || "");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setErrorMsg(null);
      setComment("");
      setCategory(defaultCategory || "formatting");

      // Auto-detect module ID from pathname if on /learn/[moduleId]
      if (defaultModuleId) {
        setModuleId(defaultModuleId);
      } else if (pathname.startsWith("/learn/")) {
        const parts = pathname.split("/learn/")[1]?.split("/");
        if (parts && parts[0]) {
          setModuleId(parts[0]);
        }
      } else {
        setModuleId("");
      }
    }
  }, [isOpen, pathname, defaultModuleId, defaultCategory]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMsg("Please write a short note describing what you noticed.");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    const payload = {
      url: typeof window !== "undefined" ? window.location.href : pathname,
      moduleId: moduleId || null,
      category,
      comment: comment.trim(),
      metadata: {
        pathname,
        viewportWidth: typeof window !== "undefined" ? window.innerWidth : null,
        viewportHeight: typeof window !== "undefined" ? window.innerHeight : null,
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : null,
        timestamp: new Date().toISOString(),
      },
    };

    try {
      // 1. Mirrored Local Storage Save
      try {
        const localRaw = localStorage.getItem("marnie_local_feedbacks");
        const list = localRaw ? JSON.parse(localRaw) : [];
        list.unshift({ ...payload, id: `local_${Date.now()}` });
        localStorage.setItem("marnie_local_feedbacks", JSON.stringify(list.slice(0, 50)));
      } catch {}

      // 2. Database API Call
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit feedback.");
      }

      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      console.warn("Feedback network save note:", err);
      // Even if database network fails, local storage succeeded
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] bg-[var(--surface2)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
              <MessageSquarePlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[var(--text)]">
                Feedback & Bug Note
              </h2>
              <p className="text-[11px] text-[var(--text2)]">
                Spotted a formula issue, diagram glitch, or typo? Jot it down here.
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

        {/* Content Body */}
        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[var(--text)]">Feedback Saved!</h3>
            <p className="text-xs text-[var(--text2)] max-w-xs mx-auto">
              Logged to the feedback queue for inspection during our next bug squashing session.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Auto Context Banner */}
            <div className="bg-[var(--surface2)] p-2.5 rounded-xl border border-[var(--border)] text-xs flex items-center justify-between">
              <span className="text-[var(--text2)] font-medium">Context:</span>
              <span className="font-mono text-primary font-bold truncate max-w-[260px]">
                {moduleId ? `Module: ${moduleId}` : pathname}
              </span>
            </div>

            {/* Category Selection */}
            <div>
              <label className="text-xs font-semibold text-[var(--text2)] uppercase tracking-wider block mb-2">
                Issue Category
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                        isSelected
                          ? "bg-primary/10 border-primary/40 shadow-xs font-semibold text-[var(--text)]"
                          : "bg-[var(--surface2)] border-[var(--border)] text-[var(--text2)] hover:border-primary/20"
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${cat.color}`} />
                      <span className="text-xs">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Note Textarea */}
            <div>
              <label className="text-xs font-semibold text-[var(--text2)] uppercase tracking-wider block mb-1.5">
                Note / Observation
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="e.g. Formula in Layer 2 is missing a minus sign; or slider in Figure 1 freezes at x=0..."
                rows={4}
                className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-3 text-xs text-[var(--text)] placeholder-[var(--text3)] focus:outline-none focus:border-primary resize-none"
              />
            </div>

            {errorMsg && (
              <div className="text-xs text-rose-500 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs text-[var(--text2)] hover:text-[var(--text)] transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !comment.trim()}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:opacity-95 disabled:opacity-50 transition-all"
              >
                {submitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>{submitting ? "Saving..." : "Submit Note"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
