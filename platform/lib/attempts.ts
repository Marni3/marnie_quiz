import { db } from "./db/client";
import {
  attempts,
  answerRecords,
  questions,
  questionSets,
  questionSetItems,
  userModuleProgress,
  users,
  Attempt,
} from "./db/schema";
import { eq, and, desc, isNotNull } from "drizzle-orm";
import { getMockStore } from "./store";
import { getAllLearningModules } from "./modules";
import { randomUUID } from "crypto";

export interface CreateAttemptInput {
  userId: string;
  questionSetId: string;
  mode: "untimed" | "timed_per_question" | "timed_whole_exam";
  clientCreatedAt?: Date;
}

export interface AttemptHistoryItem {
  id: string;
  userId: string;
  questionSetId: string;
  mode: string;
  startedAt: Date;
  completedAt: Date | null;
  durationSeconds: number | null;
  score: number | null;
  totalQuestions: number;
  setTitle: string;
  subjectTag: string | null;
  isMastery?: boolean;
  moduleId?: string;
}

export async function createAttempt(input: CreateAttemptInput): Promise<Attempt> {
  const attemptId = randomUUID();

  try {
    // Count questions in set
    const items = await db
      .select()
      .from(questionSetItems)
      .where(eq(questionSetItems.questionSetId, input.questionSetId));

    const totalQuestions = items.length;

    const [attempt] = await db
      .insert(attempts)
      .values({
        id: attemptId,
        userId: input.userId,
        questionSetId: input.questionSetId,
        mode: input.mode,
        startedAt: new Date(),
        clientCreatedAt: input.clientCreatedAt || new Date(),
        totalQuestions,
      })
      .returning();

    return attempt;
  } catch (err) {
    console.warn("DB attempt insert failed, using fallback store:", err);
    const store = getMockStore();
    let totalQuestions = 0;
    for (const item of store.questionSetItems.values()) {
      if (item.questionSetId === input.questionSetId) totalQuestions++;
    }

    const mockAttempt: Attempt = {
      id: attemptId,
      userId: input.userId,
      questionSetId: input.questionSetId,
      mode: input.mode,
      startedAt: new Date(),
      clientCreatedAt: input.clientCreatedAt || new Date(),
      completedAt: null,
      durationSeconds: null,
      score: null,
      totalQuestions,
    };
    store.attempts.set(attemptId, mockAttempt);
    return mockAttempt;
  }
}

export interface SanitizedQuestionForTaking {
  id: string;
  orderIndex: number;
  promptText: string;
  choiceA: string;
  choiceB: string;
  choiceC: string;
  choiceD: string;
  imageUrl: string | null;
  subjectTag?: string | null;
}

export async function getAttemptForTaking(attemptId: string, userId: string) {
  try {
    const GUEST_ID = "00000000-0000-0000-0000-000000000001";
    const isGuest = userId === GUEST_ID;

    const [attempt] = await db
      .select({
        attempt: attempts,
        set: questionSets,
      })
      .from(attempts)
      .innerJoin(questionSets, eq(attempts.questionSetId, questionSets.id))
      .where(
        isGuest
          ? eq(attempts.id, attemptId)
          : and(eq(attempts.id, attemptId), eq(attempts.userId, userId))
      )
      .limit(1);

    if (!attempt) return null;

    // Fetch questions in order — SECURITY: correctChoice & explanation are omitted
    const items = await db
      .select({
        item: questionSetItems,
        question: questions,
      })
      .from(questionSetItems)
      .innerJoin(questions, eq(questionSetItems.questionId, questions.id))
      .where(eq(questionSetItems.questionSetId, attempt.set.id))
      .orderBy(questionSetItems.orderIndex);

    const sanitizedQuestions: SanitizedQuestionForTaking[] = items.map((i) => ({
      id: i.question.id,
      orderIndex: i.item.orderIndex,
      promptText: i.question.promptText,
      choiceA: i.question.choiceA,
      choiceB: i.question.choiceB,
      choiceC: i.question.choiceC,
      choiceD: i.question.choiceD,
      imageUrl: i.question.imageUrl,
      subjectTag: attempt.set.subjectTag,
    }));

    return {
      attempt: attempt.attempt,
      questionSet: attempt.set,
      questions: sanitizedQuestions,
    };
  } catch (err) {
    console.warn("DB attempt fetch failed, reading fallback:", err);
    const store = getMockStore();
    const attempt = store.attempts.get(attemptId);
    if (!attempt || attempt.userId !== userId) return null;

    const set = store.questionSets.get(attempt.questionSetId);
    if (!set) return null;

    const items = Array.from(store.questionSetItems.values())
      .filter((i) => i.questionSetId === set.id)
      .sort((a, b) => a.orderIndex - b.orderIndex);

    const sanitizedQuestions: SanitizedQuestionForTaking[] = items.map((item) => {
      const q = store.questions.get(item.questionId)!;
      return {
        id: q.id,
        orderIndex: item.orderIndex,
        promptText: q.promptText,
        choiceA: q.choiceA,
        choiceB: q.choiceB,
        choiceC: q.choiceC,
        choiceD: q.choiceD,
        imageUrl: q.imageUrl,
        subjectTag: set.subjectTag,
      };
    });

    return {
      attempt,
      questionSet: set,
      questions: sanitizedQuestions,
    };
  }
}

