// scripts/main-index.js
import { searchBooks } from './api.js';
import { renderDocs, toggleView, applySavedView } from './ui.js';
import { openModal } from './modal.js';

// ---- Elements ----
const form        = document.getElementById('search-form');
const q           = document.getElementById('q');        // optional single search box
const titleInput  = document.getElementById('title');    // optional structured inputs
const authorInput = document.getElementById('author');
const results     = document.getElementById('results');
const statusEl    = document.getElementById('status');
const toggleBtn   = document.getElementById('toggle-view');
const loadMore    = document.getElementById('load-more');

// ---- State ----
const state = {
  title: '',
  author: '',
  q: '',
  page: 1,
  docs: [],
  total: 0
};

// Apply saved view (defaults to grid)
applySavedView(results, toggleBtn);

// ============ Delegates ============

// Learn More (modal) — delegated click (top-level, define once)
results.addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-learn]');
  if (!btn) return;

  const workKey = btn.getAttribute('data-work');  // e.g., "/works/OL12345W"
  const title   = btn.getAttribute('data-title') || 'Book Details';
  if (!workKey) return;

  // Open once with loading state
  openModal(`<p class="status">Loading details…</p>`, { title });

  // Grab the newly-opened modal's body so we can update it
  const modalRoot = document.getElementById('modal-root');
  const backdrop  = modalRoot?.lastElementChild;
  const bodyEl    = backdrop?.querySelector('.body');

  try {
    const resp = await fetch(`https://openlibrary.org${workKey}.json`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!resp.ok) throw new Error(`Failed to load details (${resp.status})`);
    const data = await resp.json();

    const desc = typeof data.description === 'string'
      ? data.description
      : (data.description?.value || 'No description available.');

    const subjects = Array.isArray(data.subjects) ? data.subjects.slice(0, 8) : [];
    const coverId  = (Array.isArray(data.covers) && data.covers[0]) ? data.covers[0] : null;
    const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : '';

    const html = `
      ${coverUrl ? `<img src="${coverUrl}" alt="${title} cover" width="300" height="450" loading="lazy" decoding="async" style="border-radius:8px;display:block;margin:0 auto 1rem;">` : ''}
      <p>${desc}</p>
      ${subjects.length ? `<p><strong>Subjects:</strong> ${subjects.join(', ')}</p>` : ''}
    `;
    if (bodyEl) bodyEl.innerHTML = html;
  } catch (err) {
    if (bodyEl) bodyEl.innerHTML = `<p class="status">Sorry, we couldn’t load extra details right now.</p>`;
    console.warn('Learn More error:', err);
  }
});

// Add to Shelf — delegated click
results.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-add]');
  if (!btn) return;

  const card = btn.closest('.card');
  const idx  = Array.from(results.querySelectorAll('.card')).indexOf(card);
  const doc  = (results._docs || [])[idx];
  if (!doc) return;

  const record = normalizeDoc(doc);
  const shelf  = getShelf();
  if (!shelf.some(b => b.id === record.id)) {
    shelf.push({ ...record, favorite: false, addedAt: Date.now() });
    saveShelf(shelf);
  }

  btn.textContent = 'In Shelf';
  btn.disabled = true;
});

// Toggle grid/list
toggleBtn?.addEventListener('click', () => toggleView(results, toggleBtn));

// Load more
loadMore?.addEventListener('click', async () => {
  loadMore.disabled = true;
  try {
    await fetchAndRenderPage(state.page + 1);
  } catch (err) {
    console.warn('Load-more error:', err);
    setStatus('Could not load more results. Please try again.');
  } finally {
    loadMore.disabled = false;
  }
});

// ============ Submit ============

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Read inputs (support both structured and single search box)
  state.title  = (titleInput?.value || '').trim();
  state.author = (authorInput?.value || '').trim();
  state.q      = (!state.title && !state.author) ? (q?.value || '').trim() : '';
  state.page   = 1;
  state.docs   = [];
  state.total  = 0;

  try {
    await fetchAndRenderPage(1);
  } catch (err) {
    console.warn('Submit flow error:', err);
    setStatus('Search failed. Please try again.');
  }
});

// ============ Data Fetch + Render ============

