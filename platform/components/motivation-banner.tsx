"use client";

import { GamificationData } from "@/lib/gamification";
import { Flame, Sparkles, Trophy, ShieldCheck } from "lucide-react";

export function MotivationBanner({ data }: { data: GamificationData }) {
  return (
    <div className="bg-gradient-to-r from-[var(--surface)] via-[var(--surface2)] to-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 sm:p-5 shadow-[var(--shadow)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20 flex items-center justify-center shrink-0">
          <Flame className="w-5 h-5 fill-current animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[var(--text)] tracking-tight">
              {data.motivationalMessage}
            </h3>
            {data.currentStreakDays > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                {data.currentStreakDays}d streak
              </span>
            )}
          </div>
          <p className="text-xs text-[var(--text2)] mt-0.5">
            {data.motivationalSubtext}
          </p>
        </div>
      </div>

      {/* Badges preview */}
      <div className="flex items-center gap-1.5 self-end sm:self-center">
        {data.badges.map((b) => (
          <div
            key={b.id}
            title={`${b.name}: ${b.description} (${b.progressText})`}
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm border transition-all cursor-help ${
              b.unlocked
                ? "bg-[var(--surface3)] border-[var(--accent)]/40 shadow-sm scale-105"
                : "bg-[var(--surface2)] border-[var(--border)] opacity-30 grayscale"
            }`}
          >
            <span>{b.icon}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
