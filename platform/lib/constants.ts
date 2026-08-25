/**
 * Platform-wide constants, taxonomy definitions, and shared formatters.
 */

export interface SubjectMeta {
  key: string;
  name: string;
  code: string;
  label: string;
  full: string;
  badgeClass: string;
  color: string;
  borderClass: string;
  bgGlow: string;
  totalTopics: number;
  totalQuestions: number;
}

export const SUBJECTS: Record<string, SubjectMeta> = {
  MATH: {
    key: "MATH",
    name: "Mathematics",
    code: "MATH",
    label: "MATH",
    full: "Mathematics",
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    color: "from-blue-500 to-cyan-500",
    borderClass: "border-l-blue-500",
    bgGlow: "rgba(59, 130, 246, 0.15)",
    totalTopics: 13,
    totalQuestions: 1470,
  },
  ELECS: {
    key: "ELECS",
    name: "Electronics Engineering",
    code: "ELEC",
    label: "ELECS",
    full: "Electronics Engineering",
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    color: "from-amber-500 to-orange-500",
    borderClass: "border-l-amber-500",
    bgGlow: "rgba(245, 158, 11, 0.15)",
    totalTopics: 15,
    totalQuestions: 1725,
  },
  GEAS: {
    key: "GEAS",
    name: "General Engineering & Applied Sciences",
    code: "GEAS",
    label: "GEAS",
    full: "General Engineering & Applied Sciences",
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    color: "from-emerald-500 to-teal-500",
    borderClass: "border-l-emerald-500",
    bgGlow: "rgba(16, 185, 129, 0.15)",
    totalTopics: 12,
    totalQuestions: 1380,
  },
  EST: {
    key: "EST",
    name: "Electronics Systems & Technologies",
    code: "EST",
    label: "EST",
    full: "Electronics Systems & Technologies",
    badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    color: "from-purple-500 to-pink-500",
    borderClass: "border-l-purple-500",
    bgGlow: "rgba(168, 85, 247, 0.15)",
    totalTopics: 10,
    totalQuestions: 1160,
  },
};

