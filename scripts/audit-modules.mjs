import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const MODULES_DIR = path.join(ROOT_DIR, "test-sets", "learning-modules");

// ANSI color codes
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const GREEN = "\x1b[32m";
const CYAN = "\x1b[36m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

let totalErrors = 0;
let totalWarnings = 0;
let modulesAudited = 0;
let masteryAudited = 0;

const results = [];

function walkDir(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === "legacy" || file === "node_modules" || file === ".git") continue;
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, fileList);
    } else if (file.endsWith(".json")) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function auditModule(filePath, data) {
  const relPath = path.relative(ROOT_DIR, filePath);
  const issues = [];

  // 1. Concept Checks Audit
  if (data.conceptChecks && Array.isArray(data.conceptChecks)) {
    if (data.conceptChecks.length === 0) {
      issues.push({ type: "WARN", code: "NO_CONCEPT_CHECKS", msg: "Module has 0 concept checks." });
    } else {
      const answerKeys = [];
      data.conceptChecks.forEach((chk, idx) => {
        let correctChoice = chk.correctAnswer;
        const options = chk.options;
        const explanation = chk.explanation || "";

        // Determine correct choice index/letter
        let correctLetter = "A";
        if (typeof correctChoice === "number") {
          correctLetter = ["A", "B", "C", "D"][correctChoice] || "A";
        } else if (typeof correctChoice === "string") {
          correctLetter = correctChoice.toUpperCase();
        }
        answerKeys.push(correctLetter);

        // Check for duplicate distractor explanations
        if (Array.isArray(options)) {
          const reasons = options.map((opt) => (typeof opt === "string" ? explanation : opt.distractorReason || explanation));
          const uniqueReasons = new Set(reasons.filter(Boolean));
          if (options.length > 1 && uniqueReasons.size === 1) {
            issues.push({
              type: "FAIL",
              code: "DUPLICATE_DISTRACTORS",
              msg: `Concept Check #${idx + 1} (${chk.id || idx}) has identical explanation for all options.`,
            });
          }
        } else if (options && typeof options === "object") {
          const decons = chk.distractorDeconstruction || {};
          const deconValues = Object.values(decons);
          if (deconValues.length > 1 && new Set(deconValues).size === 1) {
            issues.push({
              type: "FAIL",
              code: "DUPLICATE_DISTRACTORS",
              msg: `Concept Check #${idx + 1} (${chk.id || idx}) has identical distractorDeconstruction for all options.`,
            });
          }
        }
      });

      // Check for uniform answer key bias (e.g. all A's)
      if (data.conceptChecks.length >= 3) {
        const uniqueKeys = new Set(answerKeys);
        if (uniqueKeys.size === 1) {
          issues.push({
            type: "FAIL",
            code: "UNIFORM_KEY_BIAS",
            msg: `All ${data.conceptChecks.length} concept checks share the same correct answer key (${answerKeys[0]}).`,
          });
        }
      }
    }
  }

  // 2. Calculator Guides Audit (for non-qualitative modules)
  const isQualitative = data.domain === "GEAS" && data.topicCode?.startsWith("GEAS-10");
  if (!isQualitative) {
    if (!data.calculatorGuides) {
      issues.push({ type: "WARN", code: "MISSING_CALCULATOR_GUIDES", msg: "Module lacks calculatorGuides section." });
    } else {
      const karce = data.calculatorGuides.karce;
      const canon = data.calculatorGuides.canon;

      if (!karce || !canon) {
        issues.push({
          type: "FAIL",
          code: "INCOMPLETE_CALCULATOR_TABS",
          msg: `Missing ${!karce ? "Karce" : "Canon"} calculator guide tab.`,
        });
      } else {
        // Check 1-to-1 Problem Parity
        const karceProb = (karce.sampleProblem || "").trim();
        const canonProb = (canon.sampleProblem || "").trim();
        if (karceProb && canonProb && karceProb !== canonProb) {
          issues.push({
            type: "FAIL",
            code: "CALCULATOR_PROBLEM_MISMATCH",
            msg: `Karce and Canon tabs demonstrate different problems: "${karceProb.slice(0, 30)}..." vs "${canonProb.slice(0, 30)}..."`,
          });
        }

        // Check whyItWorks presence (light explanation standard)
        if (!karce.whyItWorks) {
          issues.push({
            type: "WARN",
            code: "MISSING_WHY_IT_WORKS",
            msg: "Karce guide is missing 'whyItWorks' light explanation rationale.",
          });
        }
        if (!canon.whyItWorks) {
          issues.push({
            type: "WARN",
            code: "MISSING_WHY_IT_WORKS",
            msg: "Canon guide is missing 'whyItWorks' light explanation rationale.",
          });
        }

        // Check keystrokes array
        if (!Array.isArray(karce.keystrokes) || karce.keystrokes.length === 0) {
          issues.push({ type: "FAIL", code: "EMPTY_KEYSTROKES", msg: "Karce keystrokes array is empty." });
        }
        if (!Array.isArray(canon.keystrokes) || canon.keystrokes.length === 0) {
          issues.push({ type: "FAIL", code: "EMPTY_KEYSTROKES", msg: "Canon keystrokes array is empty." });
        }
      }
    }
  }

  // 3. TOC Cleanliness (No hardcoded section numbers)
  if (data.toc && Array.isArray(data.toc)) {
    data.toc.forEach((item) => {
      if (/^\d+\.\s+/.test(item.title || "")) {
        issues.push({
          type: "WARN",
          code: "TOC_HARDCODED_NUMBER",
          msg: `TOC item "${item.title}" contains hardcoded section number.`,
        });
      }
    });
  }

  return { relPath, type: "MODULE", issues };
}

