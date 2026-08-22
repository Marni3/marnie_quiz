import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

if (typeof WebSocket === "undefined") {
  try {
    const ws = require("ws");
    neonConfig.webSocketConstructor = ws;
  } catch {
    // ws optional in edge/browser runtimes
  }
}

const connectionString =
  process.env.DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5432/marnie_quiz";

export const pool = new Pool({
  connectionString,
});

export const db = drizzle(pool, { schema });
