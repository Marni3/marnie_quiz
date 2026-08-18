/* home.js — Home screen logic for study-app */

var REQUIRED_COLS = ['question', 'choice_a', 'choice_b', 'choice_c', 'choice_d', 'correct_answer'];
var VALID_ANS = { a: 1, b: 1, c: 1, d: 1 };

var selectedFileContent = null;
var selectedFileName = '';
var parsedQuestions = null;

var timerMode = 'untimed';
var secondsPerQ = 60;
var totalMinutes = 60;
var feedbackMode = 'deferred'; // 'deferred' | 'immediate'

document.addEventListener('DOMContentLoaded', function () {
  MQ_THEME._updateToggles();
  initFolderPicker();
  initDropzone();
  initOptions();
  initPromptCard();
});

// ── 1. Folder picker (File System Access API) ────────────────────
var directoryHandle = null;

function initFolderPicker() {
  var browseBtn = document.getElementById('browse-folder-btn');
  var noApiNote = document.getElementById('no-api-note');

  if (!('showDirectoryPicker' in window)) {
    if (noApiNote) noApiNote.style.display = 'block';
    if (browseBtn) browseBtn.style.opacity = '0.5';
  }

  if (browseBtn) {
    browseBtn.addEventListener('click', async function () {
      if (!('showDirectoryPicker' in window)) {
        alert('Directory picker is not supported in this browser. Please use drag & drop or file upload instead.');
        return;
      }
      try {
        directoryHandle = await window.showDirectoryPicker();
        await loadCsvListFromDirectory(directoryHandle);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error accessing directory:', err);
          alert('Could not access folder: ' + err.message);
        }
      }
    });
  }
}

async function loadCsvListFromDirectory(dirHandle) {
  var container = document.getElementById('csv-grid');
  var hint = document.getElementById('no-folder-hint');
  container.innerHTML = '';

  var entries = [];
  for await (var entry of dirHandle.values()) {
    if (entry.kind === 'file' && entry.name.toLowerCase().endsWith('.csv')) {
      entries.push(entry);
    }
  }

  if (entries.length === 0) {
    if (hint) {
      hint.style.display = 'block';
      hint.innerHTML = 'No <strong>.csv</strong> files found in <em>' + escHtml(dirHandle.name) + '</em>.';
    }
    return;
  }

  if (hint) hint.style.display = 'none';

  for (var i = 0; i < entries.length; i++) {
    var fileEntry = entries[i];
    var file = await fileEntry.getFile();

    var card = document.createElement('div');
    card.className = 'csv-card';
    card.dataset.name = fileEntry.name;

    card.innerHTML =
      '<div class="csv-card-icon">📄</div>' +
      '<div style="flex:1;min-width:0">' +
      '<div class="csv-card-name">' + escHtml(fileEntry.name) + '</div>' +
      '<div class="csv-card-meta">' + formatBytes(file.size) + '</div>' +
      '</div>';

    (function (entry) {
      card.addEventListener('click', async function () {
        document.querySelectorAll('.csv-card').forEach(function (c) { c.classList.remove('selected'); });
        card.classList.add('selected');
        var f = await entry.getFile();
        loadFile(f);
      });
    })(fileEntry);

    container.appendChild(card);
  }
}

// ── 2. Drag & Drop and File Input ──────────────────────────────
function initDropzone() {
  var dz = document.getElementById('dropzone');
  var fileInput = document.getElementById('csv-input');

  if (fileInput) {
    fileInput.addEventListener('change', function (e) {
      if (e.target.files && e.target.files[0]) {
        loadFile(e.target.files[0]);
      }
    });
  }

  if (dz) {
    dz.addEventListener('dragover', function (e) {
      e.preventDefault();
      dz.classList.add('drag-over');
    });
    dz.addEventListener('dragleave', function () {
      dz.classList.remove('drag-over');
    });
    dz.addEventListener('drop', function (e) {
      e.preventDefault();
      dz.classList.remove('drag-over');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        loadFile(e.dataTransfer.files[0]);
      }
    });
  }
}

function loadFile(file) {
  if (!file) return;
  selectedFileName = file.name;

  var label = document.getElementById('file-label');
  if (label) {
    label.textContent = '📄 ' + file.name;
    label.style.display = 'block';
  }

  var errBox = document.getElementById('parse-errors');
  if (errBox) errBox.style.display = 'none';

  var startBtn = document.getElementById('start-btn');
  if (startBtn) startBtn.disabled = true;

  parsedQuestions = null;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function (result) {
      var errs = [];
      var cols = result.meta.fields || [];

      for (var i = 0; i < REQUIRED_COLS.length; i++) {
        if (cols.indexOf(REQUIRED_COLS[i]) === -1) {
          errs.push('Missing required column: "' + REQUIRED_COLS[i] + '"');
        }
      }

      if (errs.length) {
        showErrors(errs);
        return;
      }

      var valid = [];
      result.data.forEach(function (row, i) {
        var rn = i + 2;
        for (var j = 0; j < REQUIRED_COLS.length; j++) {
          if (!row[REQUIRED_COLS[j]] || !row[REQUIRED_COLS[j]].toString().trim()) {
            errs.push('Row ' + rn + ': "' + REQUIRED_COLS[j] + '" is empty');
          }
        }
        var ans = (row['correct_answer'] || '').trim().toLowerCase();
        if (!VALID_ANS[ans]) {
          errs.push('Row ' + rn + ': correct_answer must be a/b/c/d, got "' + (row['correct_answer'] || '') + '"');
        } else {
          valid.push({
            id: i + 1,
            question: row['question'].trim(),
            choice_a: row['choice_a'].trim(),
            choice_b: row['choice_b'].trim(),
            choice_c: row['choice_c'].trim(),
            choice_d: row['choice_d'].trim(),
            correct_answer: ans,
            explanation: (row['explanation'] || '').trim() || null,
            image_url: (row['image_url'] || '').trim() || null,
            subject_tag: (row['subject_tag'] || '').trim() || null,
          });
        }
      });

      if (errs.length) {
        showErrors(errs);
        return;
      }

      parsedQuestions = valid;
      if (startBtn) {
        startBtn.disabled = false;
        startBtn.textContent = 'Begin Session (' + valid.length + ' Questions) →';
      }
    },
    error: function (err) {
      showErrors(['CSV parse error: ' + err.message]);
    }
  });
}

