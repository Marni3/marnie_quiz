import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db, pool } from "../lib/db/client";
import { questionSets, questions, users, attempts } from "../lib/db/schema";
import { eq, sql } from "drizzle-orm";

function parseSet(title: string): { tier: string; topicCode: string } {
  const t = title.toLowerCase();
  let tier = "review";
  if (t.includes("diagnostic")) {
    tier = "diagnostic";
  } else if (t.includes("drill")) {
    tier = "drill";
  } else if (t.includes("simulation")) {
    tier = "simulation";
  } else if (t.includes("conceptual")) {
    tier = "conceptual_drill";
  }

  const m = title.match(/^([A-Za-z]+)\s*(\d+)/);
  const topicCode = m ? `${m[1].toUpperCase()}-${String(Number(m[2])).padStart(2, "0")}` : "GEN-01";
  return { tier, topicCode };
}

async function verifyAndBackfill() {
  console.log("=== NEON POSTGRESQL LIVE VERIFICATION & TIER BACKFILL ===");

  const allUsers = await db.select().from(users);
  console.log("Users in DB:", allUsers.length);

  const allSets = await db.select().from(questionSets);
  console.log("Question Sets in DB:", allSets.length);

  let updatedCount = 0;
  for (const set of allSets) {
    const { tier, topicCode } = parseSet(set.title);
    await db
      .update(questionSets)
      .set({
        tier,
        topicCode,
      })
      .where(eq(questionSets.id, set.id));
    updatedCount++;
  }
  console.log(`[OK] Backfilled tier and topicCode for ${updatedCount} question sets.`);

  // Set default archetype on all questions
  await db
    .update(questions)
    .set({
      archetype: "standard",
      isAnchor: false,
    })
    .where(sql`archetype IS NULL`);

  const allQs = await db.select().from(questions);
  console.log("Total Questions in DB:", allQs.length);

  const allAttempts = await db.select().from(attempts);
  console.log("Total Attempts in DB:", allAttempts.length);

  console.log("[OK] Neon PostgreSQL verification & schema backfill completed successfully.");
  await pool.end();
}

verifyAndBackfill().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
