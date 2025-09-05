/* ========= 1) Site name: single source of truth (TOP of file) ========= */
const SITE_NAME = 'Annela Buffin';
const siteNameSpan = document.getElementById('siteName');
if (siteNameSpan) siteNameSpan.textContent = SITE_NAME;

// Append the site name to the page title if it isn't already there
if (!document.title.includes(SITE_NAME)) {
  document.title = document.title ? `${document.title} • ${SITE_NAME}` : SITE_NAME;
}

/* ========= 2) Hamburger / nav toggle ========= */
const navButton = document.querySelector('#nav-button');
const navMenu   = document.getElementById('primaryNav');

if (navButton && navMenu) {
  navButton.setAttribute('aria-controls', 'primaryNav');
  navButton.setAttribute('aria-expanded', 'false');
  navButton.setAttribute('aria-label', 'Open menu');

  navButton.addEventListener('click', () => {
    const open = navMenu.classList.toggle('show');
    navButton.classList.toggle('show', open); // drives ☰ ↔ × via CSS
    navButton.setAttribute('aria-expanded', String(open));
    navButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  navMenu.addEventListener('click', (e) => {
    if (!e.target.closest('a')) return;
    navMenu.classList.remove('show');
    navButton.classList.remove('show');
    navButton.setAttribute('aria-expanded', 'false');
    navButton.setAttribute('aria-label', 'Open menu');
  });
}

/* ========= 3) Wayfinding (active link) ========= */
const here = location.pathname.replace(/\/index\.html?$/i, '/');
document.querySelectorAll('#primaryNav a').forEach(a => {
  const p = new URL(a.getAttribute('href'), location.origin).pathname
              .replace(/\/index\.html?$/i, '/');
  if (p === here) a.setAttribute('aria-current', 'page');
});

/* ========= 4) Footer dates ========= */
const yearEl = document.getElementById('currentyear');
const modEl  = document.getElementById('lastModified');
if (yearEl) yearEl.textContent = new Date().getFullYear();
if (modEl)  modEl.textContent  = document.lastModified;


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
