
const weatherForm = document.createElement("div");
weatherForm.classList.add("weatherForm");
document.body.appendChild(weatherForm);

const cityInput = document.createElement("input");
cityInput.setAttribute("type", "text");
cityInput.setAttribute("id", "cityInput");
cityInput.setAttribute("placeholder", "Enter city name");
weatherForm.appendChild(cityInput);

const submitBtn = document.createElement("button");
submitBtn.setAttribute("type", "submit");
submitBtn.setAttribute("id", "submitBtn");
submitBtn.textContent = "Get Weather";
weatherForm.appendChild(submitBtn);

const cardsContainer = document.createElement("div");
cardsContainer.classList.add("cards-container");
document.body.appendChild(cardsContainer);

submitBtn.addEventListener("click", async function () {
  const city = cityInput.value;

  if (city) {
    try {
      const weatherData = await getWeatherData(city);
      displayWeatherInfo(weatherData);
      displayCityPhoto(city);
     // createWeatherGraph(weatherData);
    } catch (error) {
      console.error(error);
      displayError(error);
    }
  } else {
    displayError("Please enter a city");
  }
});

const apiKey = "8f7491abf0edf7d482a9ce1653dae76c";

async function getWeatherData(city) {
  try {
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;
    const geoResponse = await fetch(geoUrl);
    if (!geoResponse.ok) {
      throw new Error("Could not fetch city data");
    }
    const geoData = await geoResponse.json();
    if (geoData.length === 0) {
      throw new Error("City not found");
    }
    const { lat, lon } = geoData[0];
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok) {
      throw new Error("Could not fetch weather data");
    }
    const weatherData = await weatherResponse.json();
    return weatherData;
  } catch (error) {
    throw error;
  }
}

function createCard(forecast, index, city) {
  const card = document.createElement("div");
  card.classList.add("card");

  const { dt, main, weather } = forecast;
  const { temp, humidity } = main;
  const { description } = weather[0];

  const date = new Date(dt * 1000);
  date.setDate(date.getDate() + index); // Add index to the date to increment the day

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });

  const cityNameDisplay = document.createElement("p");
  cityNameDisplay.textContent = `City: ${city}`;
  cityNameDisplay.id = "cityNameDisplay";
  card.appendChild(cityNameDisplay);

  const dateDisplay = document.createElement("p");
  dateDisplay.textContent = `${month} ${day}`;
  card.appendChild(dateDisplay);

  const tempCelsius = Math.round(temp - 273.15); // Convert temperature to Celsius and round to nearest whole number
  const tempDisplay = document.createElement("p");
  tempDisplay.textContent = `Temperature: ${tempCelsius}°C`; // Display temperature in Celsius as an integer
  card.appendChild(tempDisplay);

  const humidityDisplay = document.createElement("p");
  humidityDisplay.textContent = `Humidity: ${humidity}%`;
  card.appendChild(humidityDisplay);

  const descDisplay = document.createElement("p");
  descDisplay.textContent = `Weather: ${description}`;
  card.appendChild(descDisplay);

  const weatherEmoji = document.createElement("p");
    weatherEmoji.classList.add("weatherEmoji");
    weatherEmoji.style.fontSize = "28px"; 
  weatherEmoji.textContent = getWeatherEmoji(description); // Pass description to getWeatherEmoji function
  card.appendChild(weatherEmoji);

  return card;
}


function displayWeatherInfo(weatherData) {
  const city = weatherData.city.name; // Get the city name from the weather data
  const forecasts = weatherData.list.slice(0, 5);

   cardsContainer.innerHTML = "";

  forecasts.forEach((forecast, index) => {
    const card = createCard(forecast, index, city); // Pass city to createCard function
    cardsContainer.appendChild(card);
  });
}


async function displayCityPhoto(cityName) {
  try {
    const unsplashResponse = await fetch(
      `https://api.unsplash.com/search/photos?page=1&query=${cityName}&client_id=6Zhb8bS8u-t064Jq4aCc7TcIaNYrpi3-pZtG1QywCPA`
    );
    const unsplashData = await unsplashResponse.json();
    const photoUrl = unsplashData.results[0].urls.regular;

    // Check if cityContainer already exists
    let cityContainer = document.querySelector(".city-container");
    if (cityContainer) {
      cityContainer.innerHTML = ""; // Clear previous data
    } else {
      // Create a container for city photo and weather info if it doesn't exist
      cityContainer = document.createElement("div");
      cityContainer.classList.add("city-container");
      document.body.appendChild(cityContainer);
    }

    // Create an image element for city photo
    const cityPhoto = document.createElement("img");
    cityPhoto.src = photoUrl;
    cityPhoto.alt = `Photo of ${cityName}`;
    cityPhoto.classList.add("city-photo");

    // Create a div for weather info
    const weatherInfo = document.createElement("div");
    weatherInfo.classList.add("weather-info");

    // Append weather info to the container
    cityContainer.appendChild(cityPhoto);
    cityContainer.appendChild(weatherInfo);

    // Fetch weather data and display
    const weatherData = await getWeatherData(cityName);
    displayCityWeatherInfo(weatherData, weatherInfo);
  } catch (error) {
    console.error("Error fetching city photo:", error);
  }
}

