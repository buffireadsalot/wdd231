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
