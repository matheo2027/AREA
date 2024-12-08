const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

// Endpoint pour récupérer la météo d'une ville
router.get('/weather', async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: 'Veuillez fournir une ville dans les paramètres de la requête.' });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

  try {
    const response = await axios.get(apiUrl);
    const weatherData = response.data;

    res.json({
      city: weatherData.name,
      temperature: weatherData.main.temp,
      description: weatherData.weather[0].description,
      humidity: weatherData.main.humidity,
      windSpeed: weatherData.wind.speed,
    });
  } catch (err) {
    console.error('Erreur lors de l\'appel à OpenWeatherMap :', err.message);
    res.status(500).json({ error: 'Impossible de récupérer les données météo. Veuillez réessayer plus tard.' });
  }
});

module.exports = router;
