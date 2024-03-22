import { getWeatherEmoji } from "./emoji.js";
import { myCanvas, clearPreviousContent } from "./canvas.js";

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

 cityContainer = document.createElement("div");
 cityContainer.classList.add("city-container");
 cityContainer.style.display = "none";
 document.body.appendChild(cityContainer);

const cardsContainer = document.createElement("div");
cardsContainer.classList.add("cards-container");
document.body.appendChild(cardsContainer);


const containerCanvas = document.createElement("div");
containerCanvas.id = "containerCanvas";
document.body.appendChild(containerCanvas);

submitBtn.addEventListener("click", async function () {
  const city = cityInput.value;

  if (city) {
    try {
      
      const weatherData = await getWeatherData(city);
      displayWeatherInfo(weatherData);
      displayCityPhoto(city);
      myCanvas(city, weatherData);

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
}

const createCard = (forecast, index, city) => {
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
  tempDisplay.id ="tempDisplay"
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

const displayWeatherInfo = (weatherData) => {
  const city = weatherData.city.name; // Get the city name from the weather data
  const forecasts = weatherData.list.slice(0, 5);

  cardsContainer.innerHTML = "";
  cityContainer.style.display = "flex";
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
    cityContainer.innerHTML = ""; // Clear previous data
    

    const cityPhoto = document.createElement("img");
    cityPhoto.src = photoUrl;
    cityPhoto.alt = `Photo of ${cityName}`;
    cityPhoto.classList.add("city-photo");
    
/*
        document.body.style.backgroundImage = `url(${photoUrl})`;
         document.body.style.backgroundSize = "cover";
         document.body.style.backgroundPosition = "center";*/
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
  weatherInfoContainer.innerHTML = "";

  const city = weatherData.city.name;
  const forecasts = weatherData.list.slice(0, 1); // Only need current weather

  forecasts.forEach((forecast) => {
    const { main, weather, dt } = forecast; // Define dt here
    const { temp, humidity } = main;
    const { description } = weather[0];

    const date = new Date(dt * 1000); // Convert dt to a date object

    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });

    // Create elements for weather info
    const cityDisplay = document.createElement("p");
    cityDisplay.id = "cityBigCard";
    cityDisplay.textContent = `${city}`;

    const dateDisplay = document.createElement("p");
    dateDisplay.textContent = `${month} ${day}`;

    const tempDisplay = document.createElement("p");
    tempDisplay.textContent = `${Math.round(temp - 273.15)}°C`;
    tempDisplay.style.fontSize = "48px";

    const humidityDisplay = document.createElement("p");
    humidityDisplay.textContent = `Humidity: ${humidity}%`;

    const descDisplay = document.createElement("p");
    descDisplay.textContent = `Weather: ${description}`;

    const weatherEmoji = document.createElement("p");
    weatherEmoji.id = "bigEmoji";
    weatherEmoji.style.fontSize = "82px";
    weatherEmoji.textContent = getWeatherEmoji(description);

    // Append weather info to container
    weatherInfoContainer.appendChild(cityDisplay);
    weatherInfoContainer.appendChild(tempDisplay);
    weatherInfoContainer.appendChild(dateDisplay);
    weatherInfoContainer.appendChild(humidityDisplay);
    weatherInfoContainer.appendChild(descDisplay);
    weatherInfoContainer.appendChild(weatherEmoji);
  });
}

const displayError = (message) => {
  const errorDisplay = document.createElement("p");
  errorDisplay.textContent = message;
  errorDisplay.classList.add("errorDisplay");
  cardsContainer.textContent = "";
  cardsContainer.appendChild(errorDisplay);
};

export * from "./script.js"; 