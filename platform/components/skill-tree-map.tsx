"use client";

import { useState } from "react";
import Link from "next/link";
import { UserTopicSrs } from "@/lib/db/schema";
import { QuizListItem } from "@/lib/quizzes";
import { SUBJECTS, getSubjectFromKey, pluralize, METRIC_DEFINITIONS } from "@/lib/constants";
import {
  ShieldCheck,
  Clock,
  AlertTriangle,
  Play,
  Layers,
  Sparkles,
  Zap,
  CheckCircle2,
  Lock,
  ChevronRight,
  Info
} from "lucide-react";

interface SkillNode {
  code: string;
  name: string;
  prereq?: string;
  description: string;
}

// Canonical Board Exam Prerequisite Skill Tracks
const SKILL_TRACKS: Record<string, { label: string; full: string; color: string; nodes: SkillNode[] }> = {
  MATH: {
    label: "MATH",
    full: "Mathematics",
    color: "blue",
    nodes: [
      { code: "MATH-01", name: "College Algebra", description: "Polynomials, roots, logs, partial fractions" },
      { code: "MATH-02", name: "Probability", prereq: "MATH-01", description: "Combinatorics, permutations, distributions" },
      { code: "MATH-03", name: "Statistics & Discrete Math", prereq: "MATH-02", description: "Hypothesis testing, graph theory, sets" },
      { code: "MATH-05", name: "Trigonometry", prereq: "MATH-01", description: "Identities, oblique triangles, spherical trig" },
      { code: "MATH-06", name: "Plane Geometry", prereq: "MATH-05", description: "Polygons, circles, mensuration theorems" },
      { code: "MATH-07", name: "Solid Geometry", prereq: "MATH-06", description: "Polyhedrons, cones, spheres, prisms" },
      { code: "MATH-09", name: "Analytic Geometry", prereq: "MATH-05", description: "Conic sections, eccentricities, asymptotes" },
      { code: "MATH-13", name: "Differential Calculus", prereq: "MATH-09", description: "Limits, derivatives, maxima/minima, rates" },
      { code: "MATH-14", name: "Integral Calculus", prereq: "MATH-13", description: "Integration techniques, areas, centroid, solids" },
      { code: "MATH-17", name: "Differential Equations", prereq: "MATH-14", description: "First-order ODEs, Laplace transforms" },
    ],
  },
  ELECS: {
    label: "ELECS",
    full: "Electronics Engineering",
    color: "amber",
    nodes: [
      { code: "ELEC-01", name: "Electricity & Magnetism", description: "Coulomb, Gauss, Faraday, magnetic circuits" },
      { code: "ELEC-02", name: "Electric Circuits", prereq: "ELEC-01", description: "Ohm, Kirchhoff, mesh, nodal analysis" },
      { code: "ELEC-03", name: "Network Theorems", prereq: "ELEC-02", description: "Thevenin, Norton, Superposition, Max Power" },
      { code: "ELEC-04", name: "AC Circuits", prereq: "ELEC-03", description: "Phasors, impedance, resonance, reactive power" },
      { code: "ELEC-05", name: "Semiconductors & Diodes", prereq: "ELEC-02", description: "PN junctions, rectifiers, clippers, clampers" },
      { code: "ELEC-06", name: "BJT & FET Amplifiers", prereq: "ELEC-05", description: "CE/CB/CC configurations, MOSFET biasing, gain" },
      { code: "ELEC-07", name: "Operational Amplifiers", prereq: "ELEC-06", description: "Inverting, non-inverting, filters, feedback" },
      { code: "ELEC-08", name: "Oscillators & Timers", prereq: "ELEC-07", description: "Wien-bridge, RC phase shift, 555 IC circuits" },
      { code: "ELEC-10", name: "Digital Logic Circuits", prereq: "ELEC-05", description: "Boolean algebra, K-maps, gates, flip-flops" },
      { code: "ELEC-14", name: "Microprocessors & Embedded", prereq: "ELEC-10", description: "Registers, ALU, interfacing, instruction sets" },
    ],
  },
  GEAS: {
    label: "GEAS",
    full: "General Engineering & Applied Sciences",
    color: "emerald",
    nodes: [
      { code: "GEAS-01", name: "Engineering Mechanics (Statics)", description: "Concurrent force systems, trusses, friction" },
      { code: "GEAS-02", name: "Dynamics", prereq: "GEAS-01", description: "Kinematics, Newton laws, work-energy, impulse" },
      { code: "GEAS-03", name: "Strength of Materials", prereq: "GEAS-01", description: "Stress, strain, torsion, Mohr circle" },
      { code: "GEAS-04", name: "Thermodynamics", description: "First & Second Laws, Carnot cycle, heat engines" },
      { code: "GEAS-05", name: "Fluid Mechanics", description: "Hydrostatics, Bernoulli, pipe flow, Reynolds" },
      { code: "GEAS-06", name: "Chemistry & Materials", description: "Atomic structure, bonding, crystal lattices" },
      { code: "GEAS-07", name: "Engineering Economics", description: "Time value of money, annuities, depreciation, IRR" },
      { code: "GEAS-08", name: "Management & Laws", description: "Project management, RA 9292, PEC, ethics" },
    ],
  },
  EST: {
    label: "EST",
    full: "Electronics Systems & Technologies",
    color: "purple",
    nodes: [
      { code: "EST-01", name: "Signals & Spectra", description: "Fourier series, noise, SNR, dB conversions" },
      { code: "EST-02", name: "Amplitude Modulation (AM)", prereq: "EST-01", description: "Modulation index, sidebands, power, DSB/SSB" },
      { code: "EST-03", name: "Angle Modulation (FM/PM)", prereq: "EST-02", description: "Carson rule, Bessel functions, pre-emphasis" },
      { code: "EST-04", name: "Transmission Lines", prereq: "EST-01", description: "Characteristic impedance, SWR, reflection, Smith chart" },
      { code: "EST-05", name: "Antennas & Wave Propagation", prereq: "EST-04", description: "Dipoles, gain, radiation patterns, sky/space waves" },
      { code: "EST-06", name: "Microwave & Satellites", prereq: "EST-05", description: "Waveguides, link budget, orbital mechanics, radar" },
      { code: "EST-07", name: "Fiber Optics & Acoustics", prereq: "EST-01", description: "Total internal reflection, attenuation, lasers" },
      { code: "EST-08", name: "Data Communications & Networks", prereq: "EST-01", description: "OSI model, TCP/IP, error detection, switching" },
    ],
  },
};

