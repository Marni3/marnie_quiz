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
  ArrowRight,
  Sparkles,
  Compass,
  BookOpen,
} from "lucide-react";
import { LaunchDrillButton } from "@/components/launch-drill-button";
import { SUBJECTS, pluralize, METRIC_DEFINITIONS, TOTAL_SYLLABUS_QUESTIONS, TOTAL_SYLLABUS_TOPICS } from "@/lib/constants";

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

          <LaunchDrillButton />
        </div>

        {/* Hero Metrics Grid with Honest Calibration States (Dense 2x2 on mobile) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* PRC Board Readiness Index */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-3.5 sm:p-5 shadow-[var(--shadow)] relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span
                  title={METRIC_DEFINITIONS.readinessIndex}
                  className="text-xs font-mono uppercase text-[var(--text3)] flex items-center gap-1 cursor-help"
                >
                  <span>Board Readiness</span>
                  <HelpCircle className="w-3.5 h-3.5" />
                </span>
                <Award className="w-4 h-4 text-[var(--accent)]" />
              </div>

              {analytics.isCalibrated ? (
                <div>
                  <div className="text-3xl font-bold font-serif text-[var(--text)]">
                    {analytics.readinessIndex}%
                  </div>
                  <div className="w-full bg-[var(--surface2)] h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className="bg-[var(--accent)] h-full transition-all duration-500"
                      style={{ width: `${analytics.readinessIndex}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-lg font-bold font-serif text-[var(--accent)]">
                    Calibrating Baseline
                  </div>
                  <div className="w-full bg-[var(--surface2)] h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className="bg-[var(--accent)] h-full transition-all duration-500"
                      style={{ width: `${(analytics.calibrationProgress / 3) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <p className="text-[11px] text-[var(--text3)] mt-3">
              {analytics.isCalibrated
                ? `Factors accuracy, retention, and syllabus coverage across ${TOTAL_SYLLABUS_TOPICS} topics`
                : `Complete ${3 - analytics.calibrationProgress} more test sets across subjects to establish baseline`}
            </p>
          </div>

          {/* Average Memory Retrievability */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-3.5 sm:p-5 shadow-[var(--shadow)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span
                  title={METRIC_DEFINITIONS.retrievability}
                  className="text-[10px] sm:text-xs font-mono uppercase text-[var(--text3)] flex items-center gap-1 cursor-help truncate"
                >
                  <span>Retention</span>
                  <HelpCircle className="w-3 h-3" />
                </span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              </div>

              {srsOverview.totalTrackedTopics >= 3 ? (
                <div>
                  <div className="text-2xl sm:text-3xl font-bold font-serif text-[var(--text)]">
                    {srsOverview.averageRetention}%
                  </div>
                  <div className="w-full bg-[var(--surface2)] h-1.5 rounded-full mt-2 sm:mt-3 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-500"
                      style={{ width: `${srsOverview.averageRetention}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-base sm:text-lg font-bold font-serif text-emerald-600 dark:text-emerald-400">
                    {srsOverview.totalTrackedTopics > 0 ? "Initial Sample" : "No Data"}
                  </div>
                  <div className="w-full bg-[var(--surface2)] h-1.5 rounded-full mt-2 sm:mt-3 overflow-hidden">
                    <div
                      className="bg-emerald-500/50 h-full transition-all duration-500"
                      style={{ width: `${(srsOverview.totalTrackedTopics / 3) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <p className="text-[10px] sm:text-[11px] text-[var(--text3)] mt-2 sm:mt-3 leading-tight">
              {srsOverview.totalTrackedTopics >= 3
                ? `${srsOverview.activeDueCount} due for review`
                : `${srsOverview.totalTrackedTopics}/3 topics studied`}
            </p>
          </div>

          {/* Overall Solving Speed */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-3.5 sm:p-5 shadow-[var(--shadow)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] sm:text-xs font-mono uppercase text-[var(--text3)] flex items-center gap-1">
                  <span>Pace</span>
                  <Timer className="w-3 h-3 text-blue-500 shrink-0" />
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-serif text-[var(--text)]">
                {analytics.totalQuestionsAnswered > 0 ? `${analytics.overallAvgPaceSeconds}s` : "—"}
              </div>
            </div>

            <div>
              <p className="text-[10px] sm:text-xs text-[var(--text2)] mt-1.5 sm:mt-2">
                Target: &lt;60s/item
              </p>
              <p className="text-[10px] sm:text-[11px] text-[var(--text3)] mt-0.5 font-mono truncate">
                {pluralize(analytics.totalQuestionsAnswered, "Q")} total
              </p>
            </div>
          </div>

          {/* Global Syllabus & Learning Coverage */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-3.5 sm:p-5 shadow-[var(--shadow)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] sm:text-xs font-mono uppercase text-[var(--text3)] truncate">Syllabus</span>
                <Layers className="w-3.5 h-3.5 text-purple-500 shrink-0" />
              </div>
              <div className="text-xl sm:text-3xl font-bold font-serif text-[var(--text)] truncate">
                {analytics.totalUniqueQuestionsAnswered} / {TOTAL_SYLLABUS_QUESTIONS.toLocaleString()}
              </div>
              <div className="w-full bg-[var(--surface2)] h-1.5 rounded-full mt-2 sm:mt-3 overflow-hidden">
                <div
                  className="bg-purple-500 h-full transition-all duration-500"
                  style={{ width: `${Math.max(1, Math.round((analytics.totalUniqueQuestionsAnswered / TOTAL_SYLLABUS_QUESTIONS) * 100))}%` }}
                ></div>
              </div>
            </div>

            <div className="pt-2.5 border-t border-[var(--border)]/60 space-y-1 text-[11px] text-[var(--text3)] mt-3">
              <div className="flex items-center justify-between">
                <span>Subtopics Tested:</span>
                <span className="font-mono font-semibold text-[var(--text)]">{srsOverview.totalTrackedTopics} / {TOTAL_SYLLABUS_TOPICS}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-purple-500" />
                  <span>Module Lessons:</span>
                </span>
                <span className="font-mono font-semibold text-purple-600 dark:text-purple-400">
                  {analytics.totalModulesCompleted} / {analytics.totalModulesAvailable} ({analytics.globalModulePercent}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 PRC Board Exam Subject Pillars with Real Syllabus Totals */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold font-serif text-[var(--text)]">
                PRC Board Exam Subject Breakdown
              </h2>
              <p className="text-xs text-[var(--text2)] mt-0.5">
                Progress and accuracy benchmarked against the full {TOTAL_SYLLABUS_QUESTIONS.toLocaleString()}-question board curriculum.
              </p>
            </div>
            <span className="text-xs text-[var(--text3)] font-mono">
              Official 4-Subject Taxonomy
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjects.map((s) => {
              const hasData = s.uniqueQuestionsAttempted > 0;

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

                    {/* Dual Progress Bars: 1. Questions Practice & 2. Theory Modules */}
                    <div className="space-y-3 mt-3">
                      {/* Questions Practice Bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text3)]">
                          <span className="font-semibold text-[var(--text)]">Practice Questions</span>
                          <span>{s.uniqueQuestionsAttempted} / {s.totalSyllabusQuestions.toLocaleString()} ({s.syllabusPercent}%)</span>
                        </div>
                        <div className="w-full bg-[var(--surface2)] h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[var(--accent)] h-full transition-all duration-500 rounded-full"
                            style={{ width: `${Math.max(hasData ? 1 : 0, s.syllabusPercent)}%` }}
                          />
                        </div>
                      </div>

                      {/* Theory Learning Modules Bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text3)]">
                          <span className="flex items-center gap-1 font-semibold text-[var(--text)]">
                            <BookOpen className="w-3.5 h-3.5 text-purple-500" />
                            <span>Theory Lessons</span>
                          </span>
                          <span className="text-purple-600 dark:text-purple-400 font-semibold">
                            {s.completedModules} / {s.totalModules} modules ({s.moduleCompletionPercent}%)
                          </span>
                        </div>
                        <div className="w-full bg-[var(--surface2)] h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-purple-500 h-full transition-all duration-500 rounded-full"
                            style={{ width: `${Math.max(s.completedModules > 0 ? 3 : 0, s.moduleCompletionPercent)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {hasData ? (
                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[var(--border)] text-xs">
                      <div>
                        <div className="text-[10px] font-mono uppercase text-[var(--text3)]">Attempts</div>
                        <div className="font-bold text-[var(--text)] mt-0.5">
                          {s.totalAttempts} tests ({s.correctQuestions} correct)
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-mono uppercase text-[var(--text3)]">Avg Pace</div>
                        <div className="font-bold text-[var(--text)] mt-0.5">
                          {s.avgSecondsPerQ > 0 ? `${s.avgSecondsPerQ}s / Q` : "—"}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-mono uppercase text-[var(--text3)]">Retention</div>
                        <div className="font-bold text-[var(--text)] mt-0.5">
                          {s.retrievability > 0 ? `${s.retrievability}% Fresh` : "Establishing"}
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
