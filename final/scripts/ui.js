// scripts/ui.js
import { coverUrl } from './api.js';

// ---------- RENDER RESULTS ----------
export function renderDocs(docs, container) {
  // ensure a layout class is present
  if (!container.classList.contains('grid') && !container.classList.contains('list')) {
    container.classList.add('grid'); // default
  }

  container.innerHTML = docs.map(d => `
    <article class="card">
      <img src="${coverUrl(d)}" alt="Cover of ${escapeHtml(d.title || 'Unknown')}" loading="lazy">
      <h3>${escapeHtml(d.title || 'Untitled')}</h3>
      <p><strong>Author:</strong> ${escapeHtml((d.author_name || []).join(', ') || '—')}</p>
      <p><strong>First published:</strong> ${d.first_publish_year ?? '—'}</p>
      <p><strong>Editions:</strong> ${d.edition_count ?? 0}</p>
      <div class="actions">
        <button data-add='${encodeURIComponent(d.key || '')}'>Add to Shelf</button>
        <button data-details='${encodeURIComponent(d.key || '')}'>Details</button>
      </div>
    </article>
  `).join('');
}

// const VIEW_KEY = 'viewMode';
// export function toggleView(container, button)
// {
//   const isGrid = container.classList.contains('grid');
//   const next = isGrid ? 'list' : 'grid'; setView(container, button, next);
// }
// export function applySavedView(container, button)
// {
//   const saved = localStorage.getItem(VIEW_KEY);
//   const mode = saved === 'list' ? 'list' : 'grid'; setView(container, button, mode, /*skipSave=*/true);
// }
// function setView(container, button, mode, skipSave = false)
// {
//   container.classList.toggle('grid', mode === 'grid');
//   container.classList.toggle('list', mode === 'list');
//   if (button) {
//     button.dataset.view = mode; button.setAttribute('aria-pressed', String(mode === 'list'));
//     button.title = mode === 'grid' ? 'Switch to list view' : 'Switch to grid view';
//     button.textContent = mode === 'grid' ? 'List View' : 'Grid View';
//   }
//   if (!skipSave) localStorage.setItem(VIEW_KEY, mode);
// }
// ---------- VIEW TOGGLING ----------
const VIEW_KEY = 'viewMode'; // 'grid' | 'list'

/**
 * Toggle between grid and list layouts.
 * Also updates button text/state and saves the preference.
 */
export function toggleView(container, button) {
  const isGrid = container.classList.contains('grid');
  const next = isGrid ? 'list' : 'grid';
  setView(container, button, next);
}

/**
 * Apply saved view on load (or default to grid).
 */
export function applySavedView(container, button) {
  const saved = localStorage.getItem(VIEW_KEY);
  const initial = (saved === 'list' || saved === 'grid') ? saved : 'grid';
  setView(container, button, initial, /*skipSave=*/true);
}

// Internal helper to set view and sync UI
function setView(container, button, mode, skipSave = false) {
  container.classList.toggle('grid', mode === 'grid');
  container.classList.toggle('list', mode === 'list');

  if (button) {
    button.dataset.view = mode;
    button.setAttribute('aria-pressed', String(mode === 'list')); // pressed = list
    button.title = mode === 'grid' ? 'Switch to list view' : 'Switch to grid view';
    button.textContent = mode === 'grid' ? 'List View' : 'Grid View';
  }

  if (!skipSave) localStorage.setItem(VIEW_KEY, mode);
}

// ---------- UTILS ----------
function escapeHtml(s = '') {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
}
