/* results.js — Results and review screen logic for study-app */

var session = null;

document.addEventListener('DOMContentLoaded', function () {
  session = MQ.get('session');
  if (!session || !session.questions || session.questions.length === 0) {
    window.location.href = 'index.html';
    return;
  }

  MQ_THEME._updateToggles();
  initResultsUI();
  calculateAndRenderScore();
  renderReview('all');
});

function initResultsUI() {
  document.getElementById('crumb-title').textContent = (session.setName || 'Study Session') + ' — Results';

  // Retake button
  document.getElementById('retake-btn').addEventListener('click', function () {
    session.answers = Array(session.questions.length).fill(null);
    session.flagged = Array(session.questions.length).fill(false);
    session.startTime = Date.now();
    session.endTime = null;
    session.elapsedMs = 0;
    MQ.set('session', session);
    window.location.href = 'quiz.html';
  });

  // Home / New quiz buttons
  document.getElementById('new-quiz-btn').addEventListener('click', function () {
    window.location.href = 'index.html';
  });

  // Review filter tabs
  document.querySelectorAll('.review-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.review-tab').forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      renderReview(tab.dataset.filter);
    });
  });
}

function calculateAndRenderScore() {
  var total = session.questions.length;
  var correct = 0;
  var wrong = 0;
  var skipped = 0;

  session.questions.forEach(function (q, i) {
    var ans = session.answers[i];
    if (ans === null) {
      skipped++;
    } else if (ans === q.correct_answer) {
      correct++;
    } else {
      wrong++;
    }
  });

  var pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  document.getElementById('score-pct').textContent = pct + '%';
  document.getElementById('score-frac').textContent = correct + ' out of ' + total + ' correct';

  document.getElementById('stat-correct').textContent = correct;
  document.getElementById('stat-wrong').textContent = wrong;
  document.getElementById('stat-skipped').textContent = skipped;

  var elapsed = session.elapsedMs || 0;
  document.getElementById('stat-time').textContent = formatDuration(elapsed);
}

function renderReview(filter) {
  var items = session.questions.map(function (q, i) {
    var ans = session.answers[i];
    var status = ans === null ? 'skipped' : (ans === q.correct_answer ? 'correct' : 'wrong');
    return {
      q: q,
      index: i,
      userAnswer: ans,
      status: status,
      isFlagged: !!session.flagged[i]
    };
  }).filter(function (item) {
    if (filter === 'all') return true;
    if (filter === 'flagged') return item.isFlagged;
    return item.status === filter;
  });

  var countLabel = document.getElementById('review-count-label');
  countLabel.textContent = 'Showing ' + items.length + ' question' + (items.length !== 1 ? 's' : '');

  var listContainer = document.getElementById('review-list');
  listContainer.innerHTML = '';

  var letters = ['a', 'b', 'c', 'd'];

  items.forEach(function (item) {
    var q = item.q;
    var i = item.index;
    var status = item.status;
    var userAns = item.userAnswer;
    var texts = [q.choice_a, q.choice_b, q.choice_c, q.choice_d];

    var itemCard = document.createElement('div');
    itemCard.className = 'review-item ' + status + '-item';

    // Header row
    var hdr = document.createElement('div');
    hdr.className = 'review-q-header';

    var qNum = document.createElement('span');
    qNum.className = 'review-q-num';
    qNum.textContent = 'Q' + (i + 1);
    hdr.appendChild(qNum);

    var badge = document.createElement('span');
    badge.className = 'review-badge ' +
      (status === 'correct' ? 'badge-correct' : status === 'wrong' ? 'badge-wrong' : 'badge-skipped');
    badge.textContent = status === 'correct' ? '✓ Correct' : status === 'wrong' ? '✗ Incorrect' : '— Skipped';
    hdr.appendChild(badge);

    if (item.isFlagged) {
      var flagBadge = document.createElement('span');
      flagBadge.className = 'review-badge badge-flagged';
      flagBadge.textContent = '🚩 Flagged';
      hdr.appendChild(flagBadge);
    }

    if (q.subject_tag) {
      var tagBadge = document.createElement('span');
      tagBadge.className = 'review-badge badge-tag';
      tagBadge.textContent = q.subject_tag;
      hdr.appendChild(tagBadge);
    }

    itemCard.appendChild(hdr);

    // Image
    if (q.image_url) {
      var imgWrap = document.createElement('div');
      imgWrap.className = 'q-image';
      var img = document.createElement('img');
      img.src = q.image_url;
      imgWrap.appendChild(img);
      itemCard.appendChild(imgWrap);
    }

    // Prompt
    var promptEl = document.createElement('div');
    promptEl.className = 'review-prompt';
    promptEl.textContent = q.question;
    itemCard.appendChild(promptEl);

    // Choices
    var choicesWrap = document.createElement('div');
    choicesWrap.className = 'review-choices';

    letters.forEach(function (letter, li) {
      var choiceRow = document.createElement('div');
      choiceRow.className = 'review-choice';

      if (letter === q.correct_answer) {
        choiceRow.classList.add('correct-ans');
      } else if (letter === userAns && userAns !== q.correct_answer) {
        choiceRow.classList.add('wrong-ans');
      } else {
        choiceRow.classList.add('neutral');
      }

      var letterEl = document.createElement('span');
      letterEl.className = 'review-choice-letter';
      letterEl.textContent = letter.toUpperCase() + '.';
      choiceRow.appendChild(letterEl);

      var indicator = letter === q.correct_answer ? '✓ ' :
        (letter === userAns && userAns !== q.correct_answer ? '✗ ' : '');

      var textEl = document.createElement('span');
      textEl.textContent = indicator + texts[li];
      choiceRow.appendChild(textEl);

      choicesWrap.appendChild(choiceRow);
    });
    itemCard.appendChild(choicesWrap);

    // Explanation
    if (q.explanation) {
      var explBox = document.createElement('div');
      explBox.className = 'explanation-box';

      var explLabel = document.createElement('div');
      explLabel.className = 'explanation-label';
      explLabel.textContent = '📖 Explanation';
      explBox.appendChild(explLabel);

      var paragraphs = q.explanation.split(/\\n/);
      paragraphs.forEach(function (para) {
        para = para.trim();
        if (!para) return;
        var p = document.createElement('p');
        p.className = 'explanation-text';
        p.textContent = para;
        explBox.appendChild(p);
      });

      itemCard.appendChild(explBox);
    }

    listContainer.appendChild(itemCard);
  });

  // Typeset math on the new review items
  typesetMath([listContainer]);
}

function typesetMath(elements) {
  if (window.MathJax && MathJax.startup) {
    MathJax.startup.promise.then(function () {
      MathJax.typesetPromise(elements.filter(Boolean));
    });
  }
}

function formatDuration(ms) {
  var totalSec = Math.floor(ms / 1000);
  var m = Math.floor(totalSec / 60);
  var s = totalSec % 60;
  if (m === 0) return s + 's';
  return m + 'm ' + (s < 10 ? '0' : '') + s + 's';
}
