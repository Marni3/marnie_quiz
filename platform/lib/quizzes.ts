import { db } from "./db/client";
import {
  questionSets,
  questions,
  questionSetItems,
  users,
  folders,
  QuestionSet,
  Question,
} from "./db/schema";
import { eq, and, desc, sql, or } from "drizzle-orm";
import { ValidatedCsvRow } from "./validations/csv";
import { getMockStore } from "./store";
import { randomUUID } from "crypto";

export interface CreateQuizInput {
  userId: string;
  title: string;
  subjectTag?: string | null;
  visibility?: "shared" | "private";
  folderId?: string | null;
  rawCsv?: string | null;
  rows: ValidatedCsvRow[];
}

export async function createQuestionSetFromCsv(input: CreateQuizInput): Promise<QuestionSet> {
  const setId = randomUUID();
  const visibility = input.visibility || "shared";

  try {
    // 1. Insert questionSet
    const [set] = await db
      .insert(questionSets)
      .values({
        id: setId,
        uploadedByUserId: input.userId,
        folderId: input.folderId || null,
        title: input.title,
        subjectTag: input.subjectTag || null,
        visibility,
        rawCsv: input.rawCsv || null,
      })
      .returning();

    // 2. Insert questions & questionSetItems
    for (let i = 0; i < input.rows.length; i++) {
      const row = input.rows[i];
      const qId = randomUUID();

      await db.insert(questions).values({
        id: qId,
        sourceQuestionSetId: setId,
        promptText: row.question,
        choiceA: row.choice_a,
        choiceB: row.choice_b,
        choiceC: row.choice_c,
        choiceD: row.choice_d,
        correctChoice: row.correct_answer,
        explanation: row.explanation,
        imageUrl: row.image_url,
        interactiveUrl: row.interactive_url,
        archetype: row.archetype || "standard",
        microCluster: row.micro_cluster || null,
        isAnchor: row.is_anchor || false,
      });

      await db.insert(questionSetItems).values({
        id: randomUUID(),
        questionSetId: setId,
        questionId: qId,
        orderIndex: i,
      });
    }

    return set;
  } catch (err) {
    console.warn("DB insert failed, writing to fallback memory store:", err);
    const store = getMockStore();
    const mockSet: QuestionSet = {
      id: setId,
      uploadedByUserId: input.userId,
      folderId: input.folderId || null,
      title: input.title,
      tier: "review",
      topicCode: null,
      subjectTag: input.subjectTag || null,
      visibility,
      rawCsv: input.rawCsv || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.questionSets.set(setId, mockSet);

    input.rows.forEach((row, i) => {
      const qId = randomUUID();
      const mockQ: Question = {
        id: qId,
        sourceQuestionSetId: setId,
        promptText: row.question,
        choiceA: row.choice_a,
        choiceB: row.choice_b,
        choiceC: row.choice_c,
        choiceD: row.choice_d,
        correctChoice: row.correct_answer,
        explanation: row.explanation || null,
        imageUrl: row.image_url || null,
        interactiveHtml: null,
        interactiveUrl: row.interactive_url || null,
        archetype: "standard",
        microCluster: null,
        isAnchor: false,
      };
      store.questions.set(qId, mockQ);
      store.questionSetItems.set(randomUUID(), {
        id: randomUUID(),
        questionSetId: setId,
        questionId: qId,
        orderIndex: i,
      });
    });

    return mockSet;
  }
}

export interface QuizListItem {
  id: string;
  title: string;
  subjectTag: string | null;
  visibility: "shared" | "private";
  folderId: string | null;
  folderName: string | null;
  createdAt: Date;
  questionCount: number;
  uploader: {
    id: string;
    name: string | null;
    image: string | null;
  };
  bestScore?: {
    score: number;
    total: number;
    pct: number;
  } | null;
}

export async function getLibraryQuizzes(params: {
  userId: string;
  folderId?: string | null;
  subjectTag?: string | null;
  uploaderId?: string | null;
  search?: string | null;
}): Promise<QuizListItem[]> {
  try {
    const sets = await db
      .select({
        set: questionSets,
        uploader: users,
        folder: folders,
      })
      .from(questionSets)
      .leftJoin(users, eq(questionSets.uploadedByUserId, users.id))
      .leftJoin(folders, eq(questionSets.folderId, folders.id))
      .where(
        and(
          // Visibility rule: shared OR uploaded by current user
          or(
            eq(questionSets.visibility, "shared"),
            eq(questionSets.uploadedByUserId, params.userId)
          ),
          params.folderId ? eq(questionSets.folderId, params.folderId) : undefined,
          params.subjectTag ? eq(questionSets.subjectTag, params.subjectTag) : undefined,
          params.uploaderId ? eq(questionSets.uploadedByUserId, params.uploaderId) : undefined
        )
      )
      .orderBy(desc(questionSets.createdAt));

    const result: QuizListItem[] = [];

    for (const item of sets) {
      const qItems = await db
        .select({ count: sql<number>`count(*)` })
        .from(questionSetItems)
        .where(eq(questionSetItems.questionSetId, item.set.id));

      const count = Number(qItems[0]?.count || 0);

      // Search filter
      if (params.search) {
        const query = params.search.toLowerCase();
        const matchesTitle = item.set.title.toLowerCase().includes(query);
        const matchesSubject = item.set.subjectTag?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesSubject) continue;
      }

      result.push({
        id: item.set.id,
        title: item.set.title,
        subjectTag: item.set.subjectTag,
        visibility: item.set.visibility,
        folderId: item.set.folderId,
        folderName: item.folder?.name || null,
        createdAt: item.set.createdAt,
        questionCount: count,
        uploader: {
          id: item.uploader?.id || item.set.uploadedByUserId,
          name: item.uploader?.name || "Anonymous",
          image: item.uploader?.image || null,
        },
      });
    }

    return result;
  } catch (err) {
    console.warn("DB query failed, reading fallback memory store:", err);
    const store = getMockStore();
    const result: QuizListItem[] = [];

    for (const set of store.questionSets.values()) {
      if (set.visibility === "private" && set.uploadedByUserId !== params.userId) {
        continue;
      }
      if (params.folderId && set.folderId !== params.folderId) continue;
      if (params.subjectTag && set.subjectTag !== params.subjectTag) continue;
      if (params.uploaderId && set.uploadedByUserId !== params.uploaderId) continue;

      if (params.search) {
        const query = params.search.toLowerCase();
        const matchesTitle = set.title.toLowerCase().includes(query);
        const matchesSubject = set.subjectTag?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesSubject) continue;
      }

      let qCount = 0;
      for (const qi of store.questionSetItems.values()) {
        if (qi.questionSetId === set.id) qCount++;
      }

      const uploader = store.users.get(set.uploadedByUserId);
      const folder = set.folderId ? store.folders.get(set.folderId) : null;

      result.push({
        id: set.id,
        title: set.title,
        subjectTag: set.subjectTag,
        visibility: set.visibility,
        folderId: set.folderId,
        folderName: folder?.name || null,
        createdAt: set.createdAt,
        questionCount: qCount,
        uploader: {
          id: uploader?.id || set.uploadedByUserId,
          name: uploader?.name || "Student User",
          image: uploader?.image || null,
        },
      });
    }

    return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export async function getQuestionSetDetail(setId: string, userId: string) {
  try {
    const [setRecord] = await db
      .select({
        set: questionSets,
        uploader: users,
        folder: folders,
      })
      .from(questionSets)
      .leftJoin(users, eq(questionSets.uploadedByUserId, users.id))
      .leftJoin(folders, eq(questionSets.folderId, folders.id))
      .where(eq(questionSets.id, setId))
      .limit(1);

    if (!setRecord) return null;
    if (
      setRecord.set.visibility === "private" &&
      setRecord.set.uploadedByUserId !== userId
    ) {
      return null;
    }

    const items = await db
      .select({
        item: questionSetItems,
        question: questions,
      })
      .from(questionSetItems)
      .innerJoin(questions, eq(questionSetItems.questionId, questions.id))
      .where(eq(questionSetItems.questionSetId, setId))
      .orderBy(questionSetItems.orderIndex);

    return {
      ...setRecord.set,
      folderName: setRecord.folder?.name || null,
      uploader: {
        id: setRecord.uploader?.id || setRecord.set.uploadedByUserId,
        name: setRecord.uploader?.name || "Anonymous",
        image: setRecord.uploader?.image || null,
      },
      questions: items.map((i) => i.question),
    };
  } catch (err) {
    console.warn("DB query failed, reading fallback store:", err);
    const store = getMockStore();
    const set = store.questionSets.get(setId);
    if (!set) return null;
    if (set.visibility === "private" && set.uploadedByUserId !== userId) return null;

    const uploader = store.users.get(set.uploadedByUserId);
    const folder = set.folderId ? store.folders.get(set.folderId) : null;

    const qList: Question[] = [];
    const orderedItems = Array.from(store.questionSetItems.values())
      .filter((i) => i.questionSetId === setId)
      .sort((a, b) => a.orderIndex - b.orderIndex);

    for (const item of orderedItems) {
      const q = store.questions.get(item.questionId);
      if (q) qList.push(q);
    }

    return {
      ...set,
      folderName: folder?.name || null,
      uploader: {
        id: uploader?.id || set.uploadedByUserId,
        name: uploader?.name || "Student User",
        image: uploader?.image || null,
      },
      questions: qList,
    };
  }
}

export async function updateQuestionSet(
  setId: string,
  userId: string,
  updates: {
    title?: string;
    subjectTag?: string | null;
    visibility?: "shared" | "private";
    folderId?: string | null;
  }
) {
  try {
    const [updated] = await db
      .update(questionSets)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(
        and(eq(questionSets.id, setId), eq(questionSets.uploadedByUserId, userId))
      )
      .returning();
    return updated;
  } catch (err) {
    console.warn("DB update failed, using fallback:", err);
    const store = getMockStore();
    const existing = store.questionSets.get(setId);
    if (!existing || existing.uploadedByUserId !== userId) return null;

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    store.questionSets.set(setId, updated);
    return updated;
  }
}

export async function deleteQuestionSet(setId: string, userId: string) {
  try {
    await db
      .delete(questionSets)
      .where(
        and(eq(questionSets.id, setId), eq(questionSets.uploadedByUserId, userId))
      );
    return true;
  } catch (err) {
    console.warn("DB delete failed, using fallback:", err);
    const store = getMockStore();
    const existing = store.questionSets.get(setId);
    if (existing && existing.uploadedByUserId === userId) {
      store.questionSets.delete(setId);
      return true;
    }
    return false;
  }
}

export async function attachInteractiveModule(
  questionId: string,
  userId: string,
  module: {
    interactiveHtml?: string | null;
    interactiveUrl?: string | null;
  }
) {
  try {
    const [updated] = await db
      .update(questions)
      .set({
        interactiveHtml: module.interactiveHtml,
        interactiveUrl: module.interactiveUrl,
      })
      .where(eq(questions.id, questionId))
      .returning();
    return updated;
  } catch (err) {
    console.warn("DB module attach failed, using fallback:", err);
    const store = getMockStore();
    const q = store.questions.get(questionId);
    if (q) {
      q.interactiveHtml = module.interactiveHtml || null;
      q.interactiveUrl = module.interactiveUrl || null;
      return q;
    }
    return null;
  }
}
