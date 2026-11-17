/* the floating call-to-action: appears after a moment, can be closed for the visit */
(function () {
  var fab = document.querySelector('[data-fab]');
  if (!fab) return;
  var KEY = 'nade-fab-closed';
  try { if (sessionStorage.getItem(KEY)) { fab.hidden = true; return; } } catch (e) {}
  var close = fab.querySelector('.fab__close');
  if (close) close.addEventListener('click', function () {
    fab.hidden = true;
    try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
  });
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !window.gsap) return;
  window.gsap.from(fab, { y: 36, opacity: 0, scale: .96, duration: .9, delay: 2.2, ease: 'power3.out', clearProps: 'all' });
})();
