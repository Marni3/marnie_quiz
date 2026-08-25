"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { LearningModuleSummary } from "@/lib/modules";
import {
  Search,
  BookOpen,
  Zap,
  Layers,
  ChevronRight,
  Sparkles,
  Sliders,
  Award,
  CheckCircle2,
} from "lucide-react";
import { SUBJECTS, getSubjectFromKey } from "@/lib/constants";

interface LearnCatalogProps {
  initialModules: LearningModuleSummary[];
}

export function LearnCatalog({ initialModules }: LearnCatalogProps) {
  const [modules] = useState<LearningModuleSummary[]>(initialModules);
  const [search, setSearch] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");

  const filteredModules = useMemo(() => {
    return modules.filter((m) => {
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
  }, [modules, selectedDomain, search]);

  // Group by Topic
  const groupedByTopic = useMemo(() => {
    const map = new Map<string, { topicCode: string; topicTitle: string; domain: string; items: LearningModuleSummary[] }>();

    filteredModules.forEach((m) => {
      const key = `${m.topicCode} - ${m.topicTitle}`;
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Learning Modules</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-serif tracking-tight text-[var(--text)]">
            PRC ECE Board Exam Learning Modules
          </h1>
          <p className="text-sm sm:text-base text-[var(--text2)] max-w-3xl leading-relaxed">
            In-depth subtopic lessons featuring textbook algebraic derivations, 20-second board exam speed shortcuts, Karce/Canon calculator keystrokes, and interactive simulations.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Search & Domain Filter Toolbar */}
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
          </div>
        </div>

        {/* Modules Listing */}
        {groupedByTopic.length === 0 ? (
          <div className="p-12 text-center bg-[var(--surface)] border border-[var(--border)] rounded-2xl space-y-2">
            <BookOpen className="w-8 h-8 mx-auto text-[var(--text3)] opacity-50" />
            <div className="font-semibold text-[var(--text)]">No learning modules found</div>
            <p className="text-xs text-[var(--text3)]">Try adjusting your search query or subject filters.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {groupedByTopic.map((group) => (
              <div key={group.topicCode} className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${domainBadges[group.domain] || "border-[var(--border)]"}`}>
                    {group.topicCode}
                  </span>
                  <h2 className="font-serif font-bold text-lg text-[var(--text)]">
                    {group.topicTitle}
                  </h2>
                  <span className="text-xs text-[var(--text3)]">
                    ({group.items.length} {group.items.length === 1 ? "module" : "modules"})
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.items.map((mod) => (
                    <div
                      key={mod.id}
                      className="bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)]/60 rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between space-y-4 group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-xs font-bold text-[var(--accent)]">
                            {mod.code}
                          </span>
                          {mod.hasVisualizer && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                              <Sliders className="w-3 h-3" /> Visualizer
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-base text-[var(--text)] group-hover:text-[var(--accent)] transition-colors leading-snug">
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
                            href={`/quizzes/${mod.pairedQuizSetId}`}
                            className="text-xs text-[var(--text3)] hover:text-[var(--text)] font-medium inline-flex items-center gap-1"
                          >
                            <Zap className="w-3 h-3 text-[var(--accent)]" /> Paired Quiz
                          </Link>

                          <Link
                            href={`/learn/${mod.id}`}
                            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-[var(--accent)] text-white text-xs font-semibold hover:opacity-95 shadow-sm transition-all"
                          >
                            <span>Read Module</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
