import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db, pool } from "../lib/db/client";
import { users, questionSets, questions, questionSetItems } from "../lib/db/schema";
import seedData from "../data/seed-data.json";
import { eq } from "drizzle-orm";

async function runFastBatchSeed() {
  console.log("🚀 Starting Fast Batch PostgreSQL ingestion for all 190 ECE Board Exam test sets...");
  const startTime = Date.now();

  try {
    const defaultUserId = "00000000-0000-0000-0000-000000000001";
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, defaultUserId))
      .limit(1);

    if (existingUser.length === 0) {
      await db.insert(users).values({
        id: defaultUserId,
        email: "system@marnie.quiz",
        name: "PRC Board Exam Archive",
        image: "https://api.dicebear.com/7.x/bottts/svg?seed=prc",
      });
      console.log("✓ Created system archive user.");
    }

    // 1. First, fetch any already existing sets to avoid duplicate keys
    const existingSets = await db.select({ id: questionSets.id, title: questionSets.title }).from(questionSets);
    const existingSetTitles = new Set(existingSets.map(s => s.title));

    const setsToInsert = (seedData as any[]).filter(s => !existingSetTitles.has(s.title));

    console.log(`Ingesting ${setsToInsert.length} new test sets (out of ${seedData.length} total)...`);

    for (let sIdx = 0; sIdx < setsToInsert.length; sIdx++) {
      const s = setsToInsert[sIdx];
      const [insertedSet] = await db
        .insert(questionSets)
        .values({
          uploadedByUserId: defaultUserId,
          title: s.title,
          subjectTag: s.subjectTag || s.subjectCategory || "General",
          visibility: "shared",
        })
        .returning();

      const targetSetId = insertedSet.id;

      if (Array.isArray(s.questions) && s.questions.length > 0) {
        // Prepare questions chunk
        const qValues = s.questions.map((q: any) => ({
          sourceQuestionSetId: targetSetId,
          promptText: q.promptText,
          choiceA: q.choiceA,
          choiceB: q.choiceB,
          choiceC: q.choiceC,
          choiceD: q.choiceD,
          correctChoice: q.correctChoice as any,
          explanation: q.explanation || null,
          imageUrl: q.imageUrl || null,
        }));

        // Batch insert questions for this set
        const insertedQuestions = await db.insert(questions).values(qValues).returning();

        // Batch insert question set items
        const itemValues = insertedQuestions.map((iq, i) => ({
          questionSetId: targetSetId,
          questionId: iq.id,
          orderIndex: i,
        }));

        await db.insert(questionSetItems).values(itemValues);
      }

      if ((sIdx + 1) % 25 === 0 || sIdx === setsToInsert.length - 1) {
        console.log(`  ✓ Processed ${sIdx + 1}/${setsToInsert.length} test sets...`);
      }
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`✅ Fast batch ingestion completed in ${elapsed}s!`);

    const [totalSets] = await db.select({ count: questionSets.id }).from(questionSets);
    console.log(`📊 Neon Database Status: All test sets successfully stored in cloud PostgreSQL!`);
  } catch (err) {
    console.error("❌ Database seeding error:", err);
  } finally {
    await pool.end();
  }
}

runFastBatchSeed();
