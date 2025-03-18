const apiKey = "63ca939682492f651aec2e86e8c87415"; 
const baseUrl = "https://api.openweathermap.org/data/2.5";

// default is miami
window.addEventListener("load", () => {
  fetchWeather("Miami");
});

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
  } else {
    alert("Please enter a city name.");
  }
});

cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

async function fetchWeather(city) {
  try {
    // Current weather
    const currentRes = await fetch(
      `${baseUrl}/weather?q=${city}&units=imperial&appid=${apiKey}`
    );
    // 3-hour forecast; API doesn't allow for hourly data
    const forecastRes = await fetch(
      `${baseUrl}/forecast?q=${city}&units=imperial&appid=${apiKey}`
    );

    if (!currentRes.ok) {
      const err = await currentRes.json();
      alert(`Error: ${err.message}`);
      return;
    }
    if (!forecastRes.ok) {
      const err = await forecastRes.json();
      alert(`Error: ${err.message}`);
      return;
    }

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    updateUI(currentData, forecastData);
  } catch (error) {
    console.error("Error:", error);
    alert("Unable to fetch weather data.");
  }
}

function updateUI(current, forecast) {
  // Display current weather
  document.getElementById("cityName").textContent = current.name;
  document.getElementById("temperature").textContent = `${Math.round(current.main.temp)}°F`;
  document.getElementById("description").textContent = current.weather[0].description;
  document.getElementById("humidity").textContent = `${current.main.humidity}%`;
  document.getElementById("windSpeed").textContent = `${Math.round(current.wind.speed)} mph`;
  document.getElementById("feelsLike").textContent = `${Math.round(current.main.feels_like)}°F`;
  document.getElementById("pressure").textContent = `${current.main.pressure} hPa`;

  // Icon from openweather
  const icon = current.weather[0].icon; 
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  document.getElementById("weatherIcon").innerHTML = `<img src="${iconUrl}" alt="Weather Icon" />`;

  // 3-hourly forecast (first 6 intervals = next 18 hours)
  const hourlyContainer = document.getElementById("hourlyForecast");
  hourlyContainer.innerHTML = forecast.list.slice(0, 6).map(item => {
    const timeString = formatHour(item.dt); // Convert to 12-hour
    const temp = Math.round(item.main.temp);
    return `
      <div class="hour-item">
        <div>${timeString}</div>
        <div>${temp}°F</div>
      </div>`;

      // 10-Day Forecast
  const dailyForecast = document.getElementById("dailyForecast");
  const dailyData = forecast.list.filter((_, index) => index % 8 === 0).slice(0, 10);
  
  dailyForecast.innerHTML = dailyData.map(day => {
    const date = new Date(day.dt * 1000);
    return `
      <div class="daily-item">
        <span>${date.toLocaleDateString('en', {weekday: 'short'})}</span>
        <span>${Math.round(day.main.temp_max)}°/${Math.round(day.main.temp_min)}°</span>
      </div>
    `;
  }).join("");

  // Wind Direction
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const deg = current.wind.deg;
  const index = Math.round(deg / 45) % 8;
  document.getElementById("windDir").textContent = directions[index];
  }).join("");
}

function formatHour(timestamp) {
  const date = new Date(timestamp * 1000);
  let hour = date.getHours();    // 0–23
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;        // convert 24h -> 12h
  return `${hour}:00 ${ampm}`;
}
function createClouds() {
    const cloudsContainer = document.querySelector('.clouds');
    for (let i = 0; i < 5; i++) {
      const cloud = document.createElement('div');
      cloud.className = 'cloud';
      cloud.style.top = `${Math.random() * 100}%`;
      cloud.style.width = `${Math.random() * 200 + 100}px`;
      cloud.style.height = `${Math.random() * 60 + 30}px`;
      cloud.style.animationDuration = `${Math.random() * 30 + 30}s`;
      cloudsContainer.appendChild(cloud);
    }
  }
  window.addEventListener('load', createClouds);