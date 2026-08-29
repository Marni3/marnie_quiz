"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "./theme-toggle";
import { FeedbackModal } from "./feedback-modal";
import {
  BookOpen,
  History,
  Upload,
  LogOut,
  Sparkles,
  Brain,
  LogIn,
  GraduationCap,
  MessageSquarePlus,
  Compass,
  BookMarked,
  Search,
} from "lucide-react";

export function Navbar({ breadcrumb }: { breadcrumb?: string }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur-md transition-colors bg-[var(--surface)] border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Logo & Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/quizzes"
            aria-label="Marnie Quiz Home"
            title="Marnie Quiz Home"
            className="text-xl font-bold tracking-tight text-[var(--accent)] font-serif hover:opacity-90 flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-5 h-5 text-[var(--accent)]" />
            <span>Marnie Quiz</span>
          </Link>

          {breadcrumb && (
            <div className="hidden sm:flex items-center gap-2 text-xs text-[var(--text3)] min-w-0">
              <span>/</span>
              <span className="truncate font-medium text-[var(--text2)]">
                {breadcrumb}
              </span>
            </div>
          )}
        </div>

        {/* Center: Navigation Links with Title tooltips */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/quizzes"
            aria-label="Library"
            title="Question Library"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              pathname === "/quizzes" || (pathname.startsWith("/quizzes/") && pathname !== "/quizzes/upload")
                ? "bg-[var(--surface2)] text-[var(--accent)] border border-[var(--border)]"
                : "text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--surface2)]"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden xs:inline">Library</span>
          </Link>

          <Link
            href="/learn"
            aria-label="Learning Modules"
            title="Interactive Learning Modules"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              pathname === "/learn" || pathname.startsWith("/learn/")
                ? "bg-[var(--surface2)] text-[var(--accent)] border border-[var(--border)]"
                : "text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--surface2)]"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span className="hidden xs:inline">Modules</span>
          </Link>

          <Link
            href="/tutor"
            aria-label="AI Tutor Workspace"
            title="AI Tutor Workspace (BYOK)"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              pathname === "/tutor" || pathname.startsWith("/tutor/")
                ? "bg-[var(--surface2)] text-[var(--accent)] border border-[var(--border)]"
                : "text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--surface2)]"
            }`}
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="hidden xs:inline">Tutor</span>
          </Link>

          <Link
            href="/notes"
            aria-label="Personal Notebook"
            title="Personal Study Notebook & Vault"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              pathname === "/notes" || pathname.startsWith("/notes/")
                ? "bg-[var(--surface2)] text-[var(--accent)] border border-[var(--border)]"
                : "text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--surface2)]"
            }`}
          >
            <BookMarked className="w-4 h-4" />
            <span className="hidden xs:inline">Notebook</span>
          </Link>

          <Link
            href="/analytics"
            aria-label="Retention Matrix"
            title="Retention & Spaced Repetition Matrix"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              pathname === "/analytics"
                ? "bg-[var(--surface2)] text-[var(--accent)] border border-[var(--border)]"
                : "text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--surface2)]"
            }`}
          >
            <Brain className="w-4 h-4" />
            <span className="hidden xs:inline">Retention</span>
          </Link>

          <Link
            href="/history"
            aria-label="Attempt History"
            title="Attempt History"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              pathname === "/history"
                ? "bg-[var(--surface2)] text-[var(--accent)] border border-[var(--border)]"
                : "text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--surface2)]"
            }`}
          >
            <History className="w-4 h-4" />
            <span className="hidden xs:inline">History</span>
          </Link>

          {/* Secondary Outline Button in Navbar to avoid competing with hero primary CTA */}
          <Link
            href="/quizzes/upload"
            aria-label="Upload CSV"
            title="Upload CSV Test Set"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              pathname === "/quizzes/upload"
                ? "bg-[var(--surface2)] text-[var(--accent)] border border-[var(--accent)]"
                : "bg-[var(--surface2)] border border-[var(--border)] text-[var(--text2)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
            }`}
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Upload CSV</span>
          </Link>
        </nav>

        {/* Right: Search, Tour, Feedback, Theme Toggle & User Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("open-omni-search"))}
            aria-label="Search Topics, Modules & Notes (Press / or ⌘K)"
            title="Global Search (Press / or ⌘K)"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--text2)] hover:text-[var(--accent)] hover:bg-[var(--surface2)] border border-[var(--border)] transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[10px] font-mono text-[var(--text3)]">⌘K</span>
          </button>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("open-onboarding-tour"))}
            aria-label="Open Guided Tour"
            title="Open Guided Tour"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--text2)] hover:text-[var(--accent)] hover:bg-[var(--surface2)] border border-[var(--border)] transition-colors cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span className="hidden md:inline">Tour</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFeedbackOpen(true)}
            aria-label="Report feedback or issue"
            title="Report Feedback or Bug"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--text2)] hover:text-amber-500 hover:bg-[var(--surface2)] border border-[var(--border)] transition-colors cursor-pointer"
          >
            <MessageSquarePlus className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden md:inline">Feedback</span>
          </button>

          <ThemeToggle />

          {session?.user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-[var(--border)]">
              {session.user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="w-7 h-7 rounded-full border border-[var(--border)] object-cover"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[var(--surface3)] border border-[var(--border)] flex items-center justify-center text-xs font-bold text-[var(--accent)]">
                  {session.user.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
              <span className="hidden md:inline text-xs font-medium text-[var(--text2)] max-w-[100px] truncate">
                {session.user.name?.split(" ")[0]}
              </span>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/login" })}
                aria-label="Sign out"
                title="Sign out"
                className="text-[var(--text3)] hover:text-rose-500 p-1 rounded-md transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--accent)] text-white text-xs font-bold shadow-xs hover:brightness-110 active:scale-95 transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </header>
  );
}
