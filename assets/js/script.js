var searchHistory = ["Los Angeles", "New York", "Chicago", "Las Vegas", "Salt Lake City", "San Antonio", "Phoenix", "Houston"];
var city = "Sakt Lake City";

// return future date according to tomorrow(i=1), the day after tomorrow(i=2) ,etc
function displayDate(i) {
  var date = new Date();
  date = date.setDate(date.getDate() + i);
  date = new Date(date);
  return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
}

// show weather info
function load(city) {
  // load search history
  savedHistory = JSON.parse(localStorage.getItem("history"));
  if (!savedHistory) {
    savedHistory = searchHistory;
    save();
  }
  $(".search-history li").each(function (index, el) {
    $(el).text(savedHistory[7 - index]);
  });
  // get city's geo info
  fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + city + "&key=AIzaSyCueXEoU9lnKGoZ8uawRHGyV8tjNV9C_Sg")
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      // if the fetch is success and submit via button, save the city
      if (result.status === "OK") {
        console.log("geo api fetch success");
      } else {
        console.log("geo-api fetch fail");
        return false;
      }
      var lat = result.results[0].geometry.location.lat;
      var lon = result.results[0].geometry.location.lng;
      city = result.results[0].formatted_address;
      getWeather(lat, lon, city);
    })
    .catch((error) => console.log("geo-api connect error", error));
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

// save the history
function save() {
  savedHistory.push(city);
  savedHistory.shift();
  window.localStorage.setItem("history", JSON.stringify(savedHistory));
}

// display current weather
function displayCurrent(data, city, weather) {
  // display city name
  $(".today h3").html(city + " <span></span><img>");

  // display current date
  $(".today h3 span").text("(" + displayDate(0) + ") ");

  //display weather condition icon
  $(".today h3 img").attr({
    src: "./assets/icons/" + weather + ".svg",
    alt: weather + " weather icon",
  });

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
    .attr({
      src: "./assets/icons/" + weather + ".svg",
      alt: weather + " weather icon",
    });

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
  fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=028a37f5d8559aab5b5649bf9e5dc203")
    .then((response) => response.json())
    .then((result) => {
      console.log("weather api result:");
      console.log(result);
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
    .catch((error) => console.log("weather-api connect error", error));
}

function formDataHandler(e) {
  e.preventDefault();
  city = $("#search-form input").val().trim();
  // city default value is Salt Lake City
  if (!city) {
    city = "Salt Lake City";
  } else {
    city = capitalizeCity(city);
  }

  $("#search-form input").val("");

  // add new li
  var li = $("<li>" + city + "</li>");
  li.css("display", "none");
  $(".search-history").prepend(li);
  li.slideDown();

  // remove the last li
  $(".search-history li:last-child").fadeOut(function () {
    $(this).remove();
  });
  save();
  load(city);
}

// click city in history
function clickHistoryHandler() {
  city = $(this).text();
  load(city);
}

// load the page
load(city);

// click search button and display result
$("#search-form").on("submit", formDataHandler);

// click input and show border
$("#search-form input").click(function () {
  $(this).addClass("inputFocus");
});

//click outside input and remove border
$("#search-form input").blur(function () {
  $(this).removeClass("inputFocus");
});

// click cities in history
$(".search-history").on("click", "li", clickHistoryHandler);
