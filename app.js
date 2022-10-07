require("dotenv").config();
const express = require('express');
const https = require("https");

const app = express();

app.use(express.urlencoded({extended: true}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html")
});

app.post("/", function(req, res) {
  const cityName = req.body.nameCity; // we take the name of the city from our formular
  const apiKey = process.env.WEATHER_API_KEY;
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey + "&units=" + unit;
  https.get(url, function(response) { // we access the external server through the API
    response.on("data", function(data) { //we take the live data from the external server
      const weatherData = JSON.parse(data); // we transfrom the data from the JSON format to string format
      const temp = weatherData.main.temp; // we take the temperature
      const description = weatherData.weather[0].description; //we take the descriprion of the weather ..... weather is an array
      const icon = weatherData.weather[0].icon; // we take the img id
      const iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"; // we create the url for the img id we have taken
      res.write("<h1>The temperature in " + cityName + " is " + temp + " degrees Celsius.</h1>"); // display the temperature
      res.write("<p>The weather is curently " + description + "</p>"); // display the description
      res.write("<img src=" + iconURL + ">"); // we display an img with the source of our img id
      res.send();
    });
  });
})

app.listen(3000, function() {
  console.log("Server running on port 3000.");
});
