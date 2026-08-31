import { db } from "./db/client";
import {
  attempts,
  answerRecords,
  questions,
  questionSets,
  userModuleProgress,
} from "./db/schema";
import { eq, and, sql, desc } from "drizzle-orm";
import { getUserTopicSrsOverview } from "./srs";
import { getAllLearningModules } from "./modules";
import { SUBJECTS, getSubjectFromKey, TOTAL_SYLLABUS_QUESTIONS, TOTAL_SYLLABUS_TOPICS } from "./constants";

export interface SubjectAnalytics {
  code: string;
  label: string;
  full: string;
  badgeClass: string;
  borderClass: string;
  totalAttempts: number;
  uniqueQuestionsAttempted: number;
  totalSyllabusQuestions: number;
  syllabusPercent: number;
  correctQuestions: number;
  accuracy: number;
  avgSecondsPerQ: number;
  retrievability: number;
  trackedTopics: number;
  totalTopics: number;
  totalModules: number;
  completedModules: number;
  moduleCompletionPercent: number;
}

export interface ArchetypeMastery {
  archetype: string;
  label: string;
  total: number;
  correct: number;
  accuracy: number;
}

export interface UserAnalyticsOverview {
  readinessIndex: number;
  isCalibrated: boolean;
  calibrationProgress: number; // 0 to 3
  overallAccuracy: number;
  overallAvgPaceSeconds: number;
  totalQuestionsAnswered: number;
  totalUniqueQuestionsAnswered: number;
  totalQuizzesTaken: number;
  totalModulesAvailable: number;
  totalModulesCompleted: number;
  globalModulePercent: number;
  subjectAnalytics: Record<string, SubjectAnalytics>;
  archetypeMastery: ArchetypeMastery[];
  recentActivity: { date: string; count: number; accuracy: number }[];
}

