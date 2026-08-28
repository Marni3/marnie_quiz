const fs = require('fs');
const path = require('path');

const modulesDir = path.join(__dirname, '..', 'test-sets', 'learning-modules', 'math');
const masteryDir = path.join(__dirname, '..', 'test-sets', 'learning-modules', 'math', 'mastery');

const mapping = [
  // MATH 01: College Algebra
  { oldId: 'math-01-01', newId: 'math-01-01', topicCode: 'MATH-01', topicTitle: 'College Algebra', code: 'MATH 01-01', order: 1 },
  { oldId: 'math-01-02', newId: 'math-01-02', topicCode: 'MATH-01', topicTitle: 'College Algebra', code: 'MATH 01-02', order: 2 },
  { oldId: 'math-01-03', newId: 'math-01-03', topicCode: 'MATH-01', topicTitle: 'College Algebra', code: 'MATH 01-03', order: 3 },
  { oldId: 'math-01-04', newId: 'math-01-04', topicCode: 'MATH-01', topicTitle: 'College Algebra', code: 'MATH 01-04', order: 4 },

  // MATH 02: Progressions & Discrete Mathematics
  { oldId: 'math-04-01', newId: 'math-02-01', topicCode: 'MATH-02', topicTitle: 'Progressions & Discrete Mathematics', code: 'MATH 02-01', order: 1 },
  { oldId: 'math-04-02', newId: 'math-02-02', topicCode: 'MATH-02', topicTitle: 'Progressions & Discrete Mathematics', code: 'MATH 02-02', order: 2 },
  { oldId: 'math-04-03', newId: 'math-02-03', topicCode: 'MATH-02', topicTitle: 'Progressions & Discrete Mathematics', code: 'MATH 02-03', order: 3 },

  // MATH 03: Probability & Statistics
  { oldId: 'math-06-01', newId: 'math-03-01', topicCode: 'MATH-03', topicTitle: 'Probability & Statistics', code: 'MATH 03-01', order: 1 },
  { oldId: 'math-06-02', newId: 'math-03-02', topicCode: 'MATH-03', topicTitle: 'Probability & Statistics', code: 'MATH 03-02', order: 2 },
  { oldId: 'math-06-03', newId: 'math-03-03', topicCode: 'MATH-03', topicTitle: 'Probability & Statistics', code: 'MATH 03-03', order: 3 },

  // MATH 04: Plane & Spherical Trigonometry
  { oldId: 'math-08-01', newId: 'math-04-01', topicCode: 'MATH-04', topicTitle: 'Plane & Spherical Trigonometry', code: 'MATH 04-01', order: 1 },
  { oldId: 'math-08-02', newId: 'math-04-02', topicCode: 'MATH-04', topicTitle: 'Plane & Spherical Trigonometry', code: 'MATH 04-02', order: 2 },
  { oldId: 'math-08-03', newId: 'math-04-03', topicCode: 'MATH-04', topicTitle: 'Plane & Spherical Trigonometry', code: 'MATH 04-03', order: 3 },
  { oldId: 'math-08-04', newId: 'math-04-04', topicCode: 'MATH-04', topicTitle: 'Plane & Spherical Trigonometry', code: 'MATH 04-04', order: 4 },

  // MATH 05: Plane Geometry
  { oldId: 'math-10-01', newId: 'math-05-01', topicCode: 'MATH-05', topicTitle: 'Plane Geometry', code: 'MATH 05-01', order: 1 },
  { oldId: 'math-10-02', newId: 'math-05-02', topicCode: 'MATH-05', topicTitle: 'Plane Geometry', code: 'MATH 05-02', order: 2 },
  { oldId: 'math-10-03', newId: 'math-05-03', topicCode: 'MATH-05', topicTitle: 'Plane Geometry', code: 'MATH 05-03', order: 3 },
  { oldId: 'math-10-04', newId: 'math-05-04', topicCode: 'MATH-05', topicTitle: 'Plane Geometry', code: 'MATH 05-04', order: 4 },
  { oldId: 'math-10-05', newId: 'math-05-05', topicCode: 'MATH-05', topicTitle: 'Plane Geometry', code: 'MATH 05-05', order: 5 },

  // MATH 06: Solid Geometry & Mensuration
  { oldId: 'math-11-01', newId: 'math-06-01', topicCode: 'MATH-06', topicTitle: 'Solid Geometry & Mensuration', code: 'MATH 06-01', order: 1 },
  { oldId: 'math-11-02', newId: 'math-06-02', topicCode: 'MATH-06', topicTitle: 'Solid Geometry & Mensuration', code: 'MATH 06-02', order: 2 },
  { oldId: 'math-11-03', newId: 'math-06-03', topicCode: 'MATH-06', topicTitle: 'Solid Geometry & Mensuration', code: 'MATH 06-03', order: 3 },

  // MATH 07: Analytic Geometry
  { oldId: 'math-12-01', newId: 'math-07-01', topicCode: 'MATH-07', topicTitle: 'Analytic Geometry', code: 'MATH 07-01', order: 1 },
  { oldId: 'math-12-02', newId: 'math-07-02', topicCode: 'MATH-07', topicTitle: 'Analytic Geometry', code: 'MATH 07-02', order: 2 },
  { oldId: 'math-13-01', newId: 'math-07-03', topicCode: 'MATH-07', topicTitle: 'Analytic Geometry', code: 'MATH 07-03', order: 3 },
  { oldId: 'math-13-02', newId: 'math-07-04', topicCode: 'MATH-07', topicTitle: 'Analytic Geometry', code: 'MATH 07-04', order: 4 },

  // MATH 08: Differential Calculus
  { oldId: 'math-14-01', newId: 'math-08-01', topicCode: 'MATH-08', topicTitle: 'Differential Calculus', code: 'MATH 08-01', order: 1 },
  { oldId: 'math-14-02', newId: 'math-08-02', topicCode: 'MATH-08', topicTitle: 'Differential Calculus', code: 'MATH 08-02', order: 2 },
  { oldId: 'math-14-03', newId: 'math-08-03', topicCode: 'MATH-08', topicTitle: 'Differential Calculus', code: 'MATH 08-03', order: 3 },
  { oldId: 'math-14-04', newId: 'math-08-04', topicCode: 'MATH-08', topicTitle: 'Differential Calculus', code: 'MATH 08-04', order: 4 },

  // MATH 09: Integral Calculus
  { oldId: 'math-16-01', newId: 'math-09-01', topicCode: 'MATH-09', topicTitle: 'Integral Calculus', code: 'MATH 09-01', order: 1 },
  { oldId: 'math-16-02', newId: 'math-09-02', topicCode: 'MATH-09', topicTitle: 'Integral Calculus', code: 'MATH 09-02', order: 2 },
  { oldId: 'math-16-03', newId: 'math-09-03', topicCode: 'MATH-09', topicTitle: 'Integral Calculus', code: 'MATH 09-03', order: 3 },

  // MATH 10: Differential Equations
  { oldId: 'math-18-01', newId: 'math-10-01', topicCode: 'MATH-10', topicTitle: 'Differential Equations', code: 'MATH 10-01', order: 1 },
  { oldId: 'math-18-02', newId: 'math-10-02', topicCode: 'MATH-10', topicTitle: 'Differential Equations', code: 'MATH 10-02', order: 2 },
  { oldId: 'math-18-03', newId: 'math-10-03', topicCode: 'MATH-10', topicTitle: 'Differential Equations', code: 'MATH 10-03', order: 3 },

  // MATH 11: Complex Numbers
  { oldId: 'math-20-01', newId: 'math-11-01', topicCode: 'MATH-11', topicTitle: 'Complex Numbers', code: 'MATH 11-01', order: 1 },

  // MATH 12: Linear Algebra & Matrices
  { oldId: 'math-21-01', newId: 'math-12-01', topicCode: 'MATH-12', topicTitle: 'Linear Algebra & Matrices', code: 'MATH 12-01', order: 1 },
  { oldId: 'math-21-02', newId: 'math-12-02', topicCode: 'MATH-12', topicTitle: 'Linear Algebra & Matrices', code: 'MATH 12-02', order: 2 },
  { oldId: 'math-21-03', newId: 'math-12-03', topicCode: 'MATH-12', topicTitle: 'Linear Algebra & Matrices', code: 'MATH 12-03', order: 3 },

  // MATH 13: Advanced Transforms (Laplace, Fourier & Z)
  { oldId: 'math-22-01', newId: 'math-13-01', topicCode: 'MATH-13', topicTitle: 'Advanced Transforms (Laplace, Fourier & Z)', code: 'MATH 13-01', order: 1 },
  { oldId: 'math-22-02', newId: 'math-13-02', topicCode: 'MATH-13', topicTitle: 'Advanced Transforms (Laplace, Fourier & Z)', code: 'MATH 13-02', order: 2 },
  { oldId: 'math-23-01', newId: 'math-13-03', topicCode: 'MATH-13', topicTitle: 'Advanced Transforms (Laplace, Fourier & Z)', code: 'MATH 13-03', order: 3 },
];

