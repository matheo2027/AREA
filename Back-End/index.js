const express = require('express');
const app = express();
const PORT = 8080;
const dotenv = require('dotenv');
const { Pool } = require('pg');
const errorHandler = require('./middlewares/errorHandler');
const validateRequest = require('./middlewares/validateRequest'); // Middleware de validation

// Configuration dotenv
dotenv.config();

// Middleware de base
app.use(express.json());

// Middleware errorHandler
app.use(errorHandler);
app.use(validateRequest); // Middleware de validation

// Route par défaut
app.get('/', (req, res) => {
    res.send('Serveur Express est opérationnel !');
});

// Route exemple
const exampleRoute = require('./routes/example');
app.use('/api', exampleRoute);

// Route weather
const weatherRoute = require('./routes/weather');
app.use('/api', weatherRoute);

// Route about.js
const aboutjsonRoute = require('./routes/about.json');
app.use(aboutjsonRoute);

// Route config
const configRoute = require('./routes/config');
app.use(configRoute);

// Configuration connection PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// check connection BDD
pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Connection error', err));

// Example : Endpoint for get the users from the database
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Middleware logger
const logger = require('./middlewares/logger');
app.use(logger);

// Start the server
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});