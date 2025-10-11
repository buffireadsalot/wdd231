// scripts/main-library.js
// Buffin Books — My Library page

/* ========= Local Storage (same key used on Search page) ========= */
const SHELF_KEY = 'bb:shelf';

function getShelf() {
  try { return JSON.parse(localStorage.getItem(SHELF_KEY)) || []; }
  catch { return []; }
}
function saveShelf(arr) {
  localStorage.setItem(SHELF_KEY, JSON.stringify(arr));
  return arr;
}
function toggleFavorite(id) {
  const next = getShelf().map(b => b.id === id ? { ...b, favorite: !b.favorite } : b);
  saveShelf(next);
}
function removeBook(id) {
  saveShelf(getShelf().filter(b => b.id !== id));
}

/* ========= DOM refs (be tolerant if some controls are missing) ========= */
const list      = document.getElementById('shelf');       // container for cards
const countEl   = document.getElementById('count');       // "X book(s)"
const filterFav = document.getElementById('filter-fav');  // checkbox (optional)
const modal     = document.getElementById('confirm-modal');
const yesBtn    = document.getElementById('confirm-yes');
const noBtn     = document.getElementById('confirm-no');
const clearBtn  = document.getElementById('clear-shelf'); // button (optional)

let lastFocus = null;

function openModal() {
  lastFocus = document.activeElement;
  modal.hidden = false;
  noBtn.focus();
  document.addEventListener('keydown', onEsc);
}
function closeModal() {
  modal.hidden = true;
  document.removeEventListener('keydown', onEsc);
  lastFocus?.focus();
}
function onEsc(e) { if (e.key === 'Escape') closeModal(); }

noBtn?.addEventListener('click', closeModal);
yesBtn?.addEventListener('click', () => {
  saveShelf([]);           // your existing clear-all logic
  render();
  closeModal();
});
clearBtn?.addEventListener('click', openModal);

/* ========= Rendering ========= */
function coverUrl(b) {
  if (b.cover_i) return `https://covers.openlibrary.org/b/id/${b.cover_i}-M.jpg`;
  if (b.isbn)    return `https://covers.openlibrary.org/b/isbn/${b.isbn}-M.jpg`;
  return 'images/buffin-books-logo.svg';
}

function escapeHtml(s='') {
  return String(s).replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#39;'
  })[c]);
}

function render() {
  if (!list) return;

  const all = getShelf();
  const books = filterFav?.checked ? all.filter(b => b.favorite) : all;

  // Count + empty state
  if (countEl) countEl.textContent = `${books.length} book${books.length === 1 ? '' : 's'}`;
  if (!books.length) {
    list.innerHTML = `
      <div class="card"><p>No books here yet. Add some from the Search page!</p></div>
    `;
    clearBtn && (clearBtn.disabled = all.length === 0);
    return;
  }

  // Render cards
  list.innerHTML = books.map(b => `
    <article class="card" data-id="${escapeHtml(b.id)}">
      <img src="${coverUrl(b)}" alt="Cover of ${escapeHtml(b.title)}" loading="lazy">
      <h3>${escapeHtml(b.title)}</h3>
      <p><strong>Author:</strong> ${escapeHtml(b.authors || '—')}</p>
      <p><strong>Year:</strong> ${b.year ?? '—'}</p>
      <div class="actions">
        <button class="fav-btn" type="button">${b.favorite ? '★ Favorite' : '☆ Favorite'}</button>
        <button class="remove-btn danger" type="button">Remove</button>
      </div>
    </article>
  `).join('');

  clearBtn && (clearBtn.disabled = all.length === 0);
}

/* ========= Events ========= */
list?.addEventListener('click', (e) => {
  const card = e.target.closest('.card');
  if (!card) return;
  const id = card.getAttribute('data-id');

  if (e.target.classList.contains('remove-btn')) {
    removeBook(id);
    render();
  }
  if (e.target.classList.contains('fav-btn')) {
    toggleFavorite(id);
    render();
  }
});

filterFav?.addEventListener('change', render);

clearBtn?.addEventListener('click', () => {
  if (!confirm('Clear your entire shelf?')) return;
  saveShelf([]);
  render();
});

/* ========= Initial render ========= */
render();
