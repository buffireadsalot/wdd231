const BASE = 'https://openlibrary.org';

export async function searchBooks({ title = '', author = '', q = '', limit = 20, page = 1 }) {
  // Prefer structured params if provided; otherwise fall back to q
  const params = new URLSearchParams();
  if (title) params.set('title', title);
  if (author) params.set('author', author);
  if (!title && !author && q) params.set('q', q);
  params.set('limit', String(limit));
  params.set('page', String(page));

  const url = `${BASE}/search.json?${params.toString()}`;

  try {
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' } // optional but nice
      // You may add a 'User-Agent' header from a server; browsers set UA automatically
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json(); // { numFound, docs: [...] }
  } catch (err) {
    console.error('Open Library search failed:', err);
     throw err; // bubble to the caller so UI can show an error state;
  }
}

export function coverUrl(doc) {
  const { cover_i, isbn } = doc || {};
  if (cover_i) return `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg`;
  if (isbn?.length) return `https://covers.openlibrary.org/b/isbn/${isbn[0]}-M.jpg`;
  return 'images/buffin-books-logo.svg'; // placeholder
}
