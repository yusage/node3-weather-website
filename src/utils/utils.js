const request = require('request');

const getCoordsBySearchText = (searchText, callback) => {
    const pageGeo = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    const tokenGeo = 'pk.eyJ1IjoieXVzYWdlIiwiYSI6ImNsMHYzcXk1bzBxOHgzY24xZGY2aGxlNHUifQ.Mw3lobLVPyumjWdLtklGpw';

    const urlGeo = pageGeo + encodeURIComponent(searchText) +'.json?access_token=' + tokenGeo + '&limit=1';
    request({ url: urlGeo, json: true}, (error, {body: {features}}) => {
        if (error) {
            callback('Unable to connect to Geo server', undefined);
        } else if (features.length === 0) {
            callback('Location not found', undefined);
        } else {
            const coords = features[0].center;
            callback(undefined, coords);
        }
    });
};

const getCurrentWeatherByCoords = (coords, callback) => {
    if (!coords || coords.length != 2) {
        callback('Wrong coordinates',undefined);
    }
    const pageWeather = 'http://api.weatherstack.com/current';
    const tokenWeather = '0f9444a9055880b46a1c2dbc650569dd';
    const urlWeather = pageWeather + '?access_key=' + tokenWeather + '&query='+coords[1]+','+coords[0];
    request({ url: urlWeather, json: true}, (error, {body} ={}) => {
        if (error || !body) {
            callback('Unable to connect to Weather server', undefined);
        } else if (body.success != undefined & !body.success) {
            callback('Weather forecast for location not found',undefined);
        } else {
            callback(undefined, body);
        }
    });
};

module.exports = {
    getCoordsBySearchText,
    getCurrentWeatherByCoords
};