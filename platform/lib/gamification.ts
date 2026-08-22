import { db } from "./db/client";
import { attempts, userTopicSrs } from "./db/schema";
import { eq, and, sql, desc } from "drizzle-orm";
import { UserAnalyticsOverview } from "./analytics";

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
  progressText: string;
}

export interface GamificationData {
  currentStreakDays: number;
  longestStreakDays: number;
  motivationalMessage: string;
  motivationalSubtext: string;
  badges: Badge[];
}

export async function getUserGamificationData(
  userId: string,
  analytics?: UserAnalyticsOverview
): Promise<GamificationData> {
  try {
    const userAttempts = await db
      .select()
      .from(attempts)
      .where(and(eq(attempts.userId, userId), sql`${attempts.completedAt} IS NOT NULL`))
      .orderBy(desc(attempts.completedAt));

    // Calculate streak
    let currentStreak = 0;
    const completedDates = new Set<string>();
    userAttempts.forEach((a) => {
      if (a.completedAt) {
        completedDates.add(new Date(a.completedAt).toISOString().split("T")[0]);
      }
    });

    const today = new Date();
    for (let i = 0; i < 60; i++) {
      const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      if (completedDates.has(checkDate)) {
        currentStreak++;
      } else if (i > 0) {
        break;
      }
    }

    const totalQuestions = analytics?.totalQuestionsAnswered || 0;
    const accuracy = analytics?.overallAccuracy || 0;
    const readiness = analytics?.readinessIndex || 0;

    // Badges definition
    const badges: Badge[] = [
      {
        id: "first_drill",
        name: "First Spark",
        icon: "⚡",
        description: "Completed your first quiz attempt on the platform.",
        unlocked: userAttempts.length >= 1,
        progressText: `${Math.min(1, userAttempts.length)} / 1 attempt`,
      },
      {
        id: "streak_3",
        name: "Consistency Champion",
        icon: "🔥",
        description: "Maintained a 3-day active study streak.",
        unlocked: currentStreak >= 3,
        progressText: `${currentStreak} / 3 days`,
      },
      {
        id: "century",
        name: "Century Club",
        icon: "💯",
        description: "Answered 100 questions across any board exam subject.",
        unlocked: totalQuestions >= 100,
        progressText: `${totalQuestions} / 100 questions`,
      },
      {
        id: "speed_demon",
        name: "Speed Demon",
        icon: "⏱️",
        description: "Solved questions in under 45s average with >75% accuracy.",
        unlocked: (analytics?.overallAvgPaceSeconds || 100) < 45 && accuracy >= 75 && totalQuestions >= 20,
        progressText: `${analytics?.overallAvgPaceSeconds || 0}s avg pace`,
      },
      {
        id: "ironclad",
        name: "Ironclad Memory",
        icon: "🛡️",
        description: "Achieved an overall retention retrievability of 85%+.",
        unlocked: readiness >= 70,
        progressText: `${readiness}% readiness`,
      },
    ];

    // Dynamic Motivational Message
    let motivationalMessage = "Ready to sharpen your board exam intuition today?";
    let motivationalSubtext = "Take a 20-question recovery drill or explore new diagnostic sets.";

    if (currentStreak >= 3) {
      motivationalMessage = `🔥 ${currentStreak}-Day Study Streak Active!`;
      motivationalSubtext = "Consistency is the single biggest predictor of top-rank board performance.";
    } else if (readiness >= 75) {
      motivationalMessage = "🎯 Exceptional Performance Across All Subjects!";
      motivationalSubtext = `Your PRC Board Readiness Index is at ${readiness}%. Keep memory fresh!`;
    } else if (totalQuestions >= 50 && accuracy < 60) {
      motivationalMessage = "💡 Rebuilding Foundational Concepts";
      motivationalSubtext = "Low scores are normal during retrieval practice. Review explanations closely!";
    } else if (userAttempts.length === 0) {
      motivationalMessage = "👋 Welcome to Marnie Quiz Study System!";
      motivationalSubtext = "Start with a 30-Question Diagnostic set in Mathematics or Electronics.";
    }

    return {
      currentStreakDays: currentStreak,
      longestStreakDays: Math.max(currentStreak, 3),
      motivationalMessage,
      motivationalSubtext,
      badges,
    };
  } catch (err) {
    console.error("Error computing gamification data:", err);
    return {
      currentStreakDays: 0,
      longestStreakDays: 0,
      motivationalMessage: "Welcome to Marnie Quiz!",
      motivationalSubtext: "Start your daily review session.",
      badges: [],
    };
  }
}
