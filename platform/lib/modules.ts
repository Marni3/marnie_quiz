import fs from "fs";
import path from "path";

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

export interface LearningModule {
  id: string; // e.g. "math-01-01"
  code: string; // e.g. "MATH 01-01"
  domain: "MATH" | "ELECS" | "GEAS" | "EST";
  topicCode: string; // e.g. "MATH-01"
  topicTitle: string; // e.g. "College Algebra"
  subtopicTitle: string; // e.g. "Real Numbers, Operations & Factoring"
  order: number;
  pairedQuizSetId?: string;
  
  // Navigation & Header
  toc: Array<{ id: string; title: string; level: number }>;
  
  // Bridges
  prerequisiteBridge?: {
    priorModuleId: string;
    text: string;
  };
  crossSubjectBridges: Array<{
    targetDomain: "MATH" | "ELECS" | "GEAS" | "EST";
    targetTopicCode: string;
    badgeText: string;
    description: string;
  }>;
  
  // Terminology & Identification Signatures
  terms: Array<{
    term: string;
    symbol?: string;
    unit?: string;
    definition: string;
    keywordTrigger: string;
  }>;
  
  // Interactive Declarative Visualizer Configuration
  visualizer?: DeclarativeVisualizerConfig;

  // Optional embedded Mastery Challenge
  masteryChallenge?: MasteryChallengeSet;

  
  // Core Theory
  theory: {
    mentalAnchor: string;
    contentMarkdown: string;
  };
  
  // Dual-Method Worked Examples
  examples: Array<{
    problemStatement: string;
    formalSolutionMarkdown: string;
    shortcutSolutionMarkdown: string;
    shortcutTimeSeconds: number;
    formalTimeSeconds: number;
  }>;
  
  // Calculator Techniques
  calculatorGuides: {
    karce: {
      techniqueTitle?: string;
      problemType?: string;
      sampleProblem?: string;
      mode: string;
      problemContext?: string;
      keystrokes: string[];
      notes: string;
    };
    canon: {
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
    shortcutExplanation: string;
  }>;
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
}

function getModulesDirectory(): string {
  // Check possible relative and workspace paths
  const candidatePaths = [
    path.join(process.cwd(), "test-sets", "learning-modules"),
    path.join(process.cwd(), "..", "test-sets", "learning-modules"),
    path.resolve(process.cwd(), "test-sets", "learning-modules"),
  ];

  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  // Fallback
  return path.join(process.cwd(), "..", "test-sets", "learning-modules");
}

function scanJsonFilesRecursively(dir: string, includeMastery: boolean = false): string[] {
  if (!fs.existsSync(dir)) return [];
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
        });
      } catch (err) {
        console.warn(`Failed to parse module JSON file at ${filePath}:`, err);
      }
    }

    return summaries.sort((a, b) => {
      if (a.domain !== b.domain) return (a.domain || "").localeCompare(b.domain || "");
      if (a.topicCode !== b.topicCode) return (a.topicCode || "").localeCompare(b.topicCode || "");
      return (a.order || 0) - (b.order || 0);
    });
  } catch (err) {
    console.error("Error reading learning modules directory:", err);
    return [];
  }
}

export async function getLearningModuleById(id: string): Promise<LearningModule | null> {
  try {
    const rootDir = getModulesDirectory();
    const jsonPaths = scanJsonFilesRecursively(rootDir);
    const targetFile = id.toLowerCase().replace(/[^a-z0-9_-]/g, "");

    for (const filePath of jsonPaths) {
      const filename = path.basename(filePath, ".json");
      if (filename.toLowerCase() === targetFile) {
        const raw = fs.readFileSync(filePath, "utf8");
        return JSON.parse(raw) as LearningModule;
      }
    }

    // Direct check inside domain folders
    const domains = ["math", "elecs", "geas", "est"];
    for (const d of domains) {
      const directPath = path.join(rootDir, d, `${targetFile}.json`);
      if (fs.existsSync(directPath)) {
        const raw = fs.readFileSync(directPath, "utf8");
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
    const targetFile = `${moduleId.toLowerCase().replace(/[^a-z0-9_-]/g, "")}-mastery.json`;

    // Check domain mastery folders
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

    // Direct check in mastery root
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

