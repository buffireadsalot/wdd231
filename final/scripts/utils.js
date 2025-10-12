// scripts/utils.js
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('[data-nav]');
  const toggle = document.querySelector('[data-nav-toggle]');
  if (!header || !toggle) return;

  toggle.addEventListener('click', () => {
    const open = header.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
});
// Wayfinding: mark the current page in the nav
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('[data-nav], .site-header');
  const nav = document.getElementById('site-nav');
  if (!nav) return;

  // figure out the current file (index.html by default)
  const path = location.pathname.split('/').pop() || 'index.html';

  // mark matching link
  nav.querySelectorAll('a[href]').forEach(a => {
    const href = (a.getAttribute('href') || '').split('#')[0]; // ignore hash
    if (!href) return;

    // treat "/" or "" as index.html too
    const isCurrent = href === path || (path === '' && href === 'index.html');
    if (isCurrent) {
      a.classList.add('current');
      a.setAttribute('aria-current', 'page');
    } else {
      a.classList.remove('current');
      a.removeAttribute('aria-current');
    }

    // Close the mobile menu after a tap/click (nice UX)
    a.addEventListener('click', () => {
      if (!header) return;
      if (header.classList.contains('nav-open')) {
        header.classList.remove('nav-open');
        const toggle = document.querySelector('[data-nav-toggle], #navToggle');
        toggle?.setAttribute('aria-expanded', 'false');
      }
    });
  });
});
