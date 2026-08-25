import { db } from "./db/client";
import {
  userTopicSrs,
  questionSets,
  questions,
  questionSetItems,
  attempts,
  users,
  UserTopicSrs,
  Question,
} from "./db/schema";
import { eq, and, sql, desc, or, lte } from "drizzle-orm";
import { randomUUID } from "crypto";
import { createAttempt } from "./attempts";

const GUEST_ID = "00000000-0000-0000-0000-000000000001";

/**
 * Calculates updated memory stability (in days) using an adapted Ebbinghaus exponential model.
 * High scores multiply stability; low scores (<60%) collapse stability to 1-2 days.
 */
export function calculateStability(
  prevStability: number,
  scorePercent: number,
  tier: string = "review"
): number {
  const tierWeights: Record<string, number> = {
    diagnostic: 0.8,
    review: 1.0,
    drill: 1.2,
    simulation: 1.5,
    conceptual_drill: 1.3,
  };
  const weight = tierWeights[tier.toLowerCase()] || 1.0;

  if (scorePercent >= 60) {
    const growthFactor = 1 + (scorePercent / 100) * weight;
    return Math.min(60, Math.round(prevStability * growthFactor * 10) / 10);
  } else {
    // Score failure: collapse stability
    return Math.max(1.0, Math.round(prevStability * (scorePercent / 100) * 10) / 10);
  }
}

/**
 * Calculates current retrievability R(t) = e^(-t / S)
 */
export function calculateRetrievability(stabilityDays: number, lastStudiedAt: Date): number {
  const now = Date.now();
  const elapsedDays = Math.max(0, (now - new Date(lastStudiedAt).getTime()) / (1000 * 60 * 60 * 24));
  if (stabilityDays <= 0) return 0.5;
  const r = Math.exp(-elapsedDays / stabilityDays);
  return Math.round(r * 100) / 100;
}

/**
 * Updates or inserts a user's topic SRS record after completing an attempt.
 */
export async function updateTopicSrsAfterAttempt({
  userId,
  questionSetId,
  scorePercent,
}: {
  userId: string;
  questionSetId: string;
  scorePercent: number;
}) {
  try {
    const [set] = await db
      .select()
      .from(questionSets)
      .where(eq(questionSets.id, questionSetId))
      .limit(1);

    if (!set) return;

    const topicCode = set.topicCode || "GEN-01";
    const topicName = set.subjectTag || set.title.split("•")[0].trim();
    const domain = set.title.startsWith("MATH")
      ? "Mathematics"
      : set.title.startsWith("ELEC")
      ? "Electronics Engineering"
      : set.title.startsWith("GEAS")
      ? "General Engineering and Applied Sciences"
      : "Electronics Systems and Technologies";

    // Find existing SRS record
    const [existing] = await db
      .select()
      .from(userTopicSrs)
      .where(and(eq(userTopicSrs.userId, userId), eq(userTopicSrs.topicCode, topicCode)))
      .limit(1);

    const prevStability = existing?.stabilityDays || 3.0;
    const newStability = calculateStability(prevStability, scorePercent, set.tier || "review");
    const now = new Date();
    const nextDue = new Date(now.getTime() + newStability * 24 * 60 * 60 * 1000);
    const totalAttempts = (existing?.totalAttempts || 0) + 1;
    const prevAvg = existing?.averageAccuracy || scorePercent;
    const newAvg = Math.round(((prevAvg * (totalAttempts - 1) + scorePercent) / totalAttempts) * 10) / 10;

    if (existing) {
      await db
        .update(userTopicSrs)
        .set({
          stabilityDays: newStability,
          retrievability: 1.0,
          lastStudiedAt: now,
          nextReviewDue: nextDue,
          totalAttempts,
          averageAccuracy: newAvg,
          lastScorePercent: scorePercent,
          status: existing.status === "snoozed" ? "active" : existing.status,
          snoozedUntil: null,
        })
        .where(eq(userTopicSrs.id, existing.id));
    } else {
      await db.insert(userTopicSrs).values({
        id: randomUUID(),
        userId,
        topicCode,
        topicName,
        subjectDomain: domain,
        status: "active",
        stabilityDays: newStability,
        retrievability: 1.0,
        lastStudiedAt: now,
        nextReviewDue: nextDue,
        totalAttempts: 1,
        averageAccuracy: scorePercent,
        lastScorePercent: scorePercent,
      });
    }
  } catch (err) {
    console.warn("SRS topic update failed (non-blocking):", err);
  }
}

