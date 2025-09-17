// select HTML elements in the document
const currentTemp = document.querySelector('#current-temp');
const weatherIcon = document.querySelector('#weather-icon');
const captionDesc = document.querySelector('figcaption');

// --- SETTINGS -------------------------------------------------
const lat = 49.75;          // Trier, Germany
const lon = 6.64;
const units = 'imperial';   // 'imperial' = °F, 'metric' = °C
const apiKey = '293b360e9e9a8e245a81b65806aadee4'; // your key

const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;

// --- FETCH + RENDER -------------------------------------------
async function apiFetch() {
  try {
    console.log("Fetching from:", url); // check final URL in console
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      console.log(data); // raw API response
      displayResults(data);
    } else {
      throw Error(await response.text());
    }
  } catch (error) {
    console.log(error);
  }
}
function displayResults(data) {
  // round the temperature so it's cleaner
  currentTemp.innerHTML = `${Math.round(data.main.temp)}&deg;F`;

  // build the icon URL using the @2x version
  const iconsrc = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  // description (like "broken clouds")
  let desc = data.weather[0].description;

  // set <img> attributes
  weatherIcon.setAttribute('src', iconsrc);
  weatherIcon.setAttribute('alt', desc);

  // put description into <figcaption>
  captionDesc.textContent = desc;
}
// kick it off
apiFetch();
