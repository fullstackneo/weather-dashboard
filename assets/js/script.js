var searchHistory = Array[8];
searchHistory = ["Los Angeles", "New York", "Chicago", "Las Vegas", "Salt Lake City", "San Antonio", "Phoenix", "Houston"];

// show the cities in history
$(".search-history li").each(function (index, el) {
  $(el).text(searchHistory[index]);
});

$("#search-form").on("submit", formDataHandler);

function formDataHandler(e) {
  e.preventDefault();
  var city = $(this).find("input").val().trim();
  if (!city) {
    city = "San Diego";
  }
  // get city's lat and lon info
  fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + city + "&key=AIzaSyCueXEoU9lnKGoZ8uawRHGyV8tjNV9C_Sg")
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
    })
    .catch((error) => console.log("error", error));
}