export async function getUserAnalyticsOverview(userId: string): Promise<UserAnalyticsOverview> {
  try {
    // 1. Fetch all user attempts
    const userAttempts = await db
      .select({
        attempt: attempts,
        set: questionSets,
      })
      .from(attempts)
      .innerJoin(questionSets, eq(attempts.questionSetId, questionSets.id))
      .where(and(eq(attempts.userId, userId), sql`${attempts.completedAt} IS NOT NULL`))
      .orderBy(desc(attempts.completedAt));

    // 2. Fetch all user answer records with questions
    const userAnswers = await db
      .select({
        ans: answerRecords,
        q: questions,
        set: questionSets,
      })
      .from(answerRecords)
      .innerJoin(questions, eq(answerRecords.questionId, questions.id))
      .innerJoin(attempts, eq(answerRecords.attemptId, attempts.id))
      .innerJoin(questionSets, eq(attempts.questionSetId, questionSets.id))
      .where(eq(attempts.userId, userId));

    // 3. Fetch SRS overview
    const srsOverview = await getUserTopicSrsOverview(userId);

    // Subject breakdown aggregators
    const subjectStats: Record<string, {
      uniqueQuestionIds: Set<string>;
      totalQ: number;
      correctQ: number;
      totalTime: number;
      timeCount: number;
      attempts: number;
    }> = {
      MATH: { uniqueQuestionIds: new Set(), totalQ: 0, correctQ: 0, totalTime: 0, timeCount: 0, attempts: 0 },
      ELECS: { uniqueQuestionIds: new Set(), totalQ: 0, correctQ: 0, totalTime: 0, timeCount: 0, attempts: 0 },
      GEAS: { uniqueQuestionIds: new Set(), totalQ: 0, correctQ: 0, totalTime: 0, timeCount: 0, attempts: 0 },
      EST: { uniqueQuestionIds: new Set(), totalQ: 0, correctQ: 0, totalTime: 0, timeCount: 0, attempts: 0 },
    };

    // Archetype breakdown aggregators
    const archetypeStats: Record<string, { total: number; correct: number }> = {
      standard: { total: 0, correct: 0 },
      scaling: { total: 0, correct: 0 },
      boundary: { total: 0, correct: 0 },
      phase: { total: 0, correct: 0 },
      fault: { total: 0, correct: 0 },
      material: { total: 0, correct: 0 },
      theorem: { total: 0, correct: 0 },
      trap: { total: 0, correct: 0 },
    };

    let totalAnswered = 0;
    let totalCorrect = 0;
    let totalSeconds = 0;
    let timeMeasurements = 0;
    const globalUniqueQuestions = new Set<string>();

    userAnswers.forEach(({ ans, q, set }) => {
      const subj = getSubjectFromKey(set.topicCode || set.subjectTag || set.title);
      const code = subj.code;

      if (subjectStats[code]) {
        subjectStats[code].uniqueQuestionIds.add(q.id);
        subjectStats[code].totalQ++;
        if (ans.isCorrect) subjectStats[code].correctQ++;
        if (ans.timeSpentSeconds) {
          subjectStats[code].totalTime += ans.timeSpentSeconds;
          subjectStats[code].timeCount++;
        }
      }

      globalUniqueQuestions.add(q.id);

      const arc = (q.archetype || "standard").toLowerCase();
      if (!archetypeStats[arc]) archetypeStats[arc] = { total: 0, correct: 0 };
      archetypeStats[arc].total++;
      if (ans.isCorrect) archetypeStats[arc].correct++;

      totalAnswered++;
      if (ans.isCorrect) totalCorrect++;
      if (ans.timeSpentSeconds) {
        totalSeconds += ans.timeSpentSeconds;
        timeMeasurements++;
      }
    });

    userAttempts.forEach(({ set }) => {
      const subj = getSubjectFromKey(set.topicCode || set.subjectTag || set.title);
      if (subjectStats[subj.code]) subjectStats[subj.code].attempts++;
    });

    const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    const overallAvgPaceSeconds = timeMeasurements > 0 ? Math.round(totalSeconds / timeMeasurements) : 45;

    // 4. Fetch module progress and all authored modules
    const [rawModules, userModules] = await Promise.all([
      getAllLearningModules().catch(() => []),
      db
        .select()
        .from(userModuleProgress)
        .where(eq(userModuleProgress.userId, userId))
        .catch(() => []),
    ]);

    const allModules = rawModules.filter((m) => !m.isLegacy);

    const domainModuleCounts: Record<string, { total: number; completed: number }> = {
      MATH: { total: 0, completed: 0 },
      ELECS: { total: 0, completed: 0 },
      GEAS: { total: 0, completed: 0 },
      EST: { total: 0, completed: 0 },
    };

    allModules.forEach((m) => {
      const dom = (m.domain || "MATH").toUpperCase();
      if (domainModuleCounts[dom]) {
        domainModuleCounts[dom].total++;
      }
    });

    const completedModuleIds = new Set(
      userModules.filter((um) => um.isCompleted).map((um) => um.moduleId)
    );

    allModules.forEach((m) => {
      const dom = (m.domain || "MATH").toUpperCase();
      if (completedModuleIds.has(m.id) && domainModuleCounts[dom]) {
        domainModuleCounts[dom].completed++;
      }
    });

    const totalModulesAvailable = allModules.length;
    const totalModulesCompleted = completedModuleIds.size;
    const globalModulePercent =
      totalModulesAvailable > 0
        ? Math.round((totalModulesCompleted / totalModulesAvailable) * 100)
        : 0;

    // Build subject analytics comparing against full board exam syllabus totals
    const finalSubjects: Record<string, SubjectAnalytics> = {};
    Object.keys(SUBJECTS).forEach((k) => {
      const config = SUBJECTS[k];
      const stats = subjectStats[k];
      const acc = stats.totalQ > 0 ? Math.round((stats.correctQ / stats.totalQ) * 100) : 0;
      const pace = stats.timeCount > 0 ? Math.round(stats.totalTime / stats.timeCount) : 0;
      const uniqueCount = stats.uniqueQuestionIds.size;
      const syllabusPercent = Math.round((uniqueCount / config.totalQuestions) * 1000) / 10; // e.g. 2.1%

      // Count tracked topics in this domain
      const domainTopics = Object.values(srsOverview.topicMap).filter((t) => {
        const s = getSubjectFromKey(t.topicCode);
        return s.code === k;
      });
      const activeTopics = domainTopics.filter((t) => t.status === "active");
      const retrievability =
        activeTopics.length > 0
          ? Math.round((activeTopics.reduce((s, t) => s + t.currentR, 0) / activeTopics.length) * 100)
          : 0;

      const modStats = domainModuleCounts[k] || { total: 0, completed: 0 };
      const modPct = modStats.total > 0 ? Math.round((modStats.completed / modStats.total) * 100) : 0;

      finalSubjects[k] = {
        code: config.code,
        label: config.label,
        full: config.full,
        badgeClass: config.badgeClass,
        borderClass: config.borderClass,
        totalAttempts: stats.attempts,
        uniqueQuestionsAttempted: uniqueCount,
        totalSyllabusQuestions: config.totalQuestions,
        syllabusPercent,
        correctQuestions: stats.correctQ,
        accuracy: acc,
        avgSecondsPerQ: pace,
        retrievability,
        trackedTopics: activeTopics.length,
        totalTopics: config.totalTopics,
        totalModules: modStats.total,
        completedModules: modStats.completed,
        moduleCompletionPercent: modPct,
      };
    });

    // Calibration Gate: Require at least 3 completed attempts & 50 questions before displaying numerical Readiness Index
    const calibrationProgress = Math.min(3, userAttempts.length);
    const isCalibrated = userAttempts.length >= 3 && totalAnswered >= 50;

    // Realistic Multiplicative Board Readiness Index (BRI)
    // Formula: Accuracy * Retention * (TrackedTopics / 46)^0.5
    let readinessIndex = 0;
    if (isCalibrated) {
      const accFactor = overallAccuracy / 100;
      const retFactor = srsOverview.totalTrackedTopics > 0 ? srsOverview.averageRetention / 100 : 0.8;
      const coverageFactor = Math.pow(srsOverview.totalTrackedTopics / TOTAL_SYLLABUS_TOPICS, 0.5);
      readinessIndex = Math.round(accFactor * retFactor * coverageFactor * 100);
    }

    // Archetype Mastery List
    const archetypeLabels: Record<string, string> = {
      standard: "Computational & Standard Solves",
      scaling: "Scaling Laws & Proportionality",
      boundary: "Boundary Extremes & Limits",
      phase: "Phase & Directional Shifts",
      fault: "Fault & Open/Short Diagnostics",
      material: "Solid-State & Material Physics",
      theorem: "Theorems & Invariants",
      trap: "Common Pitfalls & Traps",
    };

    const archetypeMastery: ArchetypeMastery[] = Object.entries(archetypeStats).map(([arc, data]) => ({
      archetype: arc,
      label: archetypeLabels[arc] || arc,
      total: data.total,
      correct: data.correct,
      accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
    }));

    // Recent Activity
    const activityMap = new Map<string, { count: number; correct: number }>();
    userAnswers.forEach(({ ans }) => {
      const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (!activityMap.has(dateStr)) activityMap.set(dateStr, { count: 0, correct: 0 });
      activityMap.get(dateStr)!.count++;
      if (ans.isCorrect) activityMap.get(dateStr)!.correct++;
    });

    const recentActivity = Array.from(activityMap.entries()).map(([date, val]) => ({
      date,
      count: val.count,
      accuracy: val.count > 0 ? Math.round((val.correct / val.count) * 100) : 0,
    }));

    return {
      readinessIndex,
      isCalibrated,
      calibrationProgress,
      overallAccuracy,
      overallAvgPaceSeconds,
      totalQuestionsAnswered: totalAnswered,
      totalUniqueQuestionsAnswered: globalUniqueQuestions.size,
      totalQuizzesTaken: userAttempts.length,
      totalModulesAvailable,
      totalModulesCompleted,
      globalModulePercent,
      subjectAnalytics: finalSubjects,
      archetypeMastery,
      recentActivity,
    };
  } catch (err) {
    console.error("Error computing user analytics:", err);
    return {
      readinessIndex: 0,
      isCalibrated: false,
      calibrationProgress: 0,
      overallAccuracy: 0,
      overallAvgPaceSeconds: 45,
      totalQuestionsAnswered: 0,
      totalUniqueQuestionsAnswered: 0,
      totalQuizzesTaken: 0,
      totalModulesAvailable: 0,
      totalModulesCompleted: 0,
      globalModulePercent: 0,
      subjectAnalytics: {},
      archetypeMastery: [],
      recentActivity: [],
    };
  }
}
