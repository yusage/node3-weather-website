const path = require('path');
const express = require('express');
const hbs = require('hbs');
const utils = require('./utils/utils');

const app = express();
const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname,'../public');
const viewsPath = path.join(__dirname,'../templates/views');
const partialsPath = path.join(__dirname,'../templates/partials');


app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static(publicDirectoryPath));

const authorName = 'yusage';

// main page
app.get('', (req, res) => {
    res.render('index',{
        title: 'Weather app',
        name: authorName
    });
});

// about page
app.get('/about', (req, res) => {
    res.render('about',{
        title: 'About application',
        name: authorName
    });
});

// help page
app.get('/help', (req, res) => {
    res.render('help',{
        title: 'Help page',
        name: authorName
    });
});

// index page
app.get('', ({query: {address}}, res) => {
    if (!address) {
        return res.render('error', {
            title: 'Current weather',
            name: authorName,
            address: address,
            errorMessage: 'Error: Address has to be provided.'
        });
    }
    utils.getCoordsBySearchText(address, (error, data) => {
        if (error) {
            return res.render('error', {
                title: 'Current weather',
                name: authorName,
                address: address,
                errorMessage: error
            });
        }
        utils.getCurrentWeatherByCoords(data, (error, {location, current} = {}) => {
            if (error) {
                return res.render('error', {
                    title: 'Current weather',
                    name: authorName,
                    address: address,
                    errorMessage: error
                });
            }
            res.render('weather', {
                title: 'Current weather',
                name: authorName,
                address: address,
                latitude: data[0],
                longitude: data[1],
                location: `Weather in ${location.name}, ${location.region}, ${location.country}`,
                forecast: `${current.weather_descriptions[0]}. This is currently ${current.temperature} degrees out. It feels like ${current.feelslike} degrees out.`
            });
        });
    });
});

app.get('/weather', ({query: {address}}, res) => {
    if (!address) {
        return res.send({
            error: 'Error: Address has to be provided.'
        });
    }
    utils.getCoordsBySearchText(address, (error, data) => {
        if (error) {
            return res.send({
                error
            });
        }
        utils.getCurrentWeatherByCoords(data, (error, {location, current} = {}) => {
            if (error) {
                return res.send({
                    error
                });
            }
            const loc = `${location.name}, ${location.region}, ${location.country}`;
            const forecast = `${current.weather_descriptions[0]}. This is currently ${current.temperature} degrees out. It feels like ${current.feelslike} degrees out. The humidity is ${current.humidity}%.`;
            // res.send(loc+'\n'+forecast);
            res.send({
                address,
                location: loc,
                forecast
            });
        });
    });
});

// help/* page
app.get('/help/*', (req, res) =>{
    res.render('404', {
        title: 'Help page',
        name: authorName,
        errorMessage: 'Help article not found'
    });
});

// products page
app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send('Search parameter not provided');
    }
    console.log(req.query);
    res.send({
        products: []
    });
});

// * page
app.get('*', (req, res) =>{
    res.render('404', {
        title: 'My 404 page',
        name: authorName,
        errorMessage: 'Page not found'
    });
});

app.listen(port, () => {
    console.log('Listening to port ' + port);
});