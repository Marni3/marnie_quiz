"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { MotivationBanner } from "@/components/motivation-banner";
import { SkillTreeMap } from "@/components/skill-tree-map";
import {
  Search,
  BookOpen,
  Upload,
  ChevronRight,
  ChevronDown,
  Play,
  Clock,
  BarChart2,
  Zap,
  Brain,
  MoreVertical,
  Moon,
  EyeOff,
  ShieldCheck,
  AlertTriangle,
  GitBranch,
  List
} from "lucide-react";
import { QuizListItem } from "@/lib/quizzes";
import { FolderWithCount } from "@/lib/folders";
import { UserTopicSrs } from "@/lib/db/schema";
import { GamificationData } from "@/lib/gamification";
import { SUBJECTS, getSubjectFromKey, pluralize, METRIC_DEFINITIONS, formatTopicCode } from "@/lib/constants";

interface LibraryViewProps {
  initialQuizzes: QuizListItem[];
  initialFolders: FolderWithCount[];
  initialSrsOverview?: {
    averageRetention: number;
    activeDueCount: number;
    totalTrackedTopics: number;
    topicMap: Record<string, UserTopicSrs & { currentR: number; isDue: boolean }>;
  };
  gamificationData?: GamificationData;
  currentUserId: string;
}

export function LibraryView({
  initialQuizzes,
  initialFolders,
  initialSrsOverview,
  gamificationData,
  currentUserId,
}: LibraryViewProps) {
  const router = useRouter();
  const [quizzes] = useState<QuizListItem[]>(initialQuizzes);
  const [folders, setFolders] = useState<FolderWithCount[]>(initialFolders);
  const [srsOverview, setSrsOverview] = useState(
    initialSrsOverview || {
      averageRetention: 100,
      activeDueCount: 0,
      totalTrackedTopics: 0,
      topicMap: {},
    }
  );

  // View Mode: 'list' vs 'tree'
  const [viewMode, setViewMode] = useState<"list" | "tree">("list");

  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedTier, setSelectedTier] = useState<string>("all");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [collapsedTopics, setCollapsedTopics] = useState<Record<string, boolean>>({});
  const [allCollapsed, setAllCollapsed] = useState(true);

  // SRS Overrides State
  const [activeMenuTopic, setActiveMenuTopic] = useState<string | null>(null);
  const [launchingDrill, setLaunchingDrill] = useState(false);

  const getQuizTier = (q: QuizListItem) => {
    if (q.tier) return q.tier.toLowerCase();
    const t = q.title.toLowerCase();
    if (t.includes("diagnostic")) return "diagnostic";
    if (t.includes("review")) return "review";
    if (t.includes("drill")) return "drill";
    if (t.includes("simulation")) return "simulation";
    return "review";
  };

  const getTopicCodeFromTitle = (title: string): string => {
    const m = title.match(/^([A-Za-z]+)\s*(\d+)/);
    return m ? `${m[1].toUpperCase()}-${String(Number(m[2])).padStart(2, "0")}` : "GEN-01";
  };

  const totalQuestions = useMemo(() => {
    return quizzes.reduce((sum, q) => sum + (q.questionCount || 0), 0);
  }, [quizzes]);

  // Filter quizzes
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((q) => {
      // Subject filter
      if (selectedSubject !== "all") {
        const subj = getSubjectFromKey(q.topicCode || q.subjectTag || q.title);
        if (subj.code !== selectedSubject) return false;
      }

      // Tier filter
      if (selectedTier !== "all") {
        const tier = getQuizTier(q);
        if (tier !== selectedTier) return false;
      }

      // Folder filter
      if (selectedFolderId === "unfiled") {
        if (q.folderId) return false;
      } else if (selectedFolderId) {
        if (q.folderId !== selectedFolderId) return false;
      }

      // Search filter
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchTitle = q.title.toLowerCase().includes(query);
        const matchSubject = q.subjectTag?.toLowerCase().includes(query);
        if (!matchTitle && !matchSubject) return false;
      }

      return true;
    });
  }, [quizzes, selectedSubject, selectedTier, selectedFolderId, search]);

  // Group by topic with subject metadata
  const groupedByTopic = useMemo(() => {
    const map = new Map<string, { topicCode: string; subject: any; items: QuizListItem[] }>();
    filteredQuizzes.forEach((q) => {
      const topic = q.subjectTag || "General Review";
      const topicCode = q.topicCode || getTopicCodeFromTitle(q.title);
      const subject = getSubjectFromKey(topicCode);
      if (!map.has(topic)) {
        map.set(topic, { topicCode, subject, items: [] });
      }
      map.get(topic)!.items.push(q);
    });
    return Array.from(map.entries()).map(([name, val]) => ({
      name,
      topicCode: val.topicCode,
      subject: val.subject,
      items: val.items,
    }));
  }, [filteredQuizzes]);

  // Toggle Collapse
  const toggleTopic = (topicName: string) => {
    setCollapsedTopics((prev) => ({
      ...prev,
      [topicName]: prev[topicName] !== undefined ? !prev[topicName] : !allCollapsed,
    }));
  };

  const isTopicCollapsed = (topicName: string) => {
    return collapsedTopics[topicName] !== undefined ? collapsedTopics[topicName] : allCollapsed;
  };

  const toggleAll = () => {
    const nextState = !allCollapsed;
    setAllCollapsed(nextState);
    const newMap: Record<string, boolean> = {};
    groupedByTopic.forEach((g) => {
      newMap[g.name] = nextState;
    });
    setCollapsedTopics(newMap);
  };

  // Launch 20-Q Refresher Drill
  const handleLaunchDailyDrill = async () => {
    setLaunchingDrill(true);
    try {
      const res = await fetch("/api/srs/daily-drill", {
        method: "POST",
      });
      const data = await res.json();
      if (data.success && data.attemptId) {
        router.push(`/attempts/${data.attemptId}`);
      } else {
        alert(data.error || "Failed to assemble daily drill.");
        setLaunchingDrill(false);
      }
    } catch {
      alert("Network error launching daily drill.");
      setLaunchingDrill(false);
    }
  };

  // Handle SRS Topic Overrides
  const handleSrsAction = async (topicCode: string, action: string, value?: string | number) => {
    try {
      const payload: any = { topicCode, action };
      if (action === "confidence") payload.confidence = value;
      if (action === "snooze") payload.days = typeof value === "number" ? value : 1;

      const res = await fetch("/api/srs/override", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setSrsOverview((prev) => {
          const current = prev.topicMap[topicCode];
          if (!current) return prev;
          let newStatus = current.status;
          if (action === "suspend") newStatus = data.status || "suspended";
          if (action === "snooze") newStatus = "snoozed";
          return {
            ...prev,
            topicMap: {
              ...prev.topicMap,
              [topicCode]: {
                ...current,
                status: newStatus,
                isDue: false,
              },
            },
          };
        });
        setActiveMenuTopic(null);
      }
    } catch {
      alert("Failed to update topic override.");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Gamification Motivation Banner */}
        {gamificationData && <MotivationBanner data={gamificationData} />}

        {/* SRS Daily Retention Radar Hero Banner (Single Primary CTA on Page) */}
        <section className="bg-gradient-to-r from-[var(--surface)] via-[var(--surface2)] to-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 sm:p-7 shadow-[var(--shadow-md)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-start gap-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 flex items-center justify-center shrink-0">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold font-serif text-[var(--text)] tracking-tight">
                  Daily Retention Radar
                </h2>
                <span
                  title={METRIC_DEFINITIONS.retrievability}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 cursor-help"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {srsOverview.averageRetention}% Retrievability
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--text2)] mt-1">
                {srsOverview.activeDueCount > 0 ? (
                  <>
                    <strong className="text-[var(--accent)]">{pluralize(srsOverview.activeDueCount, "topic")}</strong> due for spaced recovery before forgetting sets in.
                  </>
                ) : (
                  "All tracked topics are currently in their retention stability window. Great job!"
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto relative z-10">
            {/* Primary Action Button */}
            <button
              type="button"
              onClick={handleLaunchDailyDrill}
              disabled={launchingDrill}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[var(--accent)] text-white text-xs sm:text-sm font-bold shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{launchingDrill ? "Assembling..." : "Start 20-Q Refresher Drill"}</span>
            </button>

            {/* Secondary Action Button */}
            <Link
              href="/analytics"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text2)] text-xs sm:text-sm font-semibold hover:text-[var(--text)] hover:bg-[var(--surface2)] transition-all"
            >
              <BarChart2 className="w-4 h-4" />
              <span>Retention Matrix</span>
            </Link>
          </div>
        </section>

        {/* Header Bar with Dual View Switcher (Library List vs Skill Tree Map) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[var(--text)] tracking-tight">
              ECE Board Exam Library
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text2)] mt-1">
              190 Comprehensive Review Sets • {pluralize(totalQuestions, "Verified Question")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Dual View Mode Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === "list"
                    ? "bg-[var(--surface2)] text-[var(--accent)] shadow-xs border border-[var(--border)]"
                    : "text-[var(--text3)] hover:text-[var(--text)]"
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>List View</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("tree")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === "tree"
                    ? "bg-[var(--surface2)] text-[var(--accent)] shadow-xs border border-[var(--border)]"
                    : "text-[var(--text3)] hover:text-[var(--text)]"
                }`}
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>Skill Tree</span>
              </button>
            </div>

            {viewMode === "list" && (
              <button
                type="button"
                onClick={toggleAll}
                className="px-3.5 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs font-semibold text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--surface2)] transition-colors cursor-pointer"
              >
                {allCollapsed ? "Expand All Topics" : "Collapse All Topics"}
              </button>
            )}

            {/* Secondary Outline Upload Button */}
            <Link
              href="/quizzes/upload"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs font-semibold text-[var(--text2)] hover:text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[var(--surface2)] transition-colors shadow-sm"
            >
              <Upload className="w-4 h-4" />
              <span>Upload CSV</span>
            </Link>
          </div>
        </div>

        {/* Dynamic Content: Skill Tree Map or Classic Accordion List */}
        {viewMode === "tree" ? (
          <SkillTreeMap quizzes={quizzes} topicMap={srsOverview.topicMap} />
        ) : (
          <>
            {/* Filter Toolbar with Standardized PRC Subject Taxonomy */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 sm:p-5 shadow-[var(--shadow)] space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text3)]" />
                <input
                  type="text"
                  placeholder="Search by topic, formula, or keyword (e.g. Diode, Fourier, RLC, Shannon)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-sm text-[var(--text)] placeholder-[var(--text3)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[var(--border)]">
                <span className="text-xs font-mono text-[var(--text3)] uppercase mr-1">Subject:</span>
                {[
                  { id: "all", label: "All Subjects" },
                  { id: "MATH", label: "MATH" },
                  { id: "ELECS", label: "ELECS" },
                  { id: "GEAS", label: "GEAS" },
                  { id: "EST", label: "EST" },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setSelectedSubject(d.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      selectedSubject === d.id
                        ? "bg-[var(--accent)] text-white shadow-sm"
                        : "bg-[var(--surface2)] text-[var(--text2)] hover:text-[var(--text)] border border-[var(--border)]"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}

                <div className="h-4 w-px bg-[var(--border)] mx-1 hidden sm:block"></div>

                <span className="text-xs font-mono text-[var(--text3)] uppercase mr-1">Tier:</span>
                {[
                  { id: "all", label: "All Tiers" },
                  { id: "diagnostic", label: "Diagnostic (30Q)" },
                  { id: "review", label: "Review (25Q)" },
                  { id: "drill", label: "Drill (10Q)" },
                  { id: "simulation", label: "Simulation (50Q)" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTier(t.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      selectedTier === t.id
                        ? "bg-[var(--accent)] text-white shadow-sm"
                        : "bg-[var(--surface2)] text-[var(--text2)] hover:text-[var(--text)] border border-[var(--border)]"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grouped Topics List with Color-Coded Subject Accents */}
            <div className="space-y-4">
              {groupedByTopic.length === 0 ? (
                <div className="text-center py-16 bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
                  <BookOpen className="w-8 h-8 text-[var(--text3)] mx-auto mb-2" />
                  <h3 className="text-base font-semibold text-[var(--text)]">No question sets found</h3>
                  <p className="text-xs text-[var(--text3)] mt-1">Try clearing your search query or filters.</p>
                </div>
              ) : (
                groupedByTopic.map((group) => {
                  const isCollapsed = isTopicCollapsed(group.name);
                  const srsInfo = srsOverview.topicMap[group.topicCode];
                  const isMenuOpen = activeMenuTopic === group.name;
                  const subjectConfig = group.subject;

                  return (
                    <div
                      key={group.name}
                      className={`bg-[var(--surface)] border border-[var(--border)] border-l-4 ${subjectConfig.borderClass} rounded-2xl overflow-visible shadow-[var(--shadow)] transition-all`}
                    >
                      {/* Topic Header Accordion */}
                      <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
                        <button
                          type="button"
                          onClick={() => toggleTopic(group.name)}
                          className="flex-1 flex items-center gap-3 text-left cursor-pointer select-none group min-w-0"
                        >
                          <div className="w-7 h-7 rounded-lg bg-[var(--surface2)] border border-[var(--border)] flex items-center justify-center text-[var(--text2)] group-hover:text-[var(--accent)] group-hover:border-[var(--accent)] transition-colors shrink-0">
                            {isCollapsed ? (
                              <ChevronRight className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.2 rounded text-[10px] font-mono font-bold uppercase ${subjectConfig.badgeClass}`}>
                                {subjectConfig.label}
                              </span>
                              <h2 className="text-base sm:text-lg font-bold font-serif text-[var(--text)] group-hover:text-[var(--accent)] transition-colors truncate">
                                {group.name}
                              </h2>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[var(--text3)] font-mono mt-0.5">
                              <span>{formatTopicCode(group.topicCode)}</span>
                              <span>•</span>
                              <span>{pluralize(group.items.length, "set")}</span>
                              <span>•</span>
                              <span>{pluralize(group.items.reduce((s, i) => s + (i.questionCount || 0), 0), "question")}</span>
                            </div>
                          </div>
                        </button>

                        {/* SRS Status Badge with Tooltips */}
                        <div className="flex items-center gap-2 shrink-0 relative">
                          {srsInfo ? (
                            srsInfo.status === "suspended" ? (
                              <span
                                title="Topic excluded from automated daily review queues"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-zinc-500/10 text-zinc-500 border border-zinc-500/20 cursor-help"
                              >
                                <EyeOff className="w-3.5 h-3.5" />
                                Ignored
                              </span>
                            ) : srsInfo.status === "snoozed" ? (
                              <span
                                title="Topic snoozed from daily review"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 cursor-help"
                              >
                                <Moon className="w-3.5 h-3.5" />
                                Snoozed
                              </span>
                            ) : srsInfo.isDue ? (
                              <span
                                title={METRIC_DEFINITIONS.reviewDue}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse cursor-help"
                              >
                                <Clock className="w-3.5 h-3.5" />
                                Review Due
                              </span>
                            ) : srsInfo.currentR < 0.6 ? (
                              <span
                                title={METRIC_DEFINITIONS.struggling}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 cursor-help"
                              >
                                <AlertTriangle className="w-3.5 h-3.5" />
                                Struggling
                              </span>
                            ) : (
                              <span
                                title={`${METRIC_DEFINITIONS.fresh} (Estimated Stability: ${pluralize(Math.round(srsInfo.stabilityDays), "day")})`}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 cursor-help"
                              >
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Fresh ({pluralize(Math.round(srsInfo.stabilityDays), "day")})
                              </span>
                            )
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-[var(--surface2)] text-[var(--text3)] border border-[var(--border)]">
                              Unstudied
                            </span>
                          )}

                          {/* Options Button */}
                          <button
                            type="button"
                            onClick={() => setActiveMenuTopic(isMenuOpen ? null : group.name)}
                            className="p-1.5 rounded-lg bg-[var(--surface2)] border border-[var(--border)] text-[var(--text3)] hover:text-[var(--text)] hover:border-[var(--accent)] transition-colors cursor-pointer"
                            title="Topic SRS Controls"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* Sleek, Clean, Modern Context Popover */}
                          {isMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-lg)] p-2.5 z-50 space-y-2.5 animate-in fade-in">
                              <div className="text-[11px] font-semibold text-[var(--text)] truncate px-1">
                                {group.name}
                              </div>

                              {/* Confidence Presets */}
                              <div className="space-y-1">
                                <div className="text-[10px] font-mono uppercase text-[var(--text3)] px-1">
                                  Set Confidence
                                </div>
                                <div className="grid grid-cols-4 gap-1 p-0.5 rounded-lg bg-[var(--surface2)] border border-[var(--border)]">
                                  <button
                                    type="button"
                                    onClick={() => handleSrsAction(group.topicCode, "confidence", "struggling")}
                                    className="py-1 text-[11px] font-mono text-center rounded hover:bg-[var(--surface3)] text-rose-500 font-bold transition-colors cursor-pointer"
                                    title="Struggling (Review in 1 day)"
                                  >
                                    1d
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleSrsAction(group.topicCode, "confidence", "moderate")}
                                    className="py-1 text-[11px] font-mono text-center rounded hover:bg-[var(--surface3)] text-amber-500 font-bold transition-colors cursor-pointer"
                                    title="Moderate (Review in 4 days)"
                                  >
                                    4d
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleSrsAction(group.topicCode, "confidence", "confident")}
                                    className="py-1 text-[11px] font-mono text-center rounded hover:bg-[var(--surface3)] text-emerald-500 font-bold transition-colors cursor-pointer"
                                    title="Confident (Review in 10 days)"
                                  >
                                    10d
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleSrsAction(group.topicCode, "confidence", "mastered")}
                                    className="py-1 text-[11px] font-mono text-center rounded hover:bg-[var(--surface3)] text-purple-500 font-bold transition-colors cursor-pointer"
                                    title="Mastered (Review in 30 days)"
                                  >
                                    30d
                                  </button>
                                </div>
                              </div>

                              {/* Snooze Presets */}
                              <div className="space-y-1">
                                <div className="text-[10px] font-mono uppercase text-[var(--text3)] px-1 flex items-center justify-between">
                                  <span>Snooze</span>
                                  <span className="text-[9px] text-[var(--text3)]">Defer review</span>
                                </div>
                                <div className="grid grid-cols-3 gap-1 p-0.5 rounded-lg bg-[var(--surface2)] border border-[var(--border)]">
                                  <button
                                    type="button"
                                    onClick={() => handleSrsAction(group.topicCode, "snooze", 1)}
                                    className="py-1 text-[11px] font-mono text-center rounded hover:bg-[var(--surface3)] text-[var(--text2)] hover:text-[var(--text)] font-semibold transition-colors cursor-pointer"
                                    title="Snooze until tomorrow"
                                  >
                                    1 Day
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleSrsAction(group.topicCode, "snooze", 3)}
                                    className="py-1 text-[11px] font-mono text-center rounded hover:bg-[var(--surface3)] text-[var(--text2)] hover:text-[var(--text)] font-semibold transition-colors cursor-pointer"
                                    title="Snooze for 3 days"
                                  >
                                    3 Days
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleSrsAction(group.topicCode, "snooze", 7)}
                                    className="py-1 text-[11px] font-mono text-center rounded hover:bg-[var(--surface3)] text-[var(--text2)] hover:text-[var(--text)] font-semibold transition-colors cursor-pointer"
                                    title="Snooze for 7 days"
                                  >
                                    7 Days
                                  </button>
                                </div>
                              </div>

                              {/* Suspend Toggle */}
                              <div className="pt-1.5 border-t border-[var(--border)]">
                                <button
                                  type="button"
                                  onClick={() => handleSrsAction(group.topicCode, "suspend")}
                                  className="w-full px-2 py-1.5 rounded-lg text-xs font-medium text-left text-[var(--text2)] hover:bg-[var(--surface2)] hover:text-[var(--text)] flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                  <EyeOff className="w-3.5 h-3.5 text-[var(--text3)]" />
                                  <span>{srsInfo?.status === "suspended" ? "Resume Topic" : "Ignore Topic"}</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Expanded Quiz Cards */}
                      {!isCollapsed && (
                        <div className="p-4 sm:p-5 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 border-t border-[var(--border)]">
                          {group.items.map((quiz) => {
                            const tier = getQuizTier(quiz);
                            return (
                              <Link
                                key={quiz.id}
                                href={`/quizzes/${quiz.id}`}
                                className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-4 hover:border-[var(--accent)] hover:shadow-sm transition-all flex flex-col justify-between group/card"
                              >
                                <div>
                                  <div className="flex items-center justify-between gap-2 mb-2">
                                    <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase tracking-wider ${
                                      tier === "diagnostic"
                                        ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                                        : tier === "drill"
                                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                        : tier === "simulation"
                                        ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                                        : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                                    }`}>
                                      {tier}
                                    </span>
                                    <span className="text-xs font-mono text-[var(--text3)]">
                                      {pluralize(quiz.questionCount || 0, "Q")}
                                    </span>
                                  </div>

                                  <h3 className="text-sm font-semibold text-[var(--text)] group-hover/card:text-[var(--accent)] transition-colors line-clamp-2">
                                    {quiz.title}
                                  </h3>
                                </div>

                                <div className="mt-4 pt-2 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--text3)]">
                                  <span>Take Quiz →</span>
                                  <Play className="w-3.5 h-3.5 fill-current text-[var(--accent)]" />
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
