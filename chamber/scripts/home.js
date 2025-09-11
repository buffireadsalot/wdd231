// EVENTS (placeholder)
const events = [
  { date: 'Fri', title: 'Networking Breakfast' },
  { date: 'Sat', title: 'Small Biz Workshop' },
  { date: 'Wed', title: 'Economic Dev. Roundtable' }
];

function renderEvents() {
  const ul = document.getElementById('eventsList');
  ul.innerHTML = events.map(e => `<li><strong>${e.date}:</strong> ${e.title}</li>`).join('');
}

// WEATHER (stub data; swap with API later)
function renderWeatherStub() {
  const now = {
    temp: 75, cond: 'Partly Cloudy', high: 85, low: 52, humidity: 34,
    sunrise: '7:30am', sunset: '5:59pm'
  };
  const el = document.getElementById('currentWeather');
  el.innerHTML = `
    <div class="big">${now.temp}°F</div>
    <div>${now.cond}</div>
    <div>High: ${now.high}° • Low: ${now.low}°</div>
    <div>Humidity: ${now.humidity}%</div>
    <div>Sunrise: ${now.sunrise} • Sunset: ${now.sunset}</div>
  `;

  const fc = [
    { day: 'Today', hi: 90 },
    { day: 'Wednesday', hi: 89 },
    { day: 'Thursday', hi: 68 }
  ];
  document.getElementById('forecast').innerHTML =
    fc.map(f => `<li><span>${f.day}:</span> <strong>${f.hi}°F</strong></li>`).join('');
}

// SPOTLIGHTS (from members.json, silver/gold only)
async function renderSpotlights() {
  try {
    const res = await fetch('data/members.json', { cache: 'no-store' });
    const { members } = await res.json();
    const candidates = members.filter(m => Number(m.membership) >= 2);
    // pick up to 3 unique random
    const pick = [];
    while (pick.length < Math.min(3, candidates.length)) {
      const idx = Math.floor(Math.random() * candidates.length);
      if (!pick.includes(candidates[idx])) pick.push(candidates[idx]);
    }
    const grid = document.getElementById('spotGrid');
    grid.innerHTML = pick.map(m => `
      <article class="spot-card">
        <img src="${m.logo}" alt="${m.name} logo" width="72" height="72" />
        <h3>${m.name}</h3>
        <p class="tag">${m.tagline ?? ''}</p>
        <p><a href="${m.url}" target="_blank" rel="noopener">Visit site</a></p>
      </article>
    `).join('');
  } catch (e) {
    document.getElementById('spotGrid').innerHTML = '<p role="alert">Unable to load spotlights.</p>';
  } finally {
    document.getElementById('spotGrid').setAttribute('aria-busy','false');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderEvents();
  renderWeatherStub();
  renderSpotlights();
});
