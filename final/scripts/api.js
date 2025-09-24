const BASE = 'https://openlibrary.org';
const COVERS = 'https://covers.openlibrary.org';


export async function searchBooks(query, limit = 20) {
const url = `${BASE}/search.json?q=${encodeURIComponent(query)}&limit=${limit}`;
try {
const res = await fetch(url);
if (!res.ok) throw new Error(`HTTP ${res.status}`);
return await res.json(); // { docs: [...] }
} catch (err) {
console.error('Search failed:', err);
return { docs: [] };
}
}


export function coverUrl({ cover_i, isbn }) {
if (cover_i) return `${COVERS}/b/id/${cover_i}-M.jpg`;
if (isbn && isbn.length) return `${COVERS}/b/isbn/${isbn[0]}-M.jpg`;
return 'images/placeholder.svg';
}