interface SkillTreeMapProps {
  quizzes: QuizListItem[];
  topicMap: Record<string, UserTopicSrs & { currentR: number; isDue: boolean }>;
}

export function SkillTreeMap({ quizzes, topicMap }: SkillTreeMapProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>("MATH");
  const [activeNodeCode, setActiveNodeCode] = useState<string | null>(null);

  const track = SKILL_TRACKS[selectedSubject] || SKILL_TRACKS.MATH;

  // Filter quizzes for the active modal node
  const activeQuizzes = quizzes.filter((q) => {
    if (!activeNodeCode) return false;
    const tCode = q.topicCode || "";
    return tCode.startsWith(activeNodeCode) || q.title.includes(activeNodeCode);
  });

  return (
    <div className="space-y-6">
      {/* Subject Track Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
        {Object.entries(SKILL_TRACKS).map(([key, t]) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setSelectedSubject(key);
              setActiveNodeCode(null);
            }}
            className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              selectedSubject === key
                ? "bg-[var(--accent)] text-white shadow-md"
                : "text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--surface2)]"
            }`}
          >
            <span>{t.label}</span>
            <span className="text-[10px] font-normal opacity-80 hidden sm:inline">
              ({t.nodes.length} Nodes)
            </span>
          </button>
        ))}
      </div>

      {/* Skill Tree Canvas Container */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 shadow-[var(--shadow)] relative overflow-hidden">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border)]">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--accent)]" />
              <h2 className="text-lg font-bold font-serif text-[var(--text)]">
                {track.full} Skill Pathway
              </h2>
            </div>
            <p className="text-xs text-[var(--text3)] mt-0.5">
              Interactive prerequisite progression map. Click any node to jump directly into practice sets.
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono text-[var(--text3)] hidden sm:flex">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Mastered / Fresh
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span> Review Due
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Struggling
            </span>
          </div>
        </div>

        {/* Tree Nodes Flow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative">
          {track.nodes.map((node, index) => {
            const srs = topicMap[node.code];
            const isDue = srs?.isDue;
            const isStruggling = srs && srs.currentR < 0.6;
            const isFresh = srs && srs.currentR >= 0.85;
            const isStudied = !!srs;

            return (
              <div
                key={node.code}
                onClick={() => setActiveNodeCode(node.code)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative group flex flex-col justify-between ${
                  isStruggling
                    ? "bg-rose-500/5 border-rose-500/40 hover:border-rose-500 shadow-sm"
                    : isDue
                    ? "bg-amber-500/5 border-amber-500/40 hover:border-amber-500 shadow-sm"
                    : isFresh
                    ? "bg-emerald-500/5 border-emerald-500/40 hover:border-emerald-500 shadow-sm"
                    : "bg-[var(--surface2)]/60 border-[var(--border)] hover:border-[var(--accent)]/50"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[var(--surface3)] text-[var(--accent)] border border-[var(--border)]">
                      {node.code}
                    </span>

                    {/* Status Badge */}
                    {isStudied ? (
                      isDue ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 animate-pulse">
                          <Clock className="w-3 h-3" /> Due
                        </span>
                      ) : isStruggling ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                          <AlertTriangle className="w-3 h-3" /> Struggling
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <ShieldCheck className="w-3 h-3" /> {Math.round(srs.stabilityDays)}d Fresh
                        </span>
                      )
                    ) : (
                      <span className="text-[10px] font-mono text-[var(--text3)]">
                        Unstudied
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                    {node.name}
                  </h3>
                  <p className="text-[11px] text-[var(--text3)] mt-1 line-clamp-2">
                    {node.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--text2)] group-hover:text-[var(--accent)]">
                  <span>Explore Sets</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Node Detail Modal / Drawer */}
      {activeNodeCode && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div>
                <span className="text-xs font-mono font-bold text-[var(--accent)]">
                  {activeNodeCode}
                </span>
                <h3 className="text-lg font-bold font-serif text-[var(--text)]">
                  {track.nodes.find((n) => n.code === activeNodeCode)?.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveNodeCode(null)}
                className="w-8 h-8 rounded-lg bg-[var(--surface2)] text-[var(--text3)] hover:text-[var(--text)] flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[var(--text2)]">
              {track.nodes.find((n) => n.code === activeNodeCode)?.description}
            </p>

            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase text-[var(--text3)] font-bold">
                Available Review Sets ({activeQuizzes.length})
              </h4>

              {activeQuizzes.length === 0 ? (
                <div className="p-4 rounded-xl bg-[var(--surface2)] text-center text-xs text-[var(--text3)]">
                  No direct sets tagged with this exact code. Browse via the Library list view!
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {activeQuizzes.map((quiz) => (
                    <Link
                      key={quiz.id}
                      href={`/quizzes/${quiz.id}`}
                      className="p-3 rounded-xl bg-[var(--surface2)] border border-[var(--border)] hover:border-[var(--accent)] flex items-center justify-between group/q block transition-all"
                    >
                      <div>
                        <div className="text-xs font-semibold text-[var(--text)] group-hover/q:text-[var(--accent)] line-clamp-1">
                          {quiz.title}
                        </div>
                        <div className="text-[10px] font-mono text-[var(--text3)] mt-0.5">
                          {pluralize(quiz.questionCount || 0, "question")} • {quiz.tier || "Review"}
                        </div>
                      </div>

                      <div className="w-7 h-7 rounded-lg bg-[var(--surface3)] text-[var(--accent)] flex items-center justify-center group-hover/q:scale-110 transition-transform shrink-0">
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[var(--border)] flex justify-end">
              <button
                type="button"
                onClick={() => setActiveNodeCode(null)}
                className="px-4 py-2 rounded-xl bg-[var(--surface2)] text-xs font-semibold text-[var(--text2)] hover:text-[var(--text)] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
