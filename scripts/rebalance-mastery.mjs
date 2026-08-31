import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const MASTERY_DIR = path.join(ROOT_DIR, "test-sets", "learning-modules", "math", "mastery");

function generateBalancedKeys(count, seed = 42) {
  const letters = ["A", "B", "C", "D"];
  const baseCount = Math.floor(count / 4);
  const remainder = count % 4;

  const pool = [];
  for (let i = 0; i < 4; i++) {
    const num = baseCount + (i < remainder ? 1 : 0);
    for (let j = 0; j < num; j++) {
      pool.push(letters[i]);
    }
  }

  let s = seed;
  function random() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  }

  let attempts = 0;
  let candidate = [];
  while (attempts < 2000) {
    attempts++;
    candidate = [...pool];
    for (let i = candidate.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [candidate[i], candidate[j]] = [candidate[j], candidate[i]];
    }

    let maxStreak = 1;
    let currStreak = 1;
    for (let i = 1; i < candidate.length; i++) {
      if (candidate[i] === candidate[i - 1]) {
        currStreak++;
        if (currStreak > maxStreak) maxStreak = currStreak;
      } else {
        currStreak = 1;
      }
    }

    if (maxStreak <= 2) {
      break;
    }
  }

  return candidate;
}

const files = fs.readdirSync(MASTERY_DIR).filter((f) => f.endsWith(".json")).sort();
console.log(`Processing ${files.length} Math Mastery Challenge files...`);

let fileIndex = 0;
for (const file of files) {
  fileIndex++;
  const filePath = path.join(MASTERY_DIR, file);
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const questions = data.questions || [];

  const targetKeys = generateBalancedKeys(questions.length, fileIndex * 7919 + 31);
  const letterMap = ["A", "B", "C", "D"];

  questions.forEach((q, idx) => {
    // Current correct letter
    let currCorrectLetter = "A";
    if (typeof q.correctAnswer === "string") currCorrectLetter = q.correctAnswer.toUpperCase();
    else if (typeof q.correctChoice === "string") currCorrectLetter = q.correctChoice.toUpperCase();
    else if (typeof q.correctAnswer === "number") currCorrectLetter = letterMap[q.correctAnswer] || "A";

    const originalChoices = {
      A: q.choiceA,
      B: q.choiceB,
      C: q.choiceC,
      D: q.choiceD,
    };

    const correctText = originalChoices[currCorrectLetter];
    const distractorLetters = letterMap.filter((l) => l !== currCorrectLetter);
    const distractorTexts = distractorLetters.map((l) => originalChoices[l]);

    const newTargetLetter = targetKeys[idx];
    const newChoices = {};
    newChoices[newTargetLetter] = correctText;

    const remainingLetters = letterMap.filter((l) => l !== newTargetLetter);
    for (let i = 0; i < remainingLetters.length; i++) {
      newChoices[remainingLetters[i]] = distractorTexts[i];
    }

    q.choiceA = newChoices.A;
    q.choiceB = newChoices.B;
    q.choiceC = newChoices.C;
    q.choiceD = newChoices.D;
    q.correctChoice = newTargetLetter;
    if ("correctAnswer" in q) {
      q.correctAnswer = newTargetLetter;
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log(`  ✅ Rebalanced ${file} (${questions.length} Qs, keys: ${targetKeys.join("")})`);
}

console.log(`\nAll ${files.length} Math Mastery Challenge files successfully rebalanced!`);
