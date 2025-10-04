// /chamber/scripts/discover.js
'use strict';

document.addEventListener('DOMContentLoaded', init);

async function init() {
  renderVisitMessage();
  await loadCards();        // builds the 8 cards
  wireModal();              // close buttons / ESC
}
// close any dialog when a [data-close] is clicked
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-close]');
  if (!btn) return;
  const dlg = btn.closest('dialog');
  if (dlg?.open) {
    e.preventDefault();
    dlg.close();
  }
});

// ESC key still closes
document.querySelectorAll('dialog').forEach(dlg => {
  dlg.addEventListener('cancel', () => dlg.close());
});

/* ---------- Visit message via localStorage ---------- */
function renderVisitMessage() {
  const key = 'discoverLastVisit';
  const msgEl = document.getElementById('visitMessage');
  if (!msgEl) return;

  const now = Date.now();
  const last = Number(localStorage.getItem(key));

  if (!last) {
    msgEl.textContent = 'Welcome! Let us know if you have any questions.';
  } else {
    const dayMs = 24 * 60 * 60 * 1000;
    const diff  = now - last;
    if (diff < dayMs) {
      msgEl.textContent = 'Back so soon! Awesome!';
    } else {
      const days = Math.floor(diff / dayMs);
      msgEl.textContent = days === 1
        ? 'You last visited 1 day ago.'
        : `You last visited ${days} days ago.`;
    }
  }
  localStorage.setItem(key, String(now));
}

/* -------------- Load and render 8 cards -------------- */
async function loadCards() {
  const container = document.getElementById('cards');
  if (!container) return;

  try {
    // JSON lives in /chamber/scripts/
    const res = await fetch('scripts/discover.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const items = Array.isArray(data.items) ? data.items : [];

    // Build cards: Title → Image → Description → Button
   container.innerHTML = items.map(it => `
  <article class="panel card area-${escapeAttr(it.id)}" data-id="${escapeAttr(it.id)}">
    <h2 class="card-title">${escapeHtml(it.name)}</h2>

    <figure class="card-figure">
      <img src="${escapeAttr(it.image)}" alt="${escapeAttr(it.name)}"
           width="300" height="200" loading="lazy" decoding="async">
      <figcaption class="sr-only">${escapeHtml(it.name)}</figcaption>
    </figure>

    <p class="card-desc">${escapeHtml(it.desc)}</p>

    <address class="card-address">
      ${escapeHtml(it.address || '')}
    </address>

    <button
      type="button"
      class="btn learn"
      data-learn="${escapeAttr(it.id)}"
      aria-label="Learn more about ${escapeAttr(it.name)}"
    >Learn More</button>
  </article>
`).join('');



    // Event delegation for Learn More (robust if cards re-render)
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-learn]');
      if (!btn) return;
      const id = btn.getAttribute('data-learn');
      const item = items.find(x => String(x.id) === String(id));
      if (item) openDetail(item);
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = `<p role="alert">Unable to load discovery items.</p>`;
  }
}

/* ------------------- Modal helpers ------------------- */
function wireModal() {
  const dlg = document.getElementById('detailModal');
  if (!dlg) return;

  const closeBtn = dlg.querySelector('[data-close]');
  closeBtn?.addEventListener('click', () => dlg.close());
  dlg.addEventListener('cancel', () => dlg.close()); // ESC
}

function openDetail(item) {
  const dlg   = document.getElementById('detailModal');
  const img   = document.getElementById('detailImg');
  const title = document.getElementById('detailTitle');
  const cap   = document.getElementById('detailCaption');
  const addr  = document.getElementById('detailAddr');
  const desc  = document.getElementById('detailDesc');
  const attr  = document.getElementById('attribution'); // optional

  if (!dlg || typeof dlg.showModal !== 'function') return;

  // Text content
  if (title) title.textContent = item?.name || 'Details';
  if (cap)   cap.textContent   = item?.name || '';
  if (addr)  addr.textContent  = item?.address || '';
  if (desc)  desc.textContent  = item?.desc || '';
  if (attr)  attr.textContent  = item?.attribution || '';

  // Image (fallback: keep whatever placeholder the HTML has)
  if (img) {
    img.alt = item?.name || 'Selected place photo';
    if (item?.image) img.src = item.image;
  }

  dlg.showModal();
}

/* ------------------- tiny sanitizer ------------------ */
function escapeHtml(s) {
  return String(s ?? '')
    .replaceAll('&','&amp;').replaceAll('<','&lt;')
    .replaceAll('>','&gt;').replaceAll('"','&quot;')
    .replaceAll("'",'&#39;');
}
function escapeAttr(s) { return escapeHtml(s); }
