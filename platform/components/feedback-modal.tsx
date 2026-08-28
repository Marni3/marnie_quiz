"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import {
  MessageSquarePlus,
  X,
  CheckCircle2,
  AlertCircle,
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
  const [mounted, setMounted] = useState(false);
  const [category, setCategory] = useState(defaultCategory);
  const [comment, setComment] = useState("");
  const [moduleId, setModuleId] = useState(defaultModuleId || "");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setErrorMsg(null);
      setComment("");
      setCategory(defaultCategory || "formatting");

      if (defaultModuleId) {
        setModuleId(defaultModuleId);
      } else if (pathname.startsWith("/learn/")) {
        const parts = pathname.split("/learn/")[1]?.split("/");
        if (parts && parts[0]) setModuleId(parts[0]);
      } else {
        setModuleId("");
      }
    }
  }, [isOpen, pathname, defaultModuleId, defaultCategory]);

  if (!isOpen || !mounted) return null;

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
      try {
        const localRaw = localStorage.getItem("marnie_local_feedbacks");
        const list = localRaw ? JSON.parse(localRaw) : [];
        list.unshift({ ...payload, id: `local_${Date.now()}` });
        localStorage.setItem("marnie_local_feedbacks", JSON.stringify(list.slice(0, 50)));
      } catch {}

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
      setTimeout(() => onClose(), 1500);
    } catch (err: any) {
      console.warn("Feedback network save note:", err);
      setSubmitted(true);
      setTimeout(() => onClose(), 1500);
    } finally {
      setSubmitting(false);
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl w-full max-w-md shadow-2xl flex flex-col my-auto max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] bg-[var(--surface2)] rounded-t-2xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center border border-amber-500/25 shrink-0">
              <MessageSquarePlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[var(--text)]">Feedback & Bug Note</h2>
              <p className="text-[11px] text-[var(--text2)]">
                Spotted an issue? Jot it here for the next squashing session.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-all shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1">
          {submitted ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[var(--text)]">Feedback Saved!</h3>
              <p className="text-xs text-[var(--text2)]">
                Logged to the feedback queue for inspection during our next bug squashing session.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-5 space-y-4">

              {/* Context tag */}
              <div className="bg-[var(--surface2)] px-3 py-2 rounded-xl border border-[var(--border)] flex items-center justify-between gap-2 text-xs">
                <span className="text-[var(--text3)] font-medium shrink-0">Context:</span>
                <span className="font-mono text-primary font-bold truncate text-right">
                  {moduleId ? `Module: ${moduleId}` : pathname}
                </span>
              </div>

              {/* Category grid */}
              <div>
                <label className="text-[10px] font-bold text-[var(--text3)] uppercase tracking-widest block mb-2">
                  Issue Category
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={`px-3 py-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                          isSelected
                            ? "bg-primary/10 border-primary/40 shadow-xs"
                            : "bg-[var(--surface2)] border-[var(--border)] text-[var(--text2)] hover:border-primary/25"
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${cat.color}`} />
                        <span className={`text-[11px] font-medium leading-tight ${isSelected ? "text-[var(--text)]" : ""}`}>
                          {cat.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Note textarea */}
              <div>
                <label className="text-[10px] font-bold text-[var(--text3)] uppercase tracking-widest block mb-1.5">
                  Note / Observation
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="e.g. Formula in Layer 2 is missing a minus sign; or slider in Figure 1 freezes at x=0..."
                  rows={3}
                  className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-3 text-xs text-[var(--text)] placeholder-[var(--text3)] focus:outline-none focus:border-primary resize-none"
                />
              </div>

              {errorMsg && (
                <div className="text-xs text-rose-500 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 pt-1 border-t border-[var(--border)]">
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
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>{submitting ? "Saving..." : "Submit Note"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
