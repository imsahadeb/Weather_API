
var express = require('express');
const http = require('http');
var bodyParser = require('body-parser');
var app = express();
const request_get = require('request');
const wwoApiKey="d39a3c387837421685761154180605";
const host = "api.worldweatheronline.com";
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(bodyParser.json());

app.post('/api',function(request,response){
    var myresult="";
   // let post_body="";
   // let city = request.body.queryResult.parameters['geo-city']; // city is a required param
   let city = request.body.queryResult.parameters['geo-city'];

    console.log("Your City Is: "+city);
    // Get the date for the weather forecast (if present)
    let date = '';
    if (request.body.queryResult.parameters['date']) {
      date = request.body.queryResult.parameters['date'];
      console.log('Date: ' + date);
    }
    console.log("Your date is :"+date);
    

    let path = 'http://api.worldweatheronline.com/premium/v1/weather.ashx?format=json&num_of_days=1' +
    '&q=' + encodeURIComponent(city) + '&key=' + wwoApiKey + '&date=' + date;
  // Make the HTTP request to get the weather
  request_get(path,(err,res,body)=>{
      // After all the data has been received parse the JSON for desired data
      let info = JSON.parse(body);
      let forecast = info['data']['weather'][0];
      let location = info['data']['request'][0];

      let conditions = info['data']['current_condition'][0];
      let currentConditions = conditions['weatherDesc'][0]['value'];
      let windSpeed = conditions['windspeedMiles'];

      // Create response
      myresult = `Current conditions in the ${location['type']} 
      ${location['query']} are ${currentConditions} with a projected high of
      ${forecast['maxtempC']}°C or ${forecast['maxtempF']}°F and a low of 
      ${forecast['mintempC']}°C or ${forecast['mintempF']}°F and wind speed is ${windSpeed} miles/hour on 
      ${forecast['date']}.`;
      response.json({ 'fulfillmentText': myresult });
   });
   
});
app.listen(process.env.PORT || 80);