export const TOPIC_CATALOG: Record<string, { code: string; name: string; domain: "MATH" | "ELECS" | "GEAS" | "EST"; order: number }> = {
  // MATH (01 to 13)
  "Algebra": { code: "MATH-01", name: "Algebra", domain: "MATH", order: 1 },
  "Probability": { code: "MATH-02", name: "Probability", domain: "MATH", order: 2 },
  "Statistics": { code: "MATH-03", name: "Statistics", domain: "MATH", order: 3 },
  "Discrete Mathematics": { code: "MATH-04", name: "Discrete Mathematics", domain: "MATH", order: 4 },
  "Trigonometry": { code: "MATH-05", name: "Trigonometry", domain: "MATH", order: 5 },
  "Plane Geometry": { code: "MATH-06", name: "Plane Geometry", domain: "MATH", order: 6 },
  "Solid Geometry": { code: "MATH-07", name: "Solid Geometry", domain: "MATH", order: 7 },
  "Solid Mensuration": { code: "MATH-08", name: "Solid Mensuration", domain: "MATH", order: 8 },
  "Analytic Geometry": { code: "MATH-09", name: "Analytic Geometry", domain: "MATH", order: 9 },
  "Differential Calculus": { code: "MATH-10", name: "Differential Calculus", domain: "MATH", order: 10 },
  "Integral Calculus": { code: "MATH-11", name: "Integral Calculus", domain: "MATH", order: 11 },
  "Differential Equations": { code: "MATH-12", name: "Differential Equations", domain: "MATH", order: 12 },
  "Advanced Engineering Math": { code: "MATH-13", name: "Advanced Engineering Math", domain: "MATH", order: 13 },
  "Advanced Math": { code: "MATH-13", name: "Advanced Engineering Math", domain: "MATH", order: 13 },

  // ELECS (01 to 15)
  "Electrical Elements": { code: "ELEC-01", name: "Electrical Elements", domain: "ELECS", order: 1 },
  "Power Supplies": { code: "ELEC-02", name: "Power Supplies", domain: "ELECS", order: 2 },
  "Dc Circuits": { code: "ELEC-03", name: "Dc Circuits", domain: "ELECS", order: 3 },
  "Ac Circuits": { code: "ELEC-04", name: "Ac Circuits", domain: "ELECS", order: 4 },
  "Transients And Resonant Circuits": { code: "ELEC-05", name: "Transients And Resonant Circuits", domain: "ELECS", order: 5 },
  "Semiconductor Physics And Diodes": { code: "ELEC-06", name: "Semiconductor Physics And Diodes", domain: "ELECS", order: 6 },
  "Bjt": { code: "ELEC-07", name: "Bjt", domain: "ELECS", order: 7 },
  "Fet And Mosfet": { code: "ELEC-08", name: "Fet And Mosfet", domain: "ELECS", order: 8 },
  "Op Amps": { code: "ELEC-09", name: "Op Amps", domain: "ELECS", order: 9 },
  "Feedback And Oscillators": { code: "ELEC-10", name: "Feedback And Oscillators", domain: "ELECS", order: 10 },
  "Industrial Electronics": { code: "ELEC-11", name: "Industrial Electronics", domain: "ELECS", order: 11 },
  "Microelectronics": { code: "ELEC-12", name: "Microelectronics", domain: "ELECS", order: 12 },
  "Test And Measurement": { code: "ELEC-13", name: "Test And Measurement", domain: "ELECS", order: 13 },
  "Control Systems": { code: "ELEC-14", name: "Control Systems", domain: "ELECS", order: 14 },
  "Digital Electronics": { code: "ELEC-15", name: "Digital Electronics", domain: "ELECS", order: 15 },

  // GEAS (01 to 12)
  "Chemistry": { code: "GEAS-01", name: "Chemistry", domain: "GEAS", order: 1 },
  "Physics 1": { code: "GEAS-02", name: "Physics 1", domain: "GEAS", order: 2 },
  "Physics 2": { code: "GEAS-03", name: "Physics 2", domain: "GEAS", order: 3 },
  "Electricity And Magnetism": { code: "GEAS-03", name: "Electricity And Magnetism", domain: "GEAS", order: 3 },
  "Engineering Mechanics And Strength Of Materials": { code: "GEAS-04", name: "Engineering Mechanics And Strength Of Materials", domain: "GEAS", order: 4 },
  "Thermodynamics": { code: "GEAS-05", name: "Thermodynamics", domain: "GEAS", order: 5 },
  "Engineering Economics": { code: "GEAS-06", name: "Engineering Economics", domain: "GEAS", order: 6 },
  "Electromagnetics": { code: "GEAS-07", name: "Electromagnetics", domain: "GEAS", order: 7 },
  "Ece Laws": { code: "GEAS-08", name: "Ece Laws", domain: "GEAS", order: 8 },
  "Material Science": { code: "GEAS-09", name: "Material Science", domain: "GEAS", order: 9 },
  "Computer Programming": { code: "GEAS-10", name: "Computer Programming", domain: "GEAS", order: 10 },
  "Environmental Science": { code: "GEAS-11", name: "Environmental Science", domain: "GEAS", order: 11 },
  "Technopreneurship": { code: "GEAS-12", name: "Technopreneurship", domain: "GEAS", order: 12 },

  // EST (01 to 10)
  "Fundamentals Of Communications": { code: "EST-01", name: "Fundamentals Of Communications", domain: "EST", order: 1 },
  "Radiowave Propagation": { code: "EST-02", name: "Radiowave Propagation", domain: "EST", order: 2 },
  "Analog Modulation": { code: "EST-03", name: "Analog Modulation", domain: "EST", order: 3 },
  "Digital Communications": { code: "EST-04", name: "Digital Communications", domain: "EST", order: 4 },
  "Transmission Lines": { code: "EST-05", name: "Transmission Lines", domain: "EST", order: 5 },
  "Antennas": { code: "EST-06", name: "Antennas", domain: "EST", order: 6 },
  "Microwave Communications": { code: "EST-07", name: "Microwave Communications", domain: "EST", order: 7 },
  "Optical Fiber Communications": { code: "EST-08", name: "Optical Fiber Communications", domain: "EST", order: 8 },
  "Telephony": { code: "EST-09", name: "Telephony", domain: "EST", order: 9 },
  "Data Communications": { code: "EST-10", name: "Data Communications", domain: "EST", order: 10 },
};

export const TOTAL_SYLLABUS_TOPICS = 50;
export const TOTAL_SYLLABUS_QUESTIONS = 5735;

export const SYLLABUS_BENCHMARKS: Record<string, { totalQuestions: number; totalTopics: number }> = {
  MATH: { totalQuestions: 1470, totalTopics: 13 },
  ELECS: { totalQuestions: 1725, totalTopics: 15 },
  GEAS: { totalQuestions: 1380, totalTopics: 12 },
  EST: { totalQuestions: 1160, totalTopics: 10 },
};

export const METRIC_DEFINITIONS: Record<string, string> = {
  retrievability: "Probability of successfully recalling this topic today based on your exponential forgetting curve.",
  stability: "Estimated number of days before memory retrievability falls below 90% without review.",
  fresh: "Topics with Retrievability ≥ 85%. Strong retention; review not yet urgent.",
  reviewDue: "Topics where Retrievability has dropped below 85% or elapsed days exceed stability.",
  struggling: "Topics with Retrievability < 60% or recent quiz accuracy < 70%. Need immediate active retrieval.",
  readinessIndex: "Calibrated composite score: Accuracy × Average Retention × √(Completed Topics / Total Syllabus Topics).",
};

