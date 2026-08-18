/* home.js — Wide Dashboard & Manifest Browser for study-app */

var REQUIRED_COLS = ['question', 'choice_a', 'choice_b', 'choice_c', 'choice_d', 'correct_answer'];
var VALID_ANS = { a: 1, b: 1, c: 1, d: 1 };

var manifestData = null;
var selectedCategory = 'all';
var searchKeyword = '';

var timerMode = 'untimed';
var secondsPerQ = 60;
var totalMinutes = 60;
var feedbackMode = 'deferred'; // 'deferred' | 'immediate'

var customParsedQuestions = null;
var customFileName = '';

document.addEventListener('DOMContentLoaded', function () {
  MQ_THEME._updateToggles();
  initOptions();
  initPromptCard();
  initCustomDropzone();
  initSearchAndFilter();
  loadManifest();
});

// ── 1. Manifest Loading & Rendering ─────────────────────────────
async function loadManifest() {
  var container = document.getElementById('manifest-container');
  var counter = document.getElementById('total-quizzes-counter');

  try {
    var res = await fetch('manifest.json?v=' + Date.now());
    if (!res.ok) throw new Error('Manifest not found');
    manifestData = await res.json();

    if (counter) {
      counter.textContent = manifestData.totalQuizzes + ' Test Sets Available';
    }

    renderCategoryPills();
    renderManifestQuizzes();
  } catch (err) {
    console.warn('Could not fetch manifest.json, loading fallback message:', err);
    if (counter) counter.textContent = 'Manual upload mode';
    if (container) {
      container.innerHTML =
        '<div style="padding:32px 20px;text-align:center;background:var(--surface);border:1.5px dashed var(--border);border-radius:var(--radius);">' +
        '<div style="font-size:1.8rem;margin-bottom:8px;">📁</div>' +
        '<div style="font-family:\'Playfair Display\',serif;font-size:1.1rem;font-weight:700;color:var(--text);">Repository Test Sets</div>' +
        '<div style="font-size:.84rem;color:var(--text3);margin-top:4px;max-width:400px;margin-left:auto;margin-right:auto;">Use the sidebar upload on the right to load any CSV test set, or run <code>npm run manifest</code> to index your folder structure.</div>' +
        '</div>';
    }
  }
}

function renderCategoryPills() {
  if (!manifestData || !manifestData.categories) return;
  var pillsContainer = document.getElementById('category-pills');
  pillsContainer.innerHTML = '';

  var allBtn = document.createElement('button');
  allBtn.type = 'button';
  allBtn.className = 'category-pill' + (selectedCategory === 'all' ? ' active' : '');
  allBtn.dataset.cat = 'all';
  allBtn.textContent = 'All Topics (' + manifestData.totalQuizzes + ')';
  allBtn.addEventListener('click', function () {
    selectCategory('all');
  });
  pillsContainer.appendChild(allBtn);

  manifestData.categories.forEach(function (cat) {
    var count = cat.topics.reduce(function (sum, t) { return sum + t.quizzes.length; }, 0);
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'category-pill' + (selectedCategory === cat.name ? ' active' : '');
    btn.dataset.cat = cat.name;
    btn.textContent = cat.name + ' (' + count + ')';
    btn.addEventListener('click', function () {
      selectCategory(cat.name);
    });
    pillsContainer.appendChild(btn);
  });
}

function selectCategory(catName) {
  selectedCategory = catName;
  document.querySelectorAll('.category-pill').forEach(function (p) {
    p.classList.toggle('active', p.dataset.cat === catName);
  });
  renderManifestQuizzes();
}

