// Hamburger toggle + wayfinding
const menuBtn = document.getElementById('menuButton');
const nav = document.getElementById('primaryNav');

if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('show');
    menuBtn.setAttribute('aria-expanded', String(open));
  });

  // Close menu after selecting a link on small screens
  nav.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    nav.classList.remove('show');
    menuBtn.setAttribute('aria-expanded', 'false');
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
