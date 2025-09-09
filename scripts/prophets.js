// URL to the JSON resource
const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';

// Select the container for the cards
const cards = document.querySelector('#cards');

// Fetch + render pipeline
async function getProphetData() {
  const response = await fetch(url);
  const data = await response.json();

  // Temporary check (comment out once verified):
  // console.table(data.prophets);

  // Pass ONLY the array to the renderer (displayProphets expects an array)
  displayProphets(data.prophets);
}

// Build cards from the array
const displayProphets = (prophets) => {
  prophets.forEach((prophet) => {
    // Create elements
    const card = document.createElement('section');
    card.className = 'card';

    const fullName = document.createElement('h2');
    fullName.textContent = `${prophet.name} ${prophet.lastname}`;

    const birthDate = document.createElement('p');
    birthDate.textContent = `Date of Birth: ${prophet.birthdate}`;

    const birthPlace = document.createElement('p');
    birthPlace.textContent = `Place of Birth: ${prophet.birthplace}`;

    const portrait = document.createElement('img');
    portrait.setAttribute('src', prophet.imageurl);
    portrait.setAttribute('alt', `Portrait of ${prophet.name} ${prophet.lastname}`);
    portrait.setAttribute('loading', 'lazy');
    portrait.setAttribute('width', '340');
    portrait.setAttribute('height', '440');

    // Assemble card in order
    card.appendChild(fullName);
    card.appendChild(birthDate);
    card.appendChild(birthPlace);
    card.appendChild(portrait);

    cards.appendChild(card);
  });
};

// Kick it off
getProphetData();
