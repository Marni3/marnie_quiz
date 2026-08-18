/**
 * In-memory fallback datastore for local dev & demo runs when DATABASE_URL is not yet connected.
 * Seamlessly integrates with the same TypeScript shapes.
 */

import {
  User,
  Folder,
  QuestionSet,
  Question,
  QuestionSetItem,
  Attempt,
  AnswerRecord,
} from "./db/schema";

export interface MockStore {
  users: Map<string, User>;
  folders: Map<string, Folder>;
  questionSets: Map<string, QuestionSet>;
  questions: Map<string, Question>;
  questionSetItems: Map<string, QuestionSetItem>;
  attempts: Map<string, Attempt>;
  answerRecords: Map<string, AnswerRecord>;
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
    };

    // Seed default sample user
    const defaultUser: User = {
      id: "00000000-0000-0000-0000-000000000001",
      email: "demo@marnie.quiz",
      name: "Demo Student",
      image: "https://api.dicebear.com/7.x/bottts/svg?seed=demo",
      createdAt: new Date(),
    };
    globalStore.__mockStore.users.set(defaultUser.id, defaultUser);
    globalStore.__mockStore.users.set(defaultUser.email, defaultUser);
  }
  return globalStore.__mockStore;
}
