"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { LearningModuleSummary } from "@/lib/modules";
import { UserModuleProgress } from "@/lib/db/schema";
import { CustomModuleModal } from "@/app/tutor/custom-module-modal";
import {
  Search,
  BookOpen,
  Zap,
  Layers,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Sliders,
  Award,
  CheckCircle2,
  Clock,
  Bookmark,
  ArrowRight,
  FoldVertical,
  UnfoldVertical,
  Trash2,
} from "lucide-react";

interface LearnCatalogProps {
  initialModules: LearningModuleSummary[];
  initialProgress?: UserModuleProgress[];
}

export function LearnCatalog({ initialModules, initialProgress = [] }: LearnCatalogProps) {
  const [modules] = useState<LearningModuleSummary[]>(initialModules);
  const [progressList] = useState<UserModuleProgress[]>(initialProgress);
  const [customModules, setCustomModules] = useState<any[]>([]);
  const [activeCustomModule, setActiveCustomModule] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"active" | "legacy">("active");
  const [collapsedTopics, setCollapsedTopics] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem("marnie_tutor_custom_modules");
      if (raw) setCustomModules(JSON.parse(raw));
    } catch {}
  }, []);

  const handleDeleteCustomModule = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updated = customModules.filter((m) => m.id !== id);
      setCustomModules(updated);
      localStorage.setItem("marnie_tutor_custom_modules", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  // Map progress by moduleId
  const progressMap = useMemo(() => {
    const map = new Map<string, UserModuleProgress>();
    progressList.forEach((p) => {
      map.set(p.moduleId, p);
    });
    return map;
  }, [progressList]);

  // Find most recent "Continue Where You Left Off" module
  const continueModule = useMemo(() => {
    if (progressList.length === 0) return null;
    const sorted = [...progressList].sort((a, b) => {
      const timeA = a.lastStudiedAt ? new Date(a.lastStudiedAt).getTime() : 0;
      const timeB = b.lastStudiedAt ? new Date(b.lastStudiedAt).getTime() : 0;
      return timeB - timeA;
    });

    const recentProgress = sorted[0];
    if (!recentProgress) return null;
    const mod = modules.find((m) => m.id === recentProgress.moduleId);
    if (!mod) return null;

    return {
      module: mod,
      progress: recentProgress,
    };
  }, [progressList, modules]);

  const filteredModules = useMemo(() => {
    return modules.filter((m) => {
      if (viewMode === "active" && m.isLegacy) return false;
      if (viewMode === "legacy" && !m.isLegacy) return false;

      if (selectedDomain !== "all" && m.domain !== selectedDomain) {
        return false;
      }
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchTitle = m.subtopicTitle.toLowerCase().includes(query);
        const matchTopic = m.topicTitle.toLowerCase().includes(query);
        const matchCode = m.code.toLowerCase().includes(query);
        if (!matchTitle && !matchTopic && !matchCode) return false;
      }
      return true;
    });
  }, [modules, selectedDomain, search, viewMode]);

  const activeCount = useMemo(() => modules.filter((m) => !m.isLegacy).length, [modules]);
  const legacyCount = useMemo(() => modules.filter((m) => !!m.isLegacy).length, [modules]);

  // Group by Topic Code
  const groupedByTopic = useMemo(() => {
    const map = new Map<string, { topicCode: string; topicTitle: string; domain: string; items: LearningModuleSummary[] }>();

    filteredModules.forEach((m) => {
      const key = `${m.topicCode}`;
      if (!map.has(key)) {
        map.set(key, {
          topicCode: m.topicCode,
          topicTitle: m.topicTitle,
          domain: m.domain,
          items: [],
        });
      }
      map.get(key)!.items.push(m);
    });

    return Array.from(map.values());
  }, [filteredModules]);

  const toggleTopicCollapse = (topicCode: string) => {
    setCollapsedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topicCode)) {
        next.delete(topicCode);
      } else {
        next.add(topicCode);
      }
      return next;
    });
  };

  const collapseAll = () => {
    const all = new Set(groupedByTopic.map((g) => g.topicCode));
    setCollapsedTopics(all);
  };

  const expandAll = () => {
    setCollapsedTopics(new Set());
  };

  const domainBadges: Record<string, string> = {
    MATH: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    ELECS: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    GEAS: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    EST: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] pb-24">
      {/* Header Banner */}
      <section className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Learning Modules</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif tracking-tight text-[var(--text)]">
            PRC ECE Board Exam Learning Modules
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text2)] max-w-3xl leading-relaxed">
            In-depth subtopic lessons featuring textbook algebraic derivations, 20-second board exam speed shortcuts, Karce/Canon calculator keystrokes, and interactive simulations.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6">
        {/* Continue Where You Left Off Prompt */}
        {continueModule && (
          <div className="bg-gradient-to-r from-[var(--surface)] to-[var(--surface2)] border-2 border-[var(--accent)]/40 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[var(--accent)] text-white">
                  <Clock className="w-3 h-3" />
                  <span>CONTINUE WHERE YOU LEFT OFF</span>
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${domainBadges[continueModule.module.domain] || ""}`}>
                  {continueModule.module.code}
                </span>
              </div>
              <h2 className="font-serif font-bold text-base sm:text-lg text-[var(--text)] truncate">
                {continueModule.module.subtopicTitle}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text3)]">
                <span>{continueModule.module.topicTitle}</span>
                <span>•</span>
                {continueModule.progress.masteryScorePercent !== null ? (
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    Mastery Score: {continueModule.progress.masteryScorePercent}%
                  </span>
                ) : continueModule.progress.conceptChecksCompleted > 0 ? (
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    {continueModule.progress.conceptChecksCompleted} Concept Checks Completed
                  </span>
                ) : (
                  <span className="font-semibold text-[var(--accent)]">Module Opened</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
              <Link
                href={`/learn/${continueModule.module.id}`}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent)] text-white text-xs sm:text-sm font-bold hover:opacity-95 shadow-sm transition-all"
              >
                <span>Resume Module</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              {continueModule.module.pairedQuizSetId && (
                <Link
                  href={`/learn/${continueModule.module.id}/mastery`}
                  className="inline-flex items-center justify-center p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] hover:text-[var(--accent)] text-xs font-semibold shadow-xs transition-all"
                  title="Take Paired Mastery Challenge"
                >
                  <Award className="w-4 h-4 text-[var(--accent)]" />
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Search, Domain Filter & Toolbar */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 sm:p-5 shadow-[var(--shadow)] space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text3)]" />
            <input
              type="text"
              placeholder="Search modules by subtopic title, topic, or code (e.g. Radicals, Ellipses, Logarithms)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-sm text-[var(--text)] placeholder-[var(--text3)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1 border-t border-[var(--border)]">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-xs font-mono text-[var(--text3)] uppercase mr-1">Subject:</span>
              {[
                { id: "all", label: "All" },
                { id: "MATH", label: "MATH" },
                { id: "ELECS", label: "ELECS" },
                { id: "GEAS", label: "GEAS" },
                { id: "EST", label: "EST" },
              ].map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setSelectedDomain(d.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    selectedDomain === d.id
                      ? "bg-[var(--accent)] text-white shadow-sm font-semibold"
                      : "bg-[var(--surface2)] text-[var(--text2)] hover:text-[var(--text)] border border-[var(--border)]"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Collapse / Expand All Buttons */}
              <div className="flex items-center gap-1 bg-[var(--surface2)] p-1 rounded-xl border border-[var(--border)]">
                <button
                  type="button"
                  onClick={expandAll}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-[var(--text2)] hover:text-[var(--text)] transition-all flex items-center gap-1"
                  title="Expand All Topic Groups"
                >
                  <UnfoldVertical className="w-3 h-3" />
                  <span className="hidden sm:inline">Expand All</span>
                </button>
                <button
                  type="button"
                  onClick={collapseAll}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-[var(--text2)] hover:text-[var(--text)] transition-all flex items-center gap-1"
                  title="Collapse All Topic Groups"
                >
                  <FoldVertical className="w-3 h-3" />
                  <span className="hidden sm:inline">Collapse All</span>
                </button>
              </div>

              {/* View Mode Toggle: Primary vs Legacy */}
              <div className="flex items-center gap-1 p-1 bg-[var(--surface2)] rounded-xl border border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setViewMode("active")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    viewMode === "active"
                      ? "bg-[var(--surface)] text-[var(--accent)] shadow-xs border border-[var(--border)]"
                      : "text-[var(--text3)] hover:text-[var(--text)]"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Primary ({activeCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("legacy")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    viewMode === "legacy"
                      ? "bg-[var(--surface)] text-amber-500 shadow-xs border border-amber-500/20"
                      : "text-[var(--text3)] hover:text-[var(--text)]"
                  }`}
                >
                  <span>Legacy ({legacyCount})</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Custom AI Modules Section (if any saved) */}
        {customModules.length > 0 && (
          <div className="bg-[var(--surface)] border-2 border-primary/30 rounded-2xl shadow-xs overflow-hidden transition-all mb-6">
            <div className="p-4 sm:p-5 bg-gradient-to-r from-primary/10 via-[var(--surface2)] to-transparent flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                      AI LAB
                    </span>
                    <h2 className="text-sm sm:text-base font-bold text-[var(--text)]">
                      My Custom AI Learning Modules
                    </h2>
                  </div>
                  <div className="text-xs text-[var(--text2)] mt-0.5">
                    {customModules.length} module{customModules.length !== 1 ? "s" : ""} generated by Marnie AI Tutor
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-[var(--border)]">
              {customModules.map((cMod) => (
                <div
                  key={cMod.id}
                  className="bg-[var(--surface2)]/70 border border-[var(--border)] rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-primary/40 transition-all group"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                        {cMod.code || "CUSTOM"}
                      </span>
                      <button
                        onClick={(e) => handleDeleteCustomModule(cMod.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-[var(--text3)] hover:text-rose-500 transition-opacity"
                        title="Delete custom module"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-[var(--text)] line-clamp-2">
                      {cMod.subtopicTitle}
                    </h3>
                    <p className="text-[11px] text-[var(--text2)] line-clamp-2">
                      {cMod.theory?.mentalAnchor || "Custom AI-generated ECE learning module."}
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveCustomModule(cMod)}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:opacity-95 transition-all cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Launch Module</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modules Listing Grouped by Topic with Collapsible Accordions */}
        {groupedByTopic.length === 0 ? (
          <div className="p-12 text-center bg-[var(--surface)] border border-[var(--border)] rounded-2xl space-y-2">
            <BookOpen className="w-8 h-8 mx-auto text-[var(--text3)] opacity-50" />
            <div className="font-semibold text-[var(--text)]">No learning modules found</div>
            <p className="text-xs text-[var(--text3)]">Try adjusting your search query or subject filters.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedByTopic.map((group) => {
              const isCollapsed = collapsedTopics.has(group.topicCode);

              // Calculate group progress stats
              let completedInGroup = 0;
              let masteryScoresTotal = 0;
              let masteryScoresCount = 0;

              group.items.forEach((m) => {
                const prog = progressMap.get(m.id);
                if (prog?.isCompleted || (prog?.masteryScorePercent && prog.masteryScorePercent >= 70)) {
                  completedInGroup++;
                }
                if (prog?.masteryScorePercent !== null && prog?.masteryScorePercent !== undefined) {
                  masteryScoresTotal += prog.masteryScorePercent;
                  masteryScoresCount++;
                }
              });

              const groupAvgMastery =
                masteryScoresCount > 0 ? Math.round(masteryScoresTotal / masteryScoresCount) : null;

              return (
                <div
                  key={group.topicCode}
                  className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xs overflow-hidden transition-all"
                >
                  {/* Collapsible Topic Header Bar */}
                  <button
                    type="button"
                    onClick={() => toggleTopicCollapse(group.topicCode)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left hover:bg-[var(--surface2)]/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-mono font-bold border shrink-0 ${
                          domainBadges[group.domain] || "border-[var(--border)]"
                        }`}
                      >
                        {group.topicCode}
                      </span>
                      <h2 className="font-serif font-bold text-base sm:text-lg text-[var(--text)] truncate">
                        {group.topicTitle}
                      </h2>
                      <span className="text-xs text-[var(--text3)] shrink-0">
                        ({group.items.length} {group.items.length === 1 ? "module" : "modules"})
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      {/* Topic Completion Ratio */}
                      {completedInGroup > 0 && (
                        <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{completedInGroup}/{group.items.length} Done</span>
                        </span>
                      )}

                      {/* Average Mastery Score Badge */}
                      {groupAvgMastery !== null && (
                        <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/20">
                          <Award className="w-3 h-3" />
                          <span>Avg {groupAvgMastery}%</span>
                        </span>
                      )}

                      <div className="w-7 h-7 rounded-lg bg-[var(--surface2)] border border-[var(--border)] flex items-center justify-center text-[var(--text2)]">
                        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </button>

                  {/* Accordion Content Grid */}
                  {!isCollapsed && (
                    <div className="p-4 sm:p-5 pt-0 border-t border-[var(--border)]/60 bg-[var(--background)]/40">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                        {group.items.map((mod) => {
                          const prog = progressMap.get(mod.id);
                          const isDone = prog?.isCompleted;
                          const score = prog?.masteryScorePercent;
                          const checksDone = prog?.conceptChecksCompleted || 0;
                          const wasOpened = !!prog?.lastStudiedAt || checksDone > 0;

                          return (
                            <div
                              key={mod.id}
                              className={`bg-[var(--surface)] border rounded-2xl p-4 sm:p-5 shadow-xs transition-all flex flex-col justify-between space-y-4 group ${
                                isDone || (score !== null && score !== undefined && score >= 70)
                                  ? "border-emerald-500/30 hover:border-emerald-500/60"
                                  : wasOpened
                                  ? "border-amber-500/30 hover:border-amber-500/60"
                                  : "border-[var(--border)] hover:border-[var(--accent)]/60"
                              }`}
                            >
                              <div className="space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-mono text-xs font-bold text-[var(--accent)]">
                                      {mod.code}
                                    </span>
                                    {mod.isLegacy && (
                                      <span className="inline-flex items-center text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                        Legacy
                                      </span>
                                    )}
                                  </div>

                                  {/* Progress / Mastery Score Badge */}
                                  {score !== null && score !== undefined ? (
                                    <span
                                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-bold border ${
                                        score >= 90
                                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                          : score >= 70
                                          ? "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30"
                                          : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                                      }`}
                                    >
                                      <Award className="w-3 h-3" />
                                      <span>{score >= 90 ? "★ Mastered" : score >= 70 ? "✓ Passed" : "Needs Review"} ({score}%)</span>
                                    </span>
                                  ) : isDone ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                      <CheckCircle2 className="w-3 h-3" />
                                      <span>Completed</span>
                                    </span>
                                  ) : wasOpened ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                      <span>In Progress {checksDone > 0 ? `(${checksDone}/${mod.conceptChecksCount || 4})` : ""}</span>
                                    </span>
                                  ) : mod.hasVisualizer ? (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                                      <Sliders className="w-3 h-3" /> Visualizer
                                    </span>
                                  ) : null}
                                </div>

                                <h3 className="font-bold text-sm sm:text-base text-[var(--text)] group-hover:text-[var(--accent)] transition-colors leading-snug">
                                  {mod.subtopicTitle}
                                </h3>
                              </div>

                              <div className="space-y-3 pt-3 border-t border-[var(--border)]">
                                <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-[var(--text3)]">
                                  <div className="bg-[var(--surface2)] rounded-lg py-1">
                                    <div className="font-bold text-[var(--text)]">{mod.termsCount}</div>
                                    <div>Terms</div>
                                  </div>
                                  <div className="bg-[var(--surface2)] rounded-lg py-1">
                                    <div className="font-bold text-[var(--text)]">{mod.examplesCount}</div>
                                    <div>Worked Ex.</div>
                                  </div>
                                  <div className="bg-[var(--surface2)] rounded-lg py-1">
                                    <div className="font-bold text-[var(--text)]">{mod.conceptChecksCount}</div>
                                    <div>MCQs</div>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between gap-2 pt-1">
                                  <Link
                                    href={`/learn/${mod.id}/mastery`}
                                    className="text-xs text-[var(--text3)] hover:text-[var(--text)] font-medium inline-flex items-center gap-1"
                                  >
                                    <Award className="w-3 h-3 text-[var(--accent)]" /> Mastery
                                  </Link>

                                  <Link
                                    href={`/learn/${mod.id}`}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[var(--accent)] text-white text-xs font-semibold hover:opacity-95 shadow-sm transition-all"
                                  >
                                    <span>{wasOpened ? "Continue" : "Read Module"}</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {activeCustomModule && (
        <CustomModuleModal
          isOpen={!!activeCustomModule}
          onClose={() => setActiveCustomModule(null)}
          module={activeCustomModule}
        />
      )}
    </div>
  );
}
