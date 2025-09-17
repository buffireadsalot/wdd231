// --- EVENTS (simple placeholder) ---
const events = [
  { date: 'Fri', title: 'Networking Breakfast' },
  { date: 'Sat', title: 'Small Biz Workshop' },
  { date: 'Wed', title: 'Economic Dev. Roundtable' }
];

function renderEvents() {
  const ul = document.getElementById('eventsList');
  ul.innerHTML = events.map(e => `<li><strong>${e.date}:</strong> ${e.title}</li>`).join('');
}

// --- WEATHER (OpenWeatherMap) ---
// --- SETTINGS -------------------------------------------------
const lat = 16.77;  // Timbuktu latitude (rounded)
const lon = -3.00;  // Timbuktu longitude (rounded)
const UNITS = 'imperial';  // keep Fahrenheit
const OWM_KEY = '293b360e9e9a8e245a81b65806aadee4';
const CITY = 'Timbuktu';  // for forecast endpoint
// Current + Forecast URLs
const currentURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${UNITS}&appid=${OWM_KEY}`;
const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${UNITS}&appid=${OWM_KEY}`;

// Helpers
function dayLabelFromDT(dtTxt) {
  // dtTxt like "2025-09-17 12:00:00"
  const d = new Date(dtTxt.replace(' ', 'T') + 'Z'); // align to UTC text
  return d.toLocaleDateString(undefined, { weekday: 'long' });
}

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  return res.json();
}

async function renderWeather() {
  const nowEl = document.getElementById('currentWeather');
  const fcEl  = document.getElementById('forecast');

  try {
    // Current conditions
    const currentURL =
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(CITY)}&units=${UNITS}&appid=${OWM_KEY}`;
    const current = await fetchJSON(currentURL);

    const tempNow = Math.round(current.main.temp);
    const cond    = current.weather?.[0]?.description ?? '—';
    const icon    = current.weather?.[0]?.icon ?? '01d';
    const hi      = Math.round(current.main.temp_max);
    const lo      = Math.round(current.main.temp_min);
    const humid   = current.main.humidity;

    const iconSrc = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    nowEl.innerHTML = `
      <div class="big">${tempNow}°F</div>
      <div style="display:flex;align-items:center;gap:.4rem">
        <img src="${iconSrc}" alt="${cond}" width="50" height="50" />
        <span style="text-transform:capitalize">${cond}</span>
      </div>
      <div>High: ${hi}° • Low: ${lo}°</div>
      <div>Humidity: ${humid}%</div>
    `;

    // 3-Day Forecast (5-day/3-hour endpoint)
    const fcURL =
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(CITY)}&units=${UNITS}&appid=${OWM_KEY}`;
    const forecast = await fetchJSON(fcURL);

    // Pick one representative slot per day (~12:00) for the next 3 DISTINCT days
    const byDay = new Map();
    forecast.list.forEach(item => {
      const [datePart, timePart] = item.dt_txt.split(' ');
      if (!byDay.has(datePart)) byDay.set(datePart, []);
      byDay.get(datePart).push(item);
    });

    // Build 3 labeled days starting from "today"
    const days = Array.from(byDay.entries())
      .slice(0, 5) // look ahead a few days
      .map(([date, items]) => {
        // prefer the noon-ish slot; otherwise take the middle slot
        const pick = items.find(i => i.dt_txt.includes('12:00:00')) || items[Math.floor(items.length / 2)];
        const hi = Math.round(pick.main.temp_max ?? pick.main.temp);
        const lbl = dayLabelFromDT(pick.dt_txt);
        return { label: lbl, hi };
      })
      // Skip duplicate same-day labels (in case of timezone oddities)
      .filter((d, i, arr) => arr.findIndex(x => x.label === d.label) === i)
      .slice(0, 3);

    fcEl.innerHTML = days
      .map(d => `<li><span>${d.label}:</span> <strong>${d.hi}°F</strong></li>`)
      .join('');

  } catch (err) {
    nowEl.innerHTML = `<p role="alert">Weather unavailable. ${String(err).slice(0,120)}</p>`;
    fcEl.innerHTML = '';
  }
}

// ---------- SPOTLIGHTS (2–3 random, Silver/Gold only, full details) ----------
function membershipBadge(level){
  switch (Number(level)) {
    case 3: return { label: 'Gold', cls: 'gold' };
    case 2: return { label: 'Silver', cls: 'silver' };
    default: return { label: 'Member', cls: 'member' };
  }
}

async function renderSpotlights() {
  const grid = document.getElementById('spotGrid');
  try {
    // Use the single source of truth at project root (your file is there).
    const { members } = await fetchJSON('scripts/members.json'); // not data/ or scripts/
    const candidates = members.filter(m => Number(m.membership) >= 2); // silver/gold only

    const want = Math.min(3, Math.max(2, candidates.length));
    const pick = [];
    while (pick.length < want) {
      const idx = Math.floor(Math.random() * candidates.length);
      if (!pick.includes(candidates[idx])) pick.push(candidates[idx]);
    }

    grid.innerHTML = pick.map(m => {
      const badge = membershipBadge(m.membership);
      const phoneHref = m.phone ? m.phone.replace(/[^+\d]/g, '') : '';
      return `
        <article class="spot-card">
          <img src="${m.logo}" alt="${m.name} logo" width="72" height="72">
          <h3>${m.name} <span class="badge ${badge.cls}">${badge.label}</span></h3>
          <p class="tag">${m.tagline ?? ''}</p>
          <p>${m.address ?? ''}</p>
          <p>${m.phone ? `<a href="tel:${phoneHref}">${m.phone}</a>` : ''}</p>
          <p>${m.url ? `<a href="${m.url}" target="_blank" rel="noopener">Visit site</a>` : ''}</p>
        </article>
      `;
    }).join('');
  } catch {
    grid.innerHTML = '<p role="alert">Unable to load spotlights.</p>';
  } finally {
    grid.setAttribute('aria-busy','false');
  }
}

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', () => {
  renderEvents();
  renderWeather();     // live OWM data: current + 3-day forecast
  renderSpotlights();  // randomized gold/silver
});