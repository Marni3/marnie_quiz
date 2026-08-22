import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db, pool } from "../lib/db/client";
import { questionSets, questions, users, attempts } from "../lib/db/schema";
import { eq, sql } from "drizzle-orm";

export function parseSet(title: string): { tier: string; topicCode: string } {
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

  // 1. Check for combined numbers like MATH 03-04 or MATH 07-08
  const mMulti = title.match(/^([A-Za-z]+)\s*(\d+)[\s\-_–]+(\d+)/);
  if (mMulti) {
    const subj = mMulti[1].toUpperCase();
    const n1 = String(Number(mMulti[2])).padStart(2, "0");
    const n2 = String(Number(mMulti[3])).padStart(2, "0");
    return { tier, topicCode: `${subj}-${n1}-${n2}` };
  }

  // 2. Check for DE or ADV
  const mDe = title.match(/^([A-Za-z]+)\s*(DE|ADV)/i);
  if (mDe) {
    return { tier, topicCode: `${mDe[1].toUpperCase()}-${mDe[2].toUpperCase()}` };
  }

  // 3. Check for single numbers like ELEC 01, GEAS 04, MATH 05
  const mSingle = title.match(/^([A-Za-z]+)\s*(\d+)/);
  if (mSingle) {
    const subj = mSingle[1].toUpperCase();
    const n = String(Number(mSingle[2])).padStart(2, "0");
    return { tier, topicCode: `${subj}-${n}` };
  }

  return { tier, topicCode: "GEN-01" };
}

async function verifyAndBackfill() {
  console.log("=== NEON POSTGRESQL LIVE VERIFICATION & TIER/TOPIC BACKFILL ===");

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
  console.log(`[OK] Backfilled normalized tier and topicCode for ${updatedCount} question sets.`);

  const distinctTopics = await db
    .select({ topic: questionSets.topicCode })
    .from(questionSets)
    .groupBy(questionSets.topicCode);
  console.log(`[OK] Distinct topic codes in live DB (${distinctTopics.length}):`, distinctTopics.map(t => t.topic).sort());

  console.log("[OK] Neon PostgreSQL verification & schema backfill completed successfully.");
  await pool.end();
}

verifyAndBackfill().catch((err) => {
  console.error("Backfill failed:", err);
  process.exit(1);
});
