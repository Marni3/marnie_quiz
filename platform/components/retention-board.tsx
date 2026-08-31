"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Brain,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Zap,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

export interface SrsTopicItem {
  topicCode: string;
  topicName: string;
  subjectDomain: string;
  stabilityDays: number;
  retrievability: number;
  lastStudiedAt: Date | string | null;
  nextReviewDue: Date | string | null;
  totalAttempts: number;
  averageAccuracy: number;
  status: string;
  currentR: number; // 0.0 to 1.0
  isDue: boolean;
}

interface RetentionBoardProps {
  topics: SrsTopicItem[];
}

export function RetentionBoard({ topics }: RetentionBoardProps) {
  const [activeMobileTab, setActiveMobileTab] = useState<"due" | "upcoming" | "mastered">("due");

  const now = new Date();

  // Categorize topics
  const dueTopics = topics.filter((t) => {
    return t.status === "active" && (t.isDue || t.currentR < 0.85 || (t.nextReviewDue && new Date(t.nextReviewDue) <= now));
  });

  const upcomingTopics = topics.filter((t) => {
    const isDue = t.isDue || t.currentR < 0.85 || (t.nextReviewDue && new Date(t.nextReviewDue) <= now);
    const isMastered = t.stabilityDays >= 14 && t.averageAccuracy >= 85;
    return t.status === "active" && !isDue && !isMastered;
  });

  const masteredTopics = topics.filter((t) => {
    const isDue = t.isDue || t.currentR < 0.85 || (t.nextReviewDue && new Date(t.nextReviewDue) <= now);
    return t.status === "active" && !isDue && t.stabilityDays >= 14 && t.averageAccuracy >= 85;
  });

  const getDomainBadgeClass = (domain: string) => {
    const d = domain.toUpperCase();
    if (d.includes("MATH")) return "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20";
    if (d.includes("ELEC")) return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    if (d.includes("GEAS")) return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
  };

  const renderTopicCard = (t: SrsTopicItem, bucket: "due" | "upcoming" | "mastered") => {
    const retrievabilityPercent = Math.round(t.currentR * 100);
    const daysUntilDue = t.nextReviewDue
      ? Math.max(0, Math.ceil((new Date(t.nextReviewDue).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
      : 0;

    return (
      <div
        key={t.topicCode}
        className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs hover:border-primary/40 transition-all space-y-3"
      >
        {/* Top Header: Code & Domain Badge */}
        <div className="flex items-center justify-between gap-2">
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${getDomainBadgeClass(t.subjectDomain || t.topicCode)}`}>
            {t.topicCode}
          </span>
          <span className="text-[11px] font-mono text-[var(--text3)]">
            {t.totalAttempts} {t.totalAttempts === 1 ? "attempt" : "attempts"}
          </span>
        </div>

        {/* Title */}
        <h4 className="text-xs sm:text-sm font-bold text-[var(--text)] line-clamp-1" title={t.topicName}>
          {t.topicName || t.topicCode}
        </h4>

        {/* Retrievability & Accuracy Matrix */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-[var(--text3)] flex items-center gap-1">
              <Brain className="w-3 h-3 text-[var(--accent)]" />
              <span>Retention:</span>
            </span>
            <span
              className={`font-bold ${
                retrievabilityPercent >= 90
                  ? "text-emerald-600 dark:text-emerald-400"
                  : retrievabilityPercent >= 75
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {retrievabilityPercent}% Fresh
            </span>
          </div>

          <div className="w-full bg-[var(--surface2)] h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                retrievabilityPercent >= 90
                  ? "bg-emerald-500"
                  : retrievabilityPercent >= 75
                  ? "bg-amber-500"
                  : "bg-rose-500"
              }`}
              style={{ width: `${retrievabilityPercent}%` }}
            />
          </div>
        </div>

        {/* Stability & Status Chips */}
        <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text3)] pt-1 border-t border-[var(--border)]/60">
          <div>
            <span>Acc: </span>
            <span className="font-bold text-[var(--text)]">{Math.round(t.averageAccuracy)}%</span>
          </div>
          <div>
            {bucket === "due" ? (
              <span className="text-rose-600 dark:text-rose-400 font-bold">Needs Review</span>
            ) : bucket === "upcoming" ? (
              <span className="text-sky-600 dark:text-sky-400 font-semibold">Due in ~{daysUntilDue}d</span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Stability: {Math.round(t.stabilityDays)}d</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <Link
            href={`/quizzes?search=${encodeURIComponent(t.topicCode)}`}
            className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 rounded-xl bg-[var(--surface2)] hover:bg-[var(--accent)] text-[var(--text2)] hover:text-white border border-[var(--border)] text-[11px] font-bold transition-colors cursor-pointer"
          >
            <Zap className="w-3 h-3 text-amber-500" />
            <span>Practice</span>
          </Link>
          <Link
            href="/learn"
            className="inline-flex items-center justify-center p-1.5 rounded-xl bg-[var(--surface2)] hover:bg-[var(--surface3)] text-[var(--text3)] hover:text-[var(--text)] border border-[var(--border)] transition-colors"
            title="Read Topic Theory Notes"
          >
            <BookOpen className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold font-serif text-[var(--text)] flex items-center gap-2">
            <Brain className="w-5 h-5 text-[var(--accent)]" />
            <span>Spaced Repetition &amp; Memory Pipeline</span>
          </h2>
          <p className="text-xs text-[var(--text2)]">
            Active FSRS retention tracking across your studied syllabus topics.
          </p>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="flex lg:hidden items-center p-1 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveMobileTab("due")}
            className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer ${
              activeMobileTab === "due"
                ? "bg-[var(--surface)] text-rose-600 dark:text-rose-400 shadow-xs font-bold"
                : "text-[var(--text3)]"
            }`}
          >
            Due ({dueTopics.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveMobileTab("upcoming")}
            className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer ${
              activeMobileTab === "upcoming"
                ? "bg-[var(--surface)] text-sky-600 dark:text-sky-400 shadow-xs font-bold"
                : "text-[var(--text3)]"
            }`}
          >
            Upcoming ({upcomingTopics.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveMobileTab("mastered")}
            className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer ${
              activeMobileTab === "mastered"
                ? "bg-[var(--surface)] text-emerald-600 dark:text-emerald-400 shadow-xs font-bold"
                : "text-[var(--text3)]"
            }`}
          >
            Mastered ({masteredTopics.length})
          </button>
        </div>
      </div>

      {/* 3-Column Grid on Desktop, Filtered View on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Column 1: Due for Review Today */}
        <div className={`space-y-3 ${activeMobileTab !== "due" ? "hidden lg:block" : "block"}`}>
          <div className="p-3.5 rounded-2xl bg-rose-500/5 border border-rose-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400">Due for Review Today</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono text-[11px] font-bold">
              {dueTopics.length}
            </span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {dueTopics.length > 0 ? (
              dueTopics.map((t) => renderTopicCard(t, "due"))
            ) : (
              <div className="p-8 rounded-2xl bg-[var(--surface2)]/40 border border-dashed border-[var(--border)] text-center space-y-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
                <p className="text-xs font-semibold text-[var(--text)]">All Caught Up!</p>
                <p className="text-[11px] text-[var(--text3)] leading-relaxed">
                  Zero topics currently due for spaced recovery. Your memory traces are fresh.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Upcoming in 1-3 Days */}
        <div className={`space-y-3 ${activeMobileTab !== "upcoming" ? "hidden lg:block" : "block"}`}>
          <div className="p-3.5 rounded-2xl bg-sky-500/5 border border-sky-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-500" />
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400">Upcoming (1–3 Days)</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 font-mono text-[11px] font-bold">
              {upcomingTopics.length}
            </span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {upcomingTopics.length > 0 ? (
              upcomingTopics.map((t) => renderTopicCard(t, "upcoming"))
            ) : (
              <div className="p-8 rounded-2xl bg-[var(--surface2)]/40 border border-dashed border-[var(--border)] text-center space-y-2">
                <Clock className="w-6 h-6 text-[var(--text3)] mx-auto" />
                <p className="text-xs font-semibold text-[var(--text)]">No Upcoming Reviews</p>
                <p className="text-[11px] text-[var(--text3)] leading-relaxed">
                  Complete more test sets to schedule upcoming memory reinforcement drills.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Mastered & Stable */}
        <div className={`space-y-3 ${activeMobileTab !== "mastered" ? "hidden lg:block" : "block"}`}>
          <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Mastered &amp; Stable</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-bold">
              {masteredTopics.length}
            </span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {masteredTopics.length > 0 ? (
              masteredTopics.map((t) => renderTopicCard(t, "mastered"))
            ) : (
              <div className="p-8 rounded-2xl bg-[var(--surface2)]/40 border border-dashed border-[var(--border)] text-center space-y-2">
                <Sparkles className="w-6 h-6 text-purple-500 mx-auto" />
                <p className="text-xs font-semibold text-[var(--text)]">Mastery in Progress</p>
                <p className="text-[11px] text-[var(--text3)] leading-relaxed">
                  Topics achieve mastery once memory stability reaches ≥14 days with ≥85% accuracy.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
