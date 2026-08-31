import fs from "fs";
import path from "path";
import { LEGACY_TO_TOS_MAP, resolveTosId } from "./tos-mapping";

export interface VisualizerControl {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit?: string;
}

export interface DeclarativeVisualizerConfig {
  archetype:
    | "factor_tree"
    | "cartesian_line"
    | "line_explorer"
    | "polygon_shoelace"
    | "triangle_centroid"
    | "parameter_sweep"
    | "geometric"
    | "conic_explorer"
    | "rlc_resonance"
    | "circuit_phasor"
    | "wave_interference"
    | "modulation"
    | "thermo_cycle"
    | "stepper";
  title: string;
  description: string;
  config: {
    canvasWidth?: number;
    canvasHeight?: number;
    controls: VisualizerControl[];
    initialParams?: Record<string, number | string | boolean>;
    renderFunction?: string; // Optional fallback legacy string
    data?: Record<string, any>;
  };
}

export interface MasteryChallengeQuestion {
  id: string;
  promptText: string;
  choiceA: string;
  choiceB: string;
  choiceC: string;
  choiceD: string;
  correctChoice: "A" | "B" | "C" | "D";
  explanation: string;
  imageUrl?: string;
  archetype?: string;
}

export interface MasteryChallengeSet {
  moduleId: string;
  moduleCode: string;
  title: string;
  description: string;
  totalQuestions: number;
  timeLimitMinutes: number;
  questions: MasteryChallengeQuestion[];
}

export interface FormulaCard {
  id?: string;
  title: string;
  formula: string; // KaTeX format (e.g. "$$d = \\frac{|Ax_1 + By_1 + C|}{\\sqrt{A^2 + B^2}}$$")
  note?: string; // Optional very minimal context / condition / sign rule
}

export interface ComparisonTable {
  id: string;
  title: string;
  headers: string[];
  rows: string[][];
}

export interface WrittenChallenge {
  id: string;
  prompt: string;
  modelAnswer: string;
  keyCheckpoints: string[];
}

export interface LearningModule {
  id: string;
  code: string;
  domain: "MATH" | "ELECS" | "GEAS" | "EST";
  topicCode: string;
  topicTitle: string;
  subtopicTitle: string;
  order: number;
  pairedQuizSetId?: string;
  
  // Navigation & Header
  toc: Array<{ id: string; title: string; level: number }>;
  
  // Bridges
  prerequisiteBridge?: {
    priorModuleId?: string;
    text: string;
  };
  crossSubjectBridges: Array<{
    targetDomain: "MATH" | "ELECS" | "GEAS" | "EST";
    targetTopicCode: string;
    badgeText: string;
    description: string;
  }>;
  
  // Compilation of Formulas (High-Visibility Formula Cards - Optional for legal/qualitative topics)
  formulas?: FormulaCard[];

  // Comparison & Statutory Matrices (Optional / Unconstrained for concept-heavy topics)
  comparisonTables?: ComparisonTable[];

  // Terminology & Identification Signatures
  terms: Array<{
    term: string;
    symbol?: string;
    unit?: string;
    definition: string;
    keywordTrigger: string;
  }>;
  
  // Interactive Declarative Visualizer Configuration (Optional)
  visualizer?: DeclarativeVisualizerConfig;

  // Optional embedded Mastery Challenge
  masteryChallenge?: MasteryChallengeSet;
  
  // Core Theory
  theory: {
    mentalAnchor: string;
    contentMarkdown: string;
  };
  
  // Dual-Method Worked Examples or Qualitative Case Scenarios
  examples: Array<{
    problemStatement: string;
    formalSolutionMarkdown: string;
    shortcutSolutionMarkdown: string;
    shortcutTimeSeconds?: number;
    formalTimeSeconds?: number;
  }>;
  
  // Calculator Techniques (Optional for qualitative topics)
  calculatorGuides?: {
    karce?: {
      techniqueTitle?: string;
      problemType?: string;
      sampleProblem?: string;
      mode: string;
      problemContext?: string;
      keystrokes: string[];
      notes: string;
    };
    canon?: {
      techniqueTitle?: string;
      problemType?: string;
      sampleProblem?: string;
      mode: string;
      problemContext?: string;
      keystrokes: string[];
      notes: string;
    };
  };
  
  // In-Line Concept Checks
  conceptChecks: Array<{
    id: string;
    question: string;
    options: {
      A: string;
      B: string;
      C: string;
      D: string;
    };
    correctAnswer: "A" | "B" | "C" | "D";
    distractorDeconstruction: {
      A: string;
      B: string;
      C: string;
      D: string;
    };
    shortcutExplanation?: string;
  }>;

  // Active Recall Written Challenge (Optional 3–5 open-ended prompts)
  writtenChallenges?: WrittenChallenge[];
}

