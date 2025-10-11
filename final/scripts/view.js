// --- Local view toggle (no UI.js changes) ---
const VIEW_KEY = 'viewMode';

function applySavedView(container, button) {
  const saved = localStorage.getItem(VIEW_KEY);
  const mode = saved === 'list' ? 'list' : 'grid';
  setView(container, button, mode, /*skipSave=*/true);
}

function toggleView(container, button) {
  const isGrid = container.classList.contains('grid');
  const next = isGrid ? 'list' : 'grid';
  setView(container, button, next);
}

function setView(container, button, mode, skipSave = false) {
  container.classList.toggle('grid', mode === 'grid');
  container.classList.toggle('list', mode === 'list');

  if (button) {
    button.dataset.view = mode;
    button.setAttribute('aria-pressed', String(mode === 'list'));
    button.title = mode === 'grid' ? 'Switch to list view' : 'Switch to grid view';
    button.textContent = mode === 'grid' ? 'List View' : 'Grid View';
  }
  if (!skipSave) localStorage.setItem(VIEW_KEY, mode);
}
const results   = document.getElementById('results');
const toggleBtn = document.getElementById('toggle-view');

applySavedView(results, toggleBtn);
toggleBtn?.addEventListener('click', () => toggleView(results, toggleBtn));

// same helpers from above (VIEW_KEY/applySavedView/toggleView/setView) pasted here

const shelfEl   = document.getElementById('shelf');
const toggleLib = document.getElementById('toggle-view'); // or #toggle-view-library if that’s your id

applySavedView(shelfEl, toggleLib);
toggleLib?.addEventListener('click', () => toggleView(shelfEl, toggleLib));
