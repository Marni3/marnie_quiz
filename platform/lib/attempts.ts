import { db } from "./db/client";
import {
  attempts,
  answerRecords,
  questions,
  questionSets,
  questionSetItems,
  Attempt,
} from "./db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getMockStore } from "./store";
import { randomUUID } from "crypto";

export interface CreateAttemptInput {
  userId: string;
  questionSetId: string;
  mode: "untimed" | "timed_per_question" | "timed_whole_exam";
  clientCreatedAt?: Date;
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
    const [attempt] = await db
      .select({
        attempt: attempts,
        set: questionSets,
      })
      .from(attempts)
      .innerJoin(questionSets, eq(attempts.questionSetId, questionSets.id))
      .where(and(eq(attempts.id, attemptId), eq(attempts.userId, userId)))
      .limit(1);

    if (!attempt) return null;

    // Fetch questions in order — SECURITY: correctChoice & explanation are omitted
    const items = await db
      .select({
        orderIndex: questionSetItems.orderIndex,
        q: questions,
      })
      .from(questionSetItems)
      .innerJoin(questions, eq(questionSetItems.questionId, questions.id))
      .where(eq(questionSetItems.questionSetId, attempt.attempt.questionSetId))
      .orderBy(questionSetItems.orderIndex);

    const sanitizedQuestions: SanitizedQuestionForTaking[] = items.map((i) => ({
      id: i.q.id,
      orderIndex: i.orderIndex,
      promptText: i.q.promptText,
      choiceA: i.q.choiceA,
      choiceB: i.q.choiceB,
      choiceC: i.q.choiceC,
      choiceD: i.q.choiceD,
      imageUrl: i.q.imageUrl,
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

export async function getUserAttemptsHistory(userId: string) {
  try {
    const list = await db
      .select({
        attempt: attempts,
        set: questionSets,
      })
      .from(attempts)
      .innerJoin(questionSets, eq(attempts.questionSetId, questionSets.id))
      .where(eq(attempts.userId, userId))
      .orderBy(desc(attempts.startedAt));

    return list.map((item) => ({
      ...item.attempt,
      setTitle: item.set.title,
      subjectTag: item.set.subjectTag,
    }));
  } catch (err) {
    console.warn("DB history fetch failed, reading fallback:", err);
    const store = getMockStore();
    const list = Array.from(store.attempts.values())
      .filter((a) => a.userId === userId)
      .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
      .map((attempt) => {
        const set = store.questionSets.get(attempt.questionSetId);
        return {
          ...attempt,
          setTitle: set?.title || "Unknown Set",
          subjectTag: set?.subjectTag || null,
        };
      });
    return list;
  }
}
