import { db } from "../lib/db/client";
import { users, questionSets, questions, questionSetItems } from "../lib/db/schema";
import seedData from "../data/seed-data.json";
import { eq } from "drizzle-orm";

async function runSeed() {
  console.log("🚀 Starting PostgreSQL batch ingestion for all 190 ECE Board Exam test sets...");

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

    let setCounter = 0;
    let questionCounter = 0;

    for (const s of seedData as any[]) {
      const existingSet = await db
        .select()
        .from(questionSets)
        .where(eq(questionSets.title, s.title))
        .limit(1);

      let targetSetId = existingSet[0]?.id;

      if (!targetSetId) {
        const [insertedSet] = await db
          .insert(questionSets)
          .values({
            uploadedByUserId: defaultUserId,
            title: s.title,
            subjectTag: s.subjectTag || s.subjectCategory || "General",
            visibility: "shared",
          })
          .returning();
        targetSetId = insertedSet.id;
        setCounter++;
      }

      if (Array.isArray(s.questions) && s.questions.length > 0) {
        for (let i = 0; i < s.questions.length; i++) {
          const q = s.questions[i];
          const [insertedQ] = await db
            .insert(questions)
            .values({
              sourceQuestionSetId: targetSetId,
              promptText: q.promptText,
              choiceA: q.choiceA,
              choiceB: q.choiceB,
              choiceC: q.choiceC,
              choiceD: q.choiceD,
              correctChoice: q.correctChoice as any,
              explanation: q.explanation || null,
              imageUrl: q.imageUrl || null,
            })
            .returning();

          await db.insert(questionSetItems).values({
            questionSetId: targetSetId,
            questionId: insertedQ.id,
            orderIndex: i,
          });
          questionCounter++;
        }
      }
    }

    console.log(`✅ Database seeding completed successfully!`);
    console.log(`   Ingested ${setCounter} question sets and ${questionCounter} questions.`);
  } catch (err) {
    console.error("❌ Database seeding error:", err);
  }
}

runSeed();
