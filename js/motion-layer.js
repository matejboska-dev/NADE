/* NADE motion layer: GSAP (+ ScrollTrigger) for the hero intro and scroll reveals,
   Motion (Framer Motion's engine for plain HTML) for springs, the language menu and the headings' second half.
   Nothing is hidden in CSS: if a library fails to load, the page stays fully visible. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var video = document.querySelector('.hero-x__video');
  if (reduce) { if (video) { video.removeAttribute('autoplay'); video.pause(); } return; }

  var gsap = window.gsap, ST = window.ScrollTrigger;
  if (gsap && ST) {
    gsap.registerPlugin(ST);
    var radius = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--r-lg')) || 8;

    // 1. the hero, in one timeline
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.nav__bar > *', { y: -14, opacity: 0, duration: .6, stagger: .07, clearProps: 'all' })
      .from('.h1-bold', { yPercent: 70, opacity: 0, duration: 1, clearProps: 'all' }, '-=.3')
      .from('.h1-tile', { scale: .35, rotate: -14, opacity: 0, duration: 1, ease: 'back.out(1.7)', clearProps: 'all' }, '-=.75')
      .from('.h1-light', { yPercent: 70, opacity: 0, duration: 1, clearProps: 'all' }, '-=.8')
      .from('.pills li', { y: 22, opacity: 0, duration: .65, stagger: .08, clearProps: 'all' }, '-=.55')
      .from('.hero-x__cta > *', { y: 18, opacity: 0, duration: .6, stagger: .08, clearProps: 'all' }, '-=.45')
      .from('.hero-x .logo-bar', { opacity: 0, duration: .8, clearProps: 'all' }, '-=.3')
      .from('.hero-x__media', { y: 70, opacity: 0, scale: .95, duration: 1.2, clearProps: 'all' }, '-=.7');

    // the video drifts a little slower than the page
    if (document.querySelector('.hero-x__media')) {
      gsap.to('.hero-x__video', { yPercent: -6, ease: 'none',
        scrollTrigger: { trigger: '.hero-x__media', start: 'top bottom', end: 'bottom top', scrub: .6 } });
    }

    // 2. every section after the hero
    gsap.utils.toArray('main > section:not(.hero-x)').forEach(function (sec) {
      var head = sec.querySelector('.x-head');
      if (head) gsap.from(head, { y: 44, opacity: 0, duration: .9, ease: 'power3.out', clearProps: 'all',
        scrollTrigger: { trigger: head, start: 'top 85%', once: true } });
    });
    ST.batch('.x-proj, .x-cell, .rows > li, .enquiry-form, .x-statement, .x-two > p, .x-clients', {
      start: 'top 88%', once: true,
      onEnter: function (els) { gsap.from(els, { y: 50, opacity: 0, duration: .9, stagger: .12, ease: 'power3.out', clearProps: 'all' }); }
    });
    // pictures open like a shutter inside their frames
    gsap.utils.toArray('.x-proj__img, .x-cell__img, .cert__doc, .x-bigphoto, .side-photo').forEach(function (el) {
      gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0% round ' + radius + 'px)' },
        { clipPath: 'inset(0% 0% 0% 0% round ' + radius + 'px)', duration: 1.1, ease: 'power4.out', clearProps: 'clipPath',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });
    // the close
    var cl = document.querySelector('.x-foot__logo');
    if (cl) gsap.from(cl, { y: 70, opacity: 0, duration: 1.1, ease: 'power3.out', clearProps: 'all',
      scrollTrigger: { trigger: cl, start: 'top 95%', once: true } });
    window.addEventListener('load', function () { ST.refresh(); });
  }

  // 3. Motion: springs, the language menu, the headings' second half
  import('https://cdn.jsdelivr.net/npm/motion@11.18.2/+esm').then(function (m) {
    var animate = m.animate, inView = m.inView;
    var spring = { type: 'spring', stiffness: 420, damping: 24 };
    document.querySelectorAll('.hchip').forEach(function (p) {
      p.addEventListener('pointerenter', function () { animate(p, { y: -4, scale: 1.03 }, spring); });
      p.addEventListener('pointerleave', function () { animate(p, { y: 0, scale: 1 }, spring); });
    });
    document.querySelectorAll('.h1-tile').forEach(function (t) {
      t.addEventListener('pointerenter', function () { animate(t, { rotate: -6, scale: 1.06 }, { type: 'spring', stiffness: 260, damping: 12 }); });
      t.addEventListener('pointerleave', function () { animate(t, { rotate: 0, scale: 1 }, { type: 'spring', stiffness: 260, damping: 16 }); });
    });
    document.querySelectorAll('.x-head h2 .muted').forEach(function (s) {
      inView(s, function () { animate(s, { opacity: [0, 1], y: [10, 0] }, { duration: .7, delay: .25, ease: 'easeOut' }); }, { margin: '0px 0px -12% 0px' });
    });
    var menu = document.querySelector('.lang__menu');
    if (menu) new MutationObserver(function () {
      if (!menu.hidden) animate(menu, { opacity: [0, 1], y: [-8, 0], scale: [.97, 1] }, { type: 'spring', stiffness: 520, damping: 30 });
    }).observe(menu, { attributes: true, attributeFilter: ['hidden'] });
  }).catch(function () { /* offline: the page works without the springs */ });
})();