async function fetchAndRenderPage(page) {
  // Block if nothing to search for
  if (!state.q && !state.title && !state.author) {
    setStatus('Enter a search to begin.', false);
    return;
  }

  // Busy status
  statusEl.hidden = false;
  setStatus(page === 1 ? 'Searching…' : 'Loading more…', true);

  try {
    // Request 20 per page
    const data = await searchBooks({
      title: state.title,
      author: state.author,
      q: state.q,
      limit: 20,
      page
    });

    const batch = (data?.docs || []).slice(0, 20);

    if (page === 1) {
      state.docs  = batch;
      state.total = data?.numFound ?? batch.length;
    } else {
      state.docs = state.docs.concat(batch);
    }
    state.page = page;

    renderDocs(state.docs, results);
    results._docs = state.docs;      // expose for delegates
    syncAddButtons();                // disable "Add" if already on shelf

    const shown = state.docs.length;
    setStatus(shown ? `Showing ${shown} of ${state.total}` : 'No results', false);

    const hasMore = shown < state.total && batch.length > 0;
    loadMore.hidden = !hasMore;
    loadMore.disabled = false;
  } catch (err) {
    console.error('Search fetch failed:', err);
    setStatus('Sorry, something went wrong while searching. Please try again.', false);
    loadMore.hidden = true;
    loadMore.disabled = true;
    throw err;
  }
}

// ============ Helpers ============

const SHELF_KEY = 'bb:shelf';

function getShelf() {
  try {
    return JSON.parse(localStorage.getItem(SHELF_KEY)) || [];
  } catch {
    return [];
  }
}

function saveShelf(arr) {
  try {
    localStorage.setItem(SHELF_KEY, JSON.stringify(arr));
  } catch (e) {
    console.warn('localStorage save failed:', e);
  }
  return arr;
}

function normalizeDoc(d) {
  const id =
    d.key ||
    (Array.isArray(d.isbn) && d.isbn.length
      ? `isbn:${d.isbn[0]}`
      : `${d.title || 'untitled'}:${d.first_publish_year || ''}`);

  return {
    id,
    key: d.key || null,
    title: d.title || 'Untitled',
    authors: (d.author_name || []).join(', '),
    year: d.first_publish_year ?? null,
    editionCount: d.edition_count ?? 0,
    isbn: Array.isArray(d.isbn) && d.isbn.length ? d.isbn[0] : null,
    cover_i: d.cover_i ?? null
  };
}

function syncAddButtons() {
  const shelf = getShelf();
  const ids   = new Set(shelf.map(b => b.id));
  const docs  = results._docs || [];
  results.querySelectorAll('.card').forEach((card, idx) => {
    const doc = docs[idx];
    if (!doc) return;
    const id  = normalizeDoc(doc).id;
    const btn = card.querySelector('[data-add]');
    if (btn && ids.has(id)) {
      btn.textContent = 'In Shelf';
      btn.disabled = true;
    }
  });
}

function setStatus(text, busy = false) {
  statusEl.textContent = text;
  statusEl.setAttribute('aria-busy', String(!!busy));
  statusEl.hidden = false;
}

function flash(msg) {
  const p = document.createElement('p');
  p.textContent = msg;
  p.style.margin = '0.5rem 0';
  p.style.color  = '#b8ffc1';
  statusEl.before(p);
  setTimeout(() => p.remove(), 1600);
}

// ============ Lazy preload (run once after first paint) ============

function onIdle(fn, timeout = 1200) {
  if ('requestIdleCallback' in window) return requestIdleCallback(fn, { timeout });
  return setTimeout(fn, timeout);
}

onIdle(async () => {
  try {
    const existingQ = (new URL(location.href)).searchParams.get('q');
    const seed = existingQ && existingQ.trim() ? existingQ.trim() : 'subject:fiction';

    // Only preload if nothing is rendered yet
    if (!results || results.children.length > 0) return;

    state.title = '';
    state.author = '';
    state.q = seed;
    state.page = 1;
    state.docs = [];
    state.total = 0;

    await fetchAndRenderPage(1);
  } catch (e) {
    console.warn('Preload skipped:', e);
  }
});
