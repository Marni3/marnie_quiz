"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Settings,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  ShieldCheck,
  Check,
  Sparkles,
  BookOpen,
  Target,
  FileText,
  RotateCcw,
  Key,
  Database,
  Flame,
  Palette,
  Compass,
  MessageSquarePlus,
} from "lucide-react";
import {
  exportStudyVault,
  importStudyVault,
  resetAllProgressData,
  getStoredCustomModules,
  getStoredCustomQuizzes,
  getStoredSessions,
  getStoredSavedFormulas,
} from "@/lib/tutor/storage";
import { getStoredNotes } from "@/lib/notes";
import { getRawStreakState } from "@/lib/streak";
import { ThemeToggle } from "@/components/theme-toggle";
import { FeedbackModal } from "@/components/feedback-modal";

export function SettingsView() {
  const [stats, setStats] = useState({
    sessions: 0,
    modules: 0,
    quizzes: 0,
    formulas: 0,
    notes: 0,
    streak: 0,
  });

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [confirmInputText, setConfirmInputText] = useState("");
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshStats = () => {
    if (typeof window === "undefined") return;
    setStats({
      sessions: getStoredSessions().length,
      modules: getStoredCustomModules().length,
      quizzes: getStoredCustomQuizzes().length,
      formulas: getStoredSavedFormulas().length,
      notes: getStoredNotes().length,
      streak: getRawStreakState().currentStreak,
    });
  };

  useEffect(() => {
    refreshStats();
  }, []);

  const handleExportBackup = () => {
    try {
      const backupJson = exportStudyVault();
      const blob = new Blob([backupJson], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `marnie-study-vault-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setStatusMessage({ type: "success", text: "Study Vault backup exported successfully!" });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      console.error("Export backup failed:", err);
      setStatusMessage({ type: "error", text: "Failed to export backup." });
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const success = importStudyVault(text);
        if (success) {
          refreshStats();
          setStatusMessage({ type: "success", text: "Study Vault restored successfully!" });
        } else {
          setStatusMessage({ type: "error", text: "Invalid backup file format." });
        }
      } catch {
        setStatusMessage({ type: "error", text: "Failed to read backup file." });
      }
      setTimeout(() => setStatusMessage(null), 3000);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleResetAllProgress = () => {
    const success = resetAllProgressData();
    if (success) {
      refreshStats();
      setIsResetConfirmOpen(false);
      setStatusMessage({ type: "success", text: "All local study progress and data have been reset to zero." });
      setTimeout(() => setStatusMessage(null), 4000);
    } else {
      setStatusMessage({ type: "error", text: "Failed to reset progress data." });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent)] uppercase font-semibold">
          <Settings className="w-4 h-4" />
          <span>Application Settings</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[var(--text)]">
          Settings & Local Storage
        </h1>
        <p className="text-sm text-[var(--text2)] max-w-2xl">
          Manage your personal study data, create offline Study Vault backups, configure BYOK credentials, or reset your local progress.
        </p>
      </div>

      {/* Toast Notification */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm font-medium flex items-center gap-2.5 animate-in fade-in duration-150 ${
            statusMessage.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
              : "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400"
          }`}
        >
          {statusMessage.type === "success" ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Storage Summary Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-1">
          <div className="text-[11px] text-[var(--text3)] flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Study Streak</span>
          </div>
          <div className="text-xl font-bold font-mono text-[var(--text)]">{stats.streak} Days</div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-1">
          <div className="text-[11px] text-[var(--text3)] flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-primary" />
            <span>Custom Modules</span>
          </div>
          <div className="text-xl font-bold font-mono text-[var(--text)]">{stats.modules}</div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-1">
          <div className="text-[11px] text-[var(--text3)] flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-emerald-500" />
            <span>Custom Quizzes</span>
          </div>
          <div className="text-xl font-bold font-mono text-[var(--text)]">{stats.quizzes}</div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-1">
          <div className="text-[11px] text-[var(--text3)] flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-sky-500" />
            <span>Notebook Notes</span>
          </div>
          <div className="text-xl font-bold font-mono text-[var(--text)]">{stats.notes}</div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-1">
          <div className="text-[11px] text-[var(--text3)] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            <span>Saved Formulas</span>
          </div>
          <div className="text-xl font-bold font-mono text-[var(--text)]">{stats.formulas}</div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-1">
          <div className="text-[11px] text-[var(--text3)] flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>AI Study Chats</span>
          </div>
          <div className="text-xl font-bold font-mono text-[var(--text)]">{stats.sessions}</div>
        </div>
      </div>

      {/* Study Vault Backup & Restore Card */}
      <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[var(--text)]">Study Vault Backup & Restore</h2>
            <p className="text-xs text-[var(--text2)]">
              Export all your notes, custom modules, AI study history, and configurations to a single portable JSON file.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportBackup}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:opacity-95 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Vault Backup (.json)</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-[var(--text)] text-xs font-bold hover:border-primary/40 transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Restore from Backup</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportBackup}
            className="hidden"
          />
        </div>
      </div>

      {/* App Experience & Preferences (Theme, Tour, Feedback) */}
      <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[var(--surface2)] text-[var(--accent)] flex items-center justify-center border border-[var(--border)]">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[var(--text)]">App Preferences & Interface</h2>
            <p className="text-xs text-[var(--text2)]">
              Customize appearance, launch the onboarding tour, or submit suggestions and bug reports.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Theme Selector */}
          <div className="p-3.5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-[var(--text)]">Theme Mode</div>
              <div className="text-[11px] text-[var(--text3)]">Dark or light aesthetic</div>
            </div>
            <ThemeToggle />
          </div>

          {/* Onboarding Tour */}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("open-onboarding-tour"))}
            className="p-3.5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] text-left hover:border-primary/40 transition-all flex items-center justify-between cursor-pointer group"
          >
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">Guided Tour</div>
              <div className="text-[11px] text-[var(--text3)]">Walkthrough all features</div>
            </div>
            <Compass className="w-4 h-4 text-[var(--accent)] shrink-0" />
          </button>

          {/* Send Feedback */}
          <button
            type="button"
            onClick={() => setIsFeedbackOpen(true)}
            className="p-3.5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] text-left hover:border-amber-500/40 transition-all flex items-center justify-between cursor-pointer group"
          >
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-[var(--text)] group-hover:text-amber-500 transition-colors">Send Feedback</div>
              <div className="text-[11px] text-[var(--text3)]">Report issues or ideas</div>
            </div>
            <MessageSquarePlus className="w-4 h-4 text-amber-500 shrink-0" />
          </button>
        </div>
      </div>

      {/* AI Tutor & BYOK Quick Access */}
      <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[var(--text)]">AI Keys & BYOK Settings</h2>
              <p className="text-xs text-[var(--text2)]">
                Configure your Gemini, Groq, OpenRouter, or DeepSeek API keys ($0 free tiers).
              </p>
            </div>
          </div>

          <Link
            href="/tutor"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-xs font-bold hover:border-primary/40 transition-all shrink-0"
          >
            <span>Open AI Tutor</span>
          </Link>
        </div>
      </div>

      {/* Danger Zone: Reset All Progress with Type-to-Confirm Modal */}
      <div className="p-6 rounded-3xl bg-rose-500/5 border border-rose-500/25 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/15 text-rose-500 flex items-center justify-center border border-rose-500/30">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-rose-600 dark:text-rose-400">Danger Zone: Reset Progress & FSRS Engine</h2>
            <p className="text-xs text-[var(--text2)]">
              Wipe your FSRS memory intervals, question attempt history, daily streaks, custom modules, and notebook entries.
            </p>
          </div>
        </div>

        {!isResetConfirmOpen ? (
          <button
            type="button"
            onClick={() => {
              setIsResetConfirmOpen(true);
              setConfirmInputText("");
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold shadow-xs hover:bg-rose-600 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset All Progress Data</span>
          </button>
        ) : (
          <div className="p-5 rounded-2xl bg-[var(--surface)] border border-rose-500/40 space-y-4 animate-in fade-in">
            <div className="space-y-1">
              <div className="text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Confirm Permanent Progress Reset</span>
              </div>
              <p className="text-xs text-[var(--text2)] leading-relaxed">
                This action will permanently wipe your <strong>FSRS memory stability intervals</strong>, <strong>study streak</strong>, <strong>quiz attempts</strong>, and <strong>local notebook entries</strong>. This cannot be undone unless you have a backup.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm-reset-input" className="block text-xs font-mono text-[var(--text2)]">
                Type <span className="font-bold text-rose-500 select-all">Reset my progress</span> below to confirm:
              </label>
              <input
                id="confirm-reset-input"
                type="text"
                value={confirmInputText}
                onChange={(e) => setConfirmInputText(e.target.value)}
                placeholder="Reset my progress"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-xs text-[var(--text)] placeholder:text-[var(--text3)] focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all font-mono"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                disabled={confirmInputText.trim() !== "Reset my progress"}
                onClick={handleResetAllProgress}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  confirmInputText.trim() === "Reset my progress"
                    ? "bg-rose-600 text-white hover:bg-rose-700 shadow-xs"
                    : "bg-[var(--surface3)] text-[var(--text3)] cursor-not-allowed opacity-50"
                }`}
              >
                Permanently Reset All Data
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsResetConfirmOpen(false);
                  setConfirmInputText("");
                }}
                className="px-3.5 py-2 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-xs text-[var(--text2)] hover:text-[var(--text)] transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Privacy Notice */}
      <div className="p-4 rounded-2xl bg-[var(--surface2)]/60 border border-[var(--border)] text-xs text-[var(--text3)] flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
        <span>
          Marnie Quiz is 100% free and client-side private. API keys and personal notes remain stored solely in your browser.
        </span>
      </div>

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </div>
  );
}
