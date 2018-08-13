var APIKey = "11631bfd75b571a520255fbeaeaeef02";
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=austin&appid=" + APIKey;

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function (response) {
    // Logs the object
    console.log(response);

    $("#description").text(response.weather[0].main);

    var sunriseTime = moment(response.sys.sunrise, "X").format("h:mm A");
    var sunsetTime = moment(response.sys.sunset, "X").format("h:mm A");


    $("#sunrise-time").text(sunriseTime);
    $("#sunset-time").text(sunsetTime);

    // Adds humidity and wind to HTML
    $("#humidity").text(response.main.humidity + "%");
    $("#wind").text(response.wind.speed + " MPH");

    // Converting temp from Kelvin to Farenheit
    var kTemp = response.main.temp;
    var fTemp = Math.floor((kTemp - 273.15) * 1.80 + 32);
    $("#temp").text(fTemp + " F");

});