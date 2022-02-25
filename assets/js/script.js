var requestOptions = {
  method: "GET",
  redirect: "follow",
};

fetch("https://developer.nps.gov/api/v1/parks?parkCode=acad&api_key=0udE9V2GRj3cRahVJ120KpyLcjQ4YXlVgLpPg4RQ", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.log("error", error));
