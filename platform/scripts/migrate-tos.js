const fs = require("fs");
const path = require("path");

const MODULES_DIR = path.resolve(__dirname, "../../test-sets/learning-modules");

const TOS_CONFIG = {
  // MATH Mapping
  "math-01": { topicCode: "MATH-01", topicTitle: "College Algebra, Polynomials & Progressions" },
  "math-02": { topicCode: "MATH-09", topicTitle: "Probability, Statistics & Discrete Mathematics" },
  "math-03": { topicCode: "MATH-09", topicTitle: "Probability, Statistics & Discrete Mathematics" },
  "math-04": { topicCode: "MATH-09", topicTitle: "Probability, Statistics & Discrete Mathematics" },
  "math-05": { topicCode: "MATH-02", topicTitle: "Plane & Spherical Trigonometry" },
  "math-06": { topicCode: "MATH-02", topicTitle: "Plane & Spherical Trigonometry" },
  "math-07": { topicCode: "MATH-03", topicTitle: "Plane & Solid Geometry" },
  "math-08": { topicCode: "MATH-03", topicTitle: "Plane & Solid Geometry" },
  "math-09": { topicCode: "MATH-04", topicTitle: "Analytic Geometry & Conic Sections" },
  "math-10": { topicCode: "MATH-05", topicTitle: "Differential Calculus" },
  "math-11": { topicCode: "MATH-06", topicTitle: "Integral Calculus" },
  "math-12": { topicCode: "MATH-07", topicTitle: "Differential Equations" },
  "math-13": { topicCode: "MATH-08", topicTitle: "Advanced Engineering Mathematics" },
  "math-14": { topicCode: "MATH-08", topicTitle: "Advanced Engineering Mathematics" },
  "math-15": { topicCode: "MATH-08", topicTitle: "Advanced Engineering Mathematics" },
  "math-16": { topicCode: "MATH-09", topicTitle: "Probability, Statistics & Discrete Mathematics" },
  "math-17": { topicCode: "MATH-09", topicTitle: "Probability, Statistics & Discrete Mathematics" },
  "math-18": { topicCode: "MATH-05", topicTitle: "Differential Calculus" },
  "math-19": { topicCode: "MATH-05", topicTitle: "Differential Calculus" },
  "math-20": { topicCode: "MATH-06", topicTitle: "Integral Calculus" },
  "math-21": { topicCode: "MATH-06", topicTitle: "Integral Calculus" },
  "math-22": { topicCode: "MATH-07", topicTitle: "Differential Equations" },
  "math-23": { topicCode: "MATH-08", topicTitle: "Advanced Engineering Mathematics" },

  // GEAS Mapping
  "geas-10": { topicCode: "GEAS-08", topicTitle: "R.A. 9292 (ECE Law), Code of Ethics & Telecommunications Laws" },

  // EST Mapping
  "est-01": { topicCode: "EST-01", topicTitle: "Transmission Lines & Waveguides" },
  "est-02": { topicCode: "EST-02", topicTitle: "Antennas & Radiation Mechanisms" },
  "est-03": { topicCode: "EST-03", topicTitle: "Radio Wave Propagation" },
  "est-04": { topicCode: "EST-04", topicTitle: "Analog Modulation & Radio Systems" },
  "est-05": { topicCode: "EST-05", topicTitle: "Digital Modulation & Baseband Communications" },
  "est-06": { topicCode: "EST-06", topicTitle: "Fiber Optic Communications" },
  "est-07": { topicCode: "EST-07", topicTitle: "Satellite Communications" },
  "est-08": { topicCode: "EST-08", topicTitle: "Microwave Systems & Radar" },
  "est-09": { topicCode: "EST-09", topicTitle: "Acoustics & Audio/Broadcast Engineering" },
  "est-10": { topicCode: "EST-10", topicTitle: "Data Communications & Computer Networks" },
};

function scanJsonFiles(dir, includeMastery = true) {
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

    const oldTopicCode = (data.topicCode || "").toLowerCase();
    const tosMatch = TOS_CONFIG[oldTopicCode];

    if (tosMatch) {
      // Keep ALL contents identical, update only metadata
      data.topicCode = tosMatch.topicCode;
      data.topicTitle = tosMatch.topicTitle;

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
      updatedCount++;
    }
  }

  console.log(`Successfully migrated metadata for ${updatedCount} learning modules.`);
}

migrateLearningModules();
