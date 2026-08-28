const fs = require('fs');
const path = require('path');

const modDir = path.join(__dirname, '../test-sets/learning-modules/math');
const mastDir = path.join(modDir, 'mastery');

function fixJsonStringEscapes(raw) {
  let out = '';
  let inString = false;
  let i = 0;

  while (i < raw.length) {
    const c = raw[i];

    if (!inString) {
      if (c === '"') {
        inString = true;
      }
      out += c;
      i++;
    } else {
      if (c === '"') {
        inString = false;
        out += c;
        i++;
      } else if (c === '\\') {
        const next = raw[i + 1];
        if (next === '"' || next === '\\' || next === '/' || next === 'b' || next === 'f' || next === 'n' || next === 'r' || next === 't') {
          out += '\\' + next;
          i += 2;
        } else if (next === 'u' && /^[0-9a-fA-F]{4}$/.test(raw.substring(i + 2, i + 6))) {
          out += raw.substring(i, i + 6);
          i += 6;
        } else {
          // Unescaped backslash! Turn \ into \\
          out += '\\\\';
          i++;
        }
      } else {
        out += c;
        i++;
      }
    }
  }

  return out;
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  let fixedCount = 0;
  let errCount = 0;

  for (const f of files) {
    const fp = path.join(dir, f);
    const raw = fs.readFileSync(fp, 'utf8');
    
    // First try standard parse
    try {
      JSON.parse(raw);
      // Already valid
    } catch (e1) {
      const fixed = fixJsonStringEscapes(raw);
      try {
        JSON.parse(fixed);
        fs.writeFileSync(fp, fixed, 'utf8');
        fixedCount++;
        console.log('Fixed:', f);
      } catch (e2) {
        console.error('Failed to fix:', f, e2.message);
        errCount++;
      }
    }
  }
  console.log(`Directory ${path.basename(dir)}: Fixed ${fixedCount} files, ${errCount} remaining errors.`);
}

processDirectory(modDir);
processDirectory(mastDir);
