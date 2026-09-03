"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Sparkles,
  BookOpen,
  GraduationCap,
  Brain,
  BookMarked,
  Layers,
  Zap,
  ArrowRight,
  ChevronRight,
  Clock,
  ExternalLink,
  Plus,
} from "lucide-react";
import { getStoredNotes, UserNote } from "@/lib/notes";

interface OmniItem {
  id: string;
  title: string;
  subtitle?: string;
  category: "action" | "module" | "topic" | "note";
  domain?: string;
  href: string;
  icon: any;
  shortcut?: string;
}

const STATIC_TOPICS: Array<{ code: string; title: string; domain: string; href: string }> = [
  // MATH
  { code: "MATH 01", title: "College Algebra (Polynomials, Exponents, Radicals)", domain: "MATH", href: "/quizzes?domain=MATH&topic=MATH-01&search=College%20Algebra" },
  { code: "MATH 02", title: "Probability & Counting Techniques", domain: "MATH", href: "/quizzes?domain=MATH&topic=MATH-02&search=Probability" },
  { code: "MATH 03", title: "Statistics (Central Tendency, Regression)", domain: "MATH", href: "/quizzes?domain=MATH&topic=MATH-03&search=Statistics" },
  { code: "MATH 04", title: "Discrete Mathematics (Sets, Graph Theory)", domain: "MATH", href: "/quizzes?domain=MATH&topic=MATH-04&search=Discrete" },
  { code: "MATH 05", title: "Plane & Spherical Trigonometry", domain: "MATH", href: "/quizzes?domain=MATH&topic=MATH-05&search=Trigonometry" },
  { code: "MATH 06", title: "Plane Geometry (Polygons, Circles, Power of a Point)", domain: "MATH", href: "/quizzes?domain=MATH&topic=MATH-06&search=Plane%20Geometry" },
  { code: "MATH 07", title: "Solid Geometry (Prisms, Pyramids, Cones)", domain: "MATH", href: "/quizzes?domain=MATH&topic=MATH-07&search=Solid%20Geometry" },
  { code: "MATH 08", title: "Solid Mensuration (Prismoidal Formula)", domain: "MATH", href: "/quizzes?domain=MATH&topic=MATH-08&search=Solid%20Mensuration" },
  { code: "MATH 09", title: "Analytic Geometry (Lines, Conics, Polar Curves)", domain: "MATH", href: "/quizzes?domain=MATH&topic=MATH-09&search=Analytic%20Geometry" },
  { code: "MATH 10", title: "Differential Calculus (Limits, Derivatives, Rates)", domain: "MATH", href: "/quizzes?domain=MATH&topic=MATH-10&search=Differential%20Calculus" },
  { code: "MATH 11", title: "Integral Calculus (Areas, Volumes, Pappus)", domain: "MATH", href: "/quizzes?domain=MATH&topic=MATH-11&search=Integral%20Calculus" },
  { code: "MATH 12", title: "Differential Equations (Separable, Exact, Linear, Laplace)", domain: "MATH", href: "/quizzes?domain=MATH&topic=MATH-12&search=Differential%20Equations" },
  { code: "MATH 13", title: "Advanced Engineering Mathematics (Vectors, Matrices, Fourier)", domain: "MATH", href: "/quizzes?domain=MATH&topic=MATH-13&search=Advanced%20Engineering" },
  // ELECS
  { code: "ELEC 01", title: "Electricity & Magnetism", domain: "ELECS", href: "/quizzes?domain=ELECS&topic=ELEC-01&search=Electricity" },
  { code: "ELEC 02", title: "Electrical Elements & Circuits", domain: "ELECS", href: "/quizzes?domain=ELECS&topic=ELEC-02&search=Electrical%20Elements" },
  { code: "ELEC 03", title: "DC Circuits & Network Theorems", domain: "ELECS", href: "/quizzes?domain=ELECS&topic=ELEC-03&search=DC%20Circuits" },
  { code: "ELEC 04", title: "AC Circuits, Phasors & Power", domain: "ELECS", href: "/quizzes?domain=ELECS&topic=ELEC-04&search=AC%20Circuits" },
  { code: "ELEC 05", title: "Transients & Resonant Circuits", domain: "ELECS", href: "/quizzes?domain=ELECS&topic=ELEC-05&search=Transients" },
  { code: "ELEC 06", title: "Semiconductor Physics & Diodes", domain: "ELECS", href: "/quizzes?domain=ELECS&topic=ELEC-06&search=Semiconductor" },
  { code: "ELEC 07", title: "Bipolar Junction Transistors (BJT)", domain: "ELECS", href: "/quizzes?domain=ELECS&topic=ELEC-07&search=BJT" },
  { code: "ELEC 08", title: "Field Effect Transistors (FET & MOSFET)", domain: "ELECS", href: "/quizzes?domain=ELECS&topic=ELEC-08&search=MOSFET" },
  { code: "ELEC 09", title: "Operational Amplifiers (Op-Amps)", domain: "ELECS", href: "/quizzes?domain=ELECS&topic=ELEC-09&search=Op-Amps" },
  { code: "ELEC 10", title: "Industrial Electronics & Thyristors", domain: "ELECS", href: "/quizzes?domain=ELECS&topic=ELEC-10&search=Industrial%20Electronics" },
  { code: "ELEC 11", title: "Power Supplies & Voltage Regulators", domain: "ELECS", href: "/quizzes?domain=ELECS&topic=ELEC-11&search=Power%20Supplies" },
  { code: "ELEC 12", title: "Microelectronics & IC Fabrication", domain: "ELECS", href: "/quizzes?domain=ELECS&topic=ELEC-12&search=Microelectronics" },
  { code: "ELEC 13", title: "Electronic Test & Measurement Instruments", domain: "ELECS", href: "/quizzes?domain=ELECS&topic=ELEC-13&search=Test%20Measurement" },
  { code: "ELEC 14", title: "Feedback Amplifiers & Oscillators", domain: "ELECS", href: "/quizzes?domain=ELECS&topic=ELEC-14&search=Oscillators" },
  { code: "ELEC 15", title: "Digital Electronics & Logic Circuits", domain: "ELECS", href: "/quizzes?domain=ELECS&topic=ELEC-15&search=Digital%20Electronics" },
  // GEAS
  { code: "GEAS 01", title: "Chemistry for Engineers", domain: "GEAS", href: "/quizzes?domain=GEAS&topic=GEAS-01&search=Chemistry" },
  { code: "GEAS 02", title: "Physics 1 (Mechanics, Waves, Sound)", domain: "GEAS", href: "/quizzes?domain=GEAS&topic=GEAS-02&search=Physics" },
  { code: "GEAS 03", title: "Physics 2 (EM, Optics, Modern Physics)", domain: "GEAS", href: "/quizzes?domain=GEAS&topic=GEAS-03&search=Optics" },
  { code: "GEAS 04", title: "Mechanics & Strength of Materials", domain: "GEAS", href: "/quizzes?domain=GEAS&topic=GEAS-04&search=Strength%20of%20Materials" },
  { code: "GEAS 05", title: "Thermodynamics & Heat Transfer", domain: "GEAS", href: "/quizzes?domain=GEAS&topic=GEAS-05&search=Thermodynamics" },
  { code: "GEAS 06", title: "Engineering Economics", domain: "GEAS", href: "/quizzes?domain=GEAS&topic=GEAS-06&search=Engineering%20Economics" },
  { code: "GEAS 10", title: "ECE Laws, Ethics & Contracts (RA 9292)", domain: "GEAS", href: "/learn/geas-10-01" },
  { code: "GEAS 11", title: "Material Science & Engineering", domain: "GEAS", href: "/quizzes?domain=GEAS&topic=GEAS-11&search=Material%20Science" },
  { code: "GEAS 12", title: "Computer Programming & IT", domain: "GEAS", href: "/quizzes?domain=GEAS&topic=GEAS-12&search=Programming" },
  { code: "GEAS 13", title: "Environmental Science & Engineering", domain: "GEAS", href: "/quizzes?domain=GEAS&topic=GEAS-13&search=Environmental" },
  { code: "GEAS 14", title: "Technopreneurship 101", domain: "GEAS", href: "/quizzes?domain=GEAS&topic=GEAS-14&search=Technopreneurship" },
  // EST
  { code: "EST 01", title: "Fundamentals of Comms & Noise", domain: "EST", href: "/quizzes?domain=EST&topic=EST-01&search=Fundamentals%20of%20Comms" },
  { code: "EST 02", title: "Radiowave Propagation", domain: "EST", href: "/quizzes?domain=EST&topic=EST-02&search=Radiowave" },
  { code: "EST 03", title: "Analog Modulation (AM, FM, PM)", domain: "EST", href: "/quizzes?domain=EST&topic=EST-03&search=Modulation" },
  { code: "EST 04", title: "Transmission Lines & Smith Charts", domain: "EST", href: "/quizzes?domain=EST&topic=EST-04&search=Transmission%20Lines" },
  { code: "EST 05", title: "Antennas & Radiation Systems", domain: "EST", href: "/quizzes?domain=EST&topic=EST-05&search=Antennas" },
  { code: "EST 06", title: "Microwave Communications & Radar", domain: "EST", href: "/quizzes?domain=EST&topic=EST-06&search=Microwave" },
  { code: "EST 07", title: "Optical Fiber Communications", domain: "EST", href: "/quizzes?domain=EST&topic=EST-07&search=Optical%20Fiber" },
  { code: "EST 08", title: "Telephony & Switching Systems", domain: "EST", href: "/quizzes?domain=EST&topic=EST-08&search=Telephony" },
  { code: "EST 09", title: "Digital Communications (PCM, PSK, QAM)", domain: "EST", href: "/quizzes?domain=EST&topic=EST-09&search=Digital%20Communications" },
  { code: "EST 10", title: "Data Communications & Networks (OSI Model)", domain: "EST", href: "/quizzes?domain=EST&topic=EST-10&search=Data%20Communications" },
];

