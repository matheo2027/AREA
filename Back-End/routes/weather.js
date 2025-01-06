const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

let selectedCity = '';

// Action : L'utilisateur choisit une ville
router.post('/weather/city', (req, res) => {
  const { city } = req.body;

  if (!city) {
    return res.status(400).json({ error: 'Veuillez fournir une ville dans la requête.' });
  }

  selectedCity = city; // Stocke la ville choisie
  res.json({ message: `Ville choisie : ${selectedCity}` });
});

// Réaction : Obtenir la météo pour la ville choisie
router.get('/weather', async (req, res) => {
  if (!selectedCity) {
    return res.status(400).json({ error: 'Aucune ville choisie. Veuillez d\'abord choisir une ville.' });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(selectedCity)}&appid=${apiKey}&units=metric`;

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
