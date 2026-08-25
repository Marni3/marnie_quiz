"use client";

import { useState } from "react";
import Link from "next/link";
import { UserTopicSrs } from "@/lib/db/schema";
import { QuizListItem } from "@/lib/quizzes";
import { SUBJECTS, pluralize, formatTopicCode } from "@/lib/constants";
import {
  Play,
  Sparkles,
  CheckCircle2,
  Trophy,
  ChevronRight
} from "lucide-react";

interface SkillNode {
  code: string;
  displayCode: string;
  name: string;
  icon: string;
  description: string;
}

const DUO_TRACKS: Record<
  string,
  { label: string; full: string; color: string; bgGlow: string; nodes: SkillNode[] }
> = {
  MATH: {
    label: "MATH",
    full: "Mathematics",
    color: "from-blue-500 to-cyan-500",
    bgGlow: "rgba(59, 130, 246, 0.15)",
    nodes: [
      { code: "MATH-01", displayCode: "MATH 01", name: "College Algebra", icon: "🔢", description: "Polynomials, roots, logarithms, systems of linear equations" },
      { code: "MATH-02", displayCode: "MATH 02", name: "Probability", icon: "🎲", description: "Permutations, combinations, discrete & continuous distributions" },
      { code: "MATH-03", displayCode: "MATH 03", name: "Statistics", icon: "📊", description: "Central tendency, dispersion, frequency tables, linear regression" },
      { code: "MATH-04", displayCode: "MATH 04", name: "Discrete Mathematics", icon: "🔗", description: "Set theory, propositional logic, truth tables, graph theory" },
      { code: "MATH-05", displayCode: "MATH 05", name: "Trigonometry", icon: "📐", description: "Identities, oblique triangles, spherical trigonometry, Napier's rules" },
      { code: "MATH-06", displayCode: "MATH 06", name: "Plane Geometry", icon: "🔷", description: "Polygons, circles, chords, tangents, power of a point" },
      { code: "MATH-07", displayCode: "MATH 07", name: "Solid Geometry", icon: "📦", description: "Prisms, pyramids, cylinders, cones, spheres" },
      { code: "MATH-08", displayCode: "MATH 08", name: "Solid Mensuration", icon: "🧊", description: "Frustums, prismoidal formula, revolution solids, composite volumes" },
      { code: "MATH-09", displayCode: "MATH 09", name: "Analytic Geometry", icon: "📈", description: "Conic sections, eccentricities, asymptotes, polar coordinates" },
      { code: "MATH-10", displayCode: "MATH 10", name: "Differential Calculus", icon: "📉", description: "Limits, derivatives, maxima/minima, related rates" },
      { code: "MATH-11", displayCode: "MATH 11", name: "Integral Calculus", icon: "🏛️", description: "Integration techniques, areas, centroids, solids of revolution" },
      { code: "MATH-12", displayCode: "MATH 12", name: "Differential Equations", icon: "⚙️", description: "First order, Bernoulli, applications, Laplace transforms" },
      { code: "MATH-13", displayCode: "MATH 13", name: "Advanced Engineering Math", icon: "🌌", description: "Complex numbers, vectors, matrices, Fourier series" },
    ],
  },
  ELECS: {
    label: "ELECS",
    full: "Electronics Engineering",
    color: "from-amber-500 to-orange-500",
    bgGlow: "rgba(245, 158, 11, 0.15)",
    nodes: [
      { code: "ELEC-01", displayCode: "ELEC 01", name: "Electricity & Magnetism", icon: "🧲", description: "Coulomb's Law, Gauss, magnetic flux, force on charges" },
      { code: "ELEC-02", displayCode: "ELEC 02", name: "Electrical Elements", icon: "🔋", description: "Resistors, inductors, capacitors, color codes, parasitics" },
      { code: "ELEC-03", displayCode: "ELEC 03", name: "DC Circuits", icon: "⚡", description: "Ohm's Law, Kirchhoff's Laws, Thevenin, Norton, Superposition" },
      { code: "ELEC-04", displayCode: "ELEC 04", name: "AC Circuits", icon: "〰️", description: "Phasors, impedance, power factor, series/parallel RLC" },
      { code: "ELEC-05", displayCode: "ELEC 05", name: "Transients & Resonance", icon: "⏱️", description: "Time constants, damping, Q-factor, bandwidth" },
      { code: "ELEC-06", displayCode: "ELEC 06", name: "Semiconductors & Diodes", icon: "💡", description: "PN junctions, Zener, rectifiers, clippers, clampers" },
      { code: "ELEC-07", displayCode: "ELEC 07", name: "BJT Transistors", icon: "🔀", description: "CE/CB/CC biasing, h-parameters, frequency response" },
      { code: "ELEC-08", displayCode: "ELEC 08", name: "FET & MOSFET", icon: "🎛️", description: "JFET, enhancement/depletion MOSFET, transconductance" },
      { code: "ELEC-09", displayCode: "ELEC 09", name: "Op-Amps", icon: "🔺", description: "Ideal op-amps, feedback, summing, filters, comparators" },
      { code: "ELEC-10", displayCode: "ELEC 10", name: "Industrial Electronics", icon: "🏭", description: "SCR, TRIAC, DIAC, motor drives, optocouplers" },
      { code: "ELEC-11", displayCode: "ELEC 11", name: "Power Supplies", icon: "🔌", description: "Linear regulators, SMPS, ripple factor, heat sinks" },
      { code: "ELEC-12", displayCode: "ELEC 12", name: "Microelectronics", icon: "🔬", description: "IC fabrication, lithography, CMOS layout" },
      { code: "ELEC-13", displayCode: "ELEC 13", name: "Test & Measurement", icon: "🎚️", description: "Oscilloscopes, multimeters, bridge circuits, sensors" },
      { code: "ELEC-14", displayCode: "ELEC 14", name: "Feedback & Oscillators", icon: "🔄", description: "Barkhausen criterion, Wien bridge, crystal oscillators" },
      { code: "ELEC-15", displayCode: "ELEC 15", name: "Digital Electronics", icon: "💻", description: "Logic gates, Karnaugh maps, flip-flops, counters, registers" },
    ],
  },
  GEAS: {
    label: "GEAS",
    full: "General Engineering & Applied Sciences",
    color: "from-emerald-500 to-teal-500",
    bgGlow: "rgba(168, 85, 247, 0.15)",
    nodes: [
      { code: "GEAS-01", displayCode: "GEAS 01", name: "Chemistry", icon: "🧪", description: "Stoichiometry, atomic bonding, electrochemistry, redox" },
      { code: "GEAS-02", displayCode: "GEAS 02", name: "Physics 1", icon: "🍎", description: "Kinematics, Newton's laws, energy, momentum, rotation" },
      { code: "GEAS-03", displayCode: "GEAS 03", name: "Physics 2", icon: "⚡", description: "Electric fields, optics, waves, sound, relativity" },
      { code: "GEAS-04", displayCode: "GEAS 04", name: "Mechanics & Strength", icon: "🏗️", description: "Statics, trusses, stress/strain, torsion, flexure" },
      { code: "GEAS-05", displayCode: "GEAS 05", name: "Thermodynamics", icon: "🔥", description: "1st & 2nd laws, heat engines, Carnot cycle, entropy" },
      { code: "GEAS-06", displayCode: "GEAS 06", name: "Engineering Economics", icon: "💰", description: "Time value of money, annuities, depreciation, ROR" },
      { code: "GEAS-09", displayCode: "GEAS 09", name: "Electromagnetics", icon: "🌐", description: "Maxwell's equations, Poynting vector, boundary conditions" },
      { code: "GEAS-10", displayCode: "GEAS 10", name: "ECE Laws & Ethics", icon: "⚖️", description: "RA 9292, PEC, NTC regulations, engineering code of ethics" },
      { code: "GEAS-11", displayCode: "GEAS 11", name: "Material Science", icon: "💎", description: "Crystal structures, phase diagrams, polymers, ceramics" },
      { code: "GEAS-12", displayCode: "GEAS 12", name: "Computer Programming", icon: "🖥️", description: "Algorithms, flowcharts, data structures, C/C++" },
      { code: "GEAS-13", displayCode: "GEAS 13", name: "Environmental Science", icon: "🌱", description: "Ecology, waste management, environmental laws" },
      { code: "GEAS-14", displayCode: "GEAS 14", name: "Technopreneurship", icon: "🚀", description: "Innovation, startups, business models, IP protection" },
    ],
  },
  EST: {
    label: "EST",
    full: "Electronics Systems & Technologies",
    color: "from-purple-500 to-pink-500",
    bgGlow: "rgba(168, 85, 247, 0.15)",
    nodes: [
      { code: "EST-01", displayCode: "EST 01", name: "Fundamentals of Comms", icon: "📻", description: "Signal spectra, bandwidth, decibels, noise figure, SNR" },
      { code: "EST-02", displayCode: "EST 02", name: "Radiowave Propagation", icon: "🌊", description: "Ground waves, sky waves, ionosphere, fading, ducting" },
      { code: "EST-03", displayCode: "EST 03", name: "Analog Modulation", icon: "🎙️", description: "AM, FM, PM, Carson's rule, superheterodyne receivers" },
      { code: "EST-04", displayCode: "EST 04", name: "Transmission Lines", icon: "➰", description: "Characteristic impedance, SWR, Smith chart, stubs" },
      { code: "EST-05", displayCode: "EST 05", name: "Antennas", icon: "📡", description: "Dipoles, gain, radiation patterns, arrays, aperture" },
      { code: "EST-06", displayCode: "EST 06", name: "Microwave Comms", icon: "🛰️", description: "Waveguides, cavity resonators, satellite link budgets" },
      { code: "EST-07", displayCode: "EST 07", name: "Optical Fiber Comms", icon: "💡", description: "Total internal reflection, attenuation, dispersion, lasers" },
      { code: "EST-08", displayCode: "EST 08", name: "Telephony", icon: "☎️", description: "PSTN, switching, signaling, traffic engineering, Erlangs" },
      { code: "EST-09", displayCode: "EST 09", name: "Digital Communications", icon: "📶", description: "PCM, ASK, FSK, PSK, QAM, constellation diagrams" },
      { code: "EST-10", displayCode: "EST 10", name: "Data Communications", icon: "🌐", description: "OSI model, TCP/IP, Ethernet, routing, protocols" },
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

  const track = DUO_TRACKS[selectedSubject] || DUO_TRACKS.MATH;

  const getMatchedQuizzes = (nodeCode: string, nodeName: string) => {
    const normCode = nodeCode.toUpperCase();
    const normName = nodeName.toUpperCase();

    return quizzes.filter((q) => {
      const qCode = (q.topicCode || "").toUpperCase();
      const qTitle = q.title.toUpperCase();
      const qTag = (q.subjectTag || "").toUpperCase();

      return (
        qCode === normCode ||
        qTitle.startsWith(normCode) ||
        qTag === normName ||
        qTitle.includes(normName)
      );
    });
  };

  const activeNode = track.nodes.find((n) => n.code === activeNodeCode);
  const activeQuizzes = activeNode ? getMatchedQuizzes(activeNode.code, activeNode.name) : [];

  // Compact alternating offset for tactile winding feel without excessive gap
  const getOffsetClass = (index: number) => {
    const pattern = [
      "justify-center",
      "justify-start pl-6 sm:pl-16",
      "justify-end pr-6 sm:pr-16",
      "justify-center",
      "justify-end pr-6 sm:pr-16",
      "justify-start pl-6 sm:pl-16",
    ];
    return pattern[index % pattern.length];
  };

  // SVG parameters for fractional circle arc
  const radius = 38;
  const circumference = 2 * Math.PI * radius; // ~238.76

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Subject Track Switcher Tabs */}
      <div className="flex items-center justify-between p-1.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs gap-1.5">
        {Object.entries(DUO_TRACKS).map(([key, t]) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setSelectedSubject(key);
              setActiveNodeCode(null);
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
              selectedSubject === key
                ? "bg-[var(--accent)] text-white shadow-md scale-102"
                : "text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--surface2)]"
            }`}
          >
            <span className="font-mono">{t.label}</span>
            <span className="text-[11px] font-normal opacity-85 hidden sm:inline">
              ({t.nodes.length} Topics)
            </span>
          </button>
        ))}
      </div>

      {/* Winding Duolingo Skill Tree Path with Compact Vertical Rhythm */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-10 shadow-[var(--shadow-lg)] relative overflow-hidden flex flex-col items-center">
        {/* Background Ambient Glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30 blur-3xl"
          style={{ background: `radial-gradient(circle at 50% 20%, ${track.bgGlow}, transparent 70%)` }}
        ></div>

        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[var(--surface2)] border border-[var(--border)] text-[11px] font-mono text-[var(--accent)] font-semibold mb-1.5 shadow-xs">
            <Sparkles className="w-3 h-3" />
            <span>PRC Board Exam Mastery Track</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-[var(--text)] tracking-tight">
            {track.full}
          </h2>
          <p className="text-xs text-[var(--text3)] mt-0.5">
            Fractional rings fill as you complete topic question sets.
          </p>
        </div>

        {/* The Winding Stepping Stones Path */}
        <div className="w-full max-w-md space-y-6 relative z-10 py-1">
          {track.nodes.map((node, index) => {
            const srs = topicMap[node.code];
            const matchedQuizzes = getMatchedQuizzes(node.code, node.name);
            const totalSets = matchedQuizzes.length || 4;
            
            // Calculate true fractional completion based on attempts/completed sets
            const attemptsCount = srs ? Number(srs.totalAttempts || 0) : 0;
            const completedSets = Math.min(totalSets, attemptsCount);
            const completionRatio = totalSets > 0 ? completedSets / totalSets : 0;
            const percentFilled = Math.min(100, Math.round(completionRatio * 100));
            const strokeDashoffset = circumference - (circumference * percentFilled) / 100;

            const isStudied = attemptsCount > 0;
            const isFresh = srs && srs.currentR >= 0.85;
            const isDue = srs && srs.isDue;
            const isStruggling = srs && (srs.currentR < 0.6 || (srs.lastScorePercent !== null && srs.lastScorePercent < 70));

            // Chromatic performance coloring
            let strokeColor = "stroke-[var(--border2)]";
            let glowClass = "";

            if (isStudied) {
              if (isFresh) {
                strokeColor = "stroke-emerald-400";
                glowClass = "shadow-emerald-500/20";
              } else if (isDue) {
                strokeColor = "stroke-amber-400";
                glowClass = "shadow-amber-500/20";
              } else if (isStruggling) {
                strokeColor = "stroke-rose-500";
                glowClass = "shadow-rose-500/20";
              } else {
                strokeColor = "stroke-blue-400";
              }
            }

            return (
              <div key={node.code} className={`flex w-full ${getOffsetClass(index)} items-center relative`}>
                {/* Node Stepping Stone with Fractional SVG Progress Ring */}
                <div className="flex flex-col items-center group">
                  <button
                    type="button"
                    onClick={() => setActiveNodeCode(node.code)}
                    className="relative cursor-pointer transition-all duration-200 group-hover:scale-108 active:scale-95 select-none focus:outline-none"
                  >
                    {/* SVG Fractional Arc Ring */}
                    <div className="relative w-20 h-20 sm:w-22 sm:h-22 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
                        {/* Background Base Ring */}
                        <circle
                          cx="48"
                          cy="48"
                          r={radius}
                          stroke="currentColor"
                          strokeWidth="5"
                          className="text-[var(--surface2)]"
                          fill="transparent"
                        />
                        {/* Dynamic Progress Arc */}
                        {isStudied && (
                          <circle
                            cx="48"
                            cy="48"
                            r={radius}
                            strokeWidth="5"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className={`${strokeColor} transition-all duration-500`}
                            fill="transparent"
                          />
                        )}
                      </svg>

                      {/* Inner Physical Button Body */}
                      <div className={`absolute inset-2.5 rounded-full bg-[var(--surface)] border border-[var(--border)] flex flex-col items-center justify-center shadow-inner ${glowClass}`}>
                        <span className="text-2xl sm:text-3xl filter drop-shadow-xs">
                          {node.icon}
                        </span>

                        {/* Completed Check Badge */}
                        {percentFilled === 100 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                            <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                          </div>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Node Label */}
                  <div className="text-center mt-1.5 max-w-[130px]">
                    <div className="text-xs font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors line-clamp-1">
                      {node.name}
                    </div>
                    <div className="text-[10px] font-mono text-[var(--text3)] mt-0.5 flex items-center justify-center gap-1 font-semibold">
                      <span className="text-[var(--accent)]">{node.displayCode}</span>
                      <span>•</span>
                      <span>{percentFilled}%</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Milestone Footer */}
        <div className="mt-6 text-center relative z-10 pt-6 border-t border-[var(--border)] w-full flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-neutral-950 flex items-center justify-center shadow-md mb-2">
            <Trophy className="w-6 h-6 fill-current" />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-[var(--text)] font-serif">
            {track.full} Complete Syllabus Track
          </h3>
          <p className="text-[11px] text-[var(--text3)] mt-0.5 max-w-xs">
            Complete all {track.nodes.length} topics to achieve 100% board mastery.
          </p>
        </div>
      </div>

      {/* Interactive Practice Drawer Modal */}
      {activeNode && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3.5 border-b border-[var(--border)]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] flex items-center justify-center text-2xl shrink-0">
                  {activeNode.icon}
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-[var(--accent)]">
                    {activeNode.displayCode}
                  </span>
                  <h3 className="text-base font-bold font-serif text-[var(--text)]">
                    {activeNode.name}
                  </h3>
                  <p className="text-xs text-[var(--text3)] mt-0.5 line-clamp-1">
                    {activeNode.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveNodeCode(null)}
                className="w-7 h-7 rounded-full bg-[var(--surface2)] text-[var(--text3)] hover:text-[var(--text)] flex items-center justify-center cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            {/* Quizzes List */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono text-[var(--text3)] uppercase">
                <span>Available Test Sets ({activeQuizzes.length})</span>
                <span>Select to Start</span>
              </div>

              {activeQuizzes.length === 0 ? (
                <div className="p-5 rounded-2xl bg-[var(--surface2)] text-center space-y-1.5">
                  <p className="text-xs text-[var(--text2)] font-medium">
                    No individual sets found matching this filter.
                  </p>
                  <p className="text-[11px] text-[var(--text3)]">
                    Browse all sets in the Library List view.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {activeQuizzes.map((quiz) => {
                    const tier = quiz.tier?.toLowerCase() || "review";
                    return (
                      <Link
                        key={quiz.id}
                        href={`/quizzes/${quiz.id}`}
                        className="p-3 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] hover:border-[var(--accent)] hover:shadow-sm flex items-center justify-between group block transition-all"
                      >
                        <div>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                                tier === "diagnostic"
                                  ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                                  : tier === "drill"
                                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                  : tier === "simulation"
                                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                                  : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                              }`}
                            >
                              {tier}
                            </span>
                            <span className="text-[11px] font-mono text-[var(--text3)]">
                              {pluralize(quiz.questionCount || 0, "Q")}
                            </span>
                          </div>

                          <h4 className="text-xs font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors line-clamp-1">
                            {quiz.title}
                          </h4>
                        </div>

                        <div className="w-7 h-7 rounded-xl bg-[var(--accent)] text-white flex items-center justify-center group-hover:scale-110 transition-transform shrink-0 shadow-xs ml-2">
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-2.5 border-t border-[var(--border)] flex justify-end">
              <button
                type="button"
                onClick={() => setActiveNodeCode(null)}
                className="px-4 py-1.5 rounded-xl bg-[var(--surface2)] text-xs font-semibold text-[var(--text2)] hover:text-[var(--text)] cursor-pointer"
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