const STATIC_ACTIONS: OmniItem[] = [
  {
    id: "act-tutor",
    title: "Marnie AI Tutor Workspace",
    subtitle: "Socratic problem solver, speed shortcuts, and formula derivations",
    category: "action",
    href: "/tutor",
    icon: Sparkles,
  },
  {
    id: "act-notes",
    title: "Personal Study Notes Vault",
    subtitle: "Saved explanations, formula flashcards, and concept derivations",
    category: "action",
    href: "/notes",
    icon: BookMarked,
  },
  {
    id: "act-library",
    title: "Syllabus Question Sets Library",
    subtitle: "Browse all 190 ECE Board Exam practice questionnaires",
    category: "action",
    href: "/quizzes",
    icon: Layers,
  },
  {
    id: "act-learn",
    title: "Interactive Learning Modules",
    subtitle: "Visualizers, formula breakdowns, and mastery challenges",
    category: "action",
    href: "/learn",
    icon: GraduationCap,
  },
  {
    id: "act-retention",
    title: "FSRS Memory Retention Board",
    subtitle: "View memory stability, retrievability, and upcoming spaced review intervals",
    category: "action",
    href: "/analytics",
    icon: Brain,
  },
  {
    id: "act-history",
    title: "Exam Attempts & Drill History",
    subtitle: "Review past scores, time per question, and diagnostic reports",
    category: "action",
    href: "/history",
    icon: Clock,
  },
];

