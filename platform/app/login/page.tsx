"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sparkles, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [devEmail, setDevEmail] = useState("");
  const [devName, setDevName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = () => {
    setLoading(true);
    signIn("google", { callbackUrl: "/quizzes" });
  };

  const handleDevSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!devEmail) return;
    setLoading(true);
    signIn("dev-login", {
      email: devEmail,
      name: devName || devEmail.split("@")[0],
      callbackUrl: "/quizzes",
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 sm:p-8 relative z-10">
      {/* Top bar with theme toggle */}
      <div className="flex justify-between items-center max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2 text-lg font-bold text-[var(--accent)] font-serif">
          <Sparkles className="w-5 h-5 text-[var(--accent)]" />
          <span>Marnie Quiz</span>
        </div>
        <ThemeToggle />
      </div>

      {/* Main login card */}
      <div className="max-w-md w-full mx-auto my-auto py-12">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 sm:p-10 shadow-[var(--shadow-lg)] transition-all">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-[var(--accent)] mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold font-serif text-[var(--text)] tracking-tight">
              Marnie <em>Quiz</em>
            </h1>
            <p className="text-sm text-[var(--text2)] mt-2">
              Board exam review and study set platform for friends.
            </p>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl bg-[var(--surface2)] border border-[var(--border2)] text-[var(--text)] font-semibold text-sm hover:border-[var(--accent)] hover:bg-[var(--surface3)] transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Dev Quick Login Box */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border)]"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[var(--surface)] px-3 text-[var(--text3)] font-mono">
                or local testing
              </span>
            </div>
          </div>

          <form onSubmit={handleDevSignIn} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--text3)] uppercase tracking-wider mb-1.5 font-mono">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="student@marnie.quiz"
                value={devEmail}
                onChange={(e) => setDevEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface2)] border border-[var(--border)] text-sm text-[var(--text)] placeholder-[var(--text3)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text3)] uppercase tracking-wider mb-1.5 font-mono">
                Display Name (Optional)
              </label>
              <input
                type="text"
                placeholder="Alex Morgan"
                value={devName}
                onChange={(e) => setDevName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface2)] border border-[var(--border)] text-sm text-[var(--text)] placeholder-[var(--text3)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !devEmail}
              className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--accent)] text-white font-semibold text-sm hover:brightness-110 transition-all cursor-pointer disabled:opacity-40"
            >
              <span>Sign in Locally</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-[var(--text3)] max-w-5xl mx-auto w-full py-4">
        Permanent $0 non-commercial study tool • Built with Next.js &amp; Drizzle
      </footer>
    </div>
  );
}
