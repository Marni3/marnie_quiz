/**
 * In-memory fallback datastore for local dev & demo runs when DATABASE_URL is not yet connected.
 * Seamlessly integrates with the exact Drizzle schema entities and pre-seeds all 190 ECE Board Exam test sets.
 */

import {
  User,
  Folder,
  QuestionSet,
  Question,
  QuestionSetItem,
  Attempt,
  AnswerRecord,
  UserTopicSrs,
  UserModuleProgress,
} from "./db/schema";
import seedData from "../data/seed-data.json";

export interface MockStore {
  users: Map<string, User>;
  folders: Map<string, Folder>;
  questionSets: Map<string, QuestionSet>;
  questions: Map<string, Question>;
  questionSetItems: Map<string, QuestionSetItem>;
  attempts: Map<string, Attempt>;
  answerRecords: Map<string, AnswerRecord>;
  userTopicSrs: Map<string, UserTopicSrs>;
  userModuleProgress: Map<string, UserModuleProgress>;
}

const globalStore = globalThis as unknown as { __mockStore?: MockStore };

export function getMockStore(): MockStore {
  if (!globalStore.__mockStore) {
    globalStore.__mockStore = {
      users: new Map(),
      folders: new Map(),
      questionSets: new Map(),
      questions: new Map(),
      questionSetItems: new Map(),
      attempts: new Map(),
      answerRecords: new Map(),
      userTopicSrs: new Map(),
      userModuleProgress: new Map(),
    };

    // Seed default sample user
    const defaultUser: User = {
      id: "00000000-0000-0000-0000-000000000001",
      email: "guest@marnie.quiz",
      name: "Guest Student",
      image: "https://api.dicebear.com/7.x/bottts/svg?seed=guest",
      createdAt: new Date(),
    };
    globalStore.__mockStore.users.set(defaultUser.id, defaultUser);
    globalStore.__mockStore.users.set(defaultUser.email, defaultUser);

    // Pre-populate with all 190 seed test sets & questions
    try {
      if (Array.isArray(seedData)) {
        for (const s of seedData) {
          const qSet: QuestionSet = {
            id: s.id || `set_${Math.random().toString(36).slice(2)}`,
            uploadedByUserId: defaultUser.id,
            folderId: null,
            title: s.title,
            tier: "review",
            topicCode: null,
            subjectTag: s.subjectTag || s.subjectCategory || "General",
            moduleId: null,
            visibility: "shared",
            rawCsv: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          globalStore.__mockStore.questionSets.set(qSet.id, qSet);

          if (Array.isArray(s.questions)) {
            s.questions.forEach((q: any, idx: number) => {
              const questionRecord: Question = {
                id: q.id || `q_${Math.random().toString(36).slice(2)}`,
                sourceQuestionSetId: qSet.id,
                promptText: q.promptText,
                choiceA: q.choiceA,
                choiceB: q.choiceB,
                choiceC: q.choiceC,
                choiceD: q.choiceD,
                correctChoice: q.correctChoice as any,
                explanation: q.explanation || null,
                imageUrl: q.imageUrl || null,
                interactiveHtml: null,
                interactiveUrl: null,
                archetype: "standard",
                microCluster: null,
                isAnchor: false,
              };
              globalStore.__mockStore!.questions.set(questionRecord.id, questionRecord);

              const itemRecord: QuestionSetItem = {
                id: `qsi_${qSet.id}_${q.id}`,
                questionSetId: qSet.id,
                questionId: questionRecord.id,
                orderIndex: idx,
              };
              globalStore.__mockStore!.questionSetItems.set(
                itemRecord.id,
                itemRecord
              );
            });
          }
        }
      }
    } catch (err) {
      console.warn("Could not load initial seed-data.json:", err);
    }
  }
  return globalStore.__mockStore;
}
