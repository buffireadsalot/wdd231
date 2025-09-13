// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const header = document.querySelector('.site-header');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const open = header.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

// Footer dates
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const lastModifiedEl = document.getElementById('lastModified');
if (lastModifiedEl) {
  const lastModDate = new Date(document.lastModified);

  // Human-friendly text
  lastModifiedEl.textContent = lastModDate.toLocaleString();

  // Valid ISO 8601 format for the datetime attribute
  lastModifiedEl.setAttribute('datetime', lastModDate.toISOString());
}
