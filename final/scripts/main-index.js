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
const loadMore  = document.getElementById('load-more');

// simple state for pagination
const state = { title: '', author: '', q: '', page: 1, docs: [], total: 0 };


// Apply saved view right away (defaults to grid)
applySavedView(results, toggleBtn);

// Handle search submits (single listener)
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // if you have title/author inputs, keep them; otherwise q is fine
  state.title = (titleInput?.value || '').trim();
  state.author = (authorInput?.value || '').trim();
  state.q = (!state.title && !state.author) ? (q?.value || '').trim() : '';
  state.page = 1;
  state.docs = [];
  state.total = 0;

  await fetchAndRenderPage(1);
});

// Load more
loadMore?.addEventListener('click', async () => {
  loadMore.disabled = true;
  await fetchAndRenderPage(state.page + 1);
});


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
async function fetchAndRenderPage(page) {
  if (!state.q && !state.title && !state.author) return;

  statusEl.hidden = false;
  statusEl.textContent = page === 1 ? 'Searching…' : 'Loading more…';
  statusEl.setAttribute('aria-busy', 'true');

  // request 20 per page
  const data = await searchBooks({
    title: state.title,
    author: state.author,
    q: state.q,
    limit: 20,
    page
  });

  const batch = (data.docs || []).slice(0, 20);
  if (page === 1) {
    state.docs = batch;
    state.total = data.numFound ?? batch.length;
  } else {
    state.docs = state.docs.concat(batch);
  }
  state.page = page;

  // re-render everything with accumulated docs
  renderDocs(state.docs, results);
  results._docs = state.docs; // keep for "Add to Shelf" handler

  // status + button visibility
  const shown = state.docs.length;
  statusEl.textContent = shown ? `Showing ${shown} of ${state.total}` : 'No results';
  statusEl.setAttribute('aria-busy', 'false');

  // show Load More only if there are more to fetch and we actually got a batch
  const hasMore = shown < state.total && batch.length > 0;
  loadMore.hidden = !hasMore;
  loadMore.disabled = false;
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
