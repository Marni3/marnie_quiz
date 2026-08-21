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
  FolderPlus,
  Play,
  Clock,
  HelpCircle,
  BarChart2,
  CheckCircle2,
  Zap,
  Target,
  FileText
} from "lucide-react";
import { QuizListItem } from "@/lib/quizzes";
import { FolderWithCount } from "@/lib/folders";

interface LibraryViewProps {
  initialQuizzes: QuizListItem[];
  initialFolders: FolderWithCount[];
  currentUserId: string;
}

const DOMAIN_MAP: Record<string, string> = {
  "MATH": "Mathematics",
  "ELEC": "Electronics Engineering",
  "GEAS": "General Engineering and Applied Sciences",
  "EST": "Electronics Systems and Technologies",
};

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

  // Tier counts
  const tierCounts = useMemo(() => {
    const counts = { all: quizzes.length, diagnostic: 0, review: 0, drill: 0, simulation: 0 };
    quizzes.forEach((q) => {
      const tier = getQuizTier(q);
      if (counts[tier] !== undefined) counts[tier]++;
    });
    return counts;
  }, [quizzes]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        
        {/* Top Hero & Real-time Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/40">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-foreground flex items-center gap-3">
              PRC ECE Board Exam <span className="text-primary italic">Platform</span>
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Comprehensive question banks, instant calculator techniques, and diagnostic simulations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/quizzes/upload"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm font-semibold border border-primary/20 transition-all shadow-sm"
            >
              <Upload className="w-4 h-4" />
              Upload Custom CSV
            </Link>
          </div>
        </div>

        {/* Dynamic Metric Stat Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-card border border-border/60 shadow-sm flex flex-col gap-1">
            <span className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground">Total Test Sets</span>
            <span className="text-2xl font-mono font-bold text-foreground">{quizzes.length} <span className="text-sm font-normal text-primary">sets</span></span>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border/60 shadow-sm flex flex-col gap-1">
            <span className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground">Question Bank</span>
            <span className="text-2xl font-mono font-bold text-foreground">{totalQuestions.toLocaleString()} <span className="text-sm font-normal text-primary">items</span></span>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border/60 shadow-sm flex flex-col gap-1">
            <span className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground">Subject Domains</span>
            <span className="text-2xl font-mono font-bold text-foreground">4 <span className="text-sm font-normal text-primary">core areas</span></span>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border/60 shadow-sm flex flex-col gap-1">
            <span className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground">Pedagogical Tiers</span>
            <span className="text-2xl font-mono font-bold text-foreground">4 <span className="text-sm font-normal text-primary">levels</span></span>
          </div>
        </div>

        {/* Search, Domain Tabs & Tier Filter Bar */}
        <div className="flex flex-col gap-4">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by topic, course code (e.g. Elec 03, Math 09, GEAS 06), or title..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border/70 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground"
            />
          </div>

          {/* Subject Domain Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
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
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                  selectedDomain === tab.id
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card hover:bg-accent text-muted-foreground hover:text-foreground border-border/60"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Pedagogical Tier Filter Pills */}
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
                className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all border ${
                  selectedTier === tier.id
                    ? "bg-foreground text-background border-foreground font-semibold"
                    : "bg-card text-muted-foreground hover:text-foreground border-border/50"
                }`}
              >
                {tier.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quiz Cards Grid */}
        {filteredQuizzes.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-xl border border-dashed border-border bg-card/50">
            <Search className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-50" />
            <h3 className="font-serif font-bold text-lg text-foreground">No test sets match your filter</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Try adjusting your search query, or reset the subject domain and tier filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredQuizzes.map((quiz) => {
              const tier = getQuizTier(quiz);
              const tierStyles = {
                diagnostic: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
                review: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
                drill: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
                simulation: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
              }[tier] || "bg-muted text-muted-foreground border-border";

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
                  className="group relative flex flex-col justify-between p-5 rounded-xl bg-card border border-border/70 hover:border-primary/60 transition-all hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${tierStyles}`}>
                        {tierLabel}
                      </span>
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        {quiz.questionCount} Qs
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-base text-foreground leading-snug group-hover:text-primary transition-colors">
                      {quiz.title}
                    </h3>
                  </div>

                  <div className="mt-5 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="truncate max-w-[180px]">{quiz.subjectTag || "General"}</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
                      Take Quiz <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
}
