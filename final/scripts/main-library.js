import { getShelf, setShelf, getPrefs, setPrefs } from './store.js';
import { renderShelf, setYear, wireMenu, toggleView } from './ui.js';


const shelfEl = document.getElementById('shelf');
const statusEl = document.getElementById('status');
const filterAuthor = document.getElementById('filter-author');
const filterYear = document.getElementById('filter-year');
const onlyFavs = document.getElementById('only-favorites');
const toggleBtn = document.getElementById('toggle-view');
const clearBtn = document.getElementById('clear-shelf');


setYear();
wireMenu();


function applyFilters() {
const shelf = getShelf();
const prefs = getPrefs();
const favs = prefs.favorites || {};
const a = (filterAuthor.value || '').toLowerCase();
const y = parseInt(filterYear.value || '0', 10);


const filtered = shelf.filter(d => {
const authors = (d.author_name || []).join(', ').toLowerCase();
const passAuthor = !a || authors.includes(a);
const passYear = !y || (d.first_publish_year || 0) >= y;
const key = d.key || (d.isbn?.[0] ? `isbn:${d.isbn[0]}` : '');
const passFav = !onlyFavs.checked || !!favs[key];
return passAuthor && passYear && passFav;
});


renderShelf(filtered, shelfEl);
statusEl.hidden = false;
statusEl.textContent = filtered.length ? `Showing ${filtered.length} book(s)` : 'No books match your filters';
}


filterAuthor.addEventListener('input', applyFilters);
filterYear.addEventListener('input', applyFilters);
onlyFavs.addEventListener('change', applyFilters);


document.getElementById('toggle-view').addEventListener('click', () => toggleView(shelfEl, toggleBtn));


clearBtn.addEventListener('click', () => {
if (confirm('Clear your entire shelf?')) {
setShelf([]);
applyFilters();
}
});


// initial render
applyFilters();