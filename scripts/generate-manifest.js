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
  'pdf_pages',
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

const SUBJECT_PREFIX_MAP = {
  math: 'Math',
  elec: 'Elec',
  geas: 'GEAS',
  est: 'EST'
};

const TIER_MAP = {
  diagnostic: 'Diagnostic',
  review: 'Review',
  drill: 'Drill',
  simulation: 'Simulation'
};

function parseQuizMetadata(filename) {
  const base = filename.replace(/\.csv$/i, '');
  const m = base.match(/^([a-z]+)_([a-z0-9_]+)_(diagnostic|review|drill|simulation)_([a-z0-9-]+)_(set\d+)$/i);
  if (m) {
    const subjRaw = m[1].toLowerCase();
    const codeAndTopic = m[2];
    const tierRaw = m[3].toLowerCase();
    const scopeRaw = m[4];
    const setRaw = m[5].toLowerCase().replace('set', '');

    const subjDisplay = SUBJECT_PREFIX_MAP[subjRaw] || subjRaw.toUpperCase();
    const tierDisplay = TIER_MAP[tierRaw] || tierRaw;

    let topicDisplay = codeAndTopic;
    let codeDisplay = '';

    const codeMatch = codeAndTopic.match(/^(\d+(?:_\d+)?|de|adv)_(.+)$/i);
    if (codeMatch) {
      codeDisplay = codeMatch[1].replace('_', '-').toUpperCase();
      topicDisplay = codeMatch[2].replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    } else {
      topicDisplay = codeAndTopic.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    }

    const scopeStr = scopeRaw === 'all' ? '' :  ();
    const title = ${subjDisplay}  •  (Set );

    return {
      tier: tierRaw,
      scope: scopeRaw,
      setNumber: setRaw,
      subjectCode: subjDisplay,
      topicCode: codeDisplay,
      topicName: topicDisplay,
      title
    };
  }

  return {
    tier: 'review',
    scope: 'all',
    setNumber: '01',
    subjectCode: '',
    topicCode: '',
    topicName: base.replace(/[_-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    title: base.replace(/[_-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  };
}

function countQuestions(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    return Math.max(0, lines.length - 1);
  } catch (err) {
    return 0;
  }
}

function buildManifest() {
  if (!fs.existsSync(TEST_SETS_DIR)) {
    console.warn(	est-sets directory not found at: );
    return;
  }

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
            const relPath = 	est-sets///;
            const qCount = countQuestions(fullFilePath);
            const meta = parseQuizMetadata(file.name);

            quizzes.push({
              id: file.name.replace(/\.csv$/i, ''),
              filename: file.name,
              title: meta.title,
              tier: meta.tier,
              scope: meta.scope,
              setNumber: meta.setNumber,
              subjectCode: meta.subjectCode,
              topicCode: meta.topicCode,
              topicName: meta.topicName,
              path: relPath,
              questionCount: qCount,
              subjectTag: topicName
            });
          }
        }

        if (quizzes.length > 0) {
          const tierOrder = { diagnostic: 1, review: 2, drill: 3, simulation: 4 };
          quizzes.sort((a, b) => {
            const tA = tierOrder[a.tier] || 5;
            const tB = tierOrder[b.tier] || 5;
            if (tA !== tB) return tA - tB;
            return a.filename.localeCompare(b.filename);
          });

          topics.push({
            name: topicName,
            quizzes
          });
        }
      } else if (subEntry.isFile() && subEntry.name.toLowerCase().endsWith('.csv')) {
        const fullFilePath = path.join(categoryPath, subEntry.name);
        const relPath = 	est-sets//;
        const qCount = countQuestions(fullFilePath);
        const meta = parseQuizMetadata(subEntry.name);

        directCsvs.push({
          id: subEntry.name.replace(/\.csv$/i, ''),
          filename: subEntry.name,
          title: meta.title,
          tier: meta.tier,
          scope: meta.scope,
          setNumber: meta.setNumber,
          subjectCode: meta.subjectCode,
          topicCode: meta.topicCode,
          topicName: meta.topicName,
          path: relPath,
          questionCount: qCount,
          subjectTag: categoryName
        });
      }
    }

    if (directCsvs.length > 0) {
      topics.unshift({
        name: 'General',
        quizzes: directCsvs
      });
    }

    if (topics.length > 0) {
      topics.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
      categories.push({
        name: categoryName,
        topics
      });
    }
  }

  const rootCsvs = [];
  for (const entry of topEntries) {
    if (entry.isFile() && entry.name.toLowerCase().endsWith('.csv')) {
      const fullFilePath = path.join(TEST_SETS_DIR, entry.name);
      const relPath = 	est-sets/;
      const qCount = countQuestions(fullFilePath);
      const meta = parseQuizMetadata(entry.name);

      rootCsvs.push({
        id: entry.name.replace(/\.csv$/i, ''),
        filename: entry.name,
        title: meta.title,
        tier: meta.tier,
        scope: meta.scope,
        setNumber: meta.setNumber,
        subjectCode: meta.subjectCode,
        topicCode: meta.topicCode,
        topicName: meta.topicName,
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

  const catOrder = {
    'Sample & Introductory': 0,
    'Mathematics': 1,
    'Electronics Engineering': 2,
    'General Engineering and Applied Sciences': 3,
    'Electronics Systems and Technologies': 4
  };

  categories.sort((a, b) => {
    const oA = catOrder[a.name] !== undefined ? catOrder[a.name] : 99;
    const oB = catOrder[b.name] !== undefined ? catOrder[b.name] : 99;
    return oA - oB;
  });

  const totalQuizzes = categories.reduce((sum, c) => sum + c.topics.reduce((tSum, t) => tSum + t.quizzes.length, 0), 0);
  const totalQuestions = categories.reduce((sum, c) => sum + c.topics.reduce((tSum, t) => tSum + t.quizzes.reduce((qSum, q) => qSum + q.questionCount, 0), 0), 0);

  const manifest = {
    generatedAt: new Date().toISOString(),
    totalQuizzes,
    totalQuestions,
    categories
  };

  const jsonStr = JSON.stringify(manifest, null, 2);

  const outDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  fs.writeFileSync(OUTPUT_FILE, jsonStr, 'utf8');
  fs.writeFileSync(ALT_OUTPUT_FILE, jsonStr, 'utf8');

  console.log(Manifest generated successfully with  quizzes ( questions) across  categories.);
  console.log(Saved to: );
}

buildManifest();
