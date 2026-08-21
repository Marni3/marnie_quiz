"use client";

import { useState, useMemo } from "react";
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
  Lightbulb
} from "lucide-react";
import { QuizListItem } from "@/lib/quizzes";
import { FolderWithCount } from "@/lib/folders";

interface LibraryViewProps {
  initialQuizzes: QuizListItem[];
  initialFolders: FolderWithCount[];
  currentUserId: string;
}

export function LibraryView({
  initialQuizzes,
  initialFolders,
  currentUserId,
}: LibraryViewProps) {
  const [quizzes] = useState<QuizListItem[]>(initialQuizzes);
  const [folders, setFolders] = useState<FolderWithCount[]>(initialFolders);
  const [search, setSearch] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [selectedTier, setSelectedTier] = useState<string>("all");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [collapsedTopics, setCollapsedTopics] = useState<Record<string, boolean>>({});
  const [allCollapsed, setAllCollapsed] = useState(true);

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
    const t = q.title.toLowerCase();
    if (t.includes("diagnostic")) return "diagnostic";
    if (t.includes("review")) return "review";
    if (t.includes("drill")) return "drill";
    if (t.includes("simulation")) return "simulation";
    return "review";
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
    const map = new Map<string, QuizListItem[]>();
    filteredQuizzes.forEach((q) => {
      const topic = q.subjectTag || "General Review";
      if (!map.has(topic)) map.set(topic, []);
      map.get(topic)!.push(q);
    });
    return Array.from(map.entries()).map(([name, items]) => ({ name, items }));
  }, [filteredQuizzes]);

  // Tier counts
  const tierCounts = useMemo(() => {
    const counts = { all: quizzes.length, diagnostic: 0, review: 0, drill: 0, simulation: 0 };
    quizzes.forEach((q) => {
      const tier = getQuizTier(q);
      if (counts[tier] !== undefined) counts[tier]++;
    });
    return counts;
  }, [quizzes]);

  const toggleTopic = (topicName: string) => {
    setCollapsedTopics(prev => ({
      ...prev,
      [topicName]: prev[topicName] !== undefined ? !prev[topicName] : !allCollapsed
    }));
  };

  const toggleAll = () => {
    const nextState = !allCollapsed;
    setAllCollapsed(nextState);
    const updated: Record<string, boolean> = {};
    groupedByTopic.forEach(g => {
      updated[g.name] = nextState;
    });
    setCollapsedTopics(updated);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
        
        {/* Top Hero & High-Level Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[var(--border)]">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-[var(--text)] flex items-center gap-3">
              PRC ECE Board Exam <span className="text-[var(--accent)] italic">Review Platform</span>
            </h1>
            <p className="text-[var(--text2)] mt-1.5 text-sm">
              Comprehensive question banks, instant calculator techniques, and 4-tier pedagogical drills.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/quizzes/upload"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface2)] text-[var(--accent)] text-sm font-semibold border border-[var(--border)] transition-all shadow-sm"
            >
              <Upload className="w-4 h-4" />
              Upload Custom CSV
            </Link>
          </div>
        </div>

        {/* Dynamic Metric Stat Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-sm flex flex-col gap-1">
            <span className="text-[11px] font-bold tracking-wider uppercase text-[var(--text3)]">Test Sets</span>
            <span className="text-2xl font-mono font-bold text-[var(--text)]">{quizzes.length} <span className="text-sm font-normal text-[var(--accent)]">sets</span></span>
          </div>
          <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-sm flex flex-col gap-1">
            <span className="text-[11px] font-bold tracking-wider uppercase text-[var(--text3)]">Question Bank</span>
            <span className="text-2xl font-mono font-bold text-[var(--text)]">{totalQuestions.toLocaleString()} <span className="text-sm font-normal text-[var(--accent)]">items</span></span>
          </div>
          <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-sm flex flex-col gap-1">
            <span className="text-[11px] font-bold tracking-wider uppercase text-[var(--text3)]">Core Subjects</span>
            <span className="text-2xl font-mono font-bold text-[var(--text)]">4 <span className="text-sm font-normal text-[var(--accent)]">domains</span></span>
          </div>
          <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-sm flex flex-col gap-1">
            <span className="text-[11px] font-bold tracking-wider uppercase text-[var(--text3)]">Tiers Covered</span>
            <span className="text-2xl font-mono font-bold text-[var(--text)]">4 <span className="text-sm font-normal text-[var(--accent)]">levels</span></span>
          </div>
        </div>

        {/* Pedagogical Study Tiers Guide Accordion */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden transition-all shadow-sm">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="w-full flex items-center justify-between px-5 py-3.5 bg-[var(--surface)] hover:bg-[var(--surface2)] text-left transition-colors"
          >
            <div className="flex items-center gap-2.5 text-sm font-semibold text-[var(--text)]">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>How the 4 Pedagogical Test Levels Work</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-[var(--text3)] transition-transform duration-200 ${showGuide ? "rotate-180" : ""}`} />
          </button>

          {showGuide && (
            <div className="p-5 border-t border-[var(--border)] bg-[var(--surface)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div className="p-3.5 rounded-lg border border-sky-500/20 bg-sky-500/10 flex flex-col gap-1">
                  <span className="text-xs font-bold text-sky-400">🩺 Diagnostic (30 Qs)</span>
                  <p className="text-xs text-[var(--text2)] leading-relaxed">Untimed assessment to diagnose baseline knowledge gaps before reviewing a topic.</p>
                </div>
                <div className="p-3.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 flex flex-col gap-1">
                  <span className="text-xs font-bold text-emerald-400">📖 Review (1:1 Ref)</span>
                  <p className="text-xs text-[var(--text2)] leading-relaxed">1:1 absolute syllabus reference review with complete step-by-step solutions.</p>
                </div>
                <div className="p-3.5 rounded-lg border border-amber-500/20 bg-amber-500/10 flex flex-col gap-1">
                  <span className="text-xs font-bold text-amber-400">⚡ Concept Drill (10 Qs)</span>
                  <p className="text-xs text-[var(--text2)] leading-relaxed">Rapid retrieval testing calculator techniques, speed heuristics, and elimination.</p>
                </div>
                <div className="p-3.5 rounded-lg border border-purple-500/20 bg-purple-500/10 flex flex-col gap-1">
                  <span className="text-xs font-bold text-purple-400">🎯 Simulation (50 Qs)</span>
                  <p className="text-xs text-[var(--text2)] leading-relaxed">Full-scale mock PRC exam under authentic time constraints and complex problems.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search, Prominent Subject Tabs & Tier Filter Bar */}
        <div className="flex flex-col gap-4">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text3)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Quick search by topic, course code (e.g. Elec 03, Math 09, GEAS 06), or title..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all placeholder:text-[var(--text3)] shadow-sm"
            />
          </div>

          {/* Prominent Subject Domain Tabs */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "all", label: "All Subjects", count: quizzes.length },
              { id: "Mathematics", label: "Mathematics", count: quizzes.filter(q => getQuizDomain(q) === "Mathematics").length },
              { id: "Electronics Engineering", label: "Electronics Engineering", count: quizzes.filter(q => getQuizDomain(q) === "Electronics Engineering").length },
              { id: "General Engineering and Applied Sciences", label: "GEAS", count: quizzes.filter(q => getQuizDomain(q) === "General Engineering and Applied Sciences").length },
              { id: "Electronics Systems and Technologies", label: "EST", count: quizzes.filter(q => getQuizDomain(q) === "Electronics Systems and Technologies").length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedDomain(tab.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedDomain === tab.id
                    ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-md scale-[1.02]"
                    : "bg-[var(--surface)] hover:bg-[var(--surface2)] text-[var(--text2)] hover:text-[var(--text)] border-[var(--border)]"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Pedagogical Tier Filter Pills & Expand Toggle */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-wrap">
              {[
                { id: "all", label: "All Tiers", count: tierCounts.all },
                { id: "diagnostic", label: "🩺 Diagnostic (30 Qs)", count: tierCounts.diagnostic },
                { id: "review", label: "📖 Review (1:1)", count: tierCounts.review },
                { id: "drill", label: "⚡ Drill (10 Qs)", count: tierCounts.drill },
                { id: "simulation", label: "🎯 Simulation (50 Qs)", count: tierCounts.simulation },
              ].map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id)}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all border ${
                    selectedTier === tier.id
                      ? "bg-[var(--text)] text-[var(--bg)] border-[var(--text)] font-semibold shadow-sm"
                      : "bg-[var(--surface)] text-[var(--text2)] hover:text-[var(--text)] border-[var(--border)] hover:bg-[var(--surface2)]"
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={toggleAll}
              className="text-xs font-semibold px-3.5 py-1.5 rounded-md border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface2)] text-[var(--text2)] hover:text-[var(--text)] transition-all"
            >
              {allCollapsed ? "Expand All" : "Collapse All"}
            </button>
          </div>
        </div>

        {/* Collapsed Topic Accordions & Quiz Grid */}
        {groupedByTopic.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)]">
            <Search className="w-8 h-8 text-[var(--text3)] mx-auto mb-3 opacity-50" />
            <h3 className="font-serif font-bold text-lg text-[var(--text)]">No test sets match your filter</h3>
            <p className="text-xs text-[var(--text3)] mt-1 max-w-sm mx-auto">
              Try adjusting your search query, or reset the subject domain and tier filters.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {groupedByTopic.map((group) => {
              const isCollapsed = collapsedTopics[group.name] !== undefined ? collapsedTopics[group.name] : allCollapsed;
              const topicTotalQs = group.items.reduce((sum, q) => sum + (q.questionCount || 0), 0);

              return (
                <div key={group.name} className="flex flex-col gap-3">
                  <button
                    onClick={() => toggleTopic(group.name)}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)]/50 hover:bg-[var(--surface2)] text-left transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <ChevronDown className={`w-4 h-4 text-[var(--text3)] transition-transform duration-200 ${isCollapsed ? "-rotate-90" : ""}`} />
                      <span className="font-serif font-bold text-base text-[var(--text)]">{group.name}</span>
                    </div>
                    <span className="text-xs font-mono font-medium text-[var(--text3)]">
                      {group.items.length} sets • {topicTotalQs} Qs
                    </span>
                  </button>

                  {!isCollapsed && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pl-2">
                      {group.items.map((quiz) => {
                        const tier = getQuizTier(quiz);
                        const tierStyles = {
                          diagnostic: "bg-sky-500/10 text-sky-400 border-sky-500/20",
                          review: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                          drill: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                          simulation: "bg-purple-500/10 text-purple-400 border-purple-500/20",
                        }[tier] || "bg-[var(--surface2)] text-[var(--text3)] border-[var(--border)]";

                        const tierLabel = {
                          diagnostic: "🩺 Diagnostic",
                          review: "📖 Review (1:1)",
                          drill: "⚡ Drill",
                          simulation: "🎯 Simulation",
                        }[tier] || "Quiz";

                        return (
                          <Link
                            key={quiz.id}
                            href={`/quizzes/${quiz.id}`}
                            className="group relative flex flex-col justify-between p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--surface2)] transition-all hover:shadow-md hover:-translate-y-0.5"
                          >
                            <div className="flex flex-col gap-3">
                              <div className="flex items-center justify-between gap-2">
                                <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${tierStyles}`}>
                                  {tierLabel}
                                </span>
                                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[var(--surface2)] text-[var(--text2)]">
                                  {quiz.questionCount} Qs
                                </span>
                              </div>

                              <h3 className="font-serif font-bold text-sm text-[var(--text)] leading-snug group-hover:text-[var(--accent)] transition-colors">
                                {quiz.title}
                              </h3>
                            </div>

                            <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--text3)]">
                              <span className="truncate max-w-[170px]">{quiz.subjectTag || "General"}</span>
                              <span className="inline-flex items-center gap-1 font-semibold text-[var(--accent)] group-hover:translate-x-0.5 transition-transform">
                                Start <ChevronRight className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
}
