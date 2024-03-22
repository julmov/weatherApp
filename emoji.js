// Import images
import sunImage from "./images/sun.jpg";
import cloudsImage from "./images/beautiful-clouds-clear-sky-daytime-background-free-photo.jpg";
import rainImage from "./images/rain-316579_1280.jpg";
import thunderstormImage from "./images/background-a089d87ba11e1a4c45a8efa960b86092.jpg";
import snowImage from "./images/24520458-snowfall-backgrounds-of-a-sunlight-cold-weather.jpg";
import mistImage from "./images/f2b30db3c8bc87486f5b452dd6e6d300.jpg";

// Export the getWeatherEmoji function
export const getWeatherEmoji = (description) => {
  if (typeof description !== "string") {
    return "🌞"; // Default emoji for unknown weather
  }
  const lowerCaseDescription = description.toLowerCase();

  switch (lowerCaseDescription) {
    case "clear sky":
      setBackgroundImage(`url('${sunImage}')`);
      return "☀️";
    case "few clouds":
    case "scattered clouds":
    case "broken clouds":
    case "overcast clouds":
      setBackgroundImage(`url('${cloudsImage}')`);
      return "⛅️";
    case "shower rain":
    case "rain":
      setBackgroundImage(`url('${rainImage}')`);
      return "🌧️";
    case "thunderstorm":
      setBackgroundImage(`url('${thunderstormImage}')`);
      return "⛈️";
    case "snow":
      setBackgroundImage(`url('${snowImage}')`);
      return "❄️";
    case "mist":
      setBackgroundImage(`url('${mistImage}')`);
      return "🌫️";
    default:
      // Default background
      return "🌞"; // Default emoji for unknown weather
  }

  function setBackgroundImage(imagePath) {
    document.body.style.backgroundImage = imagePath;
    document.body.style.backgroundSize = "cover"; // Ensure the background image covers the entire screen
    document.body.style.backgroundAttachment = "fixed";
  }
};

export * from "./emoji.js";
