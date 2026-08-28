import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  real,
  timestamp,
  pgEnum,
  jsonb,
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
  tier: text("tier").default("review"), // 'diagnostic' | 'review' | 'drill' | 'simulation' | 'conceptual_drill'
  topicCode: text("topic_code"), // e.g. 'MATH-01', 'ELEC-03', 'EST-10'
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
  archetype: text("archetype").default("standard"), // 'standard' | 'scaling' | 'boundary' | 'phase' | 'fault' | 'material' | 'info' | 'theorem' | 'trap'
  microCluster: text("micro_cluster"), // e.g. 'MATH-09-C Conic Sections'
  isAnchor: boolean("is_anchor").default(false), // Core syllabus spine question
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

export const userTopicSrs = pgTable("user_topic_srs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  topicCode: text("topic_code").notNull(), // 'MATH-09', 'ELEC-03', 'EST-01'
  topicName: text("topic_name").notNull(), // 'Analytic Geometry'
  subjectDomain: text("subject_domain").notNull(), // 'Mathematics'
  status: text("status").notNull().default("active"), // 'active' | 'snoozed' | 'suspended'
  snoozedUntil: timestamp("snoozed_until"),
  manualConfidence: text("manual_confidence"), // 'struggling' | 'moderate' | 'confident' | 'mastered' | null
  stabilityDays: real("stability_days").notNull().default(3.0),
  retrievability: real("retrievability").notNull().default(1.0),
  lastStudiedAt: timestamp("last_studied_at").defaultNow(),
  nextReviewDue: timestamp("next_review_due"),
  totalAttempts: integer("total_attempts").notNull().default(0),
  averageAccuracy: real("average_accuracy").notNull().default(0.0),
  lastScorePercent: integer("last_score_percent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userModuleProgress = pgTable("user_module_progress", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  moduleId: text("module_id").notNull(), // e.g. 'math-01-01', 'geas-17'
  topicCode: text("topic_code").notNull(), // e.g. 'MATH-01', 'GEAS-17'
  domain: text("domain").notNull(), // 'MATH' | 'ELECS' | 'GEAS' | 'EST'
  isCompleted: boolean("is_completed").notNull().default(false),
  isBookmarked: boolean("is_bookmarked").notNull().default(false),
  conceptChecksCompleted: integer("concept_checks_completed").notNull().default(0),
  conceptChecksTotal: integer("concept_checks_total").notNull().default(0),
  conceptChecksAccuracy: real("concept_checks_accuracy").notNull().default(0.0),
  masteryScorePercent: integer("mastery_score_percent"),
  confidence: text("confidence"), // 'struggling' | 'moderate' | 'confident' | 'mastered'
  stabilityDays: real("stability_days").notNull().default(3.0),
  retrievability: real("retrievability").notNull().default(1.0),
  lastStudiedAt: timestamp("last_studied_at").defaultNow(),
  nextReviewDue: timestamp("next_review_due"),
  totalReviews: integer("total_reviews").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userFeedbacks = pgTable("user_feedbacks", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  url: text("url").notNull(),
  moduleId: text("module_id"),
  category: text("category").notNull().default("formatting"), // 'formatting' | 'visualizer' | 'typo' | 'bug' | 'other'
  comment: text("comment").notNull(),
  metadata: jsonb("metadata"),
  resolved: boolean("resolved").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type Folder = typeof folders.$inferSelect;
export type QuestionSet = typeof questionSets.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type QuestionSetItem = typeof questionSetItems.$inferSelect;
export type Attempt = typeof attempts.$inferSelect;
export type AnswerRecord = typeof answerRecords.$inferSelect;
export type UserTopicSrs = typeof userTopicSrs.$inferSelect;
export type UserModuleProgress = typeof userModuleProgress.$inferSelect;
export type UserFeedback = typeof userFeedbacks.$inferSelect;
