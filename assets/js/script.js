// Set up variables that match id's of elements in the html
var searchCityEl = document.querySelector('#search-form');
var searchCityInputEl = document.querySelector('#city');
var currentWeatherInfoEl = document.querySelector('#weather-info');
var currentCityEl = document.querySelector('#current-city');
var fiveDayForecastEl = document.querySelector('#five-day');
var fiveDayForecastTitle = document.querySelector('#title');
var pastSearchesEl = document.querySelector('#past-searches');
// Set up variable that will be used to store data from the API
var savedSearchCities = [];

// Function for searching for a city
var formSubmitHandler = function(event) {
    event.preventDefault();

    // Get the value of the input field
    var city = searchCityInputEl.value.trim();

    if(city) {
        // function to get the weather data from the API
    }
    else {
        alert('Please enter a valid city');
    }

    // functions to save the city to the local storage
}

// Function to get the current weather data from the API
var getCurrentWeather = function(city) {
    var apiKey = '4d4ab74f67f9e8e521144efc850b2569'
    var url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    fetch(url)
        .then(function(response) {
            response.json().then(function(data) {
                currentWeather(data, city);
            });
        });
};

var currentWeather = function(weather, citySearch) {
    // Need to clear old weather data from the page
    currentWeatherInfoEl.textContent = '';
    currentCityEl.textContent = citySearch;

    // add the date to the current weather info
    var date = document.createElement("span");
    date.textContent = " (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
    currentCityEl.appendChild(date);

    // add the weather icon to the current weather info
    var weatherIcon = document.createElement("img");
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`);
    currentCityEl.appendChild(weatherIcon);

    // add current temperature info
    var temp = document.createElement("div");
    temp.textContent = "Temperature: " + weather.main.temp + "°F";
    temp.classList = "list-item";
    currentWeatherInfoEl.appendChild(temp);

    // add current humidity info
    var humidity = document.createElement("div");
    humidity.textContent = "Humidity: " + weather.main.humidity + "%";
    humidity.classList = "list-item";
    currentWeatherInfoEl.appendChild(humidity);

    // add current wind speed info
    var windSpeed = document.createElement("div");
    windSpeed.textContent = "Wind Speed: " + weather.wind.speed + " mph";
    windSpeed.classList = "list-item";
    currentWeatherInfoEl.appendChild(windSpeed);

    // call uvIndex function
    var lat = weather.coord.lat;
    var lon = weather.coord.lon;
    uvIndex(lat, lon);
}