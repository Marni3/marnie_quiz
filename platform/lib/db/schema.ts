import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const choiceEnum = pgEnum("choice", ["a", "b", "c", "d"]);
export const visibilityEnum = pgEnum("visibility", ["shared", "private"]);
export const attemptModeEnum = pgEnum("attempt_mode", [
  "untimed",
  "timed_per_question",
  "timed_whole_exam",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const folders = pgTable("folders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  parentFolderId: uuid("parent_folder_id"),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const questionSets = pgTable("question_sets", {
  id: uuid("id").defaultRandom().primaryKey(),
  uploadedByUserId: uuid("uploaded_by_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  folderId: uuid("folder_id").references(() => folders.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  subjectTag: text("subject_tag"),
  visibility: visibilityEnum("visibility").notNull().default("shared"),
  rawCsv: text("raw_csv"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const questions = pgTable("questions", {
  id: uuid("id").defaultRandom().primaryKey(),
  sourceQuestionSetId: uuid("source_question_set_id").references(
    () => questionSets.id,
    { onDelete: "set null" }
  ),
  promptText: text("prompt_text").notNull(),
  choiceA: text("choice_a").notNull(),
  choiceB: text("choice_b").notNull(),
  choiceC: text("choice_c").notNull(),
  choiceD: text("choice_d").notNull(),
  correctChoice: choiceEnum("correct_choice").notNull(),
  explanation: text("explanation"),
  imageUrl: text("image_url"),
  interactiveHtml: text("interactive_html"),
  interactiveUrl: text("interactive_url"),
});

export const questionSetItems = pgTable("question_set_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  questionSetId: uuid("question_set_id")
    .notNull()
    .references(() => questionSets.id, { onDelete: "cascade" }),
  questionId: uuid("question_id")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  orderIndex: integer("order_index").notNull(),
});

export const attempts = pgTable("attempts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  questionSetId: uuid("question_set_id")
    .notNull()
    .references(() => questionSets.id, { onDelete: "cascade" }),
  mode: attemptModeEnum("mode").notNull().default("untimed"),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  clientCreatedAt: timestamp("client_created_at"),
  completedAt: timestamp("completed_at"),
  durationSeconds: integer("duration_seconds"),
  score: integer("score"),
  totalQuestions: integer("total_questions").notNull(),
});

export const answerRecords = pgTable("answer_records", {
  id: uuid("id").defaultRandom().primaryKey(),
  attemptId: uuid("attempt_id")
    .notNull()
    .references(() => attempts.id, { onDelete: "cascade" }),
  questionId: uuid("question_id")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  selectedChoice: choiceEnum("selected_choice"),
  isCorrect: boolean("is_correct").notNull(),
  timeSpentSeconds: integer("time_spent_seconds"),
});

export type User = typeof users.$inferSelect;
export type Folder = typeof folders.$inferSelect;
export type QuestionSet = typeof questionSets.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type QuestionSetItem = typeof questionSetItems.$inferSelect;
export type Attempt = typeof attempts.$inferSelect;
export type AnswerRecord = typeof answerRecords.$inferSelect;
