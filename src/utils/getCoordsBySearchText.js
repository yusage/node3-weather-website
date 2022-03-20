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
            console.log(`Place name: ${features[0].place_name}, coords: ${coords}`);
            callback(undefined, coords);
        }
    });
};

module.exports = getCoordsBySearchText;