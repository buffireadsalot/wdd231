import { coverUrl } from './api.js';


container.querySelectorAll('.card').forEach(card => {
const key = card.getAttribute('data-key');
const book = list.find(d => (d.key || `isbn:${d.isbn?.[0]}`) === key);
card.querySelector('.details-btn').addEventListener('click', () => openDetails(book));
card.querySelector('.remove-btn').addEventListener('click', () => {
setShelf(getShelf().filter(d => (d.key || `isbn:${d.isbn?.[0]}`) !== key));
card.remove();
});
card.querySelector('.fav-btn').addEventListener('click', (e) => toggleFav(key, e.currentTarget));
});



export function toggleView(container, btn) {
const prefs = getPrefs();
prefs.view = (prefs.view === 'grid') ? 'list' : 'grid';
setPrefs(prefs);
container.classList.toggle('grid');
container.classList.toggle('list');
}


function openDetails(d) {
if (!d) return;
const authors = (d.author_name || []).join(', ');
const img = coverUrl(d);
const html = `
<div style="display:flex; gap:1rem; align-items:flex-start;">
<img src="${img}" alt="Cover of ${escapeHtml(d.title)}" width="128" height="192" />
<div>
<p><strong>Title:</strong> ${escapeHtml(d.title)}</p>
<p><strong>Author(s):</strong> ${escapeHtml(authors)}</p>
<p><strong>First published:</strong> ${d.first_publish_year ?? '—'}</p>
<p><strong>Editions:</strong> ${d.edition_count ?? 0}</p>
${d.isbn?.length ? `<p><strong>ISBN:</strong> ${d.isbn[0]}</p>` : ''}
</div>
</div>`;
openModal(html, { title: 'Book Details' });
}


function addToShelf(d) {
const shelf = getShelf();
const key = d.key || (d.isbn?.[0] ? `isbn:${d.isbn[0]}` : null);
if (!key) return;
if (!shelf.find(x => (x.key || `isbn:${x.isbn?.[0]}`) === key)) {
shelf.push(d);
setShelf(shelf);
}
}


function toggleFav(key, btn) {
const prefs = getPrefs();
const favs = prefs.favorites || {};
favs[key] = !favs[key];
prefs.favorites = favs;
setPrefs(prefs);
btn.textContent = favs[key] ? '★' : '☆';
btn.setAttribute('aria-pressed', String(!!favs[key]));
}


function escapeHtml(s = '') {
return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
}