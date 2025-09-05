// ===== Hamburger / nav toggle =====
const navButton = document.querySelector('#nav-button');   // must match your HTML id
const navMenu   = document.getElementById('primaryNav');   // must match the <ul> id

if (navButton && navMenu) {
  // ARIA hookup (good for a11y and consistent state)
  navButton.setAttribute('aria-controls', 'primaryNav');
  navButton.setAttribute('aria-expanded', 'false');
  navButton.setAttribute('aria-label', 'Open menu');

  navButton.addEventListener('click', () => {
    // toggle menu visibility
    const open = navMenu.classList.toggle('show');

    // toggle button state — drives the CSS icon swap
    navButton.classList.toggle('show', open);

    // keep ARIA in sync
    navButton.setAttribute('aria-expanded', String(open));
    navButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  // close the menu after choosing a link (mobile nicety)
  navMenu.addEventListener('click', (e) => {
    if (!e.target.closest('a')) return;
    navMenu.classList.remove('show');
    navButton.classList.remove('show');
    navButton.setAttribute('aria-expanded', 'false');
    navButton.setAttribute('aria-label', 'Open menu');
  });
}


// Wayfinding: mark current page link
const here = location.pathname.replace(/\/index\.html?$/i, '/');
document.querySelectorAll('#primaryNav a').forEach(a => {
  const href = new URL(a.getAttribute('href'), location.origin).pathname;
  if (href === here) a.setAttribute('aria-current','page');
});

// Footer dynamic text
const yearEl = document.getElementById('currentyear');
const modEl = document.getElementById('lastModified');
if (yearEl) yearEl.textContent = new Date().getFullYear();
if (modEl) modEl.textContent = document.lastModified;
