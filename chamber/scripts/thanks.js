document.addEventListener('DOMContentLoaded', () => {
  const p = new URLSearchParams(location.search);

  const rows = [
    ['First Name', p.get('given-name')],
    ['Last Name',  p.get('family-name')],
    ['Email',      p.get('email')],
    ['Mobile',     p.get('tel')],
    ['Level',      p.get('level')],
    ['Website',    p.get('url')],
    ['Business',   p.get('organization')],
    ['Submitted',  p.get('timestamp')],
  ];

  const dl = document.getElementById('receiptList');
  dl.innerHTML = rows.map(([k,v]) => `
    <dt>${k}</dt><dd>${v ? escapeHtml(v) : '—'}</dd>
  `).join('');
});

function escapeHtml(s){
  return String(s ?? '')
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#39;');
}
