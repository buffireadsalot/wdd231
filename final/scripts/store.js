const KEY = 'personal-library-state';


export function loadState() {
try { return JSON.parse(localStorage.getItem(KEY) || '{}'); }
catch { return {}; }
}


export function saveState(state) {
localStorage.setItem(KEY, JSON.stringify(state));
}


export function getShelf() {
const s = loadState();
return s.shelf || [];
}


export function setShelf(shelf) {
const s = loadState();
s.shelf = shelf;
saveState(s);
}


export function getPrefs() {
const s = loadState();
return s.prefs || { view: 'grid', favorites: {} };
}


export function setPrefs(prefs) {
const s = loadState();
s.prefs = prefs;
saveState(s);
}