function auditMastery(filePath, data) {
  const relPath = path.relative(ROOT_DIR, filePath);
  const issues = [];

  const questions = data.questions || [];
  if (questions.length < 20) {
    issues.push({
      type: "WARN",
      code: "MASTERY_SHORT_COUNT",
      msg: `Mastery set has only ${questions.length} questions (expected 20–25).`,
    });
  }

  const keyCounts = { A: 0, B: 0, C: 0, D: 0 };
  let maxConsecutive = 1;
  let currentConsecutive = 1;
  let lastKey = "";

  questions.forEach((q, idx) => {
    let key = "A";
    if (typeof q.correctAnswer === "number") {
      key = ["A", "B", "C", "D"][q.correctAnswer] || "A";
    } else if (typeof q.correctAnswer === "string") {
      key = q.correctAnswer.toUpperCase();
    } else if (typeof q.correctChoice === "string") {
      key = q.correctChoice.toUpperCase();
    }

    keyCounts[key] = (keyCounts[key] || 0) + 1;

    if (key === lastKey) {
      currentConsecutive++;
      if (currentConsecutive > maxConsecutive) {
        maxConsecutive = currentConsecutive;
      }
    } else {
      currentConsecutive = 1;
    }
    lastKey = key;

    if (!q.explanation && !q.shortcutSolutionMarkdown && !q.formalSolutionMarkdown) {
      issues.push({
        type: "WARN",
        code: "MISSING_EXPLANATION",
        msg: `Question #${idx + 1} (${q.id || idx}) lacks an explanation.`,
      });
    }
  });

  // Check key distribution balance
  if (questions.length >= 20) {
    for (const [k, count] of Object.entries(keyCounts)) {
      const percent = (count / questions.length) * 100;
      if (percent > 45) {
        issues.push({
          type: "FAIL",
          code: "KEY_OVERREPRESENTED",
          msg: `Answer key '${k}' comprises ${percent.toFixed(1)}% (${count}/${questions.length}) of total items.`,
        });
      } else if (percent < 10) {
        issues.push({
          type: "FAIL",
          code: "KEY_UNDERREPRESENTED",
          msg: `Answer key '${k}' comprises only ${percent.toFixed(1)}% (${count}/${questions.length}) of total items.`,
        });
      }
    }
  }

  // Check consecutive identical streak
  if (maxConsecutive >= 4) {
    issues.push({
      type: "WARN",
      code: "CONSECUTIVE_KEY_STREAK",
      msg: `Contains a streak of ${maxConsecutive} consecutive identical answer keys.`,
    });
  }

  return { relPath, type: "MASTERY", issues, keyCounts, totalQs: questions.length };
}

