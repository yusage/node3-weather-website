const request = require('request');

const getCurrentWeatherByCoords = (coords, callback) => {
    const pageWeather = 'http://api.weatherstack.com/current';
    const tokenWeather = '0f9444a9055880b46a1c2dbc650569dd';
    const urlWeather = pageWeather + '?access_key=' + tokenWeather + '&query='+coords[1]+','+coords[0];
    request({ url: urlWeather, json: true}, (error, {body} ) => {
        if (error) {
            callback('Unable to connect to Weather server', undefined);
        } else if (body.success != undefined & !body.success) {
            callback('Weather forecast for location not found',undefined);
        } else {
            callback(undefined, body);
        }
    });
};

module.exports = getCurrentWeatherByCoords;