import { searchBooks } from './api.js';
import { renderDocs, toggleView } from './ui.js';

const form = document.getElementById('search-form');
const q = document.getElementById('q');                 // single search box
const titleInput = document.getElementById('title');    // optional separate inputs
const authorInput = document.getElementById('author');
const results = document.getElementById('results');
const statusEl = document.getElementById('status');
const toggleBtn = document.getElementById('toggle-view');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Use structured if present; else fallback to q
  const title = titleInput?.value.trim() || '';
  const author = authorInput?.value.trim() || '';
  const query = q?.value.trim() || '';

  statusEl.hidden = false;
  statusEl.textContent = 'Searching…';
  statusEl.setAttribute('aria-busy', 'true');

  const data = await searchBooks({ title, author, q: (!title && !author) ? query : '', limit: 20, page: 1 });
  const docs = (data.docs || []).slice(0, 20);

  renderDocs(docs, results);
  statusEl.textContent = docs.length ? `Showing ${docs.length} of ${data.numFound ?? docs.length}` : 'No results';
  statusEl.setAttribute('aria-busy', 'false');
});

toggleBtn?.addEventListener('click', () => toggleView(results, toggleBtn));
