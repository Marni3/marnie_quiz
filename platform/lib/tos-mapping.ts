/**
 * Official PRC Board of Electronics Engineering (BEE) Table of Specifications (TOS)
 * Reference: R.A. 9292 & PRC BEE Board Licensure Examination Syllabi
 */

export type PrcDomain = "MATH" | "GEAS" | "ELECS" | "EST";

export interface TosCompetency {
  code: string;           // e.g. "EST-01", "MATH-05"
  domain: PrcDomain;
  title: string;
  description: string;
  weightPercentage: number;
}

export const PRC_TOS_COMPETENCIES: Record<string, TosCompetency> = {
  // =========================================================================
  // 1. MATHEMATICS (20% Board Exam Weight)
  // =========================================================================
  "MATH-01": {
    code: "MATH-01",
    domain: "MATH",
    title: "College Algebra, Polynomials & Progressions",
    description: "Algebraic operations, systems of linear/quadratic equations, exponents, logarithms, binomial theorem, sequences, and progressions.",
    weightPercentage: 20,
  },
  "MATH-02": {
    code: "MATH-02",
    domain: "MATH",
    title: "Plane & Spherical Trigonometry",
    description: "Trigonometric functions, identities, equations, laws of sines/cosines, solution of oblique triangles, and spherical navigation triangles.",
    weightPercentage: 20,
  },
  "MATH-03": {
    code: "MATH-03",
    domain: "MATH",
    title: "Plane & Solid Geometry",
    description: "Geometric properties of plane polygons, circles, areas, perimeter, polyhedra, cylinders, cones, spheres, prisms, and volume calculations.",
    weightPercentage: 20,
  },
  "MATH-04": {
    code: "MATH-04",
    domain: "MATH",
    title: "Analytic Geometry & Conic Sections",
    description: "Cartesian coordinates, straight lines, circles, parabolas, ellipses, hyperbolas, polar coordinates, and 3D coordinate geometry.",
    weightPercentage: 20,
  },
  "MATH-05": {
    code: "MATH-05",
    domain: "MATH",
    title: "Differential Calculus",
    description: "Limits, continuity, differentiation techniques, curve sketching, related rates, maxima and minima optimization, and Taylor series.",
    weightPercentage: 20,
  },
  "MATH-06": {
    code: "MATH-06",
    domain: "MATH",
    title: "Integral Calculus",
    description: "Indefinite and definite integrals, integration techniques, plane areas, volumes of revolution, arc length, centroids, and moment of inertia.",
    weightPercentage: 20,
  },
  "MATH-07": {
    code: "MATH-07",
    domain: "MATH",
    title: "Differential Equations",
    description: "First-order differential equations (separable, exact, linear), higher-order linear DEs with constant coefficients, and physical growth/decay modeling.",
    weightPercentage: 20,
  },
  "MATH-08": {
    code: "MATH-08",
    domain: "MATH",
    title: "Advanced Engineering Mathematics",
    description: "Laplace transforms, inverse Laplace, Fourier series, matrices, determinants, eigenvalue problems, vector analysis, and complex variables.",
    weightPercentage: 20,
  },
  "MATH-09": {
    code: "MATH-09",
    domain: "MATH",
    title: "Probability, Statistics & Discrete Mathematics",
    description: "Combinatorics, permutations, probability distributions, statistical measures, hypothesis testing, logic, set theory, and discrete structures.",
    weightPercentage: 20,
  },

  // =========================================================================
  // 2. GENERAL ENGINEERING & APPLIED SCIENCES (20% Board Exam Weight)
  // =========================================================================
  "GEAS-01": {
    code: "GEAS-01",
    domain: "GEAS",
    title: "General Chemistry",
    description: "Atomic structure, chemical bonding, stoichiometry, periodic table, gas laws, solutions, acids/bases, and electrochemistry.",
    weightPercentage: 20,
  },
  "GEAS-02": {
    code: "GEAS-02",
    domain: "GEAS",
    title: "Engineering Mechanics - Statics",
    description: "Force systems, moments, 2D/3D equilibrium of rigid bodies, trusses, frames, centroids, friction, and moment of inertia.",
    weightPercentage: 20,
  },
  "GEAS-03": {
    code: "GEAS-03",
    domain: "GEAS",
    title: "Engineering Mechanics - Dynamics",
    description: "Kinematics of particles and rigid bodies, kinetics (Newton's laws, work-energy, impulse-momentum), and rotational motion.",
    weightPercentage: 20,
  },
  "GEAS-04": {
    code: "GEAS-04",
    domain: "GEAS",
    title: "Strength of Materials",
    description: "Stress and strain, axial deformation, torsion in shafts, bending and shear in beams, combined stresses, and column buckling.",
    weightPercentage: 20,
  },
  "GEAS-05": {
    code: "GEAS-05",
    domain: "GEAS",
    title: "Thermodynamics",
    description: "Properties of pure substances, first and second laws of thermodynamics, ideal gas cycles (Carnot, Otto, Diesel, Rankine), and heat transfer.",
    weightPercentage: 20,
  },
  "GEAS-06": {
    code: "GEAS-06",
    domain: "GEAS",
    title: "Materials Science & Engineering",
    description: "Crystal structures, mechanical properties of metals, polymers, ceramics, semiconductors, phase diagrams, and corrosion mechanisms.",
    weightPercentage: 20,
  },
  "GEAS-07": {
    code: "GEAS-07",
    domain: "GEAS",
    title: "Engineering Economics",
    description: "Time value of money, compound interest, annuities, present/future worth analysis, rate of return, depreciation, and replacement economy.",
    weightPercentage: 20,
  },
  "GEAS-08": {
    code: "GEAS-08",
    domain: "GEAS",
    title: "R.A. 9292 (ECE Law), Code of Ethics & Telecommunications Laws",
    description: "Republic Act No. 9292 provisions, Board of ECE regulatory powers, ECE professional practice scopes, Code of Ethics, and NTC/DICT policies.",
    weightPercentage: 20,
  },

  // =========================================================================
  // 3. ELECTRONICS ENGINEERING (30% Board Exam Weight)
  // =========================================================================
  "ELECS-01": {
    code: "ELECS-01",
    domain: "ELECS",
    title: "Semiconductor Fundamentals & PN Junction Diodes",
    description: "Intrinsic/extrinsic semiconductor physics, energy bands, diode models, rectifiers, clippers, clampers, and Zener voltage regulation.",
    weightPercentage: 30,
  },
  "ELECS-02": {
    code: "ELECS-02",
    domain: "ELECS",
    title: "BJT Transistors & Amplifiers",
    description: "BJT DC operating point, stability factor, CE/CB/CC configurations, AC small-signal models (re, hybrid-pi), and multistage amplifiers.",
    weightPercentage: 30,
  },
  "ELECS-03": {
    code: "ELECS-03",
    domain: "ELECS",
    title: "Field Effect Transistors (JFETs & MOSFETs)",
    description: "JFET characteristics, depletion/enhancement MOSFETs, DC biasing, AC small-signal models, and CMOS logic gates.",
    weightPercentage: 30,
  },
  "ELECS-04": {
    code: "ELECS-04",
    domain: "ELECS",
    title: "Operational Amplifiers & Analog ICs",
    description: "Ideal/practical op-amp characteristics, inverting/non-inverting configurations, summing, differentiator, integrator, instrumentation amplifiers, and active filters.",
    weightPercentage: 30,
  },
  "ELECS-05": {
    code: "ELECS-05",
    domain: "ELECS",
    title: "Power Amplifiers & Frequency Response",
    description: "Class A, B, AB, C, and D power amplifiers, efficiency, thermal resistance, heat sinks, low/high frequency response, and Bode plots.",
    weightPercentage: 30,
  },
  "ELECS-06": {
    code: "ELECS-06",
    domain: "ELECS",
    title: "Feedback Circuits, Oscillators & Waveform Generators",
    description: "Feedback topologies, Barkhausen criterion, RC phase-shift, Wien bridge, Colpitts, Hartley, crystal oscillators, 555 timer, and Schmitt triggers.",
    weightPercentage: 30,
  },
  "ELECS-07": {
    code: "ELECS-07",
    domain: "ELECS",
    title: "DC Power Supplies & Special Semiconductor Devices",
    description: "Linear and switching voltage regulators, SCRs, TRIACs, DIACs, optocouplers, solar cells, LEDs, and photodetectors.",
    weightPercentage: 30,
  },
  "ELECS-08": {
    code: "ELECS-08",
    domain: "ELECS",
    title: "Digital Logic Circuits & Combinational Logic",
    description: "Number systems, Boolean algebra, De Morgan's theorems, Karnaugh mapping, decoders, encoders, multiplexers, demultiplexers, and adders.",
    weightPercentage: 30,
  },
  "ELECS-09": {
    code: "ELECS-09",
    domain: "ELECS",
    title: "Sequential Logic, Memory & Microprocessors",
    description: "Latches, flip-flops (SR, D, JK, T), shift registers, synchronous/asynchronous counters, RAM/ROM memory, and microprocessor architecture basics.",
    weightPercentage: 30,
  },

  // =========================================================================
  // 4. ELECTRONICS SYSTEMS & TECHNOLOGIES (30% Board Exam Weight)
  // =========================================================================
  "EST-01": {
    code: "EST-01",
    domain: "EST",
    title: "Transmission Lines & Waveguides",
    description: "Transmission line parameters, characteristic impedance, reflection coefficient, SWR, quarter-wave transformers, stub matching, and Smith charts.",
    weightPercentage: 30,
  },
  "EST-02": {
    code: "EST-02",
    domain: "EST",
    title: "Antennas & Radiation Mechanisms",
    description: "Isotropic radiator, dipole antennas, antenna gain, directivity, effective aperture, radiation resistance, beamwidth, arrays, and Yagi-Uda antennas.",
    weightPercentage: 30,
  },
  "EST-03": {
    code: "EST-03",
    domain: "EST",
    title: "Radio Wave Propagation",
    description: "Ground waves, sky waves, ionospheric layers, MUF, critical frequency, space waves, line-of-sight propagation, free-space path loss, and fading.",
    weightPercentage: 30,
  },
  "EST-04": {
    code: "EST-04",
    domain: "EST",
    title: "Analog Modulation & Radio Systems",
    description: "AM, DSB-SC, SSB, FM, PM, modulation index, bandwidth rules (Carson's rule), superheterodyne receivers, noise figure, and SNR.",
    weightPercentage: 30,
  },
  "EST-05": {
    code: "EST-05",
    domain: "EST",
    title: "Digital Modulation & Baseband Communications",
    description: "Sampling theorem, Nyquist rate, PCM, companding, delta modulation, ASK, FSK, BPSK, QPSK, QAM, and bit error rate.",
    weightPercentage: 30,
  },
  "EST-06": {
    code: "EST-06",
    domain: "EST",
    title: "Fiber Optic Communications",
    description: "Snell's law, numerical aperture, single/multimode fibers, attenuation, dispersion, optical sources (LED/Laser), detectors (PIN/APD), and link budget.",
    weightPercentage: 30,
  },
  "EST-07": {
    code: "EST-07",
    domain: "EST",
    title: "Satellite Communications",
    description: "Kepler's laws, orbital altitudes (LEO, MEO, GEO), look angles (azimuth/elevation), link budget ($G/T$, EIRP, $C/N$), and transponder multiplexing.",
    weightPercentage: 30,
  },
  "EST-08": {
    code: "EST-08",
    domain: "EST",
    title: "Microwave Systems & Radar",
    description: "Microwave generators (magnetrons, klystrons, TWTs), radar equation, maximum unambiguous range, pulse vs Doppler radar, and navigation systems.",
    weightPercentage: 30,
  },
  "EST-09": {
    code: "EST-09",
    domain: "EST",
    title: "Acoustics & Audio/Broadcast Engineering",
    description: "Sound pressure level (SPL), decibels, reverberation time (Sabine formula), microphones, loudspeakers, studio acoustics, and broadcast standards.",
    weightPercentage: 30,
  },
  "EST-10": {
    code: "EST-10",
    domain: "EST",
    title: "Data Communications & Computer Networks",
    description: "OSI 7-layer model, TCP/IP protocol suite, error detection/correction (CRC, parity), flow control, Ethernet, IP addressing, subnetting, and switching/routing.",
    weightPercentage: 30,
  },
};

