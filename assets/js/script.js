var userFormEl = document.querySelector("#user-form");
var formInputEl = document.querySelector("#city-name");
var cityHistory = document.querySelector("#history");
var cities = [];

//handles button input
var formHandler = function(event){
    event.preventDefault();
    var name = formInputEl.value.trim();
    name = name.substring(0, 1).toUpperCase() + name.substring(1);
    
    if(name){
        //saves name to history
        saveLocalStorage(name)

        //creates buttons and weather info
        makeHistoryButtons();
        getPosition(name);
    }
    //clears form value
    formInputEl.value = "";
}

//handles pressing a history button
var historyFormHandler = function(event){
    //grabs name of the city
    var name = event.target.textContent;

    //runs city name through weather info loop
    getPosition(name);
}

//convert get position into weather information
var getWeatherData = function(data, name){
    var lat = data.latitude;
    var lon = data.longitude;
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=&appid=aa58f17241844e64f81e30985d4f67a5&units=imperial";

    //grabs weather info from API
    fetch(apiUrl).then(function(response){
        response.json().then(function(data){
            if(response.ok){
                //if everything is fine, runs weather loop
                currentWeather(data, name);
                fiveDayForecast(data);
            } else {
                //otherwise outputs an alert
                alert("something went wrong");
            }
        });
    });
}
//figure out where the city is in longitude and latitude
var getPosition = function(cityName){
    fetch("http://api.positionstack.com/v1/forward?access_key=c3345767e1b13b7256c70b584870818e&query=" + cityName)
    .then(function(response){
        response.json().then(function(data){
            var array = data.data[0];
            getWeatherData(array, cityName);
        })
    })
}

//converts the UNIX given from openweathermp to a readable date and returns it
var timeConversion = function(unix){
    // moment.js item for unix time conversion
    var date = moment.unix(unix).utc();
    //formats date
    date = moment(date).format("M/D/YYYY");
    //returns date
    return date;
}

//gets URL from openweathermap that corresponds with the icon code given
var getIcon = function(icon){
    return "http://openweathermap.org/img/wn/" + icon + "@2x.png";
}

//create main jumbotron
var currentWeather = function(data, name){
    var date = timeConversion(data.current.dt);
    var icon = getIcon(data.current.weather[0].icon);

    var temp = data.current.temp + "°F";
    var wind = data.current.wind_speed + "MPH";
    var humidity = data.current.humidity + "%";
    var uv = data.current.uvi;

    //grabs current-day div and clears previous content
    var currentDay = document.querySelector("#current-day");
    currentDay.innerHTML = "";

    //unhides the main content
    document.querySelector("#weatherInfo").className = "col-lg-9";

    //make the h1 title and change its name and icon
    var title = document.createElement("h1");
    title.textContent = name + " " + date;
    title.innerHTML += "<img src='" + icon + "' id='current-icon'>";
    
    var tempEl = document.createElement("p");
    tempEl.textContent = "Temp: " + temp;

    var windEl = document.createElement("p");
    windEl.textContent = "Wind: " + wind;

    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + humidity;

    var uvEl = document.createElement("p");
    //chooses color of UVI based on value
    var uvColor = "";
    if(uv < 3){
        uvColor = "uv-index-good";
    } else if(2.99 < uv < 6){
        uvColor = "uv-index-moderate";
    } else if(5.99 < uv){
        uvColor = "uv-index-bad";
    }
    uvEl.innerHTML = "UV Index: <span class='uv-index " + uvColor + "'>" + uv + "</span>";

    //appends everything in order
    currentDay.append(title, tempEl, windEl, humidityEl, uvEl);
}

//creates one card from the daily weather info
var dayForecastCard = function(data, day){
    var array = data.daily[day];
    var cardId = "day" + day;
    var date = timeConversion(array.dt);
    var icon = getIcon(array.weather[0].icon)

    //grab card and make sure its empty
    var card = document.querySelector("#" + cardId);
    card.innerHTML = "";
    
    //creates all elements
    var title = document.createElement("h2");
    title.textContent = date;
    var iconEL = document.createElement("img");
    iconEL.setAttribute("src", icon);
    var tempEl = document.createElement("p");
    tempEl.textContent = "Temp: " + array.temp.day + "°F";

    var windEl = document.createElement("p");
    windEl.textContent = "Wind: " + array.wind_speed + "MPH";

    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + array.humidity + "%";

    //appends everything at once
    card.append(title, iconEL, tempEl, windEl, humidityEl);
}

//creates 5 cards going up one day each time
var fiveDayForecast = function(data){
    for(var i = 1; i < 6; i++){
        dayForecastCard(data, i);
    }
}

//creates all the history buttons based on local storage
var makeHistoryButtons = function(){
    //clear history buttons
    cityHistory.innerHTML = "";

    //creates all history buttons
    for(var i=0; i < cities.length; i++){
        var button = document.createElement("button");
        button.className = "btn btn-secondary w-100";
        button.setAttribute("id", cities[i]);
        button.textContent = (cities[i]);

        cityHistory.append(button);
    }
}

//grabs cities array value from localStorage
var getLocalStorage = function(){
    var local = localStorage.getItem("cities");
    if(local){
        local = JSON.parse(local);
        cities = local;
    }
}

//saves cities array value to local storage
var saveLocalStorage = function(name){
    //if the city name is already saved, cancels function
    for(var i=0; i < cities.length; i++){
        if(cities[i].toLowerCase() == name.toLowerCase()){
            return;
        }
    }
    //if there are already 10 saved cities, erases the oldest one and makes a new button
    if(cities.length === 10){
        cities.pop();
    }

    //adds to beginning of array and saves to localStorage
    cities.unshift(name);
    var citiesParse = JSON.stringify(cities);
    localStorage.setItem("cities", citiesParse);
    
}
// Creates initial history buttons from localStorage
getLocalStorage();
makeHistoryButtons();

//event listeners
userFormEl.addEventListener("submit", formHandler);

cityHistory.addEventListener("click", historyFormHandler);