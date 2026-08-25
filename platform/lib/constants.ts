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

export function getSubjectFromKey(key: string): SubjectMeta {
  const upper = (key || "").toUpperCase();
  if (upper.includes("MATH")) return SUBJECTS.MATH;
  if (upper.includes("ELEC")) return SUBJECTS.ELECS;
  if (upper.includes("GEAS")) return SUBJECTS.GEAS;
  if (upper.includes("EST")) return SUBJECTS.EST;
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
