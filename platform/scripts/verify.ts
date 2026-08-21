import { db, pool } from "../lib/db/client";
import { questionSets, questions, users } from "../lib/db/schema";

async function check() {
  try {
    const allSets = await db.select().from(questionSets);
    const allQs = await db.select().from(questions);
    const allUsers = await db.select().from(users);

    console.log("=== NEON POSTGRESQL LIVE VERIFICATION ===");
    console.log("✓ Connected to Neon PostgreSQL (AWS ap-southeast-1)");
    console.log("✓ Users in DB:", allUsers.length);
    console.log("✓ Question Sets in DB:", allSets.length);
    console.log("✓ Total Questions in DB:", allQs.length);
  } catch (err) {
    console.error("Verification error:", err);
  } finally {
    await pool.end();
  }
}

check();
