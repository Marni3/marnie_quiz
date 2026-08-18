import { parseAndValidateCsv } from "../lib/validations/csv";
import { createQuestionSetFromCsv } from "../lib/quizzes";
import { createFolder } from "../lib/folders";
import fs from "fs";
import path from "path";

async function main() {
  const sampleCsvPath = path.resolve(
    __dirname,
    "../../test-sets/sample.csv"
  );

  if (!fs.existsSync(sampleCsvPath)) {
    console.log("No sample.csv found at", sampleCsvPath);
    return;
  }

  const csvContent = fs.readFileSync(sampleCsvPath, "utf8");
  const validation = parseAndValidateCsv(csvContent);

  if (!validation.success || !validation.rows) {
    console.error("Sample CSV validation failed:", validation.errors);
    return;
  }

  const demoUserId = "00000000-0000-0000-0000-000000000001";

  // Create sample folder
  const cardiologyFolder = await createFolder(
    demoUserId,
    "Clinical Medicine"
  );

  // Create sample question set
  const set = await createQuestionSetFromCsv({
    userId: demoUserId,
    title: "Clinical Board Examination Sample Set",
    subjectTag: "Clinical Medicine",
    visibility: "shared",
    folderId: cardiologyFolder.id,
    rawCsv: csvContent,
    rows: validation.rows,
  });

  console.log("Successfully seeded question set:", set.id, set.title);
}

main().catch((err) => {
  console.error("Seed script error:", err);
});
