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
var formSubmitHandler = function (event) {
    event.preventDefault();

    // Get the value of the input field
    var city = searchCityInputEl.value.trim();

    if (city) {
        getCurrentWeather(city);
        getFiveDayForecast(city);
        savedSearchCities.push({ city });
        searchCityInputEl.value = '';
    }
    else {
        alert('Please enter a valid city');
    }

    saveSearch();
    pastSearches(city);
}

// Function to get the current weather data from the API
var getCurrentWeather = function (city) {
    var apiKey = '4d4ab74f67f9e8e521144efc850b2569'
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiUrl)
        .then(function (response) {
            response.json().then(function (data) {
                currentWeather(data, city);
            });
        });
};

// Function to get the UV index data from the API
var uvIndex = function (lat, lon) {
    var apiKey = '4d4ab74f67f9e8e521144efc850b2569'
    var apiUrl = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`

    fetch(apiUrl)
        .then(function (response) {
            response.json().then(function (data) {
                displayUVIndex(data);
            });
        });
}

// Function to get 5-day forecast data from the API
var getFiveDayForecast = function (city) {
    var apiKey = '4d4ab74f67f9e8e521144efc850b2569'
    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiUrl)
        .then(function (response) {
            response.json().then(function (data) {
                displayFiveDayForecast(data);
            });
        });
};

// send saved search cities to local storage
var saveSearch = function () {
    localStorage.setItem('savedSearchCities', JSON.stringify(savedSearchCities));
};

// Function to push saved searches to the page
var pastSearches = function (pastSearches) {

    var saveSearchEl = document.createElement("button");
    saveSearchEl.classList = "past";
    saveSearchEl.textContent = pastSearches;
    saveSearchEl.setAttribute("data-city", pastSearches);
    saveSearchEl.setAttribute("type", "submit");
    pastSearchesEl.prepend(saveSearchEl);
}

// Function to display the current weather data
var currentWeather = function (weather, citySearch) {
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
    humidity.textContent = "Humidity: " + weather.main.humidity + " %";
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

// Function to display the UV index data
var displayUVIndex = function (index) {
    var uviEl = document.createElement("div");
    uviEl.textContent = "UV Index: ";
    uviEl.classList = "list-item";

    var uviValue = document.createElement("span");
    uviValue.textContent = index.value;

    if (index.value <= 3) {
        uviValue.classList = "good";
    }
    else if (index.value > 3 && index.value <= 8) {
        uviValue.classList = "moderate";
    }
    else if (index.value > 8) {
        uviValue.classList = "severe";
    }

    uviEl.appendChild(uviValue);
    currentWeatherInfoEl.appendChild(uviEl);
}

// Function to display the 5-day forecast data
var displayFiveDayForecast = function (weather) {
    // Need to clear old weather data from the page
    fiveDayForecastEl.textContent = '';

    fiveDayForecastTitle.textContent = "5-Day Forecast:";

    var eachDay = weather.list;

    // loop through each day of the 5-day forecast
    for (var i = 7; i < eachDay.length; i = i + 8) {
        var dailyWeather = eachDay[i];
        console.log(dailyWeather);

        // create a new div for future weather data
        var futureDay = document.createElement("div");
        futureDay.classList = "card me-2";

        // add the date to the future weather
        var futureDate = document.createElement("h5");
        futureDate.textContent = moment.unix(dailyWeather.dt).format("MMM D, YYYY");
        futureDate.classList = "card-header";
        futureDay.appendChild(futureDate);

        // add the weather icon to the future weather
        var weatherIcon = document.createElement("img");
        weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyWeather.weather[0].icon}.png`);
        weatherIcon.classList = "card-body";
        futureDay.appendChild(weatherIcon);

        // add the temperature to the future weather
        var futureTemp = document.createElement("span");
        futureTemp.classList = "card-body";
        futureTemp.textContent = "Temperature: " + dailyWeather.main.temp + " °F";
        futureDay.appendChild(futureTemp);

        // add the humidity to the future weather
        var futureHumidity = document.createElement("span");
        futureHumidity.classList = "card-body";
        futureHumidity.textContent = "Humidity: " + dailyWeather.main.humidity + "%";
        futureDay.appendChild(futureHumidity);

        // add the wind speed to the future weather
        var futureWindSpeed = document.createElement("span");
        futureWindSpeed.classList = "card-body";
        futureWindSpeed.textContent = "Wind Speed: " + dailyWeather.wind.speed + " mph";
        futureDay.appendChild(futureWindSpeed);

        // add the future weather to the page
        fiveDayForecastEl.appendChild(futureDay);
    }
}

// Turn past searches into buttons that can be clicked to get the weather data
var pastSearchButton = function (event) {
    var city = event.target.getAttribute("data-city");
    console.log(city);
    if (city) {
        getCurrentWeather(city);
        getFiveDayForecast(city);
    }
}

searchCityEl.addEventListener("submit", formSubmitHandler);
pastSearchesEl.addEventListener("click", pastSearchButton);