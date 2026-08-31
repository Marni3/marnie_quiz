/**
 * Official PRC Board of Electronics Engineering (BEE) Table of Specifications (TOS)
 * Reference: PRC Resolution / October 2022 Table of Specifications (EE2022-10 TOS.pdf)
 * 
 * Standardized Hierarchical Dot Notation:
 * [DOMAIN].[COURSE].[SUBTOPIC]
 * Example: MATH.1.1 (Differential Calculus - Limits), EST.4.1 (Transmission Lines)
 */

export type PrcDomain = "MATH" | "GEAS" | "ELECS" | "EST";

export interface TosTopic {
  code: string;           // e.g. "MATH.1.1", "EST.4.1"
  courseCode: string;     // e.g. "MATH.1", "EST.4"
  domain: PrcDomain;
  courseTitle: string;    // e.g. "Differential Calculus"
  subtopicTitle: string;  // e.g. "Functions, Continuity, and Limits"
  itemCount?: number;
  weightPercentage?: number;
}

export interface TosCourse {
  code: string;           // e.g. "MATH.1", "EST.4", "GEAS.10"
  domain: PrcDomain;
  title: string;
  weightPercentage: number;
  totalItems: number;
  topics: Record<string, string>; // subtopic code -> title
}

export const PRC_TOS_COURSES: Record<string, TosCourse> = {
  // =========================================================================
  // 1. MATHEMATICS (20% Board Exam Weight - 100 Items Total)
  // =========================================================================
  "MATH.0": {
    code: "MATH.0",
    domain: "MATH",
    title: "Foundational Pre-Calculus Mathematics",
    weightPercentage: 0,
    totalItems: 0,
    topics: {
      "MATH.0.1": "College Algebra, Polynomials & Progressions",
      "MATH.0.2": "Plane & Spherical Trigonometry",
      "MATH.0.3": "Plane & Solid Geometry",
      "MATH.0.4": "Analytic Geometry & Conic Sections",
    },
  },
  "MATH.1": {
    code: "MATH.1",
    domain: "MATH",
    title: "Differential Calculus",
    weightPercentage: 3.0,
    totalItems: 15,
    topics: {
      "MATH.1.1": "Functions, Continuity, and Limits",
      "MATH.1.2": "Derivatives and Its Applications",
      "MATH.1.3": "Higher-Order Derivatives",
      "MATH.1.4": "Parametric Equations",
      "MATH.1.5": "Partial Differentiation",
    },
  },
  "MATH.2": {
    code: "MATH.2",
    domain: "MATH",
    title: "Integral Calculus",
    weightPercentage: 3.0,
    totalItems: 15,
    topics: {
      "MATH.2.1": "Integration Concepts & Formulas",
      "MATH.2.2": "Integration Techniques",
      "MATH.2.3": "Improper Integrals",
      "MATH.2.4": "Applications of Integral (Areas, Volumes, Centroids)",
      "MATH.2.5": "Multiple Integration and Its Applications",
    },
  },
  "MATH.3": {
    code: "MATH.3",
    domain: "MATH",
    title: "Differential Equation",
    weightPercentage: 3.0,
    totalItems: 15,
    topics: {
      "MATH.3.1": "First-Order, First-Degree ODE and Its Applications",
      "MATH.3.2": "Higher-Order ODE and Its Applications",
      "MATH.3.3": "Laplace Transforms, Inverses, and Its Applications",
    },
  },
  "MATH.4": {
    code: "MATH.4",
    domain: "MATH",
    title: "Advanced Engineering Mathematics for ECE",
    weightPercentage: 3.0,
    totalItems: 15,
    topics: {
      "MATH.4.1": "Complex Numbers and Its Applications",
      "MATH.4.2": "Series and Transforms (Power Series, Bessel, Legendre, Fourier)",
      "MATH.4.3": "Partial Differential Equations",
      "MATH.4.4": "Simultaneous Linear and Non-Linear Equations",
      "MATH.4.5": "Numerical Differentiation, Integration and Optimization",
    },
  },
  "MATH.5": {
    code: "MATH.5",
    domain: "MATH",
    title: "Engineering Data Analysis",
    weightPercentage: 3.0,
    totalItems: 15,
    topics: {
      "MATH.5.1": "Obtaining Data",
      "MATH.5.2": "Statistical Sampling, Distributions and Intervals",
      "MATH.5.3": "Test of Hypothesis",
      "MATH.5.4": "Regression and Correlation",
      "MATH.5.5": "Design of Experiments",
    },
  },
  "MATH.6": {
    code: "MATH.6",
    domain: "MATH",
    title: "Electromagnetics (shared w/ ELEX)",
    weightPercentage: 1.8,
    totalItems: 9,
    topics: {
      "MATH.6.1": "Vector Analysis & Vector Identities",
      "MATH.6.2": "Directional Derivative, Gradient, Divergence, Curl",
      "MATH.6.3": "Integral Theorems (Green's Lemma, Divergence, Stokes')",
    },
  },
  "MATH.7": {
    code: "MATH.7",
    domain: "MATH",
    title: "Signals, Spectra & Signal Processing (shared w/ EST)",
    weightPercentage: 1.6,
    totalItems: 8,
    topics: {
      "MATH.7.1": "Z-Transforms",
      "MATH.7.2": "Convolution",
      "MATH.7.3": "Correlation",
    },
  },
  "MATH.8": {
    code: "MATH.8",
    domain: "MATH",
    title: "Feedback and Control Systems (shared w/ ELEX)",
    weightPercentage: 1.6,
    totalItems: 8,
    topics: {
      "MATH.8.1": "Pole and Zero Determination",
      "MATH.8.2": "Transient Response",
      "MATH.8.3": "Block Diagram and Signal Flow",
    },
  },

  // =========================================================================
  // 2. GENERAL ENGINEERING & APPLIED SCIENCES (20% Weight - 100 Items Total)
  // =========================================================================
  "GEAS.1": {
    code: "GEAS.1",
    domain: "GEAS",
    title: "Chemistry for Engineers",
    weightPercentage: 2.0,
    totalItems: 10,
    topics: {
      "GEAS.1.1": "Energy",
      "GEAS.1.2": "Chemistry of Engineering Materials",
      "GEAS.1.3": "Chemistry of Nano-materials",
      "GEAS.1.4": "Chemistry of the Environment & Special Topics",
    },
  },
  "GEAS.2": {
    code: "GEAS.2",
    domain: "GEAS",
    title: "Physics for Engineers",
    weightPercentage: 3.0,
    totalItems: 15,
    topics: {
      "GEAS.2.1": "Work, Energy & Power, Impulse & Momentum, Kinematics, Dynamics",
      "GEAS.2.2": "Dynamics of Rotation, Elasticity, Oscillations/Waves",
      "GEAS.2.3": "Fluids & Heat Transfer",
      "GEAS.2.4": "Electrostatics, Electricity, Magnetism, Optics",
    },
  },
  "GEAS.3": {
    code: "GEAS.3",
    domain: "GEAS",
    title: "Engineering Economics",
    weightPercentage: 1.2,
    totalItems: 6,
    topics: {
      "GEAS.3.1": "Engineering Economics Introduction Terms & Principles",
      "GEAS.3.2": "Money-Time Relationship, Equivalence & Basic Economy Methods",
      "GEAS.3.3": "Decisions Under Certainty, Risk & Admitting Uncertainty",
    },
  },
  "GEAS.4": {
    code: "GEAS.4",
    domain: "GEAS",
    title: "Engineering Management",
    weightPercentage: 1.8,
    totalItems: 9,
    topics: {
      "GEAS.4.1": "Evolution of Management Theory & Its Function",
      "GEAS.4.2": "Planning, Leading, Organizing and Controlling",
      "GEAS.4.3": "Managing Operations, Marketing & Finance",
    },
  },
  "GEAS.5": {
    code: "GEAS.5",
    domain: "GEAS",
    title: "Technopreneurship 101",
    weightPercentage: 2.0,
    totalItems: 10,
    topics: {
      "GEAS.5.1": "Technopreneurship, Value Proposition, Ethics & Globalization",
      "GEAS.5.2": "Market Identification, Analysis & Competitive Advantage",
      "GEAS.5.3": "Business Models, Intellectual Property, Execution & Funding",
    },
  },
  "GEAS.6": {
    code: "GEAS.6",
    domain: "GEAS",
    title: "Physics 2",
    weightPercentage: 2.0,
    totalItems: 10,
    topics: {
      "GEAS.6.1": "Thermodynamics & Condensed Matter",
      "GEAS.6.2": "Electricity, Magnetism & EM Induction",
      "GEAS.6.3": "Inductance, AC & Optics",
    },
  },
  "GEAS.7": {
    code: "GEAS.7",
    domain: "GEAS",
    title: "Materials Science and Engineering",
    weightPercentage: 1.6,
    totalItems: 8,
    topics: {
      "GEAS.7.1": "Fundamentals, Atomic Structure & Crystalline Materials",
      "GEAS.7.2": "Imperfections, Diffusion & Mechanical Properties of Metals",
      "GEAS.7.3": "Ceramics, Polymers, Composites, Electrical/Optical Properties",
    },
  },
  "GEAS.8": {
    code: "GEAS.8",
    domain: "GEAS",
    title: "Computer Programming",
    weightPercentage: 2.0,
    totalItems: 10,
    topics: {
      "GEAS.8.1": "Object-Oriented Programming & UML Analysis/Design",
      "GEAS.8.2": "Programming Language Fundamentals",
      "GEAS.8.3": "Exception Handling & Graphical User Interface Programming",
    },
  },
  "GEAS.9": {
    code: "GEAS.9",
    domain: "GEAS",
    title: "Environmental Science and Engineering",
    weightPercentage: 2.0,
    totalItems: 10,
    topics: {
      "GEAS.9.1": "Nature, Ecology, Natural Systems & Resources",
      "GEAS.9.2": "Environmental Concerns, Crises & Impact Assessment (EIA)",
      "GEAS.9.3": "Sustainable Development",
    },
  },
  "GEAS.10": {
    code: "GEAS.10",
    domain: "GEAS",
    title: "ECE Laws, Contracts, Ethics, Standards & Safety",
    weightPercentage: 2.0,
    totalItems: 10,
    topics: {
      "GEAS.10.1": "Fundamentals of Laws, Obligations and Contracts",
      "GEAS.10.2": "Pledge of ECE, CSC Guidelines, Board Exam & PRC Regulation",
      "GEAS.10.3": "Practicing the ECE Profession (RA 9292 Provisions)",
      "GEAS.10.4": "Other ECE Related Statutes, Safety Standards & PEC Codes",
    },
  },
  "GEAS.11": {
    code: "GEAS.11",
    domain: "GEAS",
    title: "Computer-Aided Design (CAD)",
    weightPercentage: 0.4,
    totalItems: 2,
    topics: {
      "GEAS.11.1": "CAD Environment, Snapping, Construction Elements & Plotting",
    },
  },

  // =========================================================================
  // 3. ELECTRONICS ENGINEERING (30% Weight - 100 Items Total)
  // =========================================================================
  "ELECS.1": {
    code: "ELECS.1",
    domain: "ELECS",
    title: "DC Electrical Circuits",
    weightPercentage: 3.6,
    totalItems: 12,
    topics: {
      "ELECS.1.1": "Resistive Networks",
      "ELECS.1.2": "Mesh and Node Equations",
      "ELECS.1.3": "Network Theorems",
      "ELECS.1.4": "Transient Analysis",
      "ELECS.1.5": "Solutions to DC Network Problems",
    },
  },
  "ELECS.2": {
    code: "ELECS.2",
    domain: "ELECS",
    title: "AC Electrical Circuits",
    weightPercentage: 3.6,
    totalItems: 12,
    topics: {
      "ELECS.2.1": "Solutions to AC Network Problems",
      "ELECS.2.2": "Impedance and Admittance",
      "ELECS.2.3": "Resonance",
      "ELECS.2.4": "Power in AC Circuits",
      "ELECS.2.5": "Two-Port Network Parameters & Transfer Function",
    },
  },
  "ELECS.3": {
    code: "ELECS.3",
    domain: "ELECS",
    title: "Electromagnetics (shared w/ MATH)",
    weightPercentage: 2.4,
    totalItems: 8,
    topics: {
      "ELECS.3.1": "Steady Electric and Magnetic Fields",
      "ELECS.3.2": "Dielectric and Magnetic Materials",
      "ELECS.3.3": "Coupled and Magnetic Circuits",
      "ELECS.3.4": "Time-Varying Fields and Maxwell's Equations",
    },
  },
  "ELECS.4": {
    code: "ELECS.4",
    domain: "ELECS",
    title: "Electronic Devices and Circuits",
    weightPercentage: 4.2,
    totalItems: 14,
    topics: {
      "ELECS.4.1": "Diode Wave Shaping Circuits & Special Diodes",
      "ELECS.4.2": "BJT and FET Small Signal Analysis",
      "ELECS.4.3": "Diode Equivalent Circuits",
      "ELECS.4.4": "Voltage Multipliers, Power Supply & Voltage Regulation",
      "ELECS.4.5": "Bipolar Junction Transistors and FETs",
    },
  },
  "ELECS.5": {
    code: "ELECS.5",
    domain: "ELECS",
    title: "Electronic Circuit Analysis and Design",
    weightPercentage: 4.2,
    totalItems: 14,
    topics: {
      "ELECS.5.1": "BJT and FET Frequency Response",
      "ELECS.5.2": "Cascade and Cascode Connections",
      "ELECS.5.3": "Current Mirrors and Current Sources",
      "ELECS.5.4": "Differential and Operational Amplifiers",
      "ELECS.5.5": "Feedback Systems, Oscillators, and Filters",
    },
  },
  "ELECS.6": {
    code: "ELECS.6",
    domain: "ELECS",
    title: "Electronic Systems and Design (shared w/ EST)",
    weightPercentage: 2.4,
    totalItems: 8,
    topics: {
      "ELECS.6.1": "SCRs, UJT, PUT, TRIAC, DIAC & Thyristors",
      "ELECS.6.2": "Optoelectronic Devices and Sensors",
      "ELECS.6.3": "Transducers, Data Acquisition & Interfacing",
      "ELECS.6.4": "PLCs, Building Management Systems & Security Controls",
    },
  },
  "ELECS.7": {
    code: "ELECS.7",
    domain: "ELECS",
    title: "Logic Circuits and Switching Theory",
    weightPercentage: 3.6,
    totalItems: 12,
    topics: {
      "ELECS.7.1": "Boolean Algebra and Logic Gates",
      "ELECS.7.2": "Minimization of Combinational Logic Circuits",
      "ELECS.7.3": "Sequential Logic Circuits",
      "ELECS.7.4": "Algorithmic State Machines (ASM) & Asynchronous Logic",
    },
  },
  "ELECS.8": {
    code: "ELECS.8",
    domain: "ELECS",
    title: "Microprocessor & Microcontroller Systems and Design",
    weightPercentage: 3.6,
    totalItems: 12,
    topics: {
      "ELECS.8.1": "Microprocessor Units & Architecture",
      "ELECS.8.2": "Memory Subsystems",
      "ELECS.8.3": "I/O Subsystems & Bus Interfacing",
      "ELECS.8.4": "Instruction Set Architecture & Assembly Programming",
      "ELECS.8.5": "Microcontrollers",
    },
  },
  "ELECS.9": {
    code: "ELECS.9",
    domain: "ELECS",
    title: "Feedback and Control Systems (shared w/ MATH)",
    weightPercentage: 2.4,
    totalItems: 8,
    topics: {
      "ELECS.9.1": "Block Diagram Representation & Signal Flow Graphs",
      "ELECS.9.2": "LTI Systems and Transient Analysis",
      "ELECS.9.3": "System Modeling and Transfer Functions",
      "ELECS.9.4": "Poles/Zeros, Root Locus & Stability Analysis",
      "ELECS.9.5": "Steady-State Analysis and Frequency Response",
    },
  },

  // =========================================================================
  // 4. ELECTRONICS SYSTEMS & TECHNOLOGIES (30% Weight - 100 Items Total)
  // =========================================================================
  "EST.1": {
    code: "EST.1",
    domain: "EST",
    title: "Signals, Spectra, Signal Processing",
    weightPercentage: 1.0,
    totalItems: 10,
    topics: {
      "EST.1.1": "Classification and Characteristics of Signals",
      "EST.1.2": "Sampling Theorem and Aliasing",
      "EST.1.3": "Difference Equations for FIR and IIR Filters",
      "EST.1.4": "Convolution, Correlation, Z-Transforms & Filtering",
    },
  },
  "EST.2": {
    code: "EST.2",
    domain: "EST",
    title: "Principles of Communications",
    weightPercentage: 7.5,
    totalItems: 25,
    topics: {
      "EST.2.1": "Introduction to Communications Systems",
      "EST.2.2": "Noise Calculations & Signal-to-Noise Ratio",
      "EST.2.3": "Amplitude Modulation, SSB Techniques, Frequency Modulation",
      "EST.2.4": "Radio Receivers & Superheterodyne Principles",
      "EST.2.5": "Pulse Modulation, Digital Modulation & Broadband Systems",
    },
  },
  "EST.3": {
    code: "EST.3",
    domain: "EST",
    title: "Digital Communications",
    weightPercentage: 4.5,
    totalItems: 15,
    topics: {
      "EST.3.1": "Introduction to Digital Communications Systems",
      "EST.3.2": "Digital Transmission, PAM, PWM, PPM, PCM",
      "EST.3.3": "Digital Modulation (ASK, FSK, PSK, QAM)",
      "EST.3.4": "Basics of Information Theory & Error Detection",
      "EST.3.5": "Multiplexing & Multiple Access (FDM, TDM, WDM, CDMA)",
    },
  },
  "EST.4": {
    code: "EST.4",
    domain: "EST",
    title: "Transmission and Antenna Systems",
    weightPercentage: 6.9,
    totalItems: 23,
    topics: {
      "EST.4.1": "Transmission Lines, Losses, Parameters, Matching & Smith Charts",
      "EST.4.2": "Radio Wave Propagation, Power Density & Field Strength",
      "EST.4.3": "Antenna Systems & Radiation Mechanisms",
      "EST.4.4": "Waveguides & Fiber Optics",
    },
  },
  "EST.5": {
    code: "EST.5",
    domain: "EST",
    title: "Electronics 3: Electronic Systems and Design",
    weightPercentage: 2.1,
    totalItems: 7,
    topics: {
      "EST.5.1": "Optoelectronic Devices, Sensors & Transducers",
      "EST.5.2": "Interfacing Techniques & Programmable Logic Controllers",
      "EST.5.3": "Building Management Systems, HVAC, Security & SCADA Controls",
    },
  },
  "EST.6": {
    code: "EST.6",
    domain: "EST",
    title: "Data Communications",
    weightPercentage: 6.0,
    totalItems: 20,
    topics: {
      "EST.6.1": "Data Communications, Topologies & Network Configurations",
      "EST.6.2": "Transmission Modes, Synchronization & Network Hardware",
      "EST.6.3": "Open Systems Interconnection (OSI) & TCP/IP Architecture",
      "EST.6.4": "Protocols (Character/Bit-Oriented) & LAN/MAN/WAN Networks",
    },
  },
};

