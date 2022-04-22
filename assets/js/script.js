var getWeatherData = function(data){
    var lat = data.latitude;
    var lon = data.longitude;
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=&appid=aa58f17241844e64f81e30985d4f67a5&units=imperial";

    fetch(apiUrl).then(function(response){
        response.json().then(function(data){
            console.log(data);
        });
    });
}

var getPosition = function(cityName){
    fetch("http://api.positionstack.com/v1/forward?access_key=c3345767e1b13b7256c70b584870818e&query=" + cityName)
    .then(function(response){
        response.json().then(function(data){
            var array = data.data[0];
            getWeatherData(array);
        })
    })
}

getPosition("Manchester NH");