export async function getUserAttemptsHistory(userId: string): Promise<AttemptHistoryItem[]> {
  const modules = await getAllLearningModules();
  const moduleMap = new Map(modules.map((m) => [m.id, m]));

  try {
    // 1. Fetch standard quiz attempts
    const list = await db
      .select({
        attempt: attempts,
        set: questionSets,
      })
      .from(attempts)
      .innerJoin(questionSets, eq(attempts.questionSetId, questionSets.id))
      .where(eq(attempts.userId, userId))
      .orderBy(desc(attempts.startedAt));

    const standardAttempts: AttemptHistoryItem[] = list.map((item) => ({
      id: item.attempt.id,
      userId: item.attempt.userId,
      questionSetId: item.attempt.questionSetId,
      mode: item.attempt.mode,
      startedAt: item.attempt.startedAt,
      completedAt: item.attempt.completedAt,
      durationSeconds: item.attempt.durationSeconds,
      score: item.attempt.score,
      totalQuestions: item.attempt.totalQuestions,
      setTitle: item.set.title,
      subjectTag: item.set.subjectTag,
      isMastery: false,
    }));

    // 2. Fetch module mastery attempts from userModuleProgress
    const moduleProgressList = await db
      .select()
      .from(userModuleProgress)
      .where(
        and(
          eq(userModuleProgress.userId, userId),
          isNotNull(userModuleProgress.masteryScorePercent)
        )
      );

    const masteryAttempts: AttemptHistoryItem[] = moduleProgressList.map((prog) => {
      const mod = moduleMap.get(prog.moduleId);
      const scorePct = prog.masteryScorePercent || 0;
      const totalQ = 20;
      const scoreNum = Math.round((scorePct / 100) * totalQ);

      return {
        id: `mastery-${prog.id}`,
        userId: prog.userId,
        questionSetId: prog.moduleId,
        mode: "Mastery Challenge",
        startedAt: prog.lastStudiedAt || prog.createdAt,
        completedAt: prog.lastStudiedAt || prog.updatedAt,
        durationSeconds: null,
        score: scoreNum,
        totalQuestions: totalQ,
        setTitle: mod
          ? `${mod.code}: ${mod.subtopicTitle} (Mastery Challenge)`
          : `${prog.moduleId.toUpperCase()} (Mastery Challenge)`,
        subjectTag: prog.domain,
        isMastery: true,
        moduleId: prog.moduleId,
      };
    });

    return [...standardAttempts, ...masteryAttempts].sort(
      (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );
  } catch (err) {
    console.warn("DB history fetch failed, reading fallback:", err);
    const store = getMockStore();

    const standardAttempts: AttemptHistoryItem[] = Array.from(store.attempts.values())
      .filter((a) => a.userId === userId)
      .map((attempt) => {
        const set = store.questionSets.get(attempt.questionSetId);
        return {
          id: attempt.id,
          userId: attempt.userId,
          questionSetId: attempt.questionSetId,
          mode: attempt.mode,
          startedAt: attempt.startedAt,
          completedAt: attempt.completedAt,
          durationSeconds: attempt.durationSeconds,
          score: attempt.score,
          totalQuestions: attempt.totalQuestions,
          setTitle: set?.title || "Unknown Set",
          subjectTag: set?.subjectTag || null,
          isMastery: false,
        };
      });

    const masteryAttempts: AttemptHistoryItem[] = Array.from(store.userModuleProgress.values())
      .filter((p) => p.userId === userId && p.masteryScorePercent !== null && p.masteryScorePercent !== undefined)
      .map((prog) => {
        const mod = moduleMap.get(prog.moduleId);
        const scorePct = prog.masteryScorePercent || 0;
        const totalQ = 20;
        const scoreNum = Math.round((scorePct / 100) * totalQ);

        return {
          id: `mastery-${prog.id}`,
          userId: prog.userId,
          questionSetId: prog.moduleId,
          mode: "Mastery Challenge",
          startedAt: prog.lastStudiedAt || prog.createdAt,
          completedAt: prog.lastStudiedAt || prog.updatedAt,
          durationSeconds: null,
          score: scoreNum,
          totalQuestions: totalQ,
          setTitle: mod
            ? `${mod.code}: ${mod.subtopicTitle} (Mastery Challenge)`
            : `${prog.moduleId.toUpperCase()} (Mastery Challenge)`,
          subjectTag: prog.domain,
          isMastery: true,
          moduleId: prog.moduleId,
        };
      });

    return [...standardAttempts, ...masteryAttempts].sort(
      (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );
  }
}

export async function createMasteryAttempt(moduleId: string, userId: string): Promise<string> {
  const { getMasteryChallenge, getLearningModuleById } = await import("./modules");
  const mastery = await getMasteryChallenge(moduleId);
  if (!mastery) throw new Error(`Mastery challenge not found for module ${moduleId}`);

  const mod = await getLearningModuleById(moduleId);
  const GUEST_ID = "00000000-0000-0000-0000-000000000001";
  const isGuest = userId === GUEST_ID;
  const targetSetId = `${moduleId}-mastery`;

  // 1. Ensure question set and questions exist in DB or store
  try {
    const [existing] = await db
      .select()
      .from(questionSets)
      .where(eq(questionSets.id, targetSetId))
      .limit(1);

    if (!existing) {
      let ownerId = userId;
      if (isGuest) {
        const [guestUser] = await db.select().from(users).where(eq(users.id, GUEST_ID)).limit(1);
        if (!guestUser) {
          throw new Error("Guest user missing from DB; using mock store");
        }
      }

      await db.insert(questionSets).values({
        id: targetSetId,
        uploadedByUserId: ownerId,
        title: `${mastery.moduleCode || moduleId.toUpperCase()} Mastery Challenge (${mastery.title})`,
        tier: "mastery",
        moduleId: moduleId,
        topicCode: mod?.topicCode || null,
        subjectTag: mod?.domain || "MATH",
        visibility: "shared",
      });

      for (let i = 0; i < mastery.questions.length; i++) {
        const q = mastery.questions[i];
        const qId = q.id || randomUUID();
        await db.insert(questions).values({
          id: qId,
          sourceQuestionSetId: targetSetId,
          promptText: q.promptText,
          choiceA: q.choiceA,
          choiceB: q.choiceB,
          choiceC: q.choiceC,
          choiceD: q.choiceD,
          correctChoice: q.correctChoice.toLowerCase() as any,
          explanation: q.explanation || null,
          imageUrl: q.imageUrl || null,
          microCluster: mod?.subtopicTitle || null,
        }).onConflictDoNothing();

        await db.insert(questionSetItems).values({
          id: randomUUID(),
          questionSetId: targetSetId,
          questionId: qId,
          orderIndex: i,
        }).onConflictDoNothing();
      }
    }
  } catch (dbErr) {
    console.warn("DB mastery set creation failed, populating mock store:", dbErr);
    const store = getMockStore();
    if (!store.questionSets.has(targetSetId)) {
      store.questionSets.set(targetSetId, {
        id: targetSetId,
        uploadedByUserId: userId,
        folderId: null,
        title: `${mastery.moduleCode || moduleId.toUpperCase()} Mastery Challenge (${mastery.title})`,
        tier: "mastery",
        moduleId: moduleId,
        topicCode: mod?.topicCode || null,
        subjectTag: mod?.domain || "MATH",
        visibility: "shared",
        rawCsv: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mastery.questions.forEach((q, idx) => {
        const qId = q.id || `q-mastery-${moduleId}-${idx}`;
        store.questions.set(qId, {
          id: qId,
          sourceQuestionSetId: targetSetId,
          promptText: q.promptText,
          choiceA: q.choiceA,
          choiceB: q.choiceB,
          choiceC: q.choiceC,
          choiceD: q.choiceD,
          correctChoice: q.correctChoice.toLowerCase() as any,
          explanation: q.explanation || null,
          imageUrl: q.imageUrl || null,
          interactiveHtml: null,
          interactiveUrl: null,
          microCluster: mod?.subtopicTitle || null,
          archetype: (q as any).archetype || null,
          isAnchor: false,
        });

        const itemId = `item-mastery-${moduleId}-${idx}`;
        store.questionSetItems.set(itemId, {
          id: itemId,
          questionSetId: targetSetId,
          questionId: qId,
          orderIndex: idx,
        });
      });
    }
  }

  // 2. Create standard attempt
  const attempt = await createAttempt({
    userId,
    questionSetId: targetSetId,
    mode: "untimed",
  });

  return attempt.id;
}
