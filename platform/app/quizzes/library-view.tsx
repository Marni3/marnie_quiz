"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import {
  Search,
  BookOpen,
  Folder as FolderIcon,
  Plus,
  Lock,
  Globe,
  Upload,
  Sparkles,
  Layers,
  ChevronRight,
  ChevronDown,
  FolderPlus,
  Play,
  Clock,
  HelpCircle,
  BarChart2,
  CheckCircle2,
  Zap,
  Target,
  FileText,
  Lightbulb,
  Brain,
  MoreVertical,
  Sliders,
  Moon,
  EyeOff,
  Flame,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";
import { QuizListItem } from "@/lib/quizzes";
import { FolderWithCount } from "@/lib/folders";
import { UserTopicSrs } from "@/lib/db/schema";

interface LibraryViewProps {
  initialQuizzes: QuizListItem[];
  initialFolders: FolderWithCount[];
  initialSrsOverview?: {
    averageRetention: number;
    activeDueCount: number;
    totalTrackedTopics: number;
    topicMap: Record<string, UserTopicSrs & { currentR: number; isDue: boolean }>;
  };
  currentUserId: string;
}

export function LibraryView({
  initialQuizzes,
  initialFolders,
  initialSrsOverview,
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

  const [search, setSearch] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [selectedTier, setSelectedTier] = useState<string>("all");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [collapsedTopics, setCollapsedTopics] = useState<Record<string, boolean>>({});
  const [allCollapsed, setAllCollapsed] = useState(true);

  // SRS Overrides State
  const [activeMenuTopic, setActiveMenuTopic] = useState<string | null>(null);
  const [launchingDrill, setLaunchingDrill] = useState(false);

  // Extract domain from title or subject tag
  const getQuizDomain = (q: QuizListItem) => {
    const t = q.title.toUpperCase();
    if (t.startsWith("MATH") || q.subjectTag?.includes("Math") || q.subjectTag?.includes("Algebra") || q.subjectTag?.includes("Calculus") || q.subjectTag?.includes("Geometry") || q.subjectTag?.includes("Probability")) return "Mathematics";
    if (t.startsWith("ELEC") || q.subjectTag?.includes("Circuit") || q.subjectTag?.includes("BJT") || q.subjectTag?.includes("FET") || q.subjectTag?.includes("Diode") || q.subjectTag?.includes("Electronics")) return "Electronics Engineering";
    if (t.startsWith("GEAS") || q.subjectTag?.includes("Chemistry") || q.subjectTag?.includes("Physics") || q.subjectTag?.includes("Economics") || q.subjectTag?.includes("Mechanics") || q.subjectTag?.includes("Material")) return "General Engineering and Applied Sciences";
    if (t.startsWith("EST") || q.subjectTag?.includes("Communication") || q.subjectTag?.includes("Antenna") || q.subjectTag?.includes("Modulation") || q.subjectTag?.includes("Telephony") || q.subjectTag?.includes("Fiber")) return "Electronics Systems and Technologies";
    return "General";
  };

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
      // Domain filter
      if (selectedDomain !== "all") {
        const domain = getQuizDomain(q);
        if (domain !== selectedDomain) return false;
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
  }, [quizzes, selectedDomain, selectedTier, selectedFolderId, search]);

  // Group by topic
  const groupedByTopic = useMemo(() => {
    const map = new Map<string, { topicCode: string; items: QuizListItem[] }>();
    filteredQuizzes.forEach((q) => {
      const topic = q.subjectTag || "General Review";
      const topicCode = q.topicCode || getTopicCodeFromTitle(q.title);
      if (!map.has(topic)) {
        map.set(topic, { topicCode, items: [] });
      }
      map.get(topic)!.items.push(q);
    });
    return Array.from(map.entries()).map(([name, val]) => ({
      name,
      topicCode: val.topicCode,
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
      if (action === "snooze") payload.days = value || 7;

      const res = await fetch("/api/srs/override", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        // Update local map optimistically
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* SRS Daily Retention Radar Banner */}
        <section className="bg-gradient-to-r from-[var(--surface)] to-[var(--surface2)] border border-[var(--border)] rounded-2xl p-6 sm:p-7 shadow-[var(--shadow-md)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-start gap-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 flex items-center justify-center shrink-0">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold font-serif text-[var(--text)] tracking-tight">
                  Daily Retention Radar
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {srsOverview.averageRetention}% Retrievability
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--text2)] mt-1">
                {srsOverview.activeDueCount > 0 ? (
                  <>
                    <strong className="text-[var(--accent)]">{srsOverview.activeDueCount} topics</strong> are due for spaced recovery before memory decay sets in.
                  </>
                ) : (
                  "All tracked topics are currently in their retention stability window. Great job!"
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto relative z-10">
            <button
              type="button"
              onClick={handleLaunchDailyDrill}
              disabled={launchingDrill}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[var(--accent)] text-white text-xs sm:text-sm font-bold shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{launchingDrill ? "Assembling..." : "Start 20-Q Refresher Drill"}</span>
            </button>

            <Link
              href="/analytics"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-[var(--surface3)] border border-[var(--border)] text-[var(--text2)] text-xs sm:text-sm font-semibold hover:text-[var(--text)] hover:border-[var(--accent)] transition-all"
            >
              <BarChart2 className="w-4 h-4" />
              <span>Retention Matrix</span>
            </Link>
          </div>
        </section>

        {/* Top Header & Search Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[var(--text)] tracking-tight">
              ECE Board Exam Library
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text2)] mt-1">
              190 Comprehensive Review Sets • {totalQuestions} Verified Questions
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleAll}
              className="px-3.5 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs font-semibold text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--surface2)] transition-colors cursor-pointer"
            >
              {allCollapsed ? "Expand All Topics" : "Collapse All Topics"}
            </button>
            <Link
              href="/quizzes/upload"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs font-semibold text-[var(--accent)] hover:bg-[var(--surface2)] transition-colors shadow-sm"
            >
              <Upload className="w-4 h-4" />
              <span>Upload CSV</span>
            </Link>
          </div>
        </div>

        {/* Filter Toolbar */}
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
            <span className="text-xs font-mono text-[var(--text3)] uppercase mr-1">Domain:</span>
            {[
              { id: "all", label: "All Subjects" },
              { id: "Mathematics", label: "Math" },
              { id: "Electronics Engineering", label: "Elecs" },
              { id: "General Engineering and Applied Sciences", label: "GEAS" },
              { id: "Electronics Systems and Technologies", label: "EST" },
            ].map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedDomain(d.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedDomain === d.id
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

        {/* Grouped Topics List */}
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
              const isMenuOpen = activeMenuTopic === group.topicCode;

              return (
                <div
                  key={group.name}
                  className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-visible shadow-[var(--shadow)] transition-all"
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
                        <h2 className="text-base sm:text-lg font-bold font-serif text-[var(--text)] group-hover:text-[var(--accent)] transition-colors truncate">
                          {group.name}
                        </h2>
                        <div className="flex items-center gap-2 text-xs text-[var(--text3)] font-mono mt-0.5">
                          <span>{group.topicCode}</span>
                          <span>•</span>
                          <span>{group.items.length} sets</span>
                          <span>•</span>
                          <span>{group.items.reduce((s, i) => s + (i.questionCount || 0), 0)} questions</span>
                        </div>
                      </div>
                    </button>

                    {/* SRS Status Badge & Controls Menu */}
                    <div className="flex items-center gap-2 shrink-0 relative">
                      {srsInfo ? (
                        srsInfo.status === "suspended" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-zinc-500/10 text-zinc-500 border border-zinc-500/20">
                            <EyeOff className="w-3.5 h-3.5" />
                            Ignored
                          </span>
                        ) : srsInfo.status === "snoozed" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            <Moon className="w-3.5 h-3.5" />
                            Snoozed
                          </span>
                        ) : srsInfo.isDue ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse">
                            <Clock className="w-3.5 h-3.5" />
                            Review Due
                          </span>
                        ) : srsInfo.currentR < 0.6 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Struggling
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Fresh ({Math.round(srsInfo.stabilityDays)}d)
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
                        onClick={() => setActiveMenuTopic(isMenuOpen ? null : group.topicCode)}
                        className="p-1.5 rounded-lg bg-[var(--surface2)] border border-[var(--border)] text-[var(--text3)] hover:text-[var(--text)] hover:border-[var(--accent)] transition-colors cursor-pointer"
                        title="Topic SRS Controls"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {isMenuOpen && (
                        <div className="absolute right-0 top-full mt-2 w-64 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-lg)] p-3 z-50 space-y-2">
                          <div className="text-xs font-bold text-[var(--text)] font-serif pb-1 border-b border-[var(--border)]">
                            {group.name} Controls
                          </div>

                          <div className="space-y-1">
                            <div className="text-[10px] font-mono text-[var(--text3)] uppercase">
                              Manual Confidence
                            </div>
                            <div className="grid grid-cols-2 gap-1">
                              <button
                                type="button"
                                onClick={() => handleSrsAction(group.topicCode, "confidence", "struggling")}
                                className="px-2 py-1 rounded text-xs text-left hover:bg-[var(--surface2)] text-rose-500 font-medium"
                              >
                                🔴 Struggling (1d)
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSrsAction(group.topicCode, "confidence", "moderate")}
                                className="px-2 py-1 rounded text-xs text-left hover:bg-[var(--surface2)] text-amber-500 font-medium"
                              >
                                🟡 Moderate (4d)
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSrsAction(group.topicCode, "confidence", "confident")}
                                className="px-2 py-1 rounded text-xs text-left hover:bg-[var(--surface2)] text-emerald-500 font-medium"
                              >
                                🟢 Confident (10d)
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSrsAction(group.topicCode, "confidence", "mastered")}
                                className="px-2 py-1 rounded text-xs text-left hover:bg-[var(--surface2)] text-purple-500 font-medium"
                              >
                                🏆 Mastered (30d)
                              </button>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-[var(--border)] space-y-1">
                            <button
                              type="button"
                              onClick={() => handleSrsAction(group.topicCode, "snooze", 7)}
                              className="w-full px-2.5 py-1.5 rounded-lg text-xs font-medium text-left text-[var(--text2)] hover:bg-[var(--surface2)] hover:text-[var(--text)] flex items-center gap-2"
                            >
                              <Moon className="w-3.5 h-3.5 text-amber-500" />
                              <span>Snooze for 7 Days</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleSrsAction(group.topicCode, "suspend")}
                              className="w-full px-2.5 py-1.5 rounded-lg text-xs font-medium text-left text-[var(--text2)] hover:bg-[var(--surface2)] hover:text-[var(--text)] flex items-center gap-2"
                            >
                              <EyeOff className="w-3.5 h-3.5 text-zinc-400" />
                              <span>{srsInfo?.status === "suspended" ? "Resume Tracking" : "Ignore / Suspend Topic"}</span>
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
                                  {quiz.questionCount} Qs
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
      </main>
    </div>
  );
}
