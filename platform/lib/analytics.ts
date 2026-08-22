import { db } from "./db/client";
import {
  attempts,
  answerRecords,
  questions,
  questionSets,
  userTopicSrs,
} from "./db/schema";
import { eq, and, sql, desc, gte } from "drizzle-orm";
import { getUserTopicSrsOverview } from "./srs";
import { SUBJECTS, getSubjectFromKey } from "./constants";

export interface SubjectAnalytics {
  code: string;
  label: string;
  full: string;
  badgeClass: string;
  borderClass: string;
  totalAttempts: number;
  totalQuestions: number;
  correctQuestions: number;
  accuracy: number;
  avgSecondsPerQ: number;
  retrievability: number;
  trackedTopics: number;
  totalTopics: number;
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
  overallAccuracy: number;
  overallAvgPaceSeconds: number;
  totalQuestionsAnswered: number;
  totalQuizzesTaken: number;
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
    const subjectStats: Record<string, { totalQ: number; correctQ: number; totalTime: number; timeCount: number; attempts: number }> = {
      MATH: { totalQ: 0, correctQ: 0, totalTime: 0, timeCount: 0, attempts: 0 },
      ELECS: { totalQ: 0, correctQ: 0, totalTime: 0, timeCount: 0, attempts: 0 },
      GEAS: { totalQ: 0, correctQ: 0, totalTime: 0, timeCount: 0, attempts: 0 },
      EST: { totalQ: 0, correctQ: 0, totalTime: 0, timeCount: 0, attempts: 0 },
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

    userAnswers.forEach(({ ans, q, set }) => {
      const subj = getSubjectFromKey(set.topicCode || set.subjectTag || set.title);
      const code = subj.code;

      if (subjectStats[code]) {
        subjectStats[code].totalQ++;
        if (ans.isCorrect) subjectStats[code].correctQ++;
        if (ans.timeSpentSeconds) {
          subjectStats[code].totalTime += ans.timeSpentSeconds;
          subjectStats[code].timeCount++;
        }
      }

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

    // Syllabus totals per subject in ECE Board Exam
    const subjectTopicTotals: Record<string, number> = {
      MATH: 10,
      ELECS: 15,
      GEAS: 11,
      EST: 10,
    };

    const finalSubjects: Record<string, SubjectAnalytics> = {};
    Object.keys(SUBJECTS).forEach((k) => {
      const config = SUBJECTS[k];
      const stats = subjectStats[k];
      const acc = stats.totalQ > 0 ? Math.round((stats.correctQ / stats.totalQ) * 100) : 0;
      const pace = stats.timeCount > 0 ? Math.round(stats.totalTime / stats.timeCount) : 0;

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

      finalSubjects[k] = {
        code: config.code,
        label: config.label,
        full: config.full,
        badgeClass: config.badgeClass,
        borderClass: config.borderClass,
        totalAttempts: stats.attempts,
        totalQuestions: stats.totalQ,
        correctQuestions: stats.correctQ,
        accuracy: acc,
        avgSecondsPerQ: pace,
        retrievability,
        trackedTopics: activeTopics.length,
        totalTopics: subjectTopicTotals[k] || 10,
      };
    });

    // Compute PRC Board Exam Readiness Index
    const syllabusCoverage = Math.min(100, Math.round((srsOverview.totalTrackedTopics / 46) * 100));
    const effectiveRetention = srsOverview.totalTrackedTopics > 0 ? srsOverview.averageRetention : 0;
    const readinessIndex = Math.round(
      0.40 * overallAccuracy + 0.35 * effectiveRetention + 0.25 * syllabusCoverage
    );

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

    // Recent 14-day velocity
    const activityMap = new Map<string, { count: number; correct: number }>();
    userAnswers.forEach(({ ans }) => {
      // Group by date
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
      overallAccuracy,
      overallAvgPaceSeconds,
      totalQuestionsAnswered: totalAnswered,
      totalQuizzesTaken: userAttempts.length,
      subjectAnalytics: finalSubjects,
      archetypeMastery,
      recentActivity,
    };
  } catch (err) {
    console.error("Error computing user analytics:", err);
    return {
      readinessIndex: 0,
      overallAccuracy: 0,
      overallAvgPaceSeconds: 45,
      totalQuestionsAnswered: 0,
      totalQuizzesTaken: 0,
      subjectAnalytics: {},
      archetypeMastery: [],
      recentActivity: [],
    };
  }
}
