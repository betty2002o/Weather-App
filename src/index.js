//  get date
let now = new Date();
function displayCurrentTime() {
  let day = now.getDay();
  let days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
  let date = now.getDate();
  let month = now.getMonth();
  let months = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  let hour = now.getHours();
  let minute = now.getMinutes();
  let pmtime = hour - 12;

  if (minute < 10) {
    minute = `0${minute}`;
  }

  let currentTimePM = `${months[month]} ${date} ${days[day]}, ${pmtime} : ${minute} PM`;
  let currentTimeAM = `${months[month]} ${date} ${days[day]}, ${hour} : ${minute} AM`;
  let current = document.querySelector(".date-time");

  if (hour >= 12) {
    current.innerHTML = `${currentTimePM}`;
  } else {
    current.innerHTML = `${currentTimeAM}`;
  }
}
displayCurrentTime(now);

// click on search

function replaceLocation(event) {
  event.preventDefault();
  let searchedLocation = document.querySelector(".search-box");
  let key = "83a749915ff8adf28c051c8c3b142608";
  let unit = "metric";
  let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchedLocation.value}&units=${unit}&appid=${key}`;
  axios.get(weatherUrl).then(replaceTemp);
}

let clickSearch = document.querySelector("#search-button");
clickSearch.addEventListener("click", replaceLocation);

//replace current information

function replaceTemp(response) {
  let temp = Math.round(response.data.main.temp);
  let temperatureDisplay = document.querySelector(".current-temp");

  temperatureDisplay.innerHTML = `${temp}`;

  let weather = response.data.weather[0].description;

  let weatherDisplay = document.querySelector(".class-weather");
  weatherDisplay.innerHTML = `${weather}`;

  let currentLocation = document.querySelector(".city-location");
  let name = response.data.name;

  currentLocation.innerHTML = `${name}`;

  let currentHumidity = document.querySelector(".current-condition-humidity");
  let humidity = response.data.main.humidity;
  currentHumidity.innerHTML = `${humidity} %`;

  let currentWindSpeed = document.querySelector(".wind-speed");
  let windSpeed = Math.round(response.data.wind.speed);
  currentWindSpeed.innerHTML = `${windSpeed}`;

  let currentWeatherIcon = document.querySelector("#weather-icon");
  currentWeatherIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );

  currentWeatherIcon.setAttribute("alt", response.data.weather[0].description);

  dailyForecastAPI(response.data.coord);
}

// click on F or C to change Temp

function converttoImperial(event) {
  event.preventDefault();
  let cityDisplayed = document.querySelector(".city-location");
  let city = cityDisplayed.innerHTML;
  let key = "83a749915ff8adf28c051c8c3b142608";
  let unit = "imperial";
  let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${key}`;
  axios.get(weatherUrl).then(replaceTemp);

  let displayWindUnit = document.querySelector(".wind-unit");
  displayWindUnit.innerHTML = `mi/h`;

  clickTempC.classList.remove("active");
  clickTempF.classList.add("active");
}

function converttoMetric(event) {
  event.preventDefault();
  let cityDisplayed = document.querySelector(".city-location");
  let city = cityDisplayed.innerHTML;
  let key = "83a749915ff8adf28c051c8c3b142608";
  let unit = "metric";
  let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${key}`;
  axios.get(weatherUrl).then(replaceTemp);

  let displayWindUnit = document.querySelector(".wind-unit");
  displayWindUnit.innerHTML = `m/s`;
  clickTempC.classList.add("active");
  clickTempF.classList.remove("active");
}

let clickTempF = document.querySelector("#fahrenheit");
clickTempF.addEventListener("click", converttoImperial);

let clickTempC = document.querySelector("#celsius");
clickTempC.addEventListener("click", converttoMetric);

// click on current to fetch current locations

function displayCurrentLocation(position) {
  let key = "83a749915ff8adf28c051c8c3b142608";
  let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${key}&units=metric`;
  axios.get(weatherUrl).then(replaceTemp);
  clickTempC.classList.add("active");
  clickTempF.classList.remove("active");
}

function getLocation() {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(displayCurrentLocation);
}
let clickCurrent = document.querySelector("#search-button-current");
clickCurrent.addEventListener("click", getLocation);

// forecast the next few days highest + lowest weather
function dailyForecastAPI(response) {
  let key = "83a749915ff8adf28c051c8c3b142608";
  let dailyForcastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${response.lat}&lon=${response.lon}&exclude=current,minutely&appid=${key}&units=metric`;
  axios.get(dailyForcastUrl).then(displayForecast);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let dates = date.getDate();
  let month = date.getMonth();
  let months = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  return `${months[month]} / ${dates} <br/> ${days[day]}`;
}

function displayForecast(response) {
  let forecastElement = document.querySelector(".next-days");
  forecastRow = `<div class="row">`;
  let daily = response.data.daily;
  console.log(daily);
  daily.forEach(function (forecastDays, index) {
    if (index < 6) {
      forecastRow =
        forecastRow +
        `
      <div class="col-2">
      <div class="tmr">
      ${formatDay(forecastDays.dt)}
      </div>
      <img 
      src="http://openweathermap.org/img/wn/${
        forecastDays.weather[0].icon
      }@2x.png"
      alt = "cloudy" class="tmr-weather-icon"/>
      <div class="tmr-temp">
      <span>${Math.round(forecastDays.temp.max)}</span>
      /
      <span> ${Math.round(forecastDays.temp.min)} °C</span>
      </div>
      </div>
      `;
    }
  });

  forecastRow = forecastRow + `</div>`;
  forecastElement.innerHTML = forecastRow;
}

//default: setting default city to Taipei

function defaultCity(city) {
  let key = "83a749915ff8adf28c051c8c3b142608";
  let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`;
  axios.get(weatherUrl).then(replaceTemp);
}

defaultCity("Taipei");
displayForecast();
