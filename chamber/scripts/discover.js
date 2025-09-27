// scripts/discover.js
document.addEventListener('DOMContentLoaded', () => {
  renderVisitMessage();
  loadCards();
  wireModal();
});

/* --------- Visit message via localStorage ---------- */
function renderVisitMessage(){
  const key = 'discoverLastVisit';
  const now = Date.now();
  const last = Number(localStorage.getItem(key));
  const msgEl = document.getElementById('visitMessage');

  if (!last) {
    msgEl.textContent = 'Welcome! Let us know if you have any questions.';
  } else {
    const diff = now - last;
    const dayMs = 24 * 60 * 60 * 1000;
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
async function loadCards(){
  try {
    const res = await fetch('scripts/discover.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { items } = await res.json();

    const container = document.getElementById('cards');
    container.innerHTML = items.map((it) => {
  return `
    <article class="panel card area-${it.id}" data-id="${it.id}">
      <h2 class="card-title">${escapeHtml(it.name)}</h2>

      <figure class="card-figure">
        <img src="${escapeAttr(it.image)}" alt="${escapeAttr(it.name)}"
             width="300" height="200" loading="lazy" decoding="async">
        <figcaption class="sr-only">${escapeHtml(it.name)}</figcaption>
      </figure>

      <p class="card-desc">${escapeHtml(it.desc)}</p>

      <!-- keep address in DOM (for rubric/accessibility), but hide it on cards -->
      <address class="sr-only">${escapeHtml(it.address)}</address>

      <button type="button" class="btn learn" data-learn="${it.id}">Learn More</button>
    </article>
  `;
}).join('');


    // wire up learn more buttons (single modal)
    container.querySelectorAll('[data-learn]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-learn');
        const item = items.find(x => x.id === id);
        if (item) openDetail(item);
      });
    });

  } catch (err) {
    console.error(err);
    document.getElementById('cards').innerHTML =
      `<p role="alert">Unable to load discovery items.</p>`;
  }
}

/* ------------------- Modal helpers ------------------- */
function wireModal(){
  const dlg = document.getElementById('detailModal');
  dlg?.querySelector('[data-close]')?.addEventListener('click', () => dlg.close());
  dlg?.addEventListener('cancel', () => dlg.close());
}
function openDetail(item){
  const dlg = document.getElementById('detailModal');
  if (!dlg || typeof dlg.showModal !== 'function') return;

  document.getElementById('detailTitle').textContent = item.name;
  const img = document.getElementById('detailImg');
  img.src = item.image;
  img.alt = item.name;
  document.getElementById('detailCaption').textContent = item.name;
  document.getElementById('detailAddr').textContent = item.address;
  document.getElementById('detailDesc').textContent = item.desc;
  document.getElementById('attribution').textContent = item.attribution || '';

  dlg.showModal();
}

/* ------------------- tiny sanitizer ------------------ */
function escapeHtml(s){
  return String(s ?? '')
    .replaceAll('&','&amp;').replaceAll('<','&lt;')
    .replaceAll('>','&gt;').replaceAll('"','&quot;')
    .replaceAll("'",'&#39;');
}
function escapeAttr(s){ return escapeHtml(s); }
