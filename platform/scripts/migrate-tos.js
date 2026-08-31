const fs = require("fs");
const path = require("path");

const MODULES_DIR = path.resolve(__dirname, "../../test-sets/learning-modules");

const TOS_CONFIG = {
  // MATH Foundations & Courses (PRC EE2022-10 TOS)
  "math-01": { topicCode: "MATH.0.1", topicTitle: "College Algebra, Polynomials & Progressions" },
  "math-02": { topicCode: "MATH.5.2", topicTitle: "Engineering Data Analysis & Probability Distributions" },
  "math-03": { topicCode: "MATH.5.2", topicTitle: "Engineering Data Analysis & Statistics" },
  "math-04": { topicCode: "MATH.0.1", topicTitle: "Discrete Mathematics & Logic Structures" },
  "math-05": { topicCode: "MATH.0.2", topicTitle: "Plane & Spherical Trigonometry" },
  "math-06": { topicCode: "MATH.0.2", topicTitle: "Plane & Spherical Trigonometry" },
  "math-07": { topicCode: "MATH.0.3", topicTitle: "Plane & Solid Geometry" },
  "math-08": { topicCode: "MATH.0.3", topicTitle: "Plane & Solid Geometry" },
  "math-09": { topicCode: "MATH.0.4", topicTitle: "Analytic Geometry & Conic Sections" },
  "math-10": { topicCode: "MATH.1.1", topicTitle: "Differential Calculus" },
  "math-11": { topicCode: "MATH.2.1", topicTitle: "Integral Calculus" },
  "math-12": { topicCode: "MATH.3.1", topicTitle: "Differential Equations" },
  "math-13": { topicCode: "MATH.4.1", topicTitle: "Advanced Engineering Mathematics for ECE" },
  "math-14": { topicCode: "MATH.4.4", topicTitle: "Advanced Engineering Mathematics - Simultaneous Equations & Matrices" },
  "math-15": { topicCode: "MATH.4.4", topicTitle: "Advanced Engineering Mathematics - Determinants & Systems" },
  "math-16": { topicCode: "MATH.5.2", topicTitle: "Engineering Data Analysis - Probability Distributions" },
  "math-17": { topicCode: "MATH.5.2", topicTitle: "Engineering Data Analysis - Statistical Sampling" },
  "math-18": { topicCode: "MATH.1.2", topicTitle: "Differential Calculus - Maxima & Minima Optimization" },
  "math-19": { topicCode: "MATH.1.2", topicTitle: "Differential Calculus - Curve Tracing & Applications" },
  "math-20": { topicCode: "MATH.2.4", topicTitle: "Integral Calculus - Plane Areas" },
  "math-21": { topicCode: "MATH.2.4", topicTitle: "Integral Calculus - Volumes of Revolution" },
  "math-22": { topicCode: "MATH.3.1", topicTitle: "Differential Equations - First-Order ODE" },
  "math-23": { topicCode: "MATH.3.3", topicTitle: "Differential Equations - Laplace Transforms & Inverses" },

  // Match previously migrated dash codes to new dot notation
  "math-01": { topicCode: "MATH.0.1", topicTitle: "College Algebra, Polynomials & Progressions" },
  "math-02": { topicCode: "MATH.0.2", topicTitle: "Plane & Spherical Trigonometry" },
  "math-03": { topicCode: "MATH.0.3", topicTitle: "Plane & Solid Geometry" },
  "math-04": { topicCode: "MATH.0.4", topicTitle: "Analytic Geometry & Conic Sections" },
  "math-05": { topicCode: "MATH.1.1", topicTitle: "Differential Calculus" },
  "math-06": { topicCode: "MATH.2.1", topicTitle: "Integral Calculus" },
  "math-07": { topicCode: "MATH.3.1", topicTitle: "Differential Equations" },
  "math-08": { topicCode: "MATH.4.1", topicTitle: "Advanced Engineering Mathematics for ECE" },
  "math-09": { topicCode: "MATH.5.2", topicTitle: "Engineering Data Analysis" },

  // GEAS Mapping
  "geas-08": { topicCode: "GEAS.10.3", topicTitle: "ECE Laws, Contracts, Ethics, Standards & Safety (RA 9292)" },
  "geas-10": { topicCode: "GEAS.10.3", topicTitle: "ECE Laws, Contracts, Ethics, Standards & Safety (RA 9292)" },

  // EST Mapping
  "est-01": { topicCode: "EST.4.1", topicTitle: "Transmission and Antenna Systems - Transmission Lines" },
};

function scanJsonFiles(dir, includeMastery = false) {
  if (!fs.existsSync(dir)) return [];
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of list) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      results = results.concat(scanJsonFiles(fullPath, includeMastery));
    } else if (item.isFile() && item.name.endsWith(".json")) {
      if (!includeMastery && (item.name.endsWith("-mastery.json") || fullPath.includes("mastery"))) {
        continue;
      }
      results.push(fullPath);
    }
  }
  return results;
}

function migrateLearningModules() {
  console.log("Scanning modules in:", MODULES_DIR);
  const files = scanJsonFiles(MODULES_DIR, false);
  console.log(`Found ${files.length} learning modules.`);

  let updatedCount = 0;

  for (const filePath of files) {
    const rawText = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(rawText);

    // Derive lookup from filename, id, or existing topicCode
    const baseName = path.basename(filePath, ".json").toLowerCase();
    const prefixMatch = baseName.match(/^([a-z]+-\d+)/);
    const key = prefixMatch ? prefixMatch[1] : (data.topicCode || "").toLowerCase().replace(".", "-");

    const tosMatch = TOS_CONFIG[key] || TOS_CONFIG[(data.topicCode || "").toLowerCase()];

    if (tosMatch) {
      // Keep ALL pedagogical content identical, update only metadata
      data.topicCode = tosMatch.topicCode;
      data.topicTitle = tosMatch.topicTitle;

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
      updatedCount++;
    }
  }

  console.log(`Successfully migrated metadata to DOT NOTATION for ${updatedCount} learning modules.`);
}

migrateLearningModules();
