const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 8080;
const dotenv = require('dotenv');
const { Pool } = require('pg');
const { ValidationError, NotFoundError, InternalServerError } = require('./errors');
const errorHandler = require('./middlewares/errorHandler');

// Data Schema for Current Weather Data
// {
//   "coord": { "lon": Number, "lat": Number },
//   "weather": [{ "id": Number, "main": String, "description": String, "icon": String }],
//   "base": String,
//   "main": { "temp": Number, "feels_like": Number, "temp_min": Number, "temp_max": Number, "pressure": Number, "humidity": Number },
//   "visibility": Number,
//   "wind": { "speed": Number, "deg": Number },
//   "clouds": { "all": Number },
//   "dt": Number,
//   "sys": { "type": Number, "id": Number, "country": String, "sunrise": Number, "sunset": Number },
//   "timezone": Number,
//   "id": Number,
//   "name": String,
//   "cod": Number
// }

// Charger les variables depuis le fichier .env
dotenv.config();

// Middleware de base
app.use(express.json());

// Middleware errorHandler
app.use(errorHandler);

app.get('/weather', async (req, res) => {
    const city = req.query.city;
    if (!city) {
        return next(new ValidationError('La ville est requise'));
    }
    try {
        const apiKey = process.env.OPENWEATHER_API_KEY;
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
        if (response.data.cod === '404') {
            return next(new NotFoundError('Ville non trouvée'));
        }
        res.json(response.data);
    } catch (error) {
        next(new InternalServerError('Erreur lors de la récupération des données météo'));
    }
});

app.listen(PORT, () => {
    console.log(`Serveur Express à l'écoute sur le port ${PORT}`);
});