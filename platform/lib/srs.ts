import { db } from "./db/client";
import {
  userTopicSrs,
  userModuleProgress,
  questionSets,
  questions,
  questionSetItems,
  answerRecords,
  attempts,
  users,
  UserTopicSrs,
  UserModuleProgress,
  Question,
} from "./db/schema";
import { eq, and, sql, desc, or, lte, inArray } from "drizzle-orm";
import { randomUUID } from "crypto";
import { createAttempt } from "./attempts";
import { getMockStore } from "./store";

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
 * Updates or inserts a user's topic SRS record directly with given metadata.
 */
export async function updateTopicSrsDirectly({
  userId,
  topicCode,
  topicName,
  domain,
  scorePercent,
  tier = "drill",
}: {
  userId: string;
  topicCode: string;
  topicName: string;
  domain: string;
  scorePercent: number;
  tier?: "drill" | "review" | "diagnostic" | "simulation";
}) {
  try {
    const [existing] = await db
      .select()
      .from(userTopicSrs)
      .where(and(eq(userTopicSrs.userId, userId), eq(userTopicSrs.topicCode, topicCode)))
      .limit(1);

    const prevStability = existing?.stabilityDays || 3.0;
    const newStability = calculateStability(prevStability, scorePercent, tier);
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
    console.warn("SRS topic direct update failed (non-blocking):", err);
  }
}

function resolveDomain(subjectTag?: string | null, titleOrCode?: string): string {
  const upper = `${subjectTag || ""} ${titleOrCode || ""}`.toUpperCase();
  if (upper.includes("MATH")) return "Mathematics";
  if (upper.includes("ELEC")) return "Electronics Engineering";
  if (upper.includes("GEAS")) return "General Engineering and Applied Sciences";
  if (upper.includes("EST")) return "Electronics Systems and Technologies";
  return "General";
}

/**
 * Updates or inserts a user's topic SRS record after completing an attempt.
 * For dynamic Refresher Drills, partitions results across all specific topics touched.
 */
export async function updateTopicSrsAfterAttempt({
  userId,
  questionSetId,
  scorePercent,
  attemptId,
}: {
  userId: string;
  questionSetId: string;
  scorePercent: number;
  attemptId?: string;
}) {
  try {
    const [set] = await db
      .select()
      .from(questionSets)
      .where(eq(questionSets.id, questionSetId))
      .limit(1);

    if (!set) {
      // Fallback check in store
      const store = getMockStore();
      const mockSet = store.questionSets.get(questionSetId);
      if (!mockSet) return;
      
      const topicCode = mockSet.topicCode || "GEN-01";
      const cleanTitle = mockSet.title.replace(/^[⚡\s]+/, "");
      const topicName = mockSet.subjectTag || cleanTitle.split("•")[0].trim();
      const domain = resolveDomain(mockSet.subjectTag, cleanTitle);

      await updateTopicSrsDirectly({
        userId,
        topicCode,
        topicName,
        domain,
        scorePercent,
        tier: (mockSet.tier as any) || "review",
      });
      return;
    }

    // If it's a dynamic refresher drill and we have an attemptId, partition by topics touched!
    if (set.tier === "drill" && attemptId) {
      try {
        const records = await db
          .select({
            isCorrect: answerRecords.isCorrect,
            microCluster: questions.microCluster,
          })
          .from(answerRecords)
          .innerJoin(questions, eq(answerRecords.questionId, questions.id))
          .where(eq(answerRecords.attemptId, attemptId));

        if (records.length > 0) {
          const topicStats = new Map<string, { correct: number; total: number }>();

          records.forEach((r) => {
            let code: string | null = null;
            if (r.microCluster) {
              const match = r.microCluster.match(/^([A-Za-z]+-\d+)/);
              if (match) code = match[1].toUpperCase();
            }
            if (!code && set.topicCode) {
              code = set.topicCode;
            }
            if (!code && set.subjectTag) {
              code = `${set.subjectTag.toUpperCase()}-01`;
            }
            if (!code) code = "GEN-01";

            const current = topicStats.get(code) || { correct: 0, total: 0 };
            current.total++;
            if (r.isCorrect) current.correct++;
            topicStats.set(code, current);
          });

          for (const [code, stat] of topicStats.entries()) {
            const topicScorePct = Math.round((stat.correct / stat.total) * 100);
            const domain = resolveDomain(set.subjectTag, code);
            await updateTopicSrsDirectly({
              userId,
              topicCode: code,
              topicName: code,
              domain,
              scorePercent: topicScorePct,
              tier: "drill",
            });
          }
          return;
        }
      } catch (err) {
        console.warn("Partitioned drill SRS update failed, using monolithic topic fallback:", err);
      }
    }

    const topicCode = set.topicCode || "GEN-01";
    const cleanTitle = set.title.replace(/^[⚡\s]+/, "");
    const topicName = set.subjectTag || cleanTitle.split("•")[0].trim();
    const domain = resolveDomain(set.subjectTag, cleanTitle);

    await updateTopicSrsDirectly({
      userId,
      topicCode,
      topicName,
      domain,
      scorePercent,
      tier: (set.tier as any) || "review",
    });
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

    const averageRetention = activeCount > 0 ? Math.round((sumR / activeCount) * 100) : 0;

    return {
      averageRetention,
      activeDueCount,
      totalTrackedTopics: activeCount,
      topicMap,
    };
  } catch (err) {
    console.warn("Error fetching SRS overview:", err);
    return {
      averageRetention: 0,
      activeDueCount: 0,
      totalTrackedTopics: 0,
      topicMap: {},
    };
  }
}