/**
 * Applies a manual confidence override for a student on a specific topic.
 */
export async function setManualConfidence(
  userId: string,
  topicCode: string,
  confidence: "struggling" | "moderate" | "confident" | "mastered"
) {
  const confidenceStabilityMap = {
    struggling: 1.0,
    moderate: 4.0,
    confident: 10.0,
    mastered: 30.0,
  };

  const stability = confidenceStabilityMap[confidence] || 3.0;
  const now = new Date();
  const nextDue = new Date(now.getTime() + stability * 24 * 60 * 60 * 1000);

  const [existing] = await db
    .select()
    .from(userTopicSrs)
    .where(and(eq(userTopicSrs.userId, userId), eq(userTopicSrs.topicCode, topicCode)))
    .limit(1);

  if (existing) {
    await db
      .update(userTopicSrs)
      .set({
        manualConfidence: confidence,
        stabilityDays: stability,
        retrievability: 1.0,
        lastStudiedAt: now,
        nextReviewDue: nextDue,
        status: "active",
        snoozedUntil: null,
      })
      .where(eq(userTopicSrs.id, existing.id));
  } else {
    await db.insert(userTopicSrs).values({
      id: randomUUID(),
      userId,
      topicCode,
      topicName: topicCode,
      subjectDomain: "General",
      manualConfidence: confidence,
      status: "active",
      stabilityDays: stability,
      retrievability: 1.0,
      lastStudiedAt: now,
      nextReviewDue: nextDue,
      totalAttempts: 0,
      averageAccuracy: 100,
    });
  }
}

/**
 * Snoozes a topic from SRS daily queues for N days.
 */
export async function snoozeTopic(userId: string, topicCode: string, days: number = 1) {
  const snoozeExpiry = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  const [existing] = await db
    .select()
    .from(userTopicSrs)
    .where(and(eq(userTopicSrs.userId, userId), eq(userTopicSrs.topicCode, topicCode)))
    .limit(1);

  if (existing) {
    await db
      .update(userTopicSrs)
      .set({
        status: "snoozed",
        snoozedUntil: snoozeExpiry,
      })
      .where(eq(userTopicSrs.id, existing.id));
  } else {
    await db.insert(userTopicSrs).values({
      id: randomUUID(),
      userId,
      topicCode,
      topicName: topicCode,
      subjectDomain: "General",
      status: "snoozed",
      snoozedUntil: snoozeExpiry,
    });
  }
}

/**
 * Toggles a topic between 'suspended' and 'active'.
 */
export async function toggleSuspendTopic(userId: string, topicCode: string) {
  const [existing] = await db
    .select()
    .from(userTopicSrs)
    .where(and(eq(userTopicSrs.userId, userId), eq(userTopicSrs.topicCode, topicCode)))
    .limit(1);

  const newStatus = existing?.status === "suspended" ? "active" : "suspended";

  if (existing) {
    await db
      .update(userTopicSrs)
      .set({
        status: newStatus,
        snoozedUntil: null,
      })
      .where(eq(userTopicSrs.id, existing.id));
  } else {
    await db.insert(userTopicSrs).values({
      id: randomUUID(),
      userId,
      topicCode,
      topicName: topicCode,
      subjectDomain: "General",
      status: "suspended",
    });
  }

  return newStatus;
}

/**
 * Retrieves overall retention metrics and topic health map for a user.
 */
