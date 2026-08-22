import { auth } from "@/lib/auth";
import { getUserTopicSrsOverview } from "@/lib/srs";
import { Navbar } from "@/components/navbar";
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
  RotateCcw,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

export default async function AnalyticsPage() {
  const session = await auth();
  const userId = session?.user?.id || "00000000-0000-0000-0000-000000000001";

  const overview = await getUserTopicSrsOverview(userId);
  const topics = Object.values(overview.topicMap);

  const domainGroups: Record<string, typeof topics> = {
    Mathematics: [],
    "Electronics Engineering": [],
    "General Engineering and Applied Sciences": [],
    "Electronics Systems and Technologies": [],
  };

  topics.forEach((t) => {
    if (domainGroups[t.subjectDomain]) {
      domainGroups[t.subjectDomain].push(t);
    } else {
      domainGroups.Mathematics.push(t);
    }
  });

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar breadcrumb="Retention & Memory Matrix" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[var(--text)] tracking-tight">
              Spaced Repetition &amp; Memory Matrix
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text2)] mt-1">
              Real-time retrievability tracking across all 46 ECE board exam subtopics.
            </p>
          </div>

          <Link
            href="/quizzes"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent)] text-white text-xs sm:text-sm font-bold shadow-md hover:brightness-110 transition-all self-start"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Launch Daily Refresher</span>
          </Link>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-[var(--shadow)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase text-[var(--text3)]">Average Retention</span>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-3xl font-bold font-serif text-[var(--text)]">
              {overview.averageRetention}%
            </div>
            <p className="text-xs text-[var(--text2)] mt-1">Target stability benchmark: 85%+</p>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-[var(--shadow)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase text-[var(--text3)]">Due for Recovery</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-3xl font-bold font-serif text-[var(--text)]">
              {overview.activeDueCount}
            </div>
            <p className="text-xs text-[var(--text2)] mt-1">Subtopics ready for memory review</p>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-[var(--shadow)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase text-[var(--text3)]">Active Tracked Topics</span>
              <Brain className="w-4 h-4 text-[var(--accent)]" />
            </div>
            <div className="text-3xl font-bold font-serif text-[var(--text)]">
              {overview.totalTrackedTopics} / 46
            </div>
            <p className="text-xs text-[var(--text2)] mt-1">Subtopics in active review queue</p>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-[var(--shadow)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase text-[var(--text3)]">Daily Refresh Model</span>
              <TrendingUp className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-3xl font-bold font-serif text-[var(--text)]">
              20 Qs
            </div>
            <p className="text-xs text-[var(--text2)] mt-1">35% Anchor • 40% Conceptual • 25% Numerical</p>
          </div>
        </div>

        {/* Domain Retention Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(domainGroups).map(([domain, groupTopics]) => {
            const activeDomain = groupTopics.filter((t) => t.status === "active");
            const domainAvg =
              activeDomain.length > 0
                ? Math.round(
                    (activeDomain.reduce((s, t) => s + t.currentR, 0) / activeDomain.length) * 100
                  )
                : 100;

            return (
              <div
                key={domain}
                className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-[var(--shadow)] space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold font-serif text-[var(--text)]">{domain}</h2>
                  <span className="text-sm font-mono font-bold text-[var(--accent)]">
                    {domainAvg}% Retrievability
                  </span>
                </div>

                <div className="w-full bg-[var(--surface2)] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[var(--accent)] h-full transition-all duration-500"
                    style={{ width: `${domainAvg}%` }}
                  ></div>
                </div>

                <div className="divide-y divide-[var(--border)] pt-2">
                  {groupTopics.length === 0 ? (
                    <div className="text-xs text-[var(--text3)] py-4 text-center">
                      No topics tracked yet in this domain. Start taking quizzes to build memory curves!
                    </div>
                  ) : (
                    groupTopics.map((t) => (
                      <div key={t.topicCode} className="py-2.5 flex items-center justify-between gap-4">
                        <div>
                          <div className="text-xs font-bold text-[var(--text)]">
                            {t.topicName} ({t.topicCode})
                          </div>
                          <div className="text-[11px] text-[var(--text3)] font-mono">
                            Stability: {Math.round(t.stabilityDays)} days • Attempts: {t.totalAttempts}
                          </div>
                        </div>

                        <div>
                          {t.status === "suspended" ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-500/10 text-zinc-500 border border-zinc-500/20">
                              Ignored
                            </span>
                          ) : t.status === "snoozed" ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                              Snoozed
                            </span>
                          ) : t.isDue ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                              Due Now
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              {Math.round(t.currentR * 100)}% Fresh
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