function runAudit() {
  console.log(`\n${BOLD}${CYAN}=== MARNIE QUIZ: MODULE & TEST-SET CI QUALITY LINTER ===${RESET}\n`);

  const allJsonFiles = walkDir(MODULES_DIR);
  // Separate active modules vs legacy vs mastery
  const activeModules = [];
  const masteryFiles = [];

  allJsonFiles.forEach((file) => {
    if (file.includes("legacy")) return; // Skip legacy archive
    if (file.includes("mastery")) {
      masteryFiles.push(file);
    } else {
      activeModules.push(file);
    }
  });

  console.log(`Found ${BOLD}${activeModules.length}${RESET} active modules and ${BOLD}${masteryFiles.length}${RESET} mastery test sets.\n`);

  // 1. Audit Active Modules
  console.log(`${BOLD}--- 1. LEARNING MODULES AUDIT ---${RESET}`);
  activeModules.forEach((file) => {
    modulesAudited++;
    try {
      const content = fs.readFileSync(file, "utf8");
      const data = JSON.parse(content);
      const res = auditModule(file, data);
      results.push(res);

      const fails = res.issues.filter((i) => i.type === "FAIL");
      const warns = res.issues.filter((i) => i.type === "WARN");
      totalErrors += fails.length;
      totalWarnings += warns.length;

      if (fails.length > 0) {
        console.log(`  ${RED}❌ [FAIL]${RESET} ${res.relPath} (${fails.length} errors, ${warns.length} warnings)`);
        fails.forEach((f) => console.log(`      ${RED}• [${f.code}]${RESET} ${f.msg}`));
        warns.forEach((w) => console.log(`      ${YELLOW}• [${w.code}]${RESET} ${w.msg}`));
      } else if (warns.length > 0) {
        console.log(`  ${YELLOW}⚠️  [WARN]${RESET} ${res.relPath} (${warns.length} warnings)`);
        warns.forEach((w) => console.log(`      ${YELLOW}• [${w.code}]${RESET} ${w.msg}`));
      } else {
        console.log(`  ${GREEN}✅ [PASS]${RESET} ${res.relPath}`);
      }
    } catch (err) {
      totalErrors++;
      console.log(`  ${RED}❌ [SYNTAX_ERROR]${RESET} ${file}: ${err.message}`);
    }
  });

  // 2. Audit Mastery Sets
  console.log(`\n${BOLD}--- 2. MASTERY CHALLENGE TEST SETS AUDIT ---${RESET}`);
  masteryFiles.forEach((file) => {
    masteryAudited++;
    try {
      const content = fs.readFileSync(file, "utf8");
      const data = JSON.parse(content);
      const res = auditMastery(file, data);
      results.push(res);

      const fails = res.issues.filter((i) => i.type === "FAIL");
      const warns = res.issues.filter((i) => i.type === "WARN");
      totalErrors += fails.length;
      totalWarnings += warns.length;

      const keyDist = res.keyCounts
        ? `[A:${res.keyCounts.A} B:${res.keyCounts.B} C:${res.keyCounts.C} D:${res.keyCounts.D}]`
        : "";

      if (fails.length > 0) {
        console.log(`  ${RED}❌ [FAIL]${RESET} ${res.relPath} ${keyDist}`);
        fails.forEach((f) => console.log(`      ${RED}• [${f.code}]${RESET} ${f.msg}`));
        warns.forEach((w) => console.log(`      ${YELLOW}• [${w.code}]${RESET} ${w.msg}`));
      } else if (warns.length > 0) {
        console.log(`  ${YELLOW}⚠️  [WARN]${RESET} ${res.relPath} ${keyDist}`);
        warns.forEach((w) => console.log(`      ${YELLOW}• [${w.code}]${RESET} ${w.msg}`));
      } else {
        console.log(`  ${GREEN}✅ [PASS]${RESET} ${res.relPath} ${keyDist}`);
      }
    } catch (err) {
      totalErrors++;
      console.log(`  ${RED}❌ [SYNTAX_ERROR]${RESET} ${file}: ${err.message}`);
    }
  });

  // Summary Banner
  console.log(`\n${BOLD}====================================================${RESET}`);
  console.log(`${BOLD}AUDIT SUMMARY:${RESET}`);
  console.log(`  • Learning Modules Audited:  ${modulesAudited}`);
  console.log(`  • Mastery Sets Audited:      ${masteryAudited}`);
  console.log(`  • Total Errors:              ${totalErrors > 0 ? RED + totalErrors + RESET : GREEN + "0" + RESET}`);
  console.log(`  • Total Warnings:            ${totalWarnings > 0 ? YELLOW + totalWarnings + RESET : GREEN + "0" + RESET}`);
  console.log(`${BOLD}====================================================${RESET}\n`);

  if (totalErrors > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAudit();
