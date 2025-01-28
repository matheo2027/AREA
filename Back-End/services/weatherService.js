// services/weatherService.js
const axios = require('axios');
const pool = require('../db');
const { sendEmail } = require('./emailReaction');

async function checkWeatherForecast() {
  try {
    const sql = `
      SELECT a.*, u.email
      FROM actions a
      JOIN users u ON a.user_id = u.id
      WHERE a.name = 'weatherRain'
    `;
    const { rows: actionsList } = await pool.query(sql);

    for (const action of actionsList) {
      const city = action.parameters;
      const userEmail = action.email;

      const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          q: city,
          appid: process.env.OPENWEATHER_API_KEY,
          units: 'metric',
        },
      });

      const weatherData = response.data;
      const condition = weatherData.weather[0]?.main?.toLowerCase() || '';

      if (condition.includes('rain')) {
        console.log(`[WEATHER] Rain detected in ${city}`);
        await sendEmail(
          userEmail,
          `Rain in ${city}`,
          `It's going to rain in ${city} today. Stay dry!`
        );
      } else {
        console.log(`[WEATHER] No rain in ${city}`);
      }
    }
  } catch (error) {
    console.error('[WEATHER] Error checking forecast:', error);
  }
}

function startWeatherChecks() {
  // Immediately run once
  checkWeatherForecast();
  // every 10 minutes
  setInterval(() => {
    checkWeatherForecast();
  }, 60000);
}

module.exports = { startWeatherChecks };