export function inferSubjectAndTopicCode(input: {
  topicCode?: string | null;
  title?: string | null;
  subjectTag?: string | null;
}): {
  subject: SubjectMeta;
  topicCode: string;
  topicNumber: number;
} {
  const code = (input.topicCode || "").trim().toUpperCase();
  const title = (input.title || "").trim();
  const tag = (input.subjectTag || "").trim();

  // 1. Direct match on topicCode e.g. "MATH-01", "ELEC-03", "GEAS-01", "EST-01"
  if (code) {
    if (code.startsWith("MATH")) {
      const num = parseInt(code.replace(/\D/g, ""), 10) || 1;
      return { subject: SUBJECTS.MATH, topicCode: code, topicNumber: num };
    }
    if (code.startsWith("ELEC")) {
      const num = parseInt(code.replace(/\D/g, ""), 10) || 1;
      return { subject: SUBJECTS.ELECS, topicCode: code, topicNumber: num };
    }
    if (code.startsWith("GEAS")) {
      const num = parseInt(code.replace(/\D/g, ""), 10) || 1;
      return { subject: SUBJECTS.GEAS, topicCode: code, topicNumber: num };
    }
    if (code.startsWith("EST")) {
      const num = parseInt(code.replace(/\D/g, ""), 10) || 1;
      return { subject: SUBJECTS.EST, topicCode: code, topicNumber: num };
    }
  }

  // 2. Parse from Title e.g. "MATH 01 - Algebra", "ELEC 03 - Dc Circuits", "Math ADV"
  const m = title.match(/^([A-Za-z]+)\s*(\d+|ADV|DE)\b/i);
  if (m) {
    const rawDom = m[1].toUpperCase();
    const rawNum = m[2].toUpperCase();

    let subject = SUBJECTS.MATH;
    let prefix = "MATH";
    if (rawDom.startsWith("ELEC")) {
      subject = SUBJECTS.ELECS;
      prefix = "ELEC";
    } else if (rawDom.startsWith("GEAS")) {
      subject = SUBJECTS.GEAS;
      prefix = "GEAS";
    } else if (rawDom.startsWith("EST")) {
      subject = SUBJECTS.EST;
      prefix = "EST";
    }

    let num = rawNum;
    if (rawNum === "ADV") num = "13";
    if (rawNum === "DE") num = "12";
    const pad = /^\d+$/.test(num) ? String(Number(num)).padStart(2, "0") : num;
    const resolvedCode = `${prefix}-${pad}`;
    return { subject, topicCode: resolvedCode, topicNumber: parseInt(num, 10) || 1 };
  }

  // 3. Match from SubjectTag in catalog
  if (tag && TOPIC_CATALOG[tag]) {
    const entry = TOPIC_CATALOG[tag];
    const subject = SUBJECTS[entry.domain] || SUBJECTS.MATH;
    return { subject, topicCode: entry.code, topicNumber: entry.order };
  }

  return { subject: SUBJECTS.MATH, topicCode: "GEN-01", topicNumber: 1 };
}

export function getSubjectFromKey(key: string): SubjectMeta {
  const upper = (key || "").toUpperCase().trim();
  if (upper.startsWith("MATH") || upper === "MATHEMATICS") return SUBJECTS.MATH;
  if (upper.startsWith("ELEC") || upper === "ELECS" || upper === "ELECTRONICS ENGINEERING") return SUBJECTS.ELECS;
  if (upper.startsWith("GEAS") || upper === "GENERAL ENGINEERING & APPLIED SCIENCES") return SUBJECTS.GEAS;
  if (upper.startsWith("EST") || upper === "ELECTRONICS SYSTEMS & TECHNOLOGIES") return SUBJECTS.EST;

  // Fallback to topic catalog lookup
  if (TOPIC_CATALOG[key]) {
    return SUBJECTS[TOPIC_CATALOG[key].domain];
  }

  return SUBJECTS.MATH;
}

export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) return `1 ${singular}`;
  return `${count.toLocaleString()} ${plural || singular + "s"}`;
}

export function formatTopicCode(code: string): string {
  if (!code) return "GEN 01";
  const upper = code.toUpperCase().trim();
  const mMulti = upper.match(/^([A-Z]+)[-_](\d+)[-_](\d+)/);
  if (mMulti) {
    return `${mMulti[1]} ${mMulti[2]} & ${mMulti[3]}`;
  }
  const mSingle = upper.match(/^([A-Z]+)[-_](\d+)/);
  if (mSingle) {
    return `${mSingle[1]} ${mSingle[2]}`;
  }
  return upper.replace(/[-_]/g, " ");
}
