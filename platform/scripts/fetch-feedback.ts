import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      SELECT id, module_id, category, comment, metadata, created_at 
      FROM user_feedbacks 
      ORDER BY created_at DESC 
      LIMIT 50;
    `);
    console.log("=== FEEDBACK COUNT:", res.rows.length, "===");
    res.rows.forEach((r, i) => {
      console.log(`\n[#${i + 1}] Category: ${r.category} | Module: ${r.module_id} | Date: ${r.created_at}`);
      console.log(`Comment: ${r.comment}`);
    });
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch(console.error);
