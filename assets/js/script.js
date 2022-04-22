var userFormEl = document.querySelector("#user-form");
var formInputEl = document.querySelector("#city-name");

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

var timeConversion = function(unix){
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date(unix * 1000);
    var month = date.getMonth();
    var day = "0" + date.getDay();
    var year = "0" + date.getFullYear();

    // Will display time in 10:30:23 format
    var formattedTime = "(" + month + '/' + day + '/' + year + ")";
    return formattedTime;
}

var getIcon = function(icon){
    return "http://openweathermap.org/img/wn/" + icon + "@2x.png";
}

//create main jumbotron
var currentWeather = function(data){
    var name = formInputEl.value.trim();
    var date = timeConversion(data.current.dt);
    var icon = getIcon(data.current.weather[0].icon);
    
    document.querySelector("#current-title").textContent = name + " " + date;
    document.querySelector("#current-title").innerHTML += "<img src='" + icon + "' id='current-icon'>";


    document.querySelector("#weatherInfo").className = "col-lg-9";

}

userFormEl.addEventListener("click", formHandler);