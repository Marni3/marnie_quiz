/* state.js — thin sessionStorage wrapper shared across all pages */
var MQ = {
  set: function(key, val) {
    try { sessionStorage.setItem('mq_' + key, JSON.stringify(val)); } catch(e) { console.warn('MQ.set failed', e); }
  },
  get: function(key) {
    try { var v = sessionStorage.getItem('mq_' + key); return v !== null ? JSON.parse(v) : null; } catch(e) { return null; }
  },
  clear: function() {
    Object.keys(sessionStorage).filter(function(k) { return k.startsWith('mq_'); })
      .forEach(function(k) { sessionStorage.removeItem(k); });
  }
};

/* Theme — persisted in localStorage, applied immediately */
var MQ_THEME = {
  current: localStorage.getItem('mq-theme') || 'dark',
  apply: function(t) {
    this.current = t;
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('mq-theme', t);
    this._updateToggles();
  },
  toggle: function() { this.apply(this.current === 'dark' ? 'light' : 'dark'); },
  _updateToggles: function() {
    var isDark = this.current === 'dark';
    document.querySelectorAll('.theme-toggle').forEach(function(btn) {
      var label = btn.querySelector('.theme-label');
      var sun   = btn.querySelector('.icon-sun');
      var moon  = btn.querySelector('.icon-moon');
      if (label) label.textContent = isDark ? 'Light mode' : 'Dark mode';
      if (sun)  sun.style.display  = isDark ? 'none' : '';
      if (moon) moon.style.display = isDark ? '' : 'none';
    });
  }
};

/* Apply theme immediately before page renders */
document.documentElement.setAttribute('data-theme', MQ_THEME.current);