console.log(`Starting consolidation for ${mapping.length} modules...`);

// Step 1: Read all module and mastery contents into memory
const loadedModules = [];
const loadedMastery = [];

for (const m of mapping) {
  const modPath = path.join(modulesDir, `${m.oldId}.json`);
  const mastPath = path.join(masteryDir, `${m.oldId}-mastery.json`);

  if (!fs.existsSync(modPath)) {
    console.error(`Missing module file: ${modPath}`);
    process.exit(1);
  }
  if (!fs.existsSync(mastPath)) {
    console.error(`Missing mastery file: ${mastPath}`);
    process.exit(1);
  }

  const modData = JSON.parse(fs.readFileSync(modPath, 'utf8'));
  const mastData = JSON.parse(fs.readFileSync(mastPath, 'utf8'));

  // Update module data
  modData.id = m.newId;
  modData.code = m.code;
  modData.topicCode = m.topicCode;
  modData.topicTitle = m.topicTitle;
  modData.order = m.order;
  modData.pairedQuizSetId = `${m.newId}-mastery`;

  // Update mastery data
  mastData.id = `${m.newId}-mastery`;
  mastData.moduleId = m.newId;
  mastData.topicCode = m.topicCode;
  mastData.title = `${m.code} Mastery Challenge: ${modData.subtopicTitle}`;

  loadedModules.push({ oldPath: modPath, newPath: path.join(modulesDir, `${m.newId}.json`), data: modData });
  loadedMastery.push({ oldPath: mastPath, newPath: path.join(masteryDir, `${m.newId}-mastery.json`), data: mastData });
}

// Step 2: Delete old files that will be renamed
for (const item of loadedModules) {
  if (fs.existsSync(item.oldPath)) {
    fs.unlinkSync(item.oldPath);
  }
}
for (const item of loadedMastery) {
  if (fs.existsSync(item.oldPath)) {
    fs.unlinkSync(item.oldPath);
  }
}

// Step 3: Write out updated files
for (const item of loadedModules) {
  fs.writeFileSync(item.newPath, JSON.stringify(item.data, null, 2), 'utf8');
}
for (const item of loadedMastery) {
  fs.writeFileSync(item.newPath, JSON.stringify(item.data, null, 2), 'utf8');
}

console.log(`Successfully migrated and written all 43 modules and 43 mastery files!`);
