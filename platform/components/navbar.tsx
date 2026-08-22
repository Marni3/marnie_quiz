"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "./theme-toggle";
import { BookOpen, History, Upload, LogOut, Sparkles, Brain, LineChart } from "lucide-react";

export function Navbar({ breadcrumb }: { breadcrumb?: string }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur-md transition-colors bg-[var(--surface)] border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Logo & Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/quizzes"
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

        {/* Center: Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/quizzes"
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
            href="/analytics"
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
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              pathname === "/history"
                ? "bg-[var(--surface2)] text-[var(--accent)] border border-[var(--border)]"
                : "text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--surface2)]"
            }`}
          >
            <History className="w-4 h-4" />
            <span className="hidden xs:inline">History</span>
          </Link>

          <Link
            href="/quizzes/upload"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              pathname === "/quizzes/upload"
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--surface2)] border border-[var(--border)] text-[var(--text2)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload CSV</span>
          </Link>
        </nav>

        {/* Right: Theme Toggle & User Profile */}
        <div className="flex items-center gap-3 shrink-0">
          <ThemeToggle />

          {session?.user && (
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
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-[var(--text3)] hover:text-[var(--red)] p-1 rounded-md transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
