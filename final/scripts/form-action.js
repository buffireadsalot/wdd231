// scripts/form-action.js

// ---- Footer year ----
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---- Fields to display / export ----
const fields = [
  'title', 'author', 'isbn', 'publisher', 'year',
  'genre', 'format', 'location', 'notes', 'rating'
];

// ---- Read form query params (?title=...&author=... etc.) ----
const params = new URLSearchParams(location.search);
const recordRaw = Object.fromEntries(
  fields.map(k => [k, (params.get(k) || '').trim()])
);

// ---- Pretty view (already on your page) ----
const pretty = document.getElementById('pretty');
if (pretty) {
  pretty.innerHTML = `
    <ul>
      ${fields.map(k => `<li><strong>${escapeHtml(labelize(k))}:</strong> ${escapeHtml(recordRaw[k]) || '—'}</li>`).join('')}
    </ul>
  `;
}

// ---- Build a normalized record for the shelf (stable ID) ----
const id = recordRaw.isbn
  ? `isbn:${recordRaw.isbn}`
  : `${recordRaw.title || 'untitled'}:${recordRaw.year || ''}:${Date.now()}`;

const record = {
  id,
  key: null, // manual entries have no Open Library work/edition key
  title: recordRaw.title || 'Untitled',
  authors: recordRaw.author || '—',
  year: recordRaw.year ? Number(recordRaw.year) : null,
  editionCount: 1,
  isbn: recordRaw.isbn || null,
  cover_i: null, // library page will try isbn cover; else your placeholder
  publisher: recordRaw.publisher || null,
  genre: recordRaw.genre || null,
  format: recordRaw.format || null,
  location: recordRaw.location || null,
  notes: recordRaw.notes || null,
  rating: recordRaw.rating || null,
  favorite: false,
  addedAt: Date.now(),
};

// ---- LocalStorage shelf helpers ----
const SHELF_KEY = 'bb:shelf';
function getShelf() {
  try { return JSON.parse(localStorage.getItem(SHELF_KEY)) || []; }
  catch { return []; }
}
function saveShelf(arr) {
  localStorage.setItem(SHELF_KEY, JSON.stringify(arr));
  return arr;
}

// ---- Honor the Add-to-Shelf checkbox (you included a hidden 0 + checked 1) ----
// books.html has: <input type="hidden" name="addtoshelf" value="0">
//                 <input type="checkbox" name="addtoshelf" value="1" checked>
const vals = params.getAll('addtoshelf');             // ["0"] or ["0","1"]
const shouldAdd = vals[vals.length - 1] === '1';

if (shouldAdd) {
  const shelf = getShelf();
  if (!shelf.some(b => b.id === record.id)) {
    saveShelf([...shelf, record]);
    const status = document.getElementById('status');
    if (status) status.textContent = `Added “${record.title}” to your shelf.`;
  }
}

// ---- SQL (for your export section) ----
function sqlEscape(str) { return String(str).replaceAll("'", "''"); }
function numOrNull(v) { const n = Number(v); return Number.isFinite(n) ? n : 'NULL'; }

const sql = `INSERT INTO books (title, author, isbn, publisher, year, genre, format, location, notes, rating)
VALUES ('${sqlEscape(recordRaw.title)}','${sqlEscape(recordRaw.author)}','${sqlEscape(recordRaw.isbn)}','${sqlEscape(recordRaw.publisher)}',${numOrNull(recordRaw.year)},'${sqlEscape(recordRaw.genre)}','${sqlEscape(recordRaw.format)}','${sqlEscape(recordRaw.location)}','${sqlEscape(recordRaw.notes)}','${sqlEscape(recordRaw.rating)}');`;

const sqlEl = document.getElementById('sql');
if (sqlEl) sqlEl.textContent = sql;

document.getElementById('copy-sql')?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(sql);
    flash('SQL copied to clipboard.');
  } catch {
    flash('Copy failed. Select and copy manually.');
  }
});

// ---- Downloads (JSON & CSV) ----
document.getElementById('dl-json')?.addEventListener('click', () => {
  download('book.json', JSON.stringify(recordRaw, null, 2), 'application/json');
});
document.getElementById('dl-csv')?.addEventListener('click', () => {
  const header = fields.join(',');
  const row = fields.map(k => csvEscape(recordRaw[k])).join(',');
  download('book.csv', header + '\n' + row + '\n', 'text/csv');
});

// ---- small helpers ----
function download(filename, text, type = 'text/plain;charset=utf-8') {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function csvEscape(str) {
  const s = String(str ?? '');
  return /[",\n]/.test(s) ? '"' + s.replaceAll('"', '""') + '"' : s;
}
function escapeHtml(s = '') {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function labelize(k) {
  return k.replace(/[_-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
function flash(msg) {
  const p = document.createElement('p');
  p.textContent = msg;
  p.className = 'status';
  (document.querySelector('main') || document.body).prepend(p);
  setTimeout(() => p.remove(), 1800);
}
