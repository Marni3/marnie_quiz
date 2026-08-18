const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const TEST_SETS_DIR = path.join(ROOT_DIR, 'test-sets');
const STUDY_APP_DIR = path.join(ROOT_DIR, 'study-app');
const STUDY_APP_TEST_SETS = path.join(STUDY_APP_DIR, 'test-sets');
const OUTPUT_FILE = path.join(STUDY_APP_DIR, 'manifest.json');
const ALT_OUTPUT_FILE = path.join(TEST_SETS_DIR, 'manifest.json');

const IGNORED_DIRS = new Set([
  '.agents',
  'changelog',
  'scratch',
  'extracted_text',
  'Reference Documents',
  'node_modules',
  '.git'
]);

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry.name)) continue;

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.csv')) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function formatTitle(filename) {
  return filename
    .replace(/\.csv$/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/Math\s*(\d+)/i, 'Math $1 —')
    .trim();
}

function countQuestions(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    return Math.max(0, lines.length - 1); // subtract header
  } catch (err) {
    return 0;
  }
}

function buildManifest() {
  if (!fs.existsSync(TEST_SETS_DIR)) {
    console.warn(`test-sets directory not found at: ${TEST_SETS_DIR}`);
    return;
  }

  // 1. Sync test-sets into study-app/test-sets for static hosting on Vercel
  console.log('Syncing test-sets to study-app/test-sets...');
  copyDirRecursive(TEST_SETS_DIR, STUDY_APP_TEST_SETS);

  const categories = [];
  const topEntries = fs.readdirSync(TEST_SETS_DIR, { withFileTypes: true });

  for (const topEntry of topEntries) {
    if (!topEntry.isDirectory() || IGNORED_DIRS.has(topEntry.name)) {
      continue;
    }

    const categoryName = topEntry.name;
    const categoryPath = path.join(TEST_SETS_DIR, categoryName);
    const topics = [];

    const subEntries = fs.readdirSync(categoryPath, { withFileTypes: true });
    const directCsvs = [];

    for (const subEntry of subEntries) {
      if (subEntry.isDirectory() && !IGNORED_DIRS.has(subEntry.name)) {
        const topicName = subEntry.name;
        const topicPath = path.join(categoryPath, topicName);
        const files = fs.readdirSync(topicPath, { withFileTypes: true });
        const quizzes = [];

        for (const file of files) {
          if (file.isFile() && file.name.toLowerCase().endsWith('.csv')) {
            const fullFilePath = path.join(topicPath, file.name);
            const relPath = `test-sets/${categoryName}/${topicName}/${file.name}`;
            const qCount = countQuestions(fullFilePath);

            quizzes.push({
              id: file.name.replace(/\.csv$/i, ''),
              filename: file.name,
              title: formatTitle(file.name),
              path: relPath,
              questionCount: qCount,
              subjectTag: topicName
            });
          }
        }

        if (quizzes.length > 0) {
          quizzes.sort((a, b) => a.title.localeCompare(b.title));
          topics.push({
            name: topicName,
            quizzes
          });
        }
      } else if (subEntry.isFile() && subEntry.name.toLowerCase().endsWith('.csv')) {
        const fullFilePath = path.join(categoryPath, subEntry.name);
        const relPath = `test-sets/${categoryName}/${subEntry.name}`;
        const qCount = countQuestions(fullFilePath);

        directCsvs.push({
          id: subEntry.name.replace(/\.csv$/i, ''),
          filename: subEntry.name,
          title: formatTitle(subEntry.name),
          path: relPath,
          questionCount: qCount,
          subjectTag: categoryName
        });
      }
    }

    if (directCsvs.length > 0) {
      directCsvs.sort((a, b) => a.title.localeCompare(b.title));
      topics.unshift({
        name: 'General',
        quizzes: directCsvs
      });
    }

    if (topics.length > 0) {
      topics.sort((a, b) => a.name.localeCompare(b.name));
      categories.push({
        name: categoryName,
        topics
      });
    }
  }

  // Also check root test-sets/ files (e.g. sample.csv)
  const rootCsvs = [];
  for (const entry of topEntries) {
    if (entry.isFile() && entry.name.toLowerCase().endsWith('.csv')) {
      const fullFilePath = path.join(TEST_SETS_DIR, entry.name);
      const relPath = `test-sets/${entry.name}`;
      const qCount = countQuestions(fullFilePath);

      rootCsvs.push({
        id: entry.name.replace(/\.csv$/i, ''),
        filename: entry.name,
        title: formatTitle(entry.name),
        path: relPath,
        questionCount: qCount,
        subjectTag: 'Introductory'
      });
    }
  }

  if (rootCsvs.length > 0) {
    categories.unshift({
      name: 'Sample & Introductory',
      topics: [
        {
          name: 'General',
          quizzes: rootCsvs
        }
      ]
    });
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    totalQuizzes: categories.reduce((sum, c) => sum + c.topics.reduce((tSum, t) => tSum + t.quizzes.length, 0), 0),
    categories
  };

  const jsonStr = JSON.stringify(manifest, null, 2);

  const outDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  fs.writeFileSync(OUTPUT_FILE, jsonStr, 'utf8');
  fs.writeFileSync(ALT_OUTPUT_FILE, jsonStr, 'utf8');

  console.log(`Manifest generated successfully with ${manifest.totalQuizzes} quizzes across ${categories.length} categories.`);
  console.log(`Saved to: ${OUTPUT_FILE}`);
}

buildManifest();