function displayCityWeatherInfo(weatherData, weatherInfoContainer) {
  // Clear previous weather info
  weatherInfoContainer.innerHTML = "";

  const city = weatherData.city.name;
  const forecasts = weatherData.list.slice(0, 1); // Only need current weather

  forecasts.forEach((forecast) => {
    const { main, weather } = forecast;
    const { temp, humidity } = main;
    const { description } = weather[0];

    // Create elements for weather info
    const cityDisplay = document.createElement("p");
    cityDisplay.textContent = `${city}`;

    const tempDisplay = document.createElement("p");
    tempDisplay.textContent = `${Math.round(temp - 273.15)}°C`;
    tempDisplay.style.fontSize = "32px";

    const humidityDisplay = document.createElement("p");
    humidityDisplay.textContent = `Humidity: ${humidity}%`;

    const descDisplay = document.createElement("p");
    descDisplay.textContent = `${description};`

    const weatherEmoji = document.createElement("p");
    weatherEmoji.classList.add("weatherEmoji");
    weatherEmoji.style.fontSize = "38px";
    weatherEmoji.textContent = getWeatherEmoji(description);

    // Append weather info to container
    weatherInfoContainer.appendChild(cityDisplay);
    weatherInfoContainer.appendChild(tempDisplay);
    weatherInfoContainer.appendChild(humidityDisplay);
    weatherInfoContainer.appendChild(descDisplay);
    weatherInfoContainer.appendChild(weatherEmoji);
  });
}


const getWeatherEmoji = (description) => {
  if (typeof description !== "string") {
    return "🌞"; // Default emoji for unknown weather
  }
let imagePath;
  const lowerCaseDescription = description.toLowerCase();

switch (lowerCaseDescription) {
  case "clear sky":
    setBackgroundImage("url('images/sun.jpg')");
    return "☀️";
  case "few clouds":
  case "scattered clouds":
  case "broken clouds":
  case "overcast clouds":
    setBackgroundImage(
      "url('images/beautiful-clouds-clear-sky-daytime-background-free-photo.jpg')"
    );
    return "⛅️";
  case "shower rain":
  case "rain":
    setBackgroundImage("url('images/rain-316579_1280.jpg')");
    return "🌧️";
  case "thunderstorm":
    setBackgroundImage(
      "images/background-a089d87ba11e1a4c45a8efa960b86092.jpg')"
    );
    return "⛈️";
  case "snow":
    setBackgroundImage(
      "url('images/24520458-snowfall-backgrounds-of-a-sunlight-cold-weather.jpg')"
    );
    return "❄️";
  case "mist":
    setBackgroundImage("url('images/f2b30db3c8bc87486f5b452dd6e6d300.jpg')");
    return "🌫️";
  default:
 // Default background
    return "🌞"; // Default emoji for unknown weather
}

function setBackgroundImage(imagePath) {
  // Set background image for app
  document.body.style.backgroundImage = imagePath;
    document.body.style.backgroundSize = "cover"; // Ensure the background image covers the entire screen
    document.body.style.backgroundAttachment = "fixed"; 
  // Set background image for card
 /* const cards = document.querySelectorAll(".card");
  cards.forEach(card => {
    card.style.backgroundImage = imagePath;
      document.body.style.backgroundSize = "cover"; // Ensure the background image covers the entire screen
      document.body.style.backgroundAttachment = "fixed"; 
  });*/
}}


const displayError = (message) => {
  const errorDisplay = document.createElement("p");
  errorDisplay.textContent = message;
  errorDisplay.classList.add("errorDisplay");
  cardsContainer.textContent = "";
  cardsContainer.appendChild(errorDisplay);
};


/*function createWeatherGraph(weatherData) {
  const forecasts = weatherData.list.slice(0, 5);
  const dates = [];
  const temperatures = [];

  forecasts.forEach((forecast, index) => {
    const date = new Date(forecast.dt * 1000);
    dates.push(`${date.getDate()}/${date.getMonth() + 1}`);

    const tempCelsius = Math.round(forecast.main.temp - 273.15);
    temperatures.push(tempCelsius);
  });

  const ctx = document.createElement("canvas");
  ctx.classList.add("weather-chart");
  cardsContainer.appendChild(ctx);

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: dates,
      datasets: [
        {
          label: "Temperature",
          data: temperatures,
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Weather Forecast",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.dataset.label}: ${context.parsed.y}°C`;
            },
          },
        },
      },
    },
  });

  const avgTemperature = calculateAverage(temperatures);
  const avgTemperatureDisplay = document.createElement("p");
  avgTemperatureDisplay.textContent = `Average Temperature: ${avgTemperature}°C`;
  cardsContainer.appendChild(avgTemperatureDisplay);
}

function calculateAverage(arr) {
  const sum = arr.reduce((acc, curr) => acc + curr, 0);
  return Math.round(sum / arr.length);
}*/