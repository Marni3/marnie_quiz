import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db, pool } from "../lib/db/client";
import { questionSets, questions, users, questionSetItems, userTopicSrs } from "../lib/db/schema";
import { eq, sql } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

async function syncDecoupledDatabase() {
  console.log("=== NEON POSTGRESQL BULK DECOUPLED SYLLABUS SYNC & SEED ===");

  const seedPath = path.join(__dirname, "../data/seed-data.json");
  const raw = fs.readFileSync(seedPath, "utf-8");
  const seedSets = JSON.parse(raw);

  console.log(`Loaded ${seedSets.length} sets from seed-data.json.`);

  // 1. Get or create primary guest user
  let [guestUser] = await db.select().from(users).limit(1);
  if (!guestUser) {
    const [newUser] = await db
      .insert(users)
      .values({
        email: "examinee@marnie.local",
        name: "Guest Examinee",
      })
      .returning();
    guestUser = newUser;
  }

  // 2. Clear old data cleanly
  console.log("Clearing old records...");
  await db.delete(questionSetItems);
  await db.delete(questions);
  await db.delete(questionSets);

  console.log("Bulk inserting sets and questions in transactions...");

  for (const s of seedSets) {
    const [insertedSet] = await db
      .insert(questionSets)
      .values({
        uploadedByUserId: guestUser.id,
        title: s.title,
        tier: s.tier || "review",
        topicCode: s.topicCode,
        subjectTag: s.subjectTag,
        visibility: "shared",
      })
      .returning();

    const qs = s.questions || [];
    if (qs.length === 0) continue;

    // Batch insert all questions for this set
    const qValues = qs.map((q: any) => ({
      sourceQuestionSetId: insertedSet.id,
      promptText: q.promptText,
      choiceA: q.choiceA,
      choiceB: q.choiceB,
      choiceC: q.choiceC,
      choiceD: q.choiceD,
      correctChoice: (q.correctChoice || "a").toLowerCase() as any,
      explanation: q.explanation || null,
      archetype: q.archetype || "standard",
      microCluster: q.microCluster || null,
      isAnchor: q.isAnchor || false,
    }));

    const insertedQs = await db.insert(questions).values(qValues).returning();

    // Batch insert questionSetItems
    const itemValues = insertedQs.map((q, idx) => ({
      questionSetId: insertedSet.id,
      questionId: q.id,
      orderIndex: idx,
    }));

    await db.insert(questionSetItems).values(itemValues);
  }

  console.log(`[OK] All ${seedSets.length} question sets and questions bulk inserted successfully.`);

  // 3. Re-seed default userTopicSrs for all distinct topics
  const distinctTopics = await db
    .select({
      topicCode: questionSets.topicCode,
      subjectTag: questionSets.subjectTag,
    })
    .from(questionSets)
    .groupBy(questionSets.topicCode, questionSets.subjectTag);

  console.log(`Distinct syllabus topics: ${distinctTopics.length}`);

  for (const t of distinctTopics) {
    if (!t.topicCode) continue;
    const existing = await db
      .select()
      .from(userTopicSrs)
      .where(sql`${userTopicSrs.topicCode} = ${t.topicCode} AND ${userTopicSrs.userId} = ${guestUser.id}`)
      .limit(1);

    if (existing.length === 0) {
      await db.insert(userTopicSrs).values({
        userId: guestUser.id,
        topicCode: t.topicCode,
        topicName: t.subjectTag || t.topicCode,
        subjectDomain: t.topicCode.startsWith("MATH")
          ? "Mathematics"
          : t.topicCode.startsWith("ELEC")
          ? "Electronics Engineering"
          : t.topicCode.startsWith("GEAS")
          ? "General Engineering"
          : "Electronics Systems",
        stabilityDays: 3.0,
        retrievability: 1.0,
        totalAttempts: 0,
        averageAccuracy: 0.0,
      });
    }
  }

  console.log("[OK] Neon PostgreSQL live sync and continuous syllabus re-indexing complete!");
  await pool.end();
}

syncDecoupledDatabase().catch((err) => {
  console.error("Sync failed:", err);
  process.exit(1);
});
