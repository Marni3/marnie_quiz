import { db } from "@/lib/db/client";
import { userTopicSrs, attempts, questionSets, userModuleProgress } from "@/lib/db/schema";
import { eq, desc, asc, and, isNotNull } from "drizzle-orm";

export interface UserStudyProfile {
  weakTopics: Array<{
    topicCode: string;
    topicName: string;
    domain: string;
    retrievability: number;
    stabilityDays: number;
    accuracy: number;
    status: string;
  }>;
  recentAttempts: Array<{
    setTitle: string;
    subjectTag: string | null;
    score: number;
    totalQuestions: number;
    percentage: number;
    date: string;
  }>;
  moduleProgress: Array<{
    moduleId: string;
    topicCode: string;
    domain: string;
    isCompleted: boolean;
    isBookmarked: boolean;
    accuracy: number;
  }>;
}

export async function getUserStudyProfileContext(userId: string | null | undefined): Promise<string> {
  if (!userId) return "";

  try {
    // 1. Fetch FSRS Topics (order by retrievability asc to highlight weakest first)
    const srsRows = await db
      .select()
      .from(userTopicSrs)
      .where(eq(userTopicSrs.userId, userId))
      .orderBy(asc(userTopicSrs.retrievability))
      .limit(6);

    // 2. Fetch Recent Quiz Attempts (last 3 completed)
    const attemptRows = await db
      .select({
        score: attempts.score,
        totalQuestions: attempts.totalQuestions,
        completedAt: attempts.completedAt,
        setTitle: questionSets.title,
        subjectTag: questionSets.subjectTag,
      })
      .from(attempts)
      .leftJoin(questionSets, eq(attempts.questionSetId, questionSets.id))
      .where(and(eq(attempts.userId, userId), isNotNull(attempts.completedAt)))
      .orderBy(desc(attempts.completedAt))
      .limit(3);

    // 3. Fetch Active & Bookmarked Modules
    const moduleRows = await db
      .select()
      .from(userModuleProgress)
      .where(eq(userModuleProgress.userId, userId))
      .orderBy(desc(userModuleProgress.lastStudiedAt))
      .limit(5);

    if (srsRows.length === 0 && attemptRows.length === 0 && moduleRows.length === 0) {
      return "";
    }

    const lines: string[] = [
      "## LIVE USER STUDY PROFILE & FSRS MEMORY CONTEXT:",
      "You are directly connected to the user's platform study records. Use this real-time context to proactively reference their weak spots, recent quiz scores, and active topics when tutoring:",
    ];

    if (srsRows.length > 0) {
      lines.push("\n### FSRS Retention State & Weakest Topics:");
      srsRows.forEach((r) => {
        const retPct = Math.round((r.retrievability ?? 1.0) * 100);
        const accPct = Math.round((r.averageAccuracy ?? 0.0) * 100);
        const stab = (r.stabilityDays ?? 3.0).toFixed(1);
        lines.push(
          `- [${r.topicCode}] ${r.topicName} (${r.subjectDomain}): Retrievability ${retPct}%, Memory Stability ${stab}d, Accuracy ${accPct}% (Status: ${r.status})`
        );
      });
    }

    if (attemptRows.length > 0) {
      lines.push("\n### Recent Exam History:");
      attemptRows.forEach((a) => {
        const score = a.score ?? 0;
        const total = a.totalQuestions || 1;
        const pct = Math.round((score / total) * 100);
        const dt = a.completedAt ? new Date(a.completedAt).toLocaleDateString() : "Recent";
        lines.push(
          `- "${a.setTitle || "Practice Quiz"}" (${a.subjectTag || "General"}): Scored ${score}/${total} (${pct}%) on ${dt}`
        );
      });
    }

    if (moduleRows.length > 0) {
      lines.push("\n### Learning Module Progress:");
      moduleRows.forEach((m) => {
        const status = m.isCompleted ? "Completed" : m.isBookmarked ? "Bookmarked" : "In Progress";
        const accPct = Math.round((m.conceptChecksAccuracy ?? 0) * 100);
        lines.push(
          `- Module [${m.moduleId}] (${m.domain} - ${m.topicCode}): ${status}, Concept Check Score: ${accPct}%`
        );
      });
    }

    return lines.join("\n");
  } catch (err) {
    console.warn("Could not query user study profile for AI tutor:", err);
    return "";
  }
}
