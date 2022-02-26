var searchHistory = Array[8];
searchHistory = ["Los Angeles", "New York", "Chicago", "Las Vegas", "Salt Lake City", "San Antonio", "Phoenix", "Houston"];
console.log(searchHistory);

$(".search-history li").each(function (index, el) {
  $(el).text(searchHistory[index]);
});

fetch("https://maps.googleapis.com/maps/api/geocode/json?address=san+diegoA&key=AIzaSyCueXEoU9lnKGoZ8uawRHGyV8tjNV9C_Sg")
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.log("error", error));
