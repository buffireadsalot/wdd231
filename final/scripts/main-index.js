// scripts/main-index.js
import { searchBooks } from './api.js';
import { renderDocs, toggleView, applySavedView } from './ui.js';

const form = document.getElementById('search-form');
const q = document.getElementById('q');                // optional single search box
const titleInput = document.getElementById('title');   // optional structured inputs
const authorInput = document.getElementById('author');

const results = document.getElementById('results');
const statusEl = document.getElementById('status');
const toggleBtn = document.getElementById('toggle-view');

// Apply saved view right away (defaults to grid)
applySavedView(results, toggleBtn);

// Handle search submits (single listener)
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Use structured if present; else fall back to q
  const title = (titleInput?.value || '').trim();
  const author = (authorInput?.value || '').trim();
  const query  = (q?.value || '').trim();

  statusEl.hidden = false;
  statusEl.textContent = 'Searching…';
  statusEl.setAttribute('aria-busy', 'true');

  const data = await searchBooks({
    title,
    author,
    q: (!title && !author) ? query : '',
    limit: 20,
    page: 1
  });

  const docs = (data.docs || []).slice(0, 20);
  renderDocs(docs, results);
  // keep a reference to the docs for this search
  results._docs = docs;

  // disable “Add” buttons for items already in shelf
  syncAddButtons();

  statusEl.textContent = docs.length
    ? `Showing ${docs.length} of ${data.numFound ?? docs.length}`
    : 'No results';
  statusEl.setAttribute('aria-busy', 'false');
});

// Grid/List toggle (single listener)
toggleBtn?.addEventListener('click', () => toggleView(results, toggleBtn));

// Event delegation for Add to Shelf
results.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-add]');
  if (!btn) return;

  // find this card's doc by index in the current results
  const card = btn.closest('.card');
  const idx = Array.from(results.querySelectorAll('.card')).indexOf(card);
  const docs = results._docs || [];
  const doc = docs[idx];
  if (!doc) return;

  // normalize and save
  const record = normalizeDoc(doc);
  const shelf = getShelf();
  if (!shelf.some(b => b.id === record.id)) {
    shelf.push({ ...record, favorite: false, addedAt: Date.now() });
    saveShelf(shelf);
  }

  // update UI
  btn.textContent = 'In Shelf';
  btn.disabled = true;
  flash(`Added “${record.title}” to your shelf.`);
});

// ---- Shelf helpers (localStorage) ----
const SHELF_KEY = 'bb:shelf';

function getShelf() {
  try { return JSON.parse(localStorage.getItem(SHELF_KEY)) || []; }
  catch { return []; }
}
function saveShelf(arr) {
  localStorage.setItem(SHELF_KEY, JSON.stringify(arr));
  return arr;
}

// Normalize an Open Library doc into our compact record
function normalizeDoc(d) {
  const id =
    d.key ||
    (Array.isArray(d.isbn) && d.isbn.length ? `isbn:${d.isbn[0]}` : `${d.title || 'untitled'}:${d.first_publish_year || ''}`);

  return {
    id,
    key: d.key || null,
    title: d.title || 'Untitled',
    authors: (d.author_name || []).join(', '),
    year: d.first_publish_year ?? null,
    editionCount: d.edition_count ?? 0,
    isbn: Array.isArray(d.isbn) && d.isbn.length ? d.isbn[0] : null,
    cover_i: d.cover_i ?? null,
  };
}

// Disable Add buttons for items already in shelf (run after render)
function syncAddButtons() {
  const shelf = getShelf();
  const ids = new Set(shelf.map(b => b.id));
  const docs = results._docs || [];
  results.querySelectorAll('.card').forEach((card, idx) => {
    const doc = docs[idx];
    if (!doc) return;
    const id = normalizeDoc(doc).id;
    const btn = card.querySelector('[data-add]');
    if (btn && ids.has(id)) {
      btn.textContent = 'In Shelf';
      btn.disabled = true;
    }
  });
}

// Small toast message
function flash(msg) {
  const p = document.createElement('p');
  p.textContent = msg;
  p.style.margin = '0.5rem 0';
  p.style.color = '#b8ffc1';
  statusEl.before(p);
  setTimeout(() => p.remove(), 1600);
}
