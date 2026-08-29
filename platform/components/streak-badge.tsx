"use client";

import { useState, useEffect, useRef } from "react";
import { getStudyStreak, syncStreakWithServer, StudyStreakInfo } from "@/lib/streak";
import { Flame, Trophy, Calendar, Sparkles, X, Check } from "lucide-react";

export function StreakBadge() {
  const [streakInfo, setStreakInfo] = useState<StudyStreakInfo | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const refreshStreak = () => {
    setStreakInfo(getStudyStreak());
  };

  useEffect(() => {
    refreshStreak();
    syncStreakWithServer().then((updated) => setStreakInfo(updated));

    const handleUpdate = () => {
      refreshStreak();
    };

    window.addEventListener("marnie-streak-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("marnie-streak-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Close popover when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  if (!streakInfo) return null;

  const { currentStreak, maxStreak, activeToday, weeklyDays } = streakInfo;

  return (
    <div className="relative inline-block" ref={popoverRef}>
      {/* Trigger Flame Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs border ${
          activeToday
            ? "bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
            : "bg-[var(--surface2)] border-[var(--border)] text-[var(--text3)] hover:text-[var(--text)]"
        }`}
        title={
          activeToday
            ? `🔥 ${currentStreak} Day Streak Active!`
            : "Study today to keep your streak alive!"
        }
      >
        <Flame
          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
            activeToday ? "fill-amber-500 text-amber-500 animate-bounce" : "text-[var(--text3)]"
          }`}
        />
        <span className="font-mono text-[11px] sm:text-xs">
          {currentStreak}
          <span className="hidden sm:inline font-sans ml-1 font-semibold text-[10px]">
            {currentStreak === 1 ? "day" : "days"}
          </span>
        </span>
      </button>

      {/* 7-Day Dot Progress Popover */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 p-3.5 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center">
                <Flame className="w-4 h-4 fill-amber-500" />
              </div>
              <div>
                <div className="text-xs font-bold text-[var(--text)]">
                  {currentStreak} Day Study Streak
                </div>
                <div className="text-[10px] text-[var(--text2)]">
                  {activeToday ? "Extended today! 🔥" : "Complete an activity today!"}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-[var(--text3)] hover:text-[var(--text)]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 7-Day Day-by-Day Track */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-[var(--text3)] font-semibold uppercase">
              <span>Past 7 Days</span>
              <span className="font-mono">Best: {maxStreak}d</span>
            </div>
            <div className="grid grid-cols-7 gap-1.5 pt-1">
              {weeklyDays.map((day, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-bold border transition-all ${
                      day.active
                        ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                        : day.isToday
                        ? "bg-[var(--surface2)] border-dashed border-amber-500/60 text-amber-500"
                        : "bg-[var(--surface2)]/60 border-[var(--border)] text-[var(--text3)]"
                    }`}
                    title={`${day.dateStr}: ${day.active ? "Completed" : "No activity"}`}
                  >
                    {day.active ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : day.isToday ? "•" : ""}
                  </div>
                  <span className="text-[9px] font-mono text-[var(--text3)]">
                    {day.dayLabel}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Motivational Tip */}
          <div className="p-2.5 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-[11px] text-[var(--text2)] leading-snug flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
            <span>
              {activeToday
                ? "Awesome work! Consistent daily micro-sessions compound into PRC topnotcher mastery."
                : "A 3-minute quick drill, module reading, or AI study chat will light up your flame!"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
