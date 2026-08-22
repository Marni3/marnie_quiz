import { auth } from "@/lib/auth";
import { getUserTopicSrsOverview } from "@/lib/srs";
import { getUserAnalyticsOverview } from "@/lib/analytics";
import { getUserGamificationData } from "@/lib/gamification";
import { Navbar } from "@/components/navbar";
import { MotivationBanner } from "@/components/motivation-banner";
import Link from "next/link";
import {
  Brain,
  ShieldCheck,
  Clock,
  AlertTriangle,
  Moon,
  EyeOff,
  BarChart2,
  TrendingUp,
  Zap,
  CheckCircle2,
  Flame,
  Award,
  HelpCircle,
  Timer,
  Layers,
  ArrowRight
} from "lucide-react";
import { SUBJECTS, pluralize, METRIC_DEFINITIONS } from "@/lib/constants";

export default async function AnalyticsPage() {
  const session = await auth();
  const userId = session?.user?.id || "00000000-0000-0000-0000-000000000001";

  const [srsOverview, analytics] = await Promise.all([
    getUserTopicSrsOverview(userId),
    getUserAnalyticsOverview(userId),
  ]);

  const gamification = await getUserGamificationData(userId, analytics);
  const subjects = Object.values(analytics.subjectAnalytics);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar breadcrumb="Retention &amp; Performance Matrix" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Motivation Streak Banner */}
        <MotivationBanner data={gamification} />

        {/* Header & Quick Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[var(--text)] tracking-tight">
              Retention &amp; Performance Analytics
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text2)] mt-1">
              Spaced repetition stability, speed efficiency, and board exam readiness tracking.
            </p>
          </div>

          <Link
            href="/quizzes"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent)] text-white text-xs sm:text-sm font-bold shadow-md hover:brightness-110 active:scale-95 transition-all self-start"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Launch 20-Q Refresher Drill</span>
          </Link>
        </div>

        {/* Hero Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* PRC Board Readiness Index */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-[var(--shadow)] relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span
                title={METRIC_DEFINITIONS.readinessIndex}
                className="text-xs font-mono uppercase text-[var(--text3)] flex items-center gap-1 cursor-help"
              >
                <span>Board Readiness Index</span>
                <HelpCircle className="w-3.5 h-3.5" />
              </span>
              <Award className="w-4 h-4 text-[var(--accent)]" />
            </div>
            <div className="text-3xl font-bold font-serif text-[var(--text)]">
              {analytics.readinessIndex}%
            </div>
            <div className="w-full bg-[var(--surface2)] h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-[var(--accent)] h-full transition-all duration-500"
                style={{ width: `${analytics.readinessIndex}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-[var(--text3)] mt-2">
              Composite score: 40% accuracy • 35% retention • 25% syllabus coverage
            </p>
          </div>

          {/* Average Memory Retrievability */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-[var(--shadow)]">
            <div className="flex items-center justify-between mb-2">
              <span
                title={METRIC_DEFINITIONS.retrievability}
                className="text-xs font-mono uppercase text-[var(--text3)] flex items-center gap-1 cursor-help"
              >
                <span>Average Retention</span>
                <HelpCircle className="w-3.5 h-3.5" />
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-3xl font-bold font-serif text-[var(--text)]">
              {srsOverview.totalTrackedTopics > 0 ? `${srsOverview.averageRetention}%` : "—"}
            </div>
            <div className="w-full bg-[var(--surface2)] h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-500"
                style={{ width: `${srsOverview.totalTrackedTopics > 0 ? srsOverview.averageRetention : 0}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-[var(--text3)] mt-2">
              {srsOverview.totalTrackedTopics > 0
                ? `${srsOverview.activeDueCount} topics currently due for review`
                : "Complete quizzes to establish stability"}
            </p>
          </div>

          {/* Overall Solving Speed */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-[var(--shadow)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase text-[var(--text3)] flex items-center gap-1">
                <span>Solving Pace</span>
                <Timer className="w-3.5 h-3.5 text-blue-500" />
              </span>
            </div>
            <div className="text-3xl font-bold font-serif text-[var(--text)]">
              {analytics.totalQuestionsAnswered > 0 ? `${analytics.overallAvgPaceSeconds}s` : "—"}
            </div>
            <p className="text-xs text-[var(--text2)] mt-2">
              Average per question • Target: &lt;60s
            </p>
            <p className="text-[11px] text-[var(--text3)] mt-1 font-mono">
              {pluralize(analytics.totalQuestionsAnswered, "question")} answered total
            </p>
          </div>

          {/* Active Topics & Syllabus Coverage */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-[var(--shadow)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase text-[var(--text3)]">Syllabus Coverage</span>
              <Layers className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-3xl font-bold font-serif text-[var(--text)]">
              {srsOverview.totalTrackedTopics} / 46
            </div>
            <div className="w-full bg-[var(--surface2)] h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-purple-500 h-full transition-all duration-500"
                style={{ width: `${Math.round((srsOverview.totalTrackedTopics / 46) * 100)}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-[var(--text3)] mt-2">
              {Math.round((srsOverview.totalTrackedTopics / 46) * 100)}% of board exam topics tested
            </p>
          </div>
        </div>

        {/* 4 PRC Board Exam Subject Pillars (Fixed Non-Misleading Empty States) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-serif text-[var(--text)]">
              PRC Board Exam Subject Breakdown
            </h2>
            <span className="text-xs text-[var(--text3)] font-mono">
              Official 4-Subject Taxonomy
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjects.map((s) => {
              const hasData = s.totalQuestions > 0 || s.trackedTopics > 0;

              return (
                <div
                  key={s.code}
                  className={`bg-[var(--surface)] border border-[var(--border)] border-l-4 ${s.borderClass} rounded-2xl p-6 shadow-[var(--shadow)] flex flex-col justify-between space-y-4 transition-all`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold uppercase ${s.badgeClass}`}>
                          {s.label}
                        </span>
                        <h3 className="text-base font-bold font-serif text-[var(--text)]">
                          {s.full}
                        </h3>
                      </div>

                      {hasData ? (
                        <span className="text-xs font-mono font-bold text-[var(--accent)]">
                          {s.accuracy}% Accuracy
                        </span>
                      ) : (
                        <span className="text-xs font-mono text-[var(--text3)]">
                          Unassessed
                        </span>
                      )}
                    </div>

                    {/* Progress Bar (Fix #2: 0% when no data) */}
                    <div className="w-full bg-[var(--surface2)] h-2 rounded-full overflow-hidden mt-3">
                      <div
                        className="bg-[var(--accent)] h-full transition-all duration-500"
                        style={{ width: `${hasData ? s.accuracy : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {hasData ? (
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--border)] text-xs">
                      <div>
                        <div className="text-[10px] font-mono uppercase text-[var(--text3)]">Questions</div>
                        <div className="font-bold text-[var(--text)] mt-0.5">
                          {s.correctQuestions} / {s.totalQuestions}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-mono uppercase text-[var(--text3)]">Avg Pace</div>
                        <div className="font-bold text-[var(--text)] mt-0.5">
                          {s.avgSecondsPerQ > 0 ? `${s.avgSecondsPerQ}s / Q` : "—"}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-mono uppercase text-[var(--text3)]">Tracked</div>
                        <div className="font-bold text-[var(--text)] mt-0.5">
                          {s.trackedTopics} / {s.totalTopics} topics
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
                      <span className="text-xs text-[var(--text3)]">
                        No attempts logged in this subject yet.
                      </span>
                      <Link
                        href={`/quizzes`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] hover:underline"
                      >
                        <span>Start Diagnostic</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Question Archetype Mastery Breakdown */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-[var(--shadow)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold font-serif text-[var(--text)]">
                Cognitive Archetype Mastery
              </h2>
              <p className="text-xs text-[var(--text2)] mt-0.5">
                Accuracy breakdown across computational solves, scaling laws, and conceptual reasoning archetypes.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {analytics.archetypeMastery.map((arc) => (
              <div
                key={arc.archetype}
                className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-3.5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--text)] truncate">
                    {arc.label}
                  </span>
                  <span className="text-xs font-mono font-bold text-[var(--accent)] ml-2 shrink-0">
                    {arc.total > 0 ? `${arc.accuracy}%` : "—"}
                  </span>
                </div>

                <div className="w-full bg-[var(--surface3)] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[var(--accent)] h-full transition-all duration-500"
                    style={{ width: `${arc.total > 0 ? arc.accuracy : 0}%` }}
                  ></div>
                </div>

                <div className="text-[11px] text-[var(--text3)] font-mono flex items-center justify-between">
                  <span>{pluralize(arc.total, "question")}</span>
                  <span>{arc.correct} correct</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestone Achievement Badges */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-[var(--shadow)] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-serif text-[var(--text)]">
              Study Achievements &amp; Milestones
            </h2>
            <span className="text-xs font-mono text-[var(--accent)] font-semibold">
              {gamification.badges.filter((b) => b.unlocked).length} / {gamification.badges.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {gamification.badges.map((b) => (
              <div
                key={b.id}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  b.unlocked
                    ? "bg-[var(--surface2)] border-[var(--accent)]/40 shadow-sm"
                    : "bg-[var(--surface2)]/40 border-[var(--border)] opacity-40 grayscale"
                }`}
              >
                <div>
                  <div className="text-2xl mb-2">{b.icon}</div>
                  <h3 className="text-xs font-bold text-[var(--text)]">{b.name}</h3>
                  <p className="text-[11px] text-[var(--text3)] mt-1 line-clamp-2">{b.description}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-[var(--border)] text-[10px] font-mono text-[var(--text2)]">
                  {b.progressText}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
