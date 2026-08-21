/* home.js — Upgraded Dashboard & Multi-Tier Manifest Browser */

var REQUIRED_COLS = ['question', 'choice_a', 'choice_b', 'choice_c', 'choice_d', 'correct_answer'];
var VALID_ANS = { a: 1, b: 1, c: 1, d: 1 };

var manifestData = null;
var selectedCategory = 'all';
var selectedTier = 'all';
var searchKeyword = '';
var areAllCollapsed = false;

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
  initTierFilters();
  initCollapseToggle();
  loadManifest();
});

// ── 1. Manifest Loading & Rendering ─────────────────────────────
async function loadManifest() {
  var container = document.getElementById('manifest-container');
  var counter = document.getElementById('total-quizzes-counter');
  var statSets = document.getElementById('stat-sets');
  var statQs = document.getElementById('stat-questions');

  try {
    var res = await fetch('manifest.json?v=' + Date.now());
    if (!res.ok) throw new Error('Manifest not found');
    manifestData = await res.json();

    if (counter) {
      counter.textContent = manifestData.totalQuizzes + ' Test Sets Available • ' + (manifestData.totalQuestions || 5435).toLocaleString() + ' Questions';
    }
    if (statSets) statSets.innerHTML = manifestData.totalQuizzes + '<em>sets</em>';
    if (statQs) statQs.innerHTML = (manifestData.totalQuestions || 5435).toLocaleString() + '<em>items</em>';

    renderCategoryPills();
    renderManifestQuizzes();
  } catch (err) {
    console.warn('Could not fetch manifest.json:', err);
    if (counter) counter.textContent = 'Manual upload mode';
    if (container) {
      container.innerHTML =
        '<div style="padding:32px 20px;text-align:center;background:var(--surface);border:1.5px dashed var(--border);border-radius:var(--radius);">' +
        '<div style="font-size:1.8rem;margin-bottom:8px;">📁</div>' +
        '<div style="font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;color:var(--text);">Repository Test Sets</div>' +
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
  allBtn.textContent = 'All Subjects (' + manifestData.totalQuizzes + ')';
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

function initTierFilters() {
  document.querySelectorAll('.tier-pill').forEach(function (pill) {
    pill.addEventListener('click', function () {
      document.querySelectorAll('.tier-pill').forEach(function (p) { p.classList.remove('active'); });
      pill.classList.add('active');
      selectedTier = pill.dataset.tier;
      renderManifestQuizzes();
    });
  });
}

function initCollapseToggle() {
  var btn = document.getElementById('btn-toggle-all');
  if (btn) {
    btn.addEventListener('click', function () {
      areAllCollapsed = !areAllCollapsed;
      btn.textContent = areAllCollapsed ? 'Expand All' : 'Collapse All';
      document.querySelectorAll('.topic-accordion-header').forEach(function (h) {
        h.classList.toggle('collapsed', areAllCollapsed);
      });
      document.querySelectorAll('.topic-accordion-body').forEach(function (b) {
        b.classList.toggle('collapsed', areAllCollapsed);
      });
    });
  }
}

function renderManifestQuizzes() {
  if (!manifestData || !manifestData.categories) return;

  var container = document.getElementById('manifest-container');
  var emptyMsg = document.getElementById('empty-search-msg');
  container.innerHTML = '';

  var qLower = searchKeyword.toLowerCase().trim();
  var totalRendered = 0;

  manifestData.categories.forEach(function (category) {
    if (selectedCategory !== 'all' && selectedCategory !== category.name) {
      return;
    }

    var matchingTopics = [];

    category.topics.forEach(function (topic) {
      var matchingQuizzes = topic.quizzes.filter(function (quiz) {
        // Tier filter
        if (selectedTier !== 'all') {
          var qTier = (quiz.tier || '').toLowerCase();
          if (qTier !== selectedTier) return false;
        }

        // Search filter
        if (!qLower) return true;
        return (
          quiz.title.toLowerCase().includes(qLower) ||
          quiz.filename.toLowerCase().includes(qLower) ||
          topic.name.toLowerCase().includes(qLower) ||
          category.name.toLowerCase().includes(qLower) ||
          (quiz.tier && quiz.tier.toLowerCase().includes(qLower)) ||
          (quiz.subjectCode && quiz.subjectCode.toLowerCase().includes(qLower)) ||
          (quiz.topicCode && quiz.topicCode.toLowerCase().includes(qLower))
        );
      });

      if (matchingQuizzes.length > 0) {
        matchingTopics.push({
          name: topic.name,
          quizzes: matchingQuizzes
        });
        totalRendered += matchingQuizzes.length;
      }
    });

    if (matchingTopics.length === 0) return;

    var catSection = document.createElement('div');
    catSection.className = 'category-section';

    var catHeader = document.createElement('div');
    catHeader.className = 'category-header';

    var totalCatQuizzes = matchingTopics.reduce(function (sum, t) { return sum + t.quizzes.length; }, 0);
    catHeader.innerHTML =
      '<h2 class="category-title">' + escHtml(category.name) + '</h2>' +
      '<span class="category-badge">' + totalCatQuizzes + ' quizzes</span>';
    catSection.appendChild(catHeader);

    matchingTopics.forEach(function (topic) {
      var topicTotalQs = topic.quizzes.reduce(function (s, q) { return s + q.questionCount; }, 0);

      // Accordion Header
      var accHeader = document.createElement('div');
      accHeader.className = 'topic-accordion-header' + (areAllCollapsed ? ' collapsed' : '');
      accHeader.innerHTML =
        '<div class="topic-accordion-left">' +
        '  <span class="topic-accordion-icon">▾</span>' +
        '  <span class="topic-accordion-title">' + escHtml(topic.name) + '</span>' +
        '</div>' +
        '<span class="topic-accordion-meta">' + topic.quizzes.length + ' sets • ' + topicTotalQs + ' Qs</span>';

      var accBody = document.createElement('div');
      accBody.className = 'topic-accordion-body' + (areAllCollapsed ? ' collapsed' : '');

      accHeader.addEventListener('click', function () {
        accHeader.classList.toggle('collapsed');
        accBody.classList.toggle('collapsed');
      });

      topic.quizzes.forEach(function (quiz) {
        var card = document.createElement('div');
        card.className = 'quiz-card-item';

        var tier = (quiz.tier || 'review').toLowerCase();
        var tierLabel = {
          diagnostic: '🩺 Diagnostic',
          review: '📖 Review (1:1)',
          drill: '⚡ Drill',
          simulation: '🎯 Simulation'
        }[tier] || tier.toUpperCase();

        var tierClass = 'badge-tier badge-tier-' + tier;

        card.innerHTML =
          '<div class="quiz-card-top">' +
          '  <span class="' + tierClass + '">' + escHtml(tierLabel) + '</span>' +
          '  <span class="quiz-card-badge">' + quiz.questionCount + ' Qs</span>' +
          '</div>' +
          '<div class="quiz-card-title">' + escHtml(quiz.title) + '</div>' +
          '<div class="quiz-card-bottom">' +
          '  <span>' + escHtml(quiz.filename) + '</span>' +
          '  <span class="quiz-card-btn">Start →</span>' +
          '</div>';

        card.addEventListener('click', function () {
          startManifestQuiz(quiz);
        });

        accBody.appendChild(card);
      });

      catSection.appendChild(accHeader);
      catSection.appendChild(accBody);
    });

    container.appendChild(catSection);
  });

  if (emptyMsg) {
    emptyMsg.style.display = totalRendered === 0 ? 'block' : 'none';
  }
}

// ── 2. Starting a Quiz from Manifest ─────────────────────────────
async function startManifestQuiz(quiz) {
  var origText = event.currentTarget ? event.currentTarget.querySelector('.quiz-card-btn') : null;
  if (origText) origText.textContent = 'Loading...';

  try {
    var csvUrl = quiz.path + '?v=' + Date.now();
    var res = await fetch(csvUrl);
    if (!res.ok) throw new Error('Could not fetch quiz CSV at ' + quiz.path);
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
              question: row['question'].trim(),
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
          alert('Could not parse questions from this quiz file.');
          if (origText) origText.textContent = 'Start →';
          return;
        }

        launchSession(quiz.title, valid);
      },
      error: function (err) {
        alert('Error parsing CSV: ' + err.message);
        if (origText) origText.textContent = 'Start →';
      }
    });
  } catch (err) {
    alert('Failed to load quiz: ' + err.message);
    if (origText) origText.textContent = 'Start →';
  }
}

function launchSession(title, questions) {
  MQ_STATE.saveSession({
    quizTitle: title,
    questions: questions,
    timerMode: timerMode,
    secondsPerQ: secondsPerQ,
    totalMinutes: totalMinutes,
    feedbackMode: feedbackMode,
  });
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