function renderManifestQuizzes() {
  if (!manifestData || !manifestData.categories) return;

  var container = document.getElementById('manifest-container');
  var emptyMsg = document.getElementById('empty-search-msg');
  container.innerHTML = '';

  var qLower = searchKeyword.toLowerCase().trim();
  var matchFound = false;

  manifestData.categories.forEach(function (category) {
    if (selectedCategory !== 'all' && selectedCategory !== category.name) {
      return;
    }

    var matchingTopics = [];

    category.topics.forEach(function (topic) {
      var matchingQuizzes = topic.quizzes.filter(function (quiz) {
        if (!qLower) return true;
        return (
          quiz.title.toLowerCase().includes(qLower) ||
          quiz.filename.toLowerCase().includes(qLower) ||
          topic.name.toLowerCase().includes(qLower) ||
          category.name.toLowerCase().includes(qLower)
        );
      });

      if (matchingQuizzes.length > 0) {
        matchingTopics.push({
          name: topic.name,
          quizzes: matchingQuizzes
        });
      }
    });

    if (matchingTopics.length === 0) return;
    matchFound = true;

    var totalCatQuizzes = matchingTopics.reduce(function (sum, t) { return sum + t.quizzes.length; }, 0);

    var catSection = document.createElement('section');
    catSection.className = 'category-section';

    var catHeader = document.createElement('div');
    catHeader.className = 'category-header';
    catHeader.innerHTML =
      '<h2 class="category-title">' + escHtml(category.name) + '</h2>' +
      '<span class="category-badge">' + totalCatQuizzes + ' Sets</span>';
    catSection.appendChild(catHeader);

    matchingTopics.forEach(function (topic) {
      var topicGroup = document.createElement('div');
      topicGroup.className = 'topic-group';

      if (topic.name !== 'General' || category.topics.length > 1) {
        var topicTitle = document.createElement('div');
        topicTitle.className = 'topic-title';
        topicTitle.innerHTML = '📁 ' + escHtml(topic.name);
        topicGroup.appendChild(topicTitle);
      }

      var grid = document.createElement('div');
      grid.className = 'quiz-grid';

      topic.quizzes.forEach(function (quiz) {
        var card = document.createElement('div');
        card.className = 'quiz-card-item';

        card.innerHTML =
          '<div class="quiz-card-top">' +
          '  <div class="quiz-card-title">' + escHtml(quiz.title) + '</div>' +
          '  <div class="quiz-card-badge">' + quiz.questionCount + ' Qs</div>' +
          '</div>' +
          '<div class="quiz-card-bottom">' +
          '  <span>' + escHtml(quiz.subjectTag || topic.name) + '</span>' +
          '  <span class="quiz-card-btn">▶ Start Study Set</span>' +
          '</div>';

        card.addEventListener('click', function () {
          loadAndStartManifestQuiz(quiz, card);
        });

        grid.appendChild(card);
      });

      topicGroup.appendChild(grid);
      catSection.appendChild(topicGroup);
    });

    container.appendChild(catSection);
  });

  if (emptyMsg) {
    emptyMsg.style.display = matchFound ? 'none' : 'block';
  }
}

// ── 2. Direct Quiz Loader from Manifest ─────────────────────────
async function loadAndStartManifestQuiz(quiz, cardEl) {
  var originalBtn = cardEl ? cardEl.querySelector('.quiz-card-btn') : null;
  if (originalBtn) originalBtn.textContent = '⏳ Loading...';

  try {
    var rawPath = quiz.path || ('test-sets/' + quiz.filename);
    var candidates = [
      rawPath,
      '/' + rawPath,
      '../' + rawPath,
      quiz.filename
    ];

    var res = null;
    for (var c = 0; c < candidates.length; c++) {
      try {
        var tryUrl = encodeURI(candidates[c]);
        var testRes = await fetch(tryUrl);
        if (testRes.ok) {
          res = testRes;
          break;
        }
      } catch (e) {
        // continue to next candidate
      }
    }

    if (!res || !res.ok) {
      throw new Error('Could not load ' + quiz.filename + ' (tried: ' + candidates[0] + ')');
    }

    var csvText = await res.text();

    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: function (result) {
        var valid = [];
        result.data.forEach(function (row, i) {
          var ans = (row['correct_answer'] || '').trim().toLowerCase();
          if (VALID_ANS[ans] && row['question']) {
            valid.push({
              id: i + 1,
              question: (row['question'] || '').trim(),
              choice_a: (row['choice_a'] || '').trim(),
              choice_b: (row['choice_b'] || '').trim(),
              choice_c: (row['choice_c'] || '').trim(),
              choice_d: (row['choice_d'] || '').trim(),
              correct_answer: ans,
              explanation: (row['explanation'] || '').trim() || null,
              image_url: (row['image_url'] || '').trim() || null,
              subject_tag: (row['subject_tag'] || quiz.subjectTag || '').trim() || null,
            });
          }
        });

        if (valid.length === 0) {
          alert('No valid questions found in ' + quiz.filename);
          if (originalBtn) originalBtn.textContent = '▶ Start Study Set';
          return;
        }

        launchSession(quiz.title, valid);
      },
      error: function (err) {
        alert('Failed to parse CSV: ' + err.message);
        if (originalBtn) originalBtn.textContent = '▶ Start Study Set';
      }
    });
  } catch (err) {
    alert('Error loading quiz file: ' + err.message);
    if (originalBtn) originalBtn.textContent = '▶ Start Study Set';
  }
}

