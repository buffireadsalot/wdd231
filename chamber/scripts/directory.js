const directoryEl = document.getElementById('directory');
const gridBtn = document.getElementById('gridBtn');
const listBtn = document.getElementById('listBtn');

function membershipBadge(level){
  switch (Number(level)) {
    case 3: return { label: 'Gold', cls: 'gold' };
    case 2: return { label: 'Silver', cls: 'silver' };
    default: return { label: 'Member', cls: 'member' };
  }
}

function cardTemplate(m) {
  const badge = membershipBadge(m.membership);
  return `
    <article class="card" tabindex="0">
      <div class="logo">
        <img src="${m.logo}" alt="${m.name} logo" width="72" height="72">
      </div>
      <div>
        <h3>${m.name}
          <span class="badge ${badge.cls}" aria-label="Membership level">${badge.label}</span>
        </h3>
        <div class="tag">${m.tagline ?? ''}</div>
        <div class="meta">
          <div>${m.address}</div>
          <div><a href="tel:${m.phone.replace(/[^+\d]/g,'')}">${m.phone}</a> • <a href="mailto:${m.email}">${m.email}</a></div>
          <div><a href="${m.url}" target="_blank" rel="noopener">Visit Website</a></div>
        </div>
      </div>
    </article>`;
}

async function loadMembers(){
  try{
    const res = await fetch('scripts/members.json', { cache: 'no-store' });
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const html = data.members.map(cardTemplate).join('');
    directoryEl.innerHTML = html;
  }catch(err){
    directoryEl.innerHTML = `<p role="alert">Sorry—members could not be loaded. (${err.message})</p>`;
  }finally{
    directoryEl.setAttribute('aria-busy', 'false');
  }
}

function setView(mode){
  if(mode === 'grid'){
    directoryEl.classList.remove('list');
    directoryEl.classList.add('grid');
    gridBtn.classList.add('active');
    listBtn.classList.remove('active');
    gridBtn.setAttribute('aria-pressed','true');
    listBtn.setAttribute('aria-pressed','false');
    document.querySelectorAll('.card').forEach(c => c.classList.remove('list'));
  }else{
    directoryEl.classList.remove('grid');
    directoryEl.classList.add('list');
    listBtn.classList.add('active');
    gridBtn.classList.remove('active');
    listBtn.setAttribute('aria-pressed','true');
    gridBtn.setAttribute('aria-pressed','false');
    document.querySelectorAll('.card').forEach(c => c.classList.add('list'));
  }
  localStorage.setItem('chamberView', mode);
}

gridBtn.addEventListener('click', () => setView('grid'));
listBtn.addEventListener('click', () => setView('list'));

document.addEventListener('DOMContentLoaded', async () => {
  await loadMembers();
  const saved = localStorage.getItem('chamberView') || 'grid';
  setView(saved);
});
