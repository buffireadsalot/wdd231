// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const header = document.querySelector('.site-header');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const open = header.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}