function showErrors(errs) {
  var box = document.getElementById('parse-errors');
  if (!box) return;
  box.style.display = 'block';
  box.innerHTML = errs.length === 1
    ? escHtml(errs[0])
    : '<ul>' + errs.map(function (e) { return '<li>' + escHtml(e) + '</li>'; }).join('') + '</ul>';
}

// ── 3. Options Wiring ──────────────────────────────────────────
function initOptions() {
  // Timer options
  document.querySelectorAll('.timer-opt').forEach(function (opt) {
    opt.addEventListener('click', function () {
      document.querySelectorAll('.timer-opt').forEach(function (o) { o.classList.remove('selected'); });
      opt.classList.add('selected');
      timerMode = opt.dataset.mode;

      var perQ = document.getElementById('timer-sub-per-q');
      var exam = document.getElementById('timer-sub-exam');

      if (timerMode === 'timed_per_question') {
        if (perQ) perQ.style.display = 'flex';
        if (exam) exam.style.display = 'none';
      } else if (timerMode === 'timed_whole_exam') {
        if (exam) exam.style.display = 'flex';
        if (perQ) perQ.style.display = 'none';
      } else {
        if (perQ) perQ.style.display = 'none';
        if (exam) exam.style.display = 'none';
      }
    });
  });

  // Feedback options
  document.querySelectorAll('.feedback-opt').forEach(function (opt) {
    opt.addEventListener('click', function () {
      document.querySelectorAll('.feedback-opt').forEach(function (o) { o.classList.remove('selected'); });
      opt.classList.add('selected');
      feedbackMode = opt.dataset.feedback;
    });
  });

  var secInput = document.getElementById('seconds-per-q');
  if (secInput) {
    secInput.addEventListener('change', function (e) {
      secondsPerQ = parseInt(e.target.value, 10) || 60;
    });
  }

  var minInput = document.getElementById('total-minutes');
  if (minInput) {
    minInput.addEventListener('change', function (e) {
      totalMinutes = parseInt(e.target.value, 10) || 60;
    });
  }

  var startBtn = document.getElementById('start-btn');
  if (startBtn) {
    startBtn.addEventListener('click', startSession);
  }
}

function startSession() {
  if (!parsedQuestions || parsedQuestions.length === 0) return;

  var sessionConfig = {
    setName: selectedFileName.replace(/\.[^/.]+$/, '') || 'Study Session',
    questions: parsedQuestions,
    timerMode: timerMode,
    secondsPerQ: secondsPerQ,
    totalMinutes: totalMinutes,
    feedbackMode: feedbackMode,
    answers: Array(parsedQuestions.length).fill(null),
    flagged: Array(parsedQuestions.length).fill(false),
    startTime: Date.now(),
    currentIdx: 0
  };

  MQ.clear();
  MQ.set('session', sessionConfig);
  window.location.href = 'quiz.html';
}

// ── 4. AI Prompt Card & Copy ───────────────────────────────────
function initPromptCard() {
  var header = document.getElementById('ai-card-header');
  var card = document.getElementById('ai-card');
  if (header && card) {
    header.addEventListener('click', function () {
      card.classList.toggle('open');
    });
  }

  var copyBtn = document.getElementById('copy-prompt-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', copyPrompt);
  }
}

function copyPrompt() {
  var textEl = document.getElementById('ai-prompt-text');
  if (!textEl) return;
  var text = textEl.textContent;
  var btn = document.getElementById('copy-prompt-btn');

  navigator.clipboard.writeText(text).then(function () {
    if (!btn) return;
    btn.classList.add('copied');
    btn.textContent = '✓ Copied';
    setTimeout(function () {
      btn.classList.remove('copied');
      btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor"><path d="M8 3a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1z"/><path d="M6 3a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2 3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z"/></svg>Copy';
    }, 2200);
  }).catch(function () {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    if (btn) {
      btn.textContent = '✓ Copied';
      setTimeout(function () {
        btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor"><path d="M8 3a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1z"/><path d="M6 3a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2 3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z"/></svg>Copy';
      }, 2200);
    }
  });
}

// ── Helpers ────────────────────────────────────────────────────
function escHtml(s) {
  return (s || '').toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  var k = 1024;
  var sizes = ['B', 'KB', 'MB', 'GB'];
  var i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
