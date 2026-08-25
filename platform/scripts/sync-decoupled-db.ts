import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db, pool } from "../lib/db/client";
import { questionSets, questions, users, questionSetItems, userTopicSrs } from "../lib/db/schema";
import { sql } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

async function instantBulkSync() {
  console.log("=== INSTANT MULTI-ROW BATCH SYNC TO NEON POSTGRESQL ===");

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

  console.log("Preparing bulk arrays...");
  
  // Prepare all sets
  const setRows = seedSets.map((s: any) => ({
    uploadedByUserId: guestUser.id,
    title: s.title,
    tier: s.tier || "review",
    topicCode: s.topicCode,
    subjectTag: s.subjectTag,
    visibility: "shared" as const,
  }));

  // Insert all 202 sets in 1 query!
  console.log(`Inserting ${setRows.length} question sets in 1 batch query...`);
  const insertedSets = await db.insert(questionSets).values(setRows).returning();

  // Prepare questions and items
  const allQuestionRows: any[] = [];
  const questionMap: { setIdx: number; qInSetIdx: number }[] = [];

  seedSets.forEach((s: any, setIdx: number) => {
    const qs = s.questions || [];
    qs.forEach((q: any, qIdx: number) => {
      allQuestionRows.push({
        sourceQuestionSetId: insertedSets[setIdx].id,
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
      });
      questionMap.push({ setIdx, qInSetIdx: qIdx });
    });
  });

  console.log(`Inserting ${allQuestionRows.length} questions in chunks of 500...`);
  const chunkSize = 500;
  const allInsertedQuestions: any[] = [];

  for (let i = 0; i < allQuestionRows.length; i += chunkSize) {
    const chunk = allQuestionRows.slice(i, i + chunkSize);
    const res = await db.insert(questions).values(chunk).returning();
    allInsertedQuestions.push(...res);
    process.stdout.write(`.` );
  }
  console.log(`\nInserted ${allInsertedQuestions.length} questions.`);

  console.log("Preparing questionSetItems...");
  const allItemRows = allInsertedQuestions.map((q, idx) => {
    const map = questionMap[idx];
    return {
      questionSetId: insertedSets[map.setIdx].id,
      questionId: q.id,
      orderIndex: map.qInSetIdx,
    };
  });

  console.log(`Inserting ${allItemRows.length} question set items in chunks of 1000...`);
  for (let i = 0; i < allItemRows.length; i += 1000) {
    const chunk = allItemRows.slice(i, i + 1000);
    await db.insert(questionSetItems).values(chunk);
    process.stdout.write(`.` );
  }
  console.log(`\nInserted ${allItemRows.length} questionSetItems.`);

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

  console.log("[OK] Instant bulk sync to Neon PostgreSQL complete!");
  await pool.end();
}

instantBulkSync().catch((err) => {
  console.error("Instant bulk sync failed:", err);
  process.exit(1);
});
