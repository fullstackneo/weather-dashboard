// return future date according to tomorrow(i=1), the day after tomorrow(i=2) ,etc
function displayDate(i) {
  var date = new Date();
  date = date.setDate(date.getDate() + i);
  date = new Date(date);
  return  date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() ;
}

var searchHistory = Array[8];
searchHistory = ["Los Angeles", "New York", "Chicago", "Las Vegas", "Salt Lake City", "San Antonio", "Phoenix", "Houston"];

// display current weather
function displayCurrent(data, city) {
  // display city name
  $(".today h3").html(city + " <span></span><i>weather icon</i>");

  // display current date
  $(".today h3 span").text("("+displayDate(0)+")");

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
function displayFuture(futureData, i) {
  // display date
  $(".weather-row").children("div").eq(i).find("p").text(displayDate(i+1));

  // display weather data
  $(".weather-row>div")
    .eq(i)
    .find("span")
    .each(function (index, el) {
      $(this).text(futureData[index]);
    });
}

// get weather info
function getWeather(lat, lon, city) {
  fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=07fbc9932f3a4d5f19df3aa5907fbbb2")
    .then((response) => response.json())
    .then((result) => {
      // display current weather
      var currentData = [result.current.temp, result.current.wind_speed, result.current.humidity, result.current.uvi.toFixed(2)];
      displayCurrent(currentData, city);
      //display future weather
      for (let i = 0; i < 5; i++) {
        var futureData = [result.daily[i].temp.day, result.daily[i].wind_speed, result.daily[i].humidity];
        displayFuture(futureData, i);
      }
    })
    .catch((error) => console.log("error", error));
}

// show the cities in history
$(".search-history li").each(function (index, el) {
  $(el).text(searchHistory[index]);
});

// click search button and display result
$("#search-form").on("submit", formDataHandler);

function formDataHandler(e) {
  e.preventDefault();
  var city = $(this).find("input").val().trim();

  // city default value is San Diego
  if (!city) {
    city = "San Diego";
  }
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
