/* quiz.js — Quiz taking screen logic for study-app */

var session = null;
var currentIdx = 0;
var timerInterval = null;
var timerRemaining = 0;

document.addEventListener('DOMContentLoaded', function () {
  session = MQ.get('session');
  if (!session || !session.questions || session.questions.length === 0) {
    window.location.href = 'index.html';
    return;
  }

  MQ_THEME._updateToggles();
  initQuizUI();
  renderQuestion(currentIdx);
  initTimers();
});

function initQuizUI() {
  // Set title and breadcrumb
  document.getElementById('crumb-title').textContent = session.setName || 'Study Session';

  // Home button warning
  var homeBtn = document.getElementById('btn-home');
  if (homeBtn) {
    homeBtn.addEventListener('click', function (e) {
      if (!confirm('Leave this quiz session and return to home? Current progress will be lost.')) {
        e.preventDefault();
      }
    });
  }

  // Prev / Next / Submit buttons
  document.getElementById('prev-btn').addEventListener('click', function () {
    if (currentIdx > 0) goToQuestion(currentIdx - 1);
  });

  document.getElementById('next-btn').addEventListener('click', function () {
    if (currentIdx < session.questions.length - 1) {
      goToQuestion(currentIdx + 1);
    } else {
      confirmSubmit();
    }
  });

  document.getElementById('submit-btn').addEventListener('click', confirmSubmit);

  // Flag button
  document.getElementById('flag-btn').addEventListener('click', function () {
    session.flagged[currentIdx] = !session.flagged[currentIdx];
    MQ.set('session', session);
    updateFlagBtn();
    renderNavGrid();
  });
}

function initTimers() {
  var timerDisp = document.getElementById('timer-display');
  var timerLabel = document.getElementById('timer-label-text');

  if (session.timerMode === 'timed_per_question') {
    timerDisp.style.display = 'block';
    timerLabel.textContent = 'Per question';
    timerRemaining = session.secondsPerQ || 60;
    startPerQTimer();
  } else if (session.timerMode === 'timed_whole_exam') {
    timerDisp.style.display = 'block';
    timerLabel.textContent = 'Time remaining';
    timerRemaining = (session.totalMinutes || 60) * 60;
    startExamTimer();
  } else {
    timerDisp.style.display = 'none';
  }
}

function startPerQTimer() {
  clearInterval(timerInterval);
  updateTimerUI();
  timerInterval = setInterval(function () {
    timerRemaining--;
    updateTimerUI();
    if (timerRemaining <= 0) {
      clearInterval(timerInterval);
      if (currentIdx < session.questions.length - 1) {
        goToQuestion(currentIdx + 1);
      } else {
        finishQuiz();
      }
    }
  }, 1000);
}

function startExamTimer() {
  clearInterval(timerInterval);
  updateTimerUI();
  timerInterval = setInterval(function () {
    timerRemaining--;
    updateTimerUI();
    if (timerRemaining <= 0) {
      clearInterval(timerInterval);
      alert('Time is up! Submitting your quiz now.');
      finishQuiz();
    }
  }, 1000);
}

function updateTimerUI() {
  var m = Math.floor(timerRemaining / 60);
  var s = timerRemaining % 60;
  var valEl = document.getElementById('timer-value');
  var disp = document.getElementById('timer-display');

  if (valEl) {
    valEl.textContent = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }
  if (disp) {
    disp.classList.remove('warning', 'critical');
    if (timerRemaining <= 15) disp.classList.add('critical');
    else if (timerRemaining <= 45) disp.classList.add('warning');
  }
}

