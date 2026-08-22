import { updateTopicSrsAfterAttempt } from "./srs";
import { db } from "./db/client";
import {
  attempts,
  answerRecords,
  questions,
  questionSets,
  questionSetItems,
  AnswerRecord,
} from "./db/schema";
import { eq, and } from "drizzle-orm";
import { getMockStore } from "./store";
import { randomUUID } from "crypto";

export interface UserSubmittedAnswer {
  questionId: string;
  selectedChoice: "a" | "b" | "c" | "d" | null;
  timeSpentSeconds?: number;
}

export interface SubmitAttemptInput {
  attemptId: string;
  userId: string;
  answers: UserSubmittedAnswer[];
  durationSeconds: number;
}

const GUEST_ID = "00000000-0000-0000-0000-000000000001";

export async function gradeAndSubmitAttempt(input: SubmitAttemptInput) {
  const isGuest = input.userId === GUEST_ID;

  try {
    const [attempt] = await db
      .select()
      .from(attempts)
      .where(
        isGuest
          ? eq(attempts.id, input.attemptId)
          : and(eq(attempts.id, input.attemptId), eq(attempts.userId, input.userId))
      )
      .limit(1);

    if (!attempt) throw new Error("Attempt not found or unauthorized");

    // Fetch all questions in this set with real correct choices from DB
    const qRecords = await db
      .select({
        question: questions,
      })
      .from(questionSetItems)
      .innerJoin(questions, eq(questionSetItems.questionId, questions.id))
      .where(eq(questionSetItems.questionSetId, attempt.questionSetId));

    const qMap = new Map(qRecords.map((r) => [r.question.id, r.question]));

    let correctCount = 0;
    const answerInserts: {
      id: string;
      attemptId: string;
      questionId: string;
      selectedChoice: "a" | "b" | "c" | "d" | null;
      isCorrect: boolean;
      timeSpentSeconds: number | null;
    }[] = [];

    // Grade each submitted answer
    for (const ans of input.answers) {
      const q = qMap.get(ans.questionId);
      if (!q) continue;

      const isCorrect =
        ans.selectedChoice !== null &&
        ans.selectedChoice.toLowerCase() === q.correctChoice.toLowerCase();

      if (isCorrect) correctCount++;

      answerInserts.push({
        id: randomUUID(),
        attemptId: attempt.id,
        questionId: q.id,
        selectedChoice: ans.selectedChoice,
        isCorrect,
        timeSpentSeconds: ans.timeSpentSeconds || null,
      });
    }

    // Execute atomic transaction for deleting old partial answers and saving score
    let updatedAttempt = attempt;
    await db.transaction(async (tx) => {
      await tx.delete(answerRecords).where(eq(answerRecords.attemptId, attempt.id));

      if (answerInserts.length > 0) {
        await tx.insert(answerRecords).values(answerInserts);
      }

      const [updated] = await tx
        .update(attempts)
        .set({
          score: correctCount,
          completedAt: new Date(),
          durationSeconds: input.durationSeconds,
        })
        .where(eq(attempts.id, attempt.id))
        .returning();

      if (updated) updatedAttempt = updated;
    });

    // Update user's Spaced Repetition (SRS) stability and retention metrics
    const totalQ = attempt.totalQuestions || qRecords.length || 1;
    const scorePct = Math.round((correctCount / totalQ) * 100);
    await updateTopicSrsAfterAttempt({
      userId: attempt.userId,
      questionSetId: attempt.questionSetId,
      scorePercent: scorePct,
    });

    return updatedAttempt;
  } catch (err) {
    console.warn("DB grading failed, using fallback:", err);
    const store = getMockStore();
    const attempt = store.attempts.get(input.attemptId);
    if (!attempt || (!isGuest && attempt.userId !== input.userId)) {
      throw new Error("Attempt not found in store");
    }

    let correctCount = 0;
    for (const ans of input.answers) {
      const q = store.questions.get(ans.questionId);
      if (!q) continue;

      const isCorrect =
        ans.selectedChoice !== null &&
        ans.selectedChoice.toLowerCase() === q.correctChoice.toLowerCase();

      if (isCorrect) correctCount++;

      const rec: AnswerRecord = {
        id: randomUUID(),
        attemptId: attempt.id,
        questionId: q.id,
        selectedChoice: ans.selectedChoice,
        isCorrect,
        timeSpentSeconds: ans.timeSpentSeconds || null,
      };
      store.answerRecords.set(rec.id, rec);
    }

    attempt.score = correctCount;
    attempt.completedAt = new Date();
    attempt.durationSeconds = input.durationSeconds;
    store.attempts.set(attempt.id, attempt);

    return attempt;
  }
}

