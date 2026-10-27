/* Scripts communs à toutes les pages du site.
   Rien à modifier ici pour mettre à jour le contenu. */

/* ---------- Boutons "Copy" / "Copier" pour les emails ---------- */
document.querySelectorAll('.copy').forEach(function (btn) {
  var label = btn.textContent;
  btn.addEventListener('click', function () {
    var text = btn.getAttribute('data-copy');
    var done = function () {
      btn.textContent = btn.getAttribute('data-done') || 'Copied';
      setTimeout(function () { btn.textContent = label; }, 1800);
    };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(done, function () { window.prompt('', text); });
    } else {
      window.prompt('', text);
    }
  });
});

/* ---------- Liseuse du CV (page CV uniquement) ---------- */
(function () {
  var reader = document.getElementById('reader');
  if (!reader) return;

  var pages = reader.querySelectorAll('.reader-pages img');
  var scroller = reader.querySelector('.reader-pages');
  var current = reader.querySelector('[data-current]');
  var closeBtn = reader.querySelector('[data-close]');
  var lastFocus = null;

  function open(e) {
    if (e) e.preventDefault();
    lastFocus = document.activeElement;
    // charge les images au moment d'ouvrir (page plus légère au départ)
    pages.forEach(function (img) {
      if (!img.src && img.getAttribute('data-src')) img.src = img.getAttribute('data-src');
    });
    reader.classList.add('open');
    reader.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    scroller.scrollTop = 0;
    update();
    closeBtn.focus();
  }

  function close() {
    reader.classList.remove('open');
    reader.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    if (lastFocus) lastFocus.focus();
  }

  // numéro de la page visible
  function update() {
    var middle = scroller.getBoundingClientRect().top + scroller.clientHeight / 2;
    var n = 1;
    pages.forEach(function (img, i) {
      if (img.getBoundingClientRect().top < middle) n = i + 1;
    });
    if (current) current.textContent = n;
  }

  document.querySelectorAll('[data-open-reader]').forEach(function (el) {
    el.addEventListener('click', open);
  });
  closeBtn.addEventListener('click', close);
  scroller.addEventListener('scroll', update, { passive: true });
  scroller.addEventListener('click', function (e) { if (e.target === scroller) close(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && reader.classList.contains('open')) close();
  });
})();