export async function getUserTopicSrsOverview(userId: string) {
  try {
    const srsRecords = await db
      .select()
      .from(userTopicSrs)
      .where(eq(userTopicSrs.userId, userId));

    const now = new Date();
    const topicMap: Record<string, UserTopicSrs & { currentR: number; isDue: boolean }> = {};
    let activeDueCount = 0;
    let sumR = 0;
    let activeCount = 0;

    srsRecords.forEach((rec) => {
      // Check if snooze has expired
      let effectiveStatus = rec.status;
      if (rec.status === "snoozed" && rec.snoozedUntil && new Date(rec.snoozedUntil) <= now) {
        effectiveStatus = "active";
      }

      const currentR = calculateRetrievability(rec.stabilityDays, rec.lastStudiedAt || now);
      const isDue = effectiveStatus === "active" && (!rec.nextReviewDue || new Date(rec.nextReviewDue) <= now || currentR < 0.85);

      if (effectiveStatus === "active") {
        activeCount++;
        sumR += currentR;
        if (isDue) activeDueCount++;
      }

      topicMap[rec.topicCode] = {
        ...rec,
        status: effectiveStatus,
        currentR,
        isDue,
      };
    });

    const averageRetention = activeCount > 0 ? Math.round((sumR / activeCount) * 100) : 100;

    return {
      averageRetention,
      activeDueCount,
      totalTrackedTopics: activeCount,
      topicMap,
    };
  } catch (err) {
    console.warn("Error fetching SRS overview:", err);
    return {
      averageRetention: 100,
      activeDueCount: 0,
      totalTrackedTopics: 0,
      topicMap: {},
    };
  }
}

/**
 * Assembles a dynamic 20-question High-Yield Refresher Drill using the 35-40-25 Matrix:
 * - 7 Anchor & Foundation Identities (35%)
 * - 8 Conceptual & Proportionality Archetypes (40%)
 * - 5 Numerical Problem Solves (25%)
 */
export async function assembleDailyRefresherDrill(userId: string, domain?: string): Promise<string> {
  const overview = await getUserTopicSrsOverview(userId);
  let dueTopicCodes = Object.values(overview.topicMap)
    .filter((t) => t.isDue)
    .map((t) => t.topicCode);

  if (domain) {
    const domainPrefix = domain.toUpperCase().trim();
    dueTopicCodes = dueTopicCodes.filter((code) => code.startsWith(domainPrefix));
  }

  // If no specific topics are due, pull across all active topics
  const targetTopicCodes = dueTopicCodes.length > 0 ? dueTopicCodes : undefined;

  // 1. Fetch 7 Anchor questions
  const anchorQuestions = await db
    .select()
    .from(questions)
    .where(eq(questions.isAnchor, true))
    .limit(7);

  // 2. Fetch 8 Conceptual Archetype questions (archetype != 'standard')
  const conceptualQuestions = await db
    .select()
    .from(questions)
    .where(sql`${questions.archetype} IS NOT NULL AND ${questions.archetype} != 'standard'`)
    .limit(8);

  // 3. Fetch 5 Numerical Problem Solving questions (archetype = 'standard' or default)
  const numericalQuestions = await db
    .select()
    .from(questions)
    .where(or(eq(questions.archetype, "standard"), sql`${questions.archetype} IS NULL`))
    .limit(5);

  // Assemble question pool
  const pool = [...anchorQuestions, ...conceptualQuestions, ...numericalQuestions];

  // If pool has fewer than 20, backfill with random questions
  if (pool.length < 20) {
    const extra = await db
      .select()
      .from(questions)
      .limit(20 - pool.length);
    pool.push(...extra);
  }

  // Deduplicate by question ID
  const seen = new Set<string>();
  const finalQuestions: Question[] = [];
  pool.forEach((q) => {
    if (!seen.has(q.id) && finalQuestions.length < 20) {
      seen.add(q.id);
      finalQuestions.push(q);
    }
  });

  // Create an ephemeral Question Set for the drill
  const setId = randomUUID();
  const [createdSet] = await db
    .insert(questionSets)
    .values({
      id: setId,
      uploadedByUserId: userId,
      title: `⚡ Daily Spaced Refresher • 20 Questions (${new Date().toLocaleDateString()})`,
      tier: "drill",
      subjectTag: "Spaced Repetition",
      visibility: "shared",
    })
    .returning();

  // Link questions to set
  for (let i = 0; i < finalQuestions.length; i++) {
    await db.insert(questionSetItems).values({
      id: randomUUID(),
      questionSetId: setId,
      questionId: finalQuestions[i].id,
      orderIndex: i,
    });
  }

  // Create Attempt
  const attempt = await createAttempt({
    userId,
    questionSetId: setId,
    mode: "untimed",
  });

  return attempt.id;
}
