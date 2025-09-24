// js/scripts.js
(() => {
  const resultsEl = document.getElementById('results');
  if (!resultsEl) return;

  const params = new URLSearchParams(window.location.search);

  // If someone lands on the page without coming from the form
  if ([...params].length === 0) {
    resultsEl.textContent = 'No form data found.';
    return;
  }

  // Map query keys to nice labels for display
  const labelMap = {
    first: 'First Name',
    last: 'Last Name',
    phone: 'Cell Phone',
    email: 'Email',
    ordinance: 'Ordinance',
    date: 'Date',
    location: 'Location'
  };

  // Optional: format values (e.g., make date readable)
  const formatValue = (key, value) => {
    if (key === 'date') {
      const d = new Date(value);
      // Only format if valid date
      if (!isNaN(d)) return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    }
    return value;
  };

  // Build a clean, accessible definition list
  const dl = document.createElement('dl');

  params.forEach((value, key) => {
    const label = labelMap[key] ?? key;

    const dt = document.createElement('dt');
    dt.textContent = label;

    const dd = document.createElement('dd');
    dd.textContent = formatValue(key, value);

    dl.append(dt, dd);
  });

  // Replace any placeholder content with our results
  resultsEl.replaceChildren(dl);

  // Optional: add a "Back" link
  const back = document.createElement('p');
  back.innerHTML = '<a href="index.html">← Back to form</a>';
  resultsEl.appendChild(back);
})();
