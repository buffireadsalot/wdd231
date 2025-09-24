// scripts/form-action.js

// Wire footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Normalize to Buffin Library book fields
const fields = [
  'title', 'author', 'isbn', 'publisher', 'year',
  'genre', 'format', 'location', 'notes', 'rating'
];

// Read query params from form submission (?title=...&author=... etc.)
const params = new URLSearchParams(location.search);
const record = Object.fromEntries(fields.map(k => [k, (params.get(k) || '').trim()]));

// Pretty view
const pretty = document.getElementById('pretty');
pretty.innerHTML = `
  <ul>
    ${fields.map(k => `<li><strong>${escapeHtml(labelize(k))}:</strong> ${escapeHtml(record[k]) || '—'}</li>`).join('')}
  </ul>
`;

// --- SQL INSERT ---
// Basic escaping for demonstration purposes (server-side should still sanitize)
function sqlEscape(str) { return String(str).replaceAll("'", "''"); }
const sql = `INSERT INTO books (title, author, isbn, publisher, year, genre, format, location, notes, rating)
VALUES ('${sqlEscape(record.title)}','${sqlEscape(record.author)}','${sqlEscape(record.isbn)}','${sqlEscape(record.publisher)}',${numOrNull(record.year)},'${sqlEscape(record.genre)}','${sqlEscape(record.format)}','${sqlEscape(record.location)}','${sqlEscape(record.notes)}','${sqlEscape(record.rating)}');`;

document.getElementById('sql').textContent = sql;

// Copy SQL button
document.getElementById('copy-sql').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(sql);
    flash('SQL copied to clipboard.');
  } catch {
    flash('Copy failed. Select and copy manually.');
  }
});

// --- Downloads (JSON & CSV) ---
document.getElementById('dl-json').addEventListener('click', () => {
  download('book.json', JSON.stringify(record, null, 2), 'application/json');
});

document.getElementById('dl-csv').addEventListener('click', () => {
  const header = fields.join(',');
  const row = fields.map(k => csvEscape(record[k])).join(',');
  download('book.csv', header + '\n' + row + '\n', 'text/csv');
});

// --- Helpers ---
function numOrNull(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 'NULL';
}

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
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
}

function labelize(k) {
  // turn 'first_publish_year' or 'genre' into 'First Publish Year' / 'Genre'
  return k.replace(/[_-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