/**
 * Bidirectional Legacy to TOS Dot-Notation Alias Mapping
 * Ensures 100% backward compatibility for all existing URLs, bookmarks, and stored notes.
 */
export const LEGACY_TO_TOS_MAP: Record<string, string> = {
  // Legacy Math IDs to Dot Notation
  "math-01": "math.0.1",
  "math-01-01": "math.0.1",
  "math-01-02": "math.0.1",
  "math-01-03": "math.0.1",
  "math-01-04": "math.0.1",

  "math-02": "math.5.2",       // Probability -> 5.0 Data Analysis
  "math-02-01": "math.5.2",
  "math-02-02": "math.5.2",
  "math-02-03": "math.5.2",

  "math-03": "math.5.2",       // Statistics
  "math-03-01": "math.5.2",
  "math-03-02": "math.5.2",
  "math-03-03": "math.5.2",

  "math-04": "math.0.1",       // Discrete Math
  "math-04-01": "math.0.1",
  "math-04-02": "math.0.1",
  "math-04-03": "math.0.1",
  "math-04-04": "math.0.1",

  "math-05": "math.0.2",       // Trigonometry -> Foundations 0.2
  "math-05-01": "math.0.2",
  "math-05-02": "math.0.2",
  "math-05-03": "math.0.2",
  "math-05-04": "math.0.2",
  "math-05-05": "math.0.2",

  "math-06": "math.0.2",       // Spherical Trig
  "math-06-01": "math.0.2",
  "math-06-02": "math.0.2",
  "math-06-03": "math.0.2",

  "math-07": "math.0.3",       // Plane Geometry -> Foundations 0.3
  "math-07-01": "math.0.3",
  "math-07-02": "math.0.3",
  "math-07-03": "math.0.3",
  "math-07-04": "math.0.3",

  "math-08": "math.0.3",       // Solid Geometry
  "math-08-01": "math.0.3",
  "math-08-02": "math.0.3",
  "math-08-03": "math.0.3",
  "math-08-04": "math.0.3",

  "math-09": "math.0.4",       // Analytic Geometry -> Foundations 0.4
  "math-09-01": "math.0.4",
  "math-09-02": "math.0.4",
  "math-09-03": "math.0.4",

  "math-10": "math.1.1",       // Differential Calculus -> Course 1.0
  "math-10-01": "math.1.1",
  "math-10-02": "math.1.2",
  "math-10-03": "math.1.2",

  "math-11": "math.2.1",       // Integral Calculus -> Course 2.0
  "math-11-01": "math.2.1",

  "math-12": "math.3.1",       // Differential Equations -> Course 3.0
  "math-12-01": "math.3.1",
  "math-12-02": "math.3.2",
  "math-12-03": "math.3.3",

  "math-13": "math.4.1",       // Advanced Math -> Course 4.0
  "math-13-01": "math.4.1",
  "math-13-02": "math.4.2",
  "math-13-03": "math.4.4",

  // Legacy GEAS IDs
  "geas-10": "geas.10.3",      // RA 9292 ECE Law -> Course 10.0
  "geas-10-01": "geas.10.3",
  "geas-10-02": "geas.10.3",
  "geas-10-03": "geas.10.4",
  "geas-08-01": "geas.10.3",
  "geas-08-02": "geas.10.3",
  "geas-08-03": "geas.10.4",

  // Legacy EST IDs
  "est-01": "est.4.1",
  "est-01-01": "est.4.1",
  "est-01-02": "est.4.1",
};

/**
 * Resolves any legacy, slug, or dash-formatted ID to its canonical Dot Notation
 */
export function resolveTosId(rawId: string): string {
  if (!rawId) return "";
  const normalized = rawId.toLowerCase().trim();
  return LEGACY_TO_TOS_MAP[normalized] || normalized;
}

/**
 * Retrieves the TOS Course metadata for a given course or topic code (e.g. "MATH.1", "EST.4.1")
 */
export function getTosCourse(code: string): TosCourse | undefined {
  if (!code) return undefined;
  const upper = code.toUpperCase().trim();
  if (PRC_TOS_COURSES[upper]) {
    return PRC_TOS_COURSES[upper];
  }
  // Try resolving from 2-part prefix (e.g. "EST.4.1" -> "EST.4")
  const parts = upper.split(".");
  if (parts.length >= 2) {
    const candidate = `${parts[0]}.${parts[1]}`;
    if (PRC_TOS_COURSES[candidate]) {
      return PRC_TOS_COURSES[candidate];
    }
  }
  return undefined;
}
