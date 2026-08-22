/**
 * Core constants, subject taxonomies, and helper utilities.
 * Single source of truth for the entire platform.
 */

export interface SubjectConfig {
  code: string;
  label: string;
  full: string;
  totalSets: number;
  totalQuestions: number;
  totalTopics: number;
  colorName: "blue" | "amber" | "emerald" | "purple";
  badgeClass: string;
  borderClass: string;
  textClass: string;
  bgClass: string;
}

export const TOTAL_SYLLABUS_QUESTIONS = 5435;
export const TOTAL_SYLLABUS_TOPICS = 46;
export const TOTAL_SYLLABUS_SETS = 190;

export const SUBJECTS: Record<string, SubjectConfig> = {
  MATH: {
    code: "MATH",
    label: "MATH",
    full: "Mathematics",
    totalSets: 41,
    totalQuestions: 1170,
    totalTopics: 10,
    colorName: "blue",
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    borderClass: "border-l-blue-500",
    textClass: "text-blue-500",
    bgClass: "bg-blue-500",
  },
  ELECS: {
    code: "ELECS",
    label: "ELECS",
    full: "Electronics Engineering",
    totalSets: 60,
    totalQuestions: 1725,
    totalTopics: 15,
    colorName: "amber",
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    borderClass: "border-l-amber-500",
    textClass: "text-amber-500",
    bgClass: "bg-amber-500",
  },
  GEAS: {
    code: "GEAS",
    label: "GEAS",
    full: "General Engineering and Applied Sciences",
    totalSets: 48,
    totalQuestions: 1380,
    totalTopics: 11,
    colorName: "emerald",
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    borderClass: "border-l-emerald-500",
    textClass: "text-emerald-500",
    bgClass: "bg-emerald-500",
  },
  EST: {
    code: "EST",
    label: "EST",
    full: "Electronics Systems and Technologies",
    totalSets: 41,
    totalQuestions: 1160,
    totalTopics: 10,
    colorName: "purple",
    badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    borderClass: "border-l-purple-500",
    textClass: "text-purple-500",
    bgClass: "bg-purple-500",
  },
};

/**
 * Returns the matching subject config from a topicCode, subjectTag, or quiz title.
 */
export function getSubjectFromKey(key: string): SubjectConfig {
  const upper = (key || "").toUpperCase().trim();
  if (upper.startsWith("MATH") || upper.includes("ALGEBRA") || upper.includes("CALCULUS") || upper.includes("GEOMETRY") || upper.includes("PROBABILITY")) {
    return SUBJECTS.MATH;
  }
  if (upper.startsWith("ELEC") || upper.includes("CIRCUIT") || upper.includes("DIODE") || upper.includes("TRANSISTOR") || upper.includes("BJT") || upper.includes("FET")) {
    return SUBJECTS.ELECS;
  }
  if (upper.startsWith("GEAS") || upper.includes("CHEMISTRY") || upper.includes("PHYSICS") || upper.includes("ECONOMICS") || upper.includes("MECHANICS") || upper.includes("THERMO")) {
    return SUBJECTS.GEAS;
  }
  if (upper.startsWith("EST") || upper.includes("COMMUNICATION") || upper.includes("ANTENNA") || upper.includes("MODULATION") || upper.includes("TELEPHONY") || upper.includes("FIBER")) {
    return SUBJECTS.EST;
  }
  return SUBJECTS.MATH;
}

/**
 * Pluralization helper for strings like "1 set" vs "2 sets", "1 question" vs "25 questions".
 */
export function pluralize(count: number, singular: string, plural: string = singular + "s"): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

/**
 * Metric definitions for zero-dependency tooltips and legends.
 */
export const METRIC_DEFINITIONS = {
  retrievability: "Estimated probability (0–100%) that you can recall this concept right now based on past attempts and time elapsed.",
  stability: "Estimated memory half-life in days before your retention drops below the 85% review threshold.",
  fresh: "Topic retention is above 85%. No urgent review needed.",
  reviewDue: "Topic retention is decaying (65%–85%). Recommended for recovery.",
  struggling: "Recent score was below 60% or retrievability has critically lapsed (<65%).",
  anchor: "Core foundational spine concept prioritized for board exam syllabus mastery.",
  readinessIndex: "Realistic preparedness index factoring overall accuracy, retention stability, and global syllabus completion against all 5,435 board exam questions.",
};