export interface LearningModuleSummary {
  id: string;
  code: string;
  domain: "MATH" | "ELECS" | "GEAS" | "EST";
  topicCode: string;
  topicTitle: string;
  subtopicTitle: string;
  order: number;
  pairedQuizSetId?: string;
  termsCount: number;
  examplesCount: number;
  conceptChecksCount: number;
  hasVisualizer: boolean;
  isLegacy?: boolean;
}

let _cachedModulesDir: string | null = null;
let _cachedModuleSummaries: LearningModuleSummary[] | null = null;

function getModulesDirectory(): string {
  if (_cachedModulesDir) return _cachedModulesDir;

  const directPath = path.join(process.cwd(), "test-sets", "learning-modules");
  const parentPath = path.join(process.cwd(), "..", "test-sets", "learning-modules");

  try {
    if (fs.existsSync(/* turbopackIgnore: true */ directPath)) {
      _cachedModulesDir = directPath;
      return directPath;
    }
  } catch {}

  try {
    if (fs.existsSync(/* turbopackIgnore: true */ parentPath)) {
      _cachedModulesDir = parentPath;
      return parentPath;
    }
  } catch {}

  _cachedModulesDir = parentPath;
  return parentPath;
}

function scanJsonFilesRecursively(dir: string, includeMastery: boolean = false): string[] {
  if (!fs.existsSync(/* turbopackIgnore: true */ dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files: string[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    if (!includeMastery && (entry.name === "mastery" || entry.name.endsWith("-mastery.json"))) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(scanJsonFilesRecursively(fullPath, includeMastery));
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      files.push(fullPath);
    }
  }

  return files;
}

export async function getAllLearningModules(): Promise<LearningModuleSummary[]> {
  if (_cachedModuleSummaries && _cachedModuleSummaries.length > 0) {
    return _cachedModuleSummaries;
  }

  try {
    const rootDir = getModulesDirectory();
    const jsonPaths = scanJsonFilesRecursively(rootDir, false);
    const summaries: LearningModuleSummary[] = [];

    for (const filePath of jsonPaths) {
      try {
        const raw = fs.readFileSync(filePath, "utf8");
        const data = JSON.parse(raw) as LearningModule;
        if (!data || !data.id || !data.domain || !data.topicCode || !data.code) {
          continue;
        }

        const isLegacy =
          filePath.includes(`${path.sep}legacy${path.sep}`) ||
          filePath.includes("/legacy/") ||
          filePath.includes("\\legacy\\");

        summaries.push({
          id: data.id,
          code: data.code,
          domain: data.domain,
          topicCode: data.topicCode,
          topicTitle: data.topicTitle || "",
          subtopicTitle: data.subtopicTitle || "",
          order: typeof data.order === "number" ? data.order : 1,
          pairedQuizSetId: data.pairedQuizSetId || "",
          termsCount: data.terms?.length || 0,
          examplesCount: data.examples?.length || 0,
          conceptChecksCount: data.conceptChecks?.length || 0,
          hasVisualizer: !!data.visualizer,
          isLegacy,
        });
      } catch (err) {
        console.warn(`Failed to parse module JSON file at ${filePath}:`, err);
      }
    }

    const sorted = summaries.sort((a, b) => {
      // Keep active modules first, legacy modules at the end
      if (a.isLegacy !== b.isLegacy) return a.isLegacy ? 1 : -1;
      if (a.domain !== b.domain) return (a.domain || "").localeCompare(b.domain || "");
      if (a.topicCode !== b.topicCode) return (a.topicCode || "").localeCompare(b.topicCode || "");
      return (a.order || 0) - (b.order || 0);
    });

    _cachedModuleSummaries = sorted;
    return sorted;
  } catch (err) {
    console.error("Error reading learning modules directory:", err);
    return [];
  }
}

const LEGACY_ID_ALIASES: Record<string, string> = {
  ...LEGACY_TO_TOS_MAP,
  "math-04-01": "math-02-01",
  "math-04-02": "math-02-02",
  "math-04-03": "math-02-03",
  "math-06-01": "math-03-01",
  "math-06-02": "math-03-02",
  "math-06-03": "math-03-03",
  "math-08-01": "math-04-01",
  "math-08-02": "math-04-02",
  "math-08-03": "math-04-03",
  "math-08-04": "math-04-04",
  "math-10-01": "math-05-01",
  "math-10-02": "math-05-02",
  "math-10-03": "math-05-03",
  "math-10-04": "math-05-04",
  "math-10-05": "math-05-05",
  "math-11-01": "math-06-01",
  "math-11-02": "math-06-02",
  "math-11-03": "math-06-03",
  "math-12-01": "math-07-01",
  "math-12-02": "math-07-02",
  "math-13-01": "math-07-03",
  "math-13-02": "math-07-04",
  "math-14-01": "math-08-01",
  "math-14-02": "math-08-02",
  "math-14-03": "math-08-03",
  "math-14-04": "math-08-04",
  "math-16-01": "math-09-01",
  "math-16-02": "math-09-02",
  "math-16-03": "math-09-03",
  "math-18-01": "math-10-01",
  "math-18-02": "math-10-02",
  "math-18-03": "math-10-03",
  "math-20-01": "math-11-01",
  "math-21-01": "math-12-01",
  "math-21-02": "math-12-02",
  "math-21-03": "math-12-03",
  "math-22-01": "math-13-01",
  "math-22-02": "math-13-02",
  "math-23-01": "math-13-03",
};

export async function getLearningModuleById(id: string): Promise<LearningModule | null> {
  try {
    const rootDir = getModulesDirectory();
    const jsonPaths = scanJsonFilesRecursively(rootDir);
    const normalizedInput = id.toLowerCase().replace(/[^a-z0-9_-]/g, "");
    const targetFile = LEGACY_ID_ALIASES[normalizedInput] || resolveTosId(normalizedInput) || normalizedInput;

    // 1. Direct check across scanned paths
    for (const filePath of jsonPaths) {
      const filename = path.basename(filePath, ".json");
      if (filename.toLowerCase() === targetFile || filename.toLowerCase() === normalizedInput) {
        const raw = fs.readFileSync(filePath, "utf8");
        return JSON.parse(raw) as LearningModule;
      }
    }

    // 2. Direct check inside domain and legacy folders
    const domains = ["math", "elecs", "geas", "est"];
    for (const d of domains) {
      const directPath = path.join(rootDir, d, `${targetFile}.json`);
      if (fs.existsSync(directPath)) {
        const raw = fs.readFileSync(directPath, "utf8");
        return JSON.parse(raw) as LearningModule;
      }
      const legacyPath = path.join(rootDir, "legacy", d, `${targetFile}.json`);
      if (fs.existsSync(legacyPath)) {
        const raw = fs.readFileSync(legacyPath, "utf8");
        return JSON.parse(raw) as LearningModule;
      }
    }

    return null;
  } catch (err) {
    console.error(`Error loading learning module ${id}:`, err);
    return null;
  }
}

export async function getLearningModulesByTopic(topicCode: string): Promise<LearningModuleSummary[]> {
  const all = await getAllLearningModules();
  const normalized = topicCode.toUpperCase().trim();
  return all.filter((m) => m.topicCode.toUpperCase() === normalized);
}

/**
 * Loads the decoupled companion Mastery Challenge Set for a specific learning module.
 */
export async function getMasteryChallenge(
  moduleId: string
): Promise<MasteryChallengeSet | null> {
  try {
    const mod = await getLearningModuleById(moduleId);
    if (mod?.masteryChallenge && mod.masteryChallenge.questions?.length > 0) {
      return mod.masteryChallenge;
    }

    const rootDir = getModulesDirectory();
    const normalizedInput = moduleId.toLowerCase().replace(/[^a-z0-9_-]/g, "");
    const resolvedId = LEGACY_ID_ALIASES[normalizedInput] || normalizedInput;
    const targetFile = `${resolvedId}-mastery.json`;

    // 1. Check active domain mastery folders
    const domains = ["math", "elecs", "geas", "est"];
    for (const d of domains) {
      const directPath = path.join(rootDir, d, "mastery", targetFile);
      if (fs.existsSync(directPath)) {
        const raw = fs.readFileSync(directPath, "utf8");
        return JSON.parse(raw) as MasteryChallengeSet;
      }
      const directPathAlt = path.join(rootDir, d, targetFile);
      if (fs.existsSync(directPathAlt)) {
        const raw = fs.readFileSync(directPathAlt, "utf8");
        return JSON.parse(raw) as MasteryChallengeSet;
      }
    }

    // 2. Check legacy mastery folders
    for (const d of domains) {
      const legacyMastery = path.join(rootDir, "legacy", d, "mastery", targetFile);
      if (fs.existsSync(legacyMastery)) {
        const raw = fs.readFileSync(legacyMastery, "utf8");
        return JSON.parse(raw) as MasteryChallengeSet;
      }
      const legacyMasteryAlt = path.join(rootDir, "legacy", d, targetFile);
      if (fs.existsSync(legacyMasteryAlt)) {
        const raw = fs.readFileSync(legacyMasteryAlt, "utf8");
        return JSON.parse(raw) as MasteryChallengeSet;
      }
    }

    // 3. Direct check in mastery root
    const rootMastery = path.join(rootDir, "mastery", targetFile);
    if (fs.existsSync(rootMastery)) {
      const raw = fs.readFileSync(rootMastery, "utf8");
      return JSON.parse(raw) as MasteryChallengeSet;
    }

    return null;
  } catch (err) {
    console.error(`Error loading mastery challenge for module ${moduleId}:`, err);
    return null;
  }
}