export function OmniSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [userNotes, setUserNotes] = useState<UserNote[]>([]);
  const [customModules, setCustomModules] = useState<any[]>([]);
  const [officialModules, setOfficialModules] = useState<any[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Load local user notes, custom modules, and official modules when modal opens
  useEffect(() => {
    if (isOpen) {
      setUserNotes(getStoredNotes());
      try {
        const raw = localStorage.getItem("marnie_tutor_custom_modules");
        if (raw) setCustomModules(JSON.parse(raw));
      } catch {}

      // Dynamically fetch official modules catalog
      fetch("/api/modules")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.modules)) {
            setOfficialModules(data.modules);
          }
        })
        .catch((err) => console.warn("Failed to load modules catalog for omni-search:", err));

      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Global Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }
      if (e.key === "/" && !isOpen) {
        const target = e.target as HTMLElement;
        const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
        if (!isInput) {
          e.preventDefault();
          setIsOpen(true);
        }
      }
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    const handleTrigger = () => setIsOpen(true);
    window.addEventListener("open-omni-search", handleTrigger);
    return () => window.removeEventListener("open-omni-search", handleTrigger);
  }, []);

  const allItems = useMemo<OmniItem[]>(() => {
    const items: OmniItem[] = [...STATIC_ACTIONS];

    STATIC_TOPICS.forEach((t) => {
      items.push({
        id: `top-${t.code}`,
        title: `${t.code} — ${t.title}`,
        subtitle: `${t.domain} Topic Syllabus`,
        category: "topic",
        domain: t.domain,
        href: t.href,
        icon: BookOpen,
      });
    });

    // Add Official Learning Modules
    if (officialModules.length > 0) {
      officialModules.forEach((m) => {
        items.push({
          id: `mod-${m.id}`,
          title: `${m.code}: ${m.subtopicTitle}`,
          subtitle: `${m.domain} • ${m.topicTitle}`,
          category: "module",
          domain: m.domain,
          href: `/learn/${m.id}`,
          icon: GraduationCap,
        });
      });
    } else {
      items.push({
        id: "mod-geas-10-01",
        title: "GEAS 10-01: RA 9292 Origins, 8 Articles & Terms",
        subtitle: "Official ECE Law Interactive Module",
        category: "module",
        domain: "GEAS",
        href: "/learn/geas-10-01",
        icon: GraduationCap,
      });
    }

    customModules.forEach((m) => {
      items.push({
        id: `cmod-${m.id}`,
        title: `${m.code || "CUSTOM"}: ${m.subtopicTitle}`,
        subtitle: `Custom AI Learning Module • ${m.topicTitle || ""}`,
        category: "module",
        domain: m.domain || "AI",
        href: `/learn`,
        icon: Sparkles,
      });
    });

    userNotes.forEach((n) => {
      items.push({
        id: `note-${n.id}`,
        title: n.title,
        subtitle: `${n.domain || "General"} Note • ${n.content.slice(0, 60)}...`,
        category: "note",
        domain: n.domain || "NOTE",
        href: `/notes#note-${n.id}`,
        icon: BookMarked,
      });
    });

    return items;
  }, [officialModules, customModules, userNotes]);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return STATIC_ACTIONS;
    const q = query.toLowerCase();
    return allItems
      .filter((item) => {
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchSub = (item.subtitle || "").toLowerCase().includes(q);
        const matchDomain = (item.domain || "").toLowerCase().includes(q);
        return matchTitle || matchSub || matchDomain;
      })
      .slice(0, 12);
  }, [allItems, query]);

  // Handle arrow key navigation & execution
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (filteredItems.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = filteredItems[selectedIndex];
      if (selected) {
        setIsOpen(false);
        router.push(selected.href);
      }
    }
  };

  const handleSelectItem = (item: OmniItem) => {
    setIsOpen(false);
    router.push(item.href);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-3 sm:p-6 pt-[10vh] sm:pt-[14vh] animate-in fade-in duration-150">
      <div
        className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--border)] bg-[var(--surface2)] shrink-0">
          <Search className="w-5 h-5 text-primary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search topics, modules, notes, or quick actions (e.g. RA 9292, Laplace, Diodes)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            className="flex-1 bg-transparent text-sm sm:text-base text-[var(--text)] placeholder-[var(--text3)] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-[var(--text3)] hover:text-[var(--text)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-mono text-[var(--text3)] border border-[var(--border)] bg-[var(--surface)]">
            ESC to close
          </span>
        </div>

        {/* Search Results List */}
        <div
          ref={resultsContainerRef}
          className="max-h-96 overflow-y-auto p-2 divide-y divide-[var(--border)]/40"
        >
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-[var(--text3)] space-y-1">
              <Search className="w-6 h-6 mx-auto opacity-30 mb-2" />
              <div>No results matching "{query}"</div>
              <p>Try searching by topic code (e.g. MATH-10), concept title, or note keywords.</p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    isSelected
                      ? "bg-primary/10 text-primary border-l-4 border-primary pl-3"
                      : "text-[var(--text)] hover:bg-[var(--surface2)]"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-xl border shrink-0 ${
                        isSelected
                          ? "bg-primary text-white border-primary"
                          : "bg-[var(--surface2)] text-[var(--text2)] border-[var(--border)]"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-bold truncate">
                        {item.title}
                      </div>
                      {item.subtitle && (
                        <div className="text-[11px] text-[var(--text3)] truncate">
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.domain && (
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[var(--surface2)] text-[var(--text2)] border border-[var(--border)]">
                        {item.domain}
                      </span>
                    )}
                    <ChevronRight className={`w-4 h-4 ${isSelected ? "text-primary" : "text-[var(--text3)]"}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Bottom Keyboard Legend */}
        <div className="px-4 py-2 bg-[var(--surface2)] border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--text3)]">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 rounded bg-[var(--surface)] border text-[10px]">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface)] border text-[10px]">↓</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-[var(--surface)] border text-[10px]">↵</kbd> Select</span>
          </div>
          <span>Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface)] border text-[10px]">/</kbd> anywhere to search</span>
        </div>
      </div>
    </div>
  );
}
