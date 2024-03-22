import { getWeatherData } from "./script.js";

export const myCanvas = (city, weatherData) => {
  clearPreviousContent();
  const canvas = document.createElement("canvas");
  canvas.id = "myChart";
  canvas.width = 900;
  canvas.height = 400;

  containerCanvas.style.display = "block";
  containerCanvas.style.width = "100%"; // Adjust width as needed
  containerCanvas.style.height = "400px";

  containerCanvas.appendChild(canvas);
  const forecasts = weatherData.list.slice(0, 5);
  const dates = [];
  temperatures = [];
  const today = new Date();

  forecasts.forEach((forecast, index) => {
    const date = new Date(forecast.dt * 1000);
    if (index === 0) {
      dates.push("Today");
    
    } else {
      const nextDate = new Date();
      nextDate.setDate(today.getDate() + index);
      dates.push(`${nextDate.getDate()}/${nextDate.getMonth() + 1}`);
      
    }
     const tempCelsius = Math.round(forecast.main.temp - 273.15);
     temperatures.push(tempCelsius);
  });

  // Initialize your chart using Chart.js
  const ctx = canvas.getContext("2d");
  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: dates,
      datasets: [
        {
          label: "temperatures",
          data: temperatures,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
          ],
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
    },
  });
};

export function clearPreviousContent() {
  containerCanvas.innerHTML = "";
}


export * from "./canvas.js";