export interface RefresherDrillOptions {
  domain?: string;
  targetMode?: "due_srs" | "weak_topics" | "random_mix";
  count?: number;
  mode?: "untimed" | "timed_per_question" | "timed_whole_exam";
}

/**
 * Assembles a dynamic High-Yield Refresher Drill with configurable count and domain targeting.
 */
export async function assembleDailyRefresherDrill(
  userId: string,
  optionsOrDomain?: string | RefresherDrillOptions
): Promise<string> {
  const options: RefresherDrillOptions =
    typeof optionsOrDomain === "string"
      ? { domain: optionsOrDomain }
      : optionsOrDomain || {};

  const domain = options.domain && options.domain !== "ALL" ? options.domain : undefined;
  const count = options.count && [10, 20, 30].includes(options.count) ? options.count : 20;
  const targetMode = options.targetMode || "due_srs";
  const examMode = options.mode || "untimed";

  const overview = await getUserTopicSrsOverview(userId);
  let dueTopicCodes = Object.values(overview.topicMap)
    .filter((t) => (targetMode === "weak_topics" ? t.averageAccuracy < 70 : t.isDue))
    .map((t) => t.topicCode);

  if (domain) {
    const domainPrefix = domain.toUpperCase().trim();
    dueTopicCodes = dueTopicCodes.filter((code) => code.startsWith(domainPrefix));
  }

  let pool: Question[] = [];

  try {
    // 1. Fetch targeted questions matching due/weak topic codes via microCluster or questionSet topicCode
    if (dueTopicCodes.length > 0) {
      const topicConditions = dueTopicCodes.map((tc) => sql`${questions.microCluster} LIKE ${tc + "%"}`);
      const targeted = await db
        .select()
        .from(questions)
        .where(or(...topicConditions))
        .limit(count * 2);
      pool.push(...targeted);
    }

    // 2. If pool still needs questions and domain is specified, fetch domain questions
    if (pool.length < count && domain) {
      const domainPrefix = domain.toUpperCase().trim();
      const domainQuestions = await db
        .select()
        .from(questions)
        .where(sql`${questions.microCluster} LIKE ${domainPrefix + "%"}`)
        .limit(count * 2);
      pool.push(...domainQuestions);
    }

    // 3. If still needed, backfill with general questions
    if (pool.length < count) {
      const general = await db
        .select()
        .from(questions)
        .limit(count * 2);
      pool.push(...general);
    }
  } catch (dbErr) {
    console.warn("DB question query failed for drill, falling back to mock store:", dbErr);
  }

  // Fallback to Mock Store if DB query returned insufficient questions
  if (pool.length < count) {
    const store = getMockStore();
    const allStoreQuestions = Array.from(store.questions.values());

    if (dueTopicCodes.length > 0) {
      const mockTargeted = allStoreQuestions.filter(
        (q) => q.microCluster && dueTopicCodes.some((tc) => q.microCluster?.startsWith(tc))
      );
      pool.push(...mockTargeted);
    }

    if (pool.length < count && domain) {
      const domainPrefix = domain.toUpperCase().trim();
      const mockDomain = allStoreQuestions.filter((q) =>
        q.microCluster?.toUpperCase().startsWith(domainPrefix)
      );
      pool.push(...mockDomain);
    }

    if (pool.length < count) {
      pool.push(...allStoreQuestions);
    }
  }

  // Deduplicate by question ID and trim to requested count
  const seen = new Set<string>();
  const finalQuestions: Question[] = [];
  pool.forEach((q) => {
    if (!seen.has(q.id) && finalQuestions.length < count) {
      seen.add(q.id);
      finalQuestions.push(q);
    }
  });

  const domainLabel = domain ? `${domain.toUpperCase()} ` : "";
  const title = `⚡ ${domainLabel}Refresher Drill • ${finalQuestions.length} Questions (${new Date().toLocaleDateString()})`;

  // Create ephemeral Question Set for the drill
  const setId = randomUUID();
  let setSavedInDb = false;

  try {
    let canSaveInDb = true;
    if (userId === GUEST_ID) {
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, GUEST_ID))
        .limit(1);
      if (!existingUser) {
        canSaveInDb = false;
      }
    }

    if (canSaveInDb) {
      await db.insert(questionSets).values({
        id: setId,
        uploadedByUserId: userId,
        title,
        tier: "drill",
        subjectTag: domain ? domain.toUpperCase() : "Spaced Repetition",
        visibility: "shared",
      });

      for (let i = 0; i < finalQuestions.length; i++) {
        await db.insert(questionSetItems).values({
          id: randomUUID(),
          questionSetId: setId,
          questionId: finalQuestions[i].id,
          orderIndex: i,
        });
      }
      setSavedInDb = true;
    }
  } catch (dbErr) {
    console.warn("DB question set insert failed for drill, persisting to mock store:", dbErr);
  }

  // Ensure set exists in mock store if DB save was skipped or failed
  if (!setSavedInDb) {
    const store = getMockStore();
    store.questionSets.set(setId, {
      id: setId,
      uploadedByUserId: userId,
      title,
      folderId: null,
      tier: "drill",
      subjectTag: domain ? domain.toUpperCase() : "Spaced Repetition",
      topicCode: null,
      moduleId: null,
      visibility: "shared",
      rawCsv: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    finalQuestions.forEach((q, idx) => {
      store.questions.set(q.id, q);
      const itemId = randomUUID();
      store.questionSetItems.set(itemId, {
        id: itemId,
        questionSetId: setId,
        questionId: q.id,
        orderIndex: idx,
      });
    });
  }

  // Create Attempt
  const attempt = await createAttempt({
    userId,
    questionSetId: setId,
    mode: examMode,
  });

  return attempt.id;
}

/**
 * Retrieves the user's progress and SRS state for a specific learning module.
 */
export async function getModuleProgress(
  userId: string,
  moduleId: string
): Promise<UserModuleProgress | null> {
  try {
    const [progress] = await db
      .select()
      .from(userModuleProgress)
      .where(
        and(
          eq(userModuleProgress.userId, userId),
          eq(userModuleProgress.moduleId, moduleId)
        )
      )
      .limit(1);

    if (progress) return progress;

    // Fallback store
    const store = getMockStore();
    const key = `${userId}_${moduleId}`;
    return store.userModuleProgress.get(key) || null;
  } catch (err) {
    const store = getMockStore();
    const key = `${userId}_${moduleId}`;
    return store.userModuleProgress.get(key) || null;
  }
}

/**
 * Updates or creates a user's progress and SRS record for a learning module.
 */
export async function updateModuleProgress({
  userId,
  moduleId,
  topicCode,
  domain,
  isCompleted,
  isBookmarked,
  conceptChecksCompleted,
  conceptChecksTotal,
  conceptChecksAccuracy,
  masteryScorePercent,
  confidence,
}: {
  userId: string;
  moduleId: string;
  topicCode?: string;
  domain?: string;
  isCompleted?: boolean;
  isBookmarked?: boolean;
  conceptChecksCompleted?: number;
  conceptChecksTotal?: number;
  conceptChecksAccuracy?: number;
  masteryScorePercent?: number;
  confidence?: string;
}): Promise<UserModuleProgress> {
  const existing = await getModuleProgress(userId, moduleId);
  const now = new Date();

  const prevStability = existing?.stabilityDays || 3.0;
  let newStability = prevStability;

  if (masteryScorePercent !== undefined) {
    newStability = calculateStability(prevStability, masteryScorePercent, "drill");
  } else if (conceptChecksAccuracy !== undefined && conceptChecksAccuracy > 0) {
    newStability = calculateStability(prevStability, conceptChecksAccuracy * 100, "review");
  }

  const nextDue = new Date(now.getTime() + newStability * 24 * 60 * 60 * 1000);
  const totalReviews = (existing?.totalReviews || 0) + 1;

  const recordData = {
    userId,
    moduleId,
    topicCode: topicCode || existing?.topicCode || "GEN-01",
    domain: domain || existing?.domain || "MATH",
    isCompleted: isCompleted !== undefined ? isCompleted : existing?.isCompleted ?? false,
    isBookmarked: isBookmarked !== undefined ? isBookmarked : existing?.isBookmarked ?? false,
    conceptChecksCompleted:
      conceptChecksCompleted !== undefined
        ? conceptChecksCompleted
        : existing?.conceptChecksCompleted ?? 0,
    conceptChecksTotal:
      conceptChecksTotal !== undefined
        ? conceptChecksTotal
        : existing?.conceptChecksTotal ?? 0,
    conceptChecksAccuracy:
      conceptChecksAccuracy !== undefined
        ? conceptChecksAccuracy
        : existing?.conceptChecksAccuracy ?? 0.0,
    masteryScorePercent:
      masteryScorePercent !== undefined
        ? masteryScorePercent
        : existing?.masteryScorePercent ?? null,
    confidence: confidence || existing?.confidence || null,
    stabilityDays: newStability,
    retrievability: 1.0,
    lastStudiedAt: now,
    nextReviewDue: nextDue,
    totalReviews,
    updatedAt: now,
  };

  let resultRecord: UserModuleProgress;
  try {
    if (existing) {
      const [updated] = await db
        .update(userModuleProgress)
        .set(recordData)
        .where(eq(userModuleProgress.id, existing.id))
        .returning();
      resultRecord = updated;
    } else {
      const [inserted] = await db
        .insert(userModuleProgress)
        .values({
          id: randomUUID(),
          ...recordData,
          createdAt: now,
        })
        .returning();
      resultRecord = inserted;
    }
  } catch (err) {
    // Fallback store update
    const store = getMockStore();
    const id = existing?.id || randomUUID();
    const record: UserModuleProgress = {
      id,
      ...recordData,
      createdAt: existing?.createdAt || now,
    };
    store.userModuleProgress.set(`${userId}_${moduleId}`, record);
    resultRecord = record;
  }

  // Synchronize to userTopicSrs so topic appears in Retention Board, BRI, and Refresher Drills
  try {
    const resolvedTopicCode = topicCode || existing?.topicCode || recordData.topicCode;
    const resolvedDomain = domain || existing?.domain || recordData.domain;
    if (masteryScorePercent !== undefined) {
      await updateTopicSrsDirectly({
        userId,
        topicCode: resolvedTopicCode,
        topicName: resolvedTopicCode,
        domain: resolvedDomain,
        scorePercent: masteryScorePercent,
        tier: "drill",
      });
    } else if (conceptChecksAccuracy !== undefined && conceptChecksAccuracy > 0) {
      await updateTopicSrsDirectly({
        userId,
        topicCode: resolvedTopicCode,
        topicName: resolvedTopicCode,
        domain: resolvedDomain,
        scorePercent: Math.round(conceptChecksAccuracy * 100),
        tier: "review",
      });
    }
  } catch (srsSyncErr) {
    console.warn("Topic SRS sync from module progress failed:", srsSyncErr);
  }

  return resultRecord;
}

export const saveModuleProgress = updateModuleProgress;

/**
 * Returns all modules due for review under the Spaced Repetition System.
 */
export async function getDueLearningModules(
  userId: string
): Promise<UserModuleProgress[]> {
  const now = new Date();
  try {
    const records = await db
      .select()
      .from(userModuleProgress)
      .where(
        and(
          eq(userModuleProgress.userId, userId),
          lte(userModuleProgress.nextReviewDue, now)
        )
      )
      .orderBy(userModuleProgress.nextReviewDue);
    return records;
  } catch (err) {
    const store = getMockStore();
    const results: UserModuleProgress[] = [];
    store.userModuleProgress.forEach((p) => {
      if (p.userId === userId && p.nextReviewDue && p.nextReviewDue <= now) {
        results.push(p);
      }
    });
    return results.sort((a, b) => (a.nextReviewDue?.getTime() || 0) - (b.nextReviewDue?.getTime() || 0));
  }
}

/**
 * Returns all module progress records for a specific user.
 */
export async function getAllUserModuleProgress(
  userId: string
): Promise<UserModuleProgress[]> {
  try {
    const records = await db
      .select()
      .from(userModuleProgress)
      .where(eq(userModuleProgress.userId, userId))
      .orderBy(desc(userModuleProgress.updatedAt));
    return records;
  } catch (err) {
    const store = getMockStore();
    const results: UserModuleProgress[] = [];
    store.userModuleProgress.forEach((p) => {
      if (p.userId === userId) {
        results.push(p);
      }
    });
    return results.sort((a, b) => (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0));
  }
}


