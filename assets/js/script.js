var userFormEl = document.querySelector("#user-form");
var formInputEl = document.querySelector("#city-name");

//handles button input
var formHandler = function(event){
    event.preventDefault();
    var name = formInputEl.value.trim();
    
    if(name){
        getPosition(name);
    }
}

//convert get position into weather information
var getWeatherData = function(data){
    var lat = data.latitude;
    var lon = data.longitude;
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=&appid=aa58f17241844e64f81e30985d4f67a5&units=imperial";

    fetch(apiUrl).then(function(response){
        response.json().then(function(data){
            if(response.ok){
                currentWeather(data);
                fiveDayForecast(data);
            } else {
                alert("something went wrong");
            }
            console.log(data);
        });
    });
}
//figure out where the city is in longitude and latitude
var getPosition = function(cityName){
    fetch("http://api.positionstack.com/v1/forward?access_key=c3345767e1b13b7256c70b584870818e&query=" + cityName)
    .then(function(response){
        response.json().then(function(data){
            var array = data.data[0];
            getWeatherData(array);
        })
    })
}

//converts the UNIX given from openweathermp to a readable date and returns it
var timeConversion = function(unix){
    // moment.js item for unix time conversion
    var date = moment.unix(unix).utc();

    console.log(date)
    var date = moment(date).format("M/D/YYYY");

    return date;
}

//gets URL from openweathermap that corresponds with the icon code given
var getIcon = function(icon){
    return "http://openweathermap.org/img/wn/" + icon + "@2x.png";
}

//create main jumbotron
var currentWeather = function(data){
    var name = formInputEl.value.trim();
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
    var uvColor = "";
    if(uv < 3){
        uvColor = "uv-index-good";
    } else if(2.99 < uv < 6){
        uvColor = "uv-index-moderate";
    } else if(5.99 < uv){
        uvColor = "uv-index-bad";
    }
    uvEl.innerHTML = "UV Index: <span class='uv-index " + uvColor + "'>" + uv + "</span>";

    currentDay.append(title, tempEl, windEl, humidityEl, uvEl);
}

//creates one card from the daily weather info
var dayForecastCard = function(data, day){
    var array = data.daily[day];
    var cardId = "day" + day;
    var date = timeConversion(array.dt);

    var card = document.querySelector("#" + cardId);
    
    var title = document.createElement("h2");
    title.textContent = date;

    card.append(title);
}

//creates 5 cards going up one day each time
var fiveDayForecast = function(data){
    for(var i = 1; i < 6; i++){
        dayForecastCard(data, i);
    }
}

userFormEl.addEventListener("submit", formHandler);