function renderQuestion(idx) {
  currentIdx = idx;
  var q = session.questions[idx];
  var total = session.questions.length;
  var isImmediate = session.feedbackMode === 'immediate';
  var hasAnswered = session.answers[idx] !== null;

  // Update badges & headers
  document.getElementById('topbar-q-badge').textContent = 'Q ' + (idx + 1) + ' / ' + total;

  var tagEl = document.getElementById('q-tag-label');
  if (q.subject_tag) {
    tagEl.textContent = q.subject_tag;
    tagEl.style.display = 'inline-block';
  } else {
    tagEl.style.display = 'none';
  }

  updateFlagBtn();

  // Image handling
  var imgWrap = document.getElementById('q-image');
  var imgEl = document.getElementById('q-image-el');
  if (q.image_url) {
    imgEl.src = q.image_url;
    imgWrap.style.display = 'block';
  } else {
    imgWrap.style.display = 'none';
  }

  // Question Prompt text
  var promptEl = document.getElementById('q-prompt');
  promptEl.textContent = q.question;

  // Render choices
  var container = document.getElementById('choices-container');
  container.innerHTML = '';

  var letters = ['a', 'b', 'c', 'd'];
  var texts = [q.choice_a, q.choice_b, q.choice_c, q.choice_d];

  letters.forEach(function (letter, i) {
    var div = document.createElement('div');
    div.className = 'choice';
    div.dataset.letter = letter;

    var isSelected = session.answers[idx] === letter;

    if (isImmediate && hasAnswered) {
      div.classList.add('locked');
      if (letter === q.correct_answer) {
        div.classList.add('revealed-correct');
      } else if (isSelected && letter !== q.correct_answer) {
        div.classList.add('revealed-wrong');
      } else {
        div.classList.add('revealed-neutral');
      }
    } else {
      if (isSelected) div.classList.add('selected');
    }

    var letterBadge = document.createElement('div');
    letterBadge.className = 'choice-letter';
    letterBadge.textContent = letter.toUpperCase();

    var textSpan = document.createElement('div');
    textSpan.className = 'choice-text';
    textSpan.textContent = texts[i];

    div.appendChild(letterBadge);
    div.appendChild(textSpan);

    div.addEventListener('click', function () {
      handleChoiceClick(letter);
    });

    container.appendChild(div);
  });

  // Inline explanation (immediate mode)
  var explEl = document.getElementById('inline-explanation');
  var explBody = document.getElementById('inline-explanation-body');
  if (isImmediate && hasAnswered && q.explanation) {
    explBody.innerHTML = '';
    var paragraphs = q.explanation.split(/\\n/);
    paragraphs.forEach(function (para) {
      para = para.trim();
      if (!para) return;
      var p = document.createElement('p');
      p.className = 'inline-explanation-text';
      p.textContent = para;
      explBody.appendChild(p);
    });
    explEl.classList.add('visible');
  } else {
    explEl.classList.remove('visible');
  }

  // Navigation buttons state
  document.getElementById('prev-btn').disabled = idx === 0;
  var nextBtn = document.getElementById('next-btn');
  nextBtn.textContent = idx === total - 1 ? 'Finish & Submit →' : 'Next →';

  updateProgressBar();
  renderNavGrid();

  // Reset per-Q timer if active
  if (session.timerMode === 'timed_per_question') {
    timerRemaining = session.secondsPerQ || 60;
    startPerQTimer();
  }

  // Typeset math
  typesetMath([promptEl, container, explBody]);
}

function handleChoiceClick(letter) {
  var isImmediate = session.feedbackMode === 'immediate';
  var hasAnswered = session.answers[currentIdx] !== null;

  // In immediate mode, locked once answered
  if (isImmediate && hasAnswered) return;

  session.answers[currentIdx] = letter;
  MQ.set('session', session);

  if (isImmediate) {
    // Re-render to show immediate feedback styling and explanation
    renderQuestion(currentIdx);
  } else {
    // Standard mode: toggle selected state
    document.querySelectorAll('.choice').forEach(function (el) {
      el.classList.toggle('selected', el.dataset.letter === letter);
    });
    updateProgressBar();
    renderNavGrid();
  }
}

function updateFlagBtn() {
  var btn = document.getElementById('flag-btn');
  var f = session.flagged[currentIdx];
  btn.classList.toggle('flagged', f);
  btn.innerHTML =
    '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M3 3a1 1 0 0 1 1-1h.5l.9 2H16a1 1 0 0 1 .894 1.447l-2 4A1 1 0 0 1 14 10H6.236l-.382.764A1 1 0 0 0 6.764 12H15a1 1 0 1 1 0 2H6a1 1 0 0 1-.894-1.553L6.618 10H4.618l-1.5-3H3a1 1 0 0 1-1-1V3z"/></svg>' +
    (f ? ' Flagged' : ' Flag for review');
}

function updateProgressBar() {
  var answeredCount = session.answers.filter(function (a) { return a !== null; }).length;
  var total = session.questions.length;
  var pct = (answeredCount / total) * 100;
  document.getElementById('progress-fill').style.width = pct + '%';
}

function renderNavGrid() {
  var grid = document.getElementById('nav-grid');
  grid.innerHTML = '';
  var isImmediate = session.feedbackMode === 'immediate';

  session.questions.forEach(function (q, i) {
    var cell = document.createElement('div');
    cell.className = 'nav-cell';
    if (i === currentIdx) cell.classList.add('current');

    var ans = session.answers[i];
    if (ans !== null) {
      cell.classList.add('answered');
      if (isImmediate) {
        if (ans === q.correct_answer) cell.classList.add('correct-imm');
        else cell.classList.add('wrong-imm');
      }
    }

    if (session.flagged[i]) cell.classList.add('flagged');

    cell.textContent = i + 1;
    cell.addEventListener('click', function () {
      goToQuestion(i);
    });
    grid.appendChild(cell);
  });
}

function goToQuestion(idx) {
  renderQuestion(idx);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function confirmSubmit() {
  var unAns = session.answers.filter(function (a) { return a === null; }).length;
  if (unAns > 0) {
    if (!confirm('You have ' + unAns + ' unanswered question' + (unAns > 1 ? 's' : '') + '. Submit exam anyway?')) {
      return;
    }
  }
  finishQuiz();
}

function finishQuiz() {
  clearInterval(timerInterval);
  session.endTime = Date.now();
  session.elapsedMs = session.endTime - (session.startTime || session.endTime);
  MQ.set('session', session);
  window.location.href = 'results.html';
}

function typesetMath(elements) {
  if (window.MathJax && MathJax.startup) {
    MathJax.startup.promise.then(function () {
      MathJax.typesetPromise(elements.filter(Boolean));
    });
  }
}