export interface QuestionResultDetail {
  id: string;
  orderIndex: number;
  promptText: string;
  choiceA: string;
  choiceB: string;
  choiceC: string;
  choiceD: string;
  selectedChoice: "a" | "b" | "c" | "d" | null;
  correctChoice: "a" | "b" | "c" | "d";
  isCorrect: boolean;
  explanation: string | null;
  imageUrl: string | null;
  interactiveHtml: string | null;
  interactiveUrl: string | null;
  timeSpentSeconds: number | null;
}

export async function getAttemptResults(attemptId: string, userId: string) {
  const isGuest = userId === GUEST_ID;

  try {
    const [attemptRecord] = await db
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

    if (!attemptRecord) return null;

    // Fetch answer records
    const answers = await db
      .select()
      .from(answerRecords)
      .where(eq(answerRecords.attemptId, attemptId));

    const ansMap = new Map(answers.map((a) => [a.questionId, a]));

    // Fetch questions in order
    const items = await db
      .select({
        orderIndex: questionSetItems.orderIndex,
        q: questions,
      })
      .from(questionSetItems)
      .innerJoin(questions, eq(questionSetItems.questionId, questions.id))
      .where(eq(questionSetItems.questionSetId, attemptRecord.set.id))
      .orderBy(questionSetItems.orderIndex);

    const questionResults: QuestionResultDetail[] = items.map((i) => {
      const userAns = ansMap.get(i.q.id);
      return {
        id: i.q.id,
        orderIndex: i.orderIndex,
        promptText: i.q.promptText,
        choiceA: i.q.choiceA,
        choiceB: i.q.choiceB,
        choiceC: i.q.choiceC,
        choiceD: i.q.choiceD,
        selectedChoice: userAns?.selectedChoice || null,
        correctChoice: i.q.correctChoice,
        isCorrect: userAns?.isCorrect || false,
        explanation: i.q.explanation,
        imageUrl: i.q.imageUrl,
        interactiveHtml: i.q.interactiveHtml,
        interactiveUrl: i.q.interactiveUrl,
        timeSpentSeconds: userAns?.timeSpentSeconds || null,
      };
    });

    const score = attemptRecord.attempt.score ?? 0;
    const total = attemptRecord.attempt.totalQuestions || questionResults.length;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

    return {
      attempt: attemptRecord.attempt,
      questionSet: attemptRecord.set,
      score,
      total,
      percentage,
      questions: questionResults,
    };
  } catch (err) {
    console.warn("DB results fetch failed, reading fallback:", err);
    const store = getMockStore();
    const attempt = store.attempts.get(attemptId);
    if (!attempt || (!isGuest && attempt.userId !== userId)) return null;

    const set = store.questionSets.get(attempt.questionSetId);
    if (!set) return null;

    const answers = Array.from(store.answerRecords.values()).filter(
      (a) => a.attemptId === attemptId
    );
    const ansMap = new Map(answers.map((a) => [a.questionId, a]));

    const items = Array.from(store.questionSetItems.values())
      .filter((i) => i.questionSetId === set.id)
      .sort((a, b) => a.orderIndex - b.orderIndex);

    const questionResults: QuestionResultDetail[] = items.map((i) => {
      const q = store.questions.get(i.questionId)!;
      const userAns = ansMap.get(q.id);
      return {
        id: q.id,
        orderIndex: i.orderIndex,
        promptText: q.promptText,
        choiceA: q.choiceA,
        choiceB: q.choiceB,
        choiceC: q.choiceC,
        choiceD: q.choiceD,
        selectedChoice: userAns?.selectedChoice || null,
        correctChoice: q.correctChoice,
        isCorrect: userAns?.isCorrect || false,
        explanation: q.explanation,
        imageUrl: q.imageUrl,
        interactiveHtml: q.interactiveHtml,
        interactiveUrl: q.interactiveUrl,
        timeSpentSeconds: userAns?.timeSpentSeconds || null,
      };
    });

    const score = attempt.score ?? 0;
    const total = attempt.totalQuestions || questionResults.length;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

    return {
      attempt,
      questionSet: set,
      score,
      total,
      percentage,
      questions: questionResults,
    };
  }
}
