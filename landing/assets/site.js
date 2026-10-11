(function () {
  var site = document.getElementById('site');
  var LANGS = ['en', 'ru', 'kk'];

  function setLang(lang, save) {
    if (LANGS.indexOf(lang) < 0) lang = 'en';
    site.setAttribute('data-lang', lang);
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-set]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-set') === lang));
    });
    if (save) { try { localStorage.setItem('lang', lang); } catch (e) {} }
  }

  function initialLang() {
    var hash = (location.hash || '').slice(1);
    if (hash === 'kz') hash = 'kk';
    if (LANGS.indexOf(hash) >= 0) return hash;
    try { var s = localStorage.getItem('lang'); if (s) return s; } catch (e) {}
    var nav = (navigator.language || 'en').slice(0, 2).toLowerCase();
    return LANGS.indexOf(nav) >= 0 ? nav : 'en';
  }

  document.querySelectorAll('[data-set]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-set'), true); });
  });
  setLang(initialLang(), false);

  // Photo strip appears once any photo loads
  var strip = document.getElementById('strip');
  if (strip) {
    strip.querySelectorAll('img').forEach(function (img) {
      function shown() { strip.hidden = false; }
      if (img.complete && img.naturalWidth) shown();
      img.addEventListener('load', shown);
      img.addEventListener('error', function () { img.remove(); });
    });
  }

  var copyBtn = document.getElementById('copy-email');
  var email = document.getElementById('email');
  if (copyBtn && email) {
    var DONE = { en: 'Copied', ru: 'Скопировано', kk: 'Көшірілді' };
    copyBtn.addEventListener('click', function () {
      var lang = site.getAttribute('data-lang');
      var original = copyBtn.innerHTML;
      function done() {
        copyBtn.textContent = DONE[lang] || DONE.en;
        setTimeout(function () { copyBtn.innerHTML = original; }, 1600);
      }
      function selectText() {
        var r = document.createRange(); r.selectNodeContents(email);
        var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email.textContent.trim()).then(done, selectText);
      } else {
        selectText();
      }
    });
  }
})();
