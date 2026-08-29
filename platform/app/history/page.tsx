import { auth } from "@/lib/auth";
import { getUserAttemptsHistory } from "@/lib/attempts";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import {
  History,
  RotateCcw,
  CheckCircle,
  ExternalLink,
  BookOpen,
  Sparkles,
} from "lucide-react";

export default async function HistoryPage() {
  const session = await auth();
  const userId = session?.user?.id || "00000000-0000-0000-0000-000000000001";

  const history = await getUserAttemptsHistory(userId);

  const formatDuration = (sec: number | null) => {
    if (!sec) return "0s";
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (m === 0) return `${s}s`;
    return `${m}m ${s.toString().padStart(2, "0")}s`;
  };

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      <Navbar breadcrumb="Past History" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[var(--text)] tracking-tight">
              Attempt <em>History</em>
            </h1>
            <p className="text-sm text-[var(--text2)] mt-1">
              Review all your previous study attempts and performance across question sets.
            </p>
          </div>

          <Link
            href="/quizzes"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-[var(--text2)] text-xs font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors self-start sm:self-auto"
          >
            <BookOpen className="w-4 h-4" />
            <span>Browse Library</span>
          </Link>
        </div>

        {history.length === 0 ? (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-12 text-center shadow-[var(--shadow)]">
            <div className="w-12 h-12 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] text-[var(--text3)] flex items-center justify-center mx-auto mb-4">
              <History className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-serif text-[var(--text)]">
              No quiz attempts yet
            </h3>
            <p className="text-sm text-[var(--text2)] mt-1.5 max-w-sm mx-auto">
              You haven&apos;t taken any study quizzes yet. Head to the library and start your first practice set!
            </p>
            <Link
              href="/quizzes"
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--accent)] text-white text-xs font-semibold hover:brightness-110 transition-all"
            >
              Browse Available Quizzes →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Mobile Card View (visible on < sm) */}
            <div className="sm:hidden space-y-3">
              {history.map((item) => {
                const score = item.score ?? 0;
                const total = item.totalQuestions || 1;
                const pct = Math.round((score / total) * 100);
                const isCompleted = !!item.completedAt;
                const targetLink = item.isMastery
                  ? `/learn/${item.moduleId}/mastery`
                  : `/quizzes/${item.questionSetId}`;
                const resultLink = item.isMastery
                  ? `/learn/${item.moduleId}/mastery`
                  : `/attempts/${item.id}/results`;

                return (
                  <div
                    key={item.id}
                    className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {item.subjectTag && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[rgba(217,119,87,0.12)] text-[var(--accent)] border border-[rgba(217,119,87,0.25)]">
                              {item.subjectTag}
                            </span>
                          )}
                          {item.isMastery && (
                            <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-bold rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                              Mastery
                            </span>
                          )}
                        </div>
                        <Link
                          href={targetLink}
                          className="font-bold text-sm text-[var(--text)] hover:text-primary transition-colors line-clamp-2"
                        >
                          {item.setTitle}
                        </Link>
                      </div>

                      {isCompleted ? (
                        <div
                          className={`font-bold font-mono text-sm shrink-0 ${
                            pct >= 75
                              ? "text-[var(--green)]"
                              : pct >= 50
                              ? "text-[var(--yellow)]"
                              : "text-[var(--red)]"
                          }`}
                        >
                          {score}/{total} ({pct}%)
                        </div>
                      ) : (
                        <span className="text-[var(--yellow)] text-xs font-mono font-medium shrink-0">
                          In Progress
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[var(--text3)] font-mono pt-2 border-t border-[var(--border)]/60">
                      <span>{new Date(item.startedAt).toLocaleDateString()}</span>
                      <span>⏱️ {formatDuration(item.durationSeconds)}</span>
                    </div>

                    {/* Mobile Action Buttons */}
                    <div className="flex items-center gap-1.5 pt-1">
                      {isCompleted ? (
                        <>
                          <Link
                            href={
                              item.isMastery
                                ? `/tutor?mode=review_exam&moduleId=${item.moduleId}`
                                : `/tutor?mode=review_exam&attemptId=${item.id}`
                            }
                            className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold transition-all"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>AI Debrief</span>
                          </Link>

                          <Link
                            href={resultLink}
                            className="inline-flex items-center justify-center p-2 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-[var(--text2)] text-xs font-semibold hover:text-[var(--text)] transition-all"
                            title="View Score Breakdown"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </Link>
                        </>
                      ) : (
                        <Link
                          href={`/attempts/${item.id}`}
                          className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-primary text-white text-xs font-bold transition-all"
                        >
                          <span>Resume Quiz</span>
                        </Link>
                      )}

                      <Link
                        href={targetLink}
                        className="inline-flex items-center justify-center p-2 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-[var(--text2)] text-xs font-semibold hover:text-[var(--text)] transition-all"
                        title="Retake Quiz"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (visible on >= sm) */}
            <div className="hidden sm:block bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--surface2)] text-[var(--text3)] font-mono text-xs uppercase tracking-wider">
                      <th className="px-6 py-3.5">Quiz Set</th>
                      <th className="px-6 py-3.5">Subject</th>
                      <th className="px-6 py-3.5">Mode</th>
                      <th className="px-6 py-3.5">Score</th>
                      <th className="px-6 py-3.5">Time</th>
                      <th className="px-6 py-3.5">Date</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {history.map((item) => {
                      const score = item.score ?? 0;
                      const total = item.totalQuestions || 1;
                      const pct = Math.round((score / total) * 100);
                      const isCompleted = !!item.completedAt;
                      const targetLink = item.isMastery
                        ? `/learn/${item.moduleId}/mastery`
                        : `/quizzes/${item.questionSetId}`;
                      const resultLink = item.isMastery
                        ? `/learn/${item.moduleId}/mastery`
                        : `/attempts/${item.id}/results`;

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-[var(--surface2)] transition-colors"
                        >
                          <td className="px-6 py-4 font-semibold text-[var(--text)]">
                            <Link
                              href={targetLink}
                              className="hover:text-[var(--accent)] transition-colors inline-flex items-center gap-2"
                            >
                              <span>{item.setTitle}</span>
                              {item.isMastery && (
                                <span className="px-1.5 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                                  Mastery
                                </span>
                              )}
                            </Link>
                          </td>

                          <td className="px-6 py-4">
                            {item.subjectTag ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[rgba(217,119,87,0.12)] text-[var(--accent)] border border-[rgba(217,119,87,0.25)]">
                                {item.subjectTag}
                              </span>
                            ) : (
                              <span className="text-[var(--text3)]">—</span>
                            )}
                          </td>

                          <td className="px-6 py-4 capitalize text-[var(--text2)]">
                            {item.isMastery ? (
                              <span className="text-purple-600 dark:text-purple-400 font-medium">
                                Mastery Challenge
                              </span>
                            ) : (
                              item.mode.replace(/_/g, " ")
                            )}
                          </td>

                          <td className="px-6 py-4">
                            {isCompleted ? (
                              <div className="flex items-center gap-2">
                                <span
                                  className={`font-bold font-mono ${
                                    pct >= 75
                                      ? "text-[var(--green)]"
                                      : pct >= 50
                                      ? "text-[var(--yellow)]"
                                      : "text-[var(--red)]"
                                  }`}
                                >
                                  {score}/{total} ({pct}%)
                                </span>
                              </div>
                            ) : (
                              <span className="text-[var(--yellow)] text-xs font-mono font-medium">
                                In Progress
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-4 font-mono text-[var(--text2)]">
                            {formatDuration(item.durationSeconds)}
                          </td>

                          <td className="px-6 py-4 text-[var(--text3)] text-xs">
                            {new Date(item.startedAt).toLocaleDateString()}
                          </td>

                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {isCompleted ? (
                                <>
                                  <Link
                                    href={
                                      item.isMastery
                                        ? `/tutor?mode=review_exam&moduleId=${item.moduleId}`
                                        : `/tutor?mode=review_exam&attemptId=${item.id}`
                                    }
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary text-xs font-semibold transition-all"
                                    title="Deconstruct missed questions and review with AI Tutor"
                                  >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>AI Debrief</span>
                                  </Link>

                                  <Link
                                    href={resultLink}
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[var(--surface2)] border border-[var(--border)] text-[var(--text2)] hover:text-[var(--text)] text-xs font-semibold transition-all"
                                    title="View Score Breakdown"
                                  >
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    <span>Results</span>
                                  </Link>
                                </>
                              ) : (
                                <Link
                                  href={`/attempts/${item.id}`}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[var(--accent)] text-white text-xs font-semibold hover:brightness-110 transition-all shadow-xs"
                                >
                                  <span>Resume</span>
                                </Link>
                              )}

                              <Link
                                href={targetLink}
                                className="p-1.5 rounded-lg text-[var(--text3)] hover:text-[var(--text)] hover:bg-[var(--surface2)] transition-colors inline-block"
                                title="Retake Quiz"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
