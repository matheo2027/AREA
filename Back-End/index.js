const express = require('express');
const app = express();
const PORT = 8080;
const dotenv = require('dotenv');
const { Pool } = require('pg');
const { NotFoundError} = require('./errors');
const errorHandler = require('./middlewares/errorHandler');

// Charger les variables depuis le fichier .env
dotenv.config();

// Middleware de base
app.use(express.json());

// Middleware errorHandler
app.use(errorHandler);

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

// Configuration de la connexion PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Tester la connexion à la base
pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Connection error', err));

// Exemple : Endpoint pour récupérer une liste d'utilisateurs
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Exemple : Endpoint pour ajouter un utilisateur
app.post('/users', async (req, res) => {
  const { username, email } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *',
      [username, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding user:', err);
    res.status(500).json({ error: 'Failed to add user' });
  }
});

// Exemple erreur 404
app.get('/resource', (req, res, next) => {
  const error = new NotFoundError('Resource not found');
  return next(error);
});

// Middleware logger
const logger = require('./middlewares/logger');
app.use(logger);

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});