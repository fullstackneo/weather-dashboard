var searchHistory = ["Los Angeles", "New York", "Chicago", "Las Vegas", "Salt Lake City", "San Antonio", "Phoenix", "Houston"];

// return future date according to tomorrow(i=1), the day after tomorrow(i=2) ,etc
function displayDate(i) {
  var date = new Date();
  date = date.setDate(date.getDate() + i);
  date = new Date(date);
  return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
}

// show weather info
function showWeather(city) {
  // get city's lat and lon info
  fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + city + "&key=AIzaSyCueXEoU9lnKGoZ8uawRHGyV8tjNV9C_Sg")
    .then((response) => response.json())
    .then((result) => {
      var lat = result.results[0].geometry.location.lat;
      var lon = result.results[0].geometry.location.lng;
      getWeather(lat, lon, city);
    })
    .catch((error) => console.log("error", error));
}

//capitalize first char of city
function capitalizeCity(city) {
  var nameArray = city.split("");
  //capitalize first char of the city string
  nameArray[0] = nameArray[0].toUpperCase();
  //capitalize first char of each word of the city string
  nameArray.forEach((el, index, array) => {
    if (el === " ") {
      array[index + 1] = array[index + 1].toUpperCase();
    }
  });
  return nameArray.join("");
}

function save() {
  window.localStorage.setItem("history", JSON.stringify(searchHistory));
}

function load() {
  var savedHistory = JSON.parse(localStorage.getItem("history"));

  // load cities
  $(".search-history li").each(function (index, el) {
    $(el).text(savedHistory[7 - index]);
  });
  //load weather info
  showWeather("Salt Lake City");
}

// display current weather
function displayCurrent(data, city, weather) {
  // display city name

  $(".today h3").html(city + " <span></span><img>");

  // display current date
  $(".today h3 span").text("(" + displayDate(0) + ") ");

  //display weather condition icon
  $(".today h3 img").attr("src", "./assets/icons/" + weather + ".svg");

  // console.log(currentData);
  $(".today ul span").each(function (index, el) {
    $(el).text(data[index]);
  });

  // change the uv background
  var uvlevel = data[3];
  if (uvlevel < 3) {
    $("#uvIndex").addClass("favorable");
  } else if (uvlevel <= 7) {
    $("#uvIndex").addClass("moderate");
  } else if (uvlevel > 7) {
    $("#uvIndex").addClass("severe");
  }
}

//display future day weather
function displayFuture(data, i, weather) {
  // display date
  $(".weather-row")
    .children("div")
    .eq(i)
    .find("p")
    .text(displayDate(i + 1));

  //display weather condition icon
  $(".weather-row")
    .children("div")
    .eq(i)
    .find("img")
    .attr("src", "./assets/icons/" + weather + ".svg");

  // display weather data
  $(".weather-row > div")
    .eq(i)
    .find("span")
    .each(function (index, el) {
      $(this).text(data[index]);
    });
}

// get weather info
function getWeather(lat, lon, city) {
  fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=07fbc9932f3a4d5f19df3aa5907fbbb2")
    .then((response) => response.json())
    .then((result) => {
      // display current weather
      var currentData = [result.current.temp, result.current.wind_speed, result.current.humidity, result.current.uvi.toFixed(2)];
      var currentWeather = result.current.weather[0].main.toLowerCase();
      displayCurrent(currentData, city, currentWeather);
      //display future weather
      for (let i = 0; i < 5; i++) {
        var futureData = [result.daily[i].temp.day, result.daily[i].wind_speed, result.daily[i].humidity];
        var futureWeather = result.daily[i].weather[0].main.toLowerCase();
        displayFuture(futureData, i, futureWeather);
      }
    })
    .catch((error) => console.log("error", error));
}

function formDataHandler(e) {
  e.preventDefault();
  var city = $(this).find("input").val().trim();
  // city default value is San Diego
  if (!city) {
    city = "Salt Lake City";
  }
  //capitalize first char of city
  city = capitalizeCity(city);
  searchHistory.push(city);
  searchHistory.shift();
  save();
  load();
}

// click cities in history
function clickHistoryHandler() {
  var city = $(this).text();
  showWeather(city);
}

// show the cities in history
load();

// click search button and display result
$("#search-form").on("submit", formDataHandler);

// click cities in history
$(".search-history li").on("click", clickHistoryHandler);
