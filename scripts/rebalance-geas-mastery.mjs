import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

const GEAS_MASTERY_FILES = [
  path.join(ROOT_DIR, "test-sets", "learning-modules", "geas", "mastery", "geas-10-01-mastery.json"),
  path.join(ROOT_DIR, "test-sets", "learning-modules", "geas", "mastery", "geas-10-02-mastery.json"),
  path.join(ROOT_DIR, "test-sets", "learning-modules", "geas", "mastery", "geas-10-03-mastery.json"),
];

// Target pattern: 25 items -> 6 A, 6 B, 6 C, 7 D, max consecutive 1
const TARGET_PATTERNS = [
  // Pattern 1: B, C, D, A, C, D, A, B, D, A, B, C, A, B, C, D, B, C, D, A, C, D, A, B, D
  ["B", "C", "D", "A", "C", "D", "A", "B", "D", "A", "B", "C", "A", "B", "C", "D", "B", "C", "D", "A", "C", "D", "A", "B", "D"],
  // Pattern 2: C, D, A, B, D, A, B, C, A, B, C, D, B, C, D, A, C, D, A, B, D, A, B, C, D
  ["C", "D", "A", "B", "D", "A", "B", "C", "A", "B", "C", "D", "B", "C", "D", "A", "C", "D", "A", "B", "D", "A", "B", "C", "D"],
  // Pattern 3: D, A, B, C, A, B, C, D, B, C, D, A, C, D, A, B, D, A, B, C, A, B, C, D, D
  ["D", "A", "B", "C", "A", "B", "C", "D", "B", "C", "D", "A", "C", "D", "A", "B", "D", "A", "B", "C", "A", "B", "C", "D", "B"],
];

GEAS_MASTERY_FILES.forEach((filePath, fIdx) => {
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const pattern = TARGET_PATTERNS[fIdx % TARGET_PATTERNS.length];

  data.questions.forEach((q, qIdx) => {
    const originalCorrectKey = q.correctChoice || (typeof q.correctAnswer === "number" ? ["A", "B", "C", "D"][q.correctAnswer] : q.correctAnswer) || "A";
    const correctText = q[`choice${originalCorrectKey.toUpperCase()}`];
    
    // Extract distractors
    const allKeys = ["A", "B", "C", "D"];
    const distractorTexts = allKeys
      .filter((k) => k !== originalCorrectKey.toUpperCase())
      .map((k) => q[`choice${k}`]);

    const targetKey = pattern[qIdx % pattern.length];
    const newChoices = {};
    newChoices[`choice${targetKey}`] = correctText;

    const remainingKeys = allKeys.filter((k) => k !== targetKey);
    remainingKeys.forEach((k, idx) => {
      newChoices[`choice${k}`] = distractorTexts[idx];
    });

    q.choiceA = newChoices.choiceA;
    q.choiceB = newChoices.choiceB;
    q.choiceC = newChoices.choiceC;
    q.choiceD = newChoices.choiceD;
    q.correctChoice = targetKey;
    if (q.correctAnswer !== undefined) {
      delete q.correctAnswer;
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  console.log(`Rebalanced: ${path.basename(filePath)}`);
});