function launchSession(setName, questions) {
  var sessionConfig = {
    setName: setName || 'Study Session',
    questions: questions,
    timerMode: timerMode,
    secondsPerQ: secondsPerQ,
    totalMinutes: totalMinutes,
    feedbackMode: feedbackMode,
    answers: Array(questions.length).fill(null),
    flagged: Array(questions.length).fill(false),
    startTime: Date.now(),
    currentIdx: 0
  };

  MQ.clear();
  MQ.set('session', sessionConfig);
  window.location.href = 'quiz.html';
}

// ── 3. Search and Category Filter Wiring ─────────────────────────
function initSearchAndFilter() {
  var searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', function (e) {
      searchKeyword = e.target.value;
      renderManifestQuizzes();
    });
  }
}

// ── 4. Sidebar Custom Dropzone ──────────────────────────────────
function initCustomDropzone() {
  var dz = document.getElementById('dropzone');
  var fileInput = document.getElementById('csv-input');
  var startBtn = document.getElementById('start-btn');

  if (fileInput) {
    fileInput.addEventListener('change', function (e) {
      if (e.target.files && e.target.files[0]) {
        loadCustomFile(e.target.files[0]);
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
        loadCustomFile(e.dataTransfer.files[0]);
      }
    });
  }

  if (startBtn) {
    startBtn.addEventListener('click', function () {
      if (customParsedQuestions && customParsedQuestions.length > 0) {
        launchSession(customFileName.replace(/\.[^/.]+$/, ''), customParsedQuestions);
      }
    });
  }
}

function loadCustomFile(file) {
  if (!file) return;
  customFileName = file.name;

  var label = document.getElementById('file-label');
  if (label) label.textContent = '📄 ' + file.name;

  var errBox = document.getElementById('parse-errors');
  if (errBox) errBox.style.display = 'none';

  var startBtn = document.getElementById('start-btn');
  if (startBtn) startBtn.disabled = true;

  customParsedQuestions = null;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function (result) {
      var errs = [];
      var cols = result.meta.fields || [];

      for (var i = 0; i < REQUIRED_COLS.length; i++) {
        if (cols.indexOf(REQUIRED_COLS[i]) === -1) {
          errs.push('Missing column: "' + REQUIRED_COLS[i] + '"');
        }
      }

      if (errs.length) {
        showErrors(errs);
        return;
      }

      var valid = [];
      result.data.forEach(function (row, i) {
        var rn = i + 2;
        var ans = (row['correct_answer'] || '').trim().toLowerCase();
        if (!VALID_ANS[ans]) {
          errs.push('Row ' + rn + ': correct_answer must be a/b/c/d');
        } else if (!row['question']) {
          errs.push('Row ' + rn + ': question is empty');
        } else {
          valid.push({
            id: i + 1,
            question: row['question'].trim(),
            choice_a: (row['choice_a'] || '').trim(),
            choice_b: (row['choice_b'] || '').trim(),
            choice_c: (row['choice_c'] || '').trim(),
            choice_d: (row['choice_d'] || '').trim(),
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

      customParsedQuestions = valid;
      if (startBtn) {
        startBtn.disabled = false;
        startBtn.textContent = 'Start Custom Set (' + valid.length + ' Qs) →';
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

// ── 5. Sidebar Options Wiring ────────────────────────────────────
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
}

// ── 6. AI Prompt Card Wiring ─────────────────────────────────────
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
      btn.innerHTML = '<svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor"><path d="M8 3a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1z"/><path d="M6 3a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2 3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z"/></svg>Copy';
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
        btn.innerHTML = '<svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor"><path d="M8 3a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1z"/><path d="M6 3a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2 3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z"/></svg>Copy';
      }, 2200);
    }
  });
}

function escHtml(s) {
  return (s || '').toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