/**
 * Bidirectional Legacy to TOS ID Alias Mapping
 * Ensures 100% backward compatibility for all existing URLs, bookmarks, and stored notes.
 */
export const LEGACY_TO_TOS_MAP: Record<string, string> = {
  // Legacy Math IDs
  "math-01": "math-01",
  "math-02": "math-09-01",     // Probability
  "math-03": "math-09-02",     // Statistics
  "math-04": "math-09-03",     // Discrete Math
  "math-05": "math-02-01",     // Plane Trig
  "math-06": "math-02-02",     // Spherical Trig
  "math-07": "math-03-01",     // Plane Geometry
  "math-08": "math-03-02",     // Solid Geometry
  "math-09": "math-04",        // Analytic Geometry
  "math-10": "math-05",        // Differential Calculus
  "math-11": "math-06",        // Integral Calculus
  "math-12": "math-07",        // Differential Equations
  "math-13": "math-08",        // Advanced Engineering Math
  "math-14": "math-08",
  "math-16": "math-09",
  "math-18": "math-10",
  "math-20": "math-11",
  "math-21": "math-12",
  "math-22": "math-13",
  "math-23": "math-13",

  // Legacy GEAS IDs
  "geas-10": "geas-08",        // RA 9292 ECE Law
  "geas-10-01": "geas-08-01",
  "geas-10-02": "geas-08-02",
  "geas-10-03": "geas-08-03",

  // Legacy EST IDs
  "est-01": "est-01",
  "est-02": "est-02",
  "est-03": "est-03",
  "est-04": "est-04",
  "est-05": "est-05",
  "est-06": "est-06",
  "est-07": "est-07",
  "est-08": "est-08",
  "est-09": "est-09",
  "est-10": "est-10",
};

/**
 * Resolves any legacy or alias ID to its canonical PRC TOS ID
 */
export function resolveTosId(rawId: string): string {
  if (!rawId) return "";
  const normalized = rawId.toLowerCase().trim();
  return LEGACY_TO_TOS_MAP[normalized] || normalized;
}

/**
 * Retrieves the TOS Competency metadata for a given topic code (e.g. "EST-01", "MATH-05")
 */
export function getTosCompetency(codeOrId: string): TosCompetency | undefined {
  if (!codeOrId) return undefined;
  const upper = codeOrId.toUpperCase().trim();
  if (PRC_TOS_COMPETENCIES[upper]) {
    return PRC_TOS_COMPETENCIES[upper];
  }
  // Try resolving from ID prefix
  const parts = upper.split("-");
  if (parts.length >= 2) {
    const candidateCode = `${parts[0]}-${parts[1]}`;
    if (PRC_TOS_COMPETENCIES[candidateCode]) {
      return PRC_TOS_COMPETENCIES[candidateCode];
    }
  }
  return undefined;
}
