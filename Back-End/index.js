const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8080;
const dotenv = require('dotenv');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const { NotFoundError } = require('./errors');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./middlewares/logger');

// Charger les variables depuis le fichier .env
dotenv.config();

// Middleware CORS pour autoriser les requêtes venant du frontend
const corsOptions = {
  origin: 'http://localhost:3000', // Remplacez par l'URL de votre frontend si elle est différente
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions)); // Active CORS

// Middleware de base
app.use(express.json());
app.use(logger); // Middleware de log

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

// Route par défaut
app.get('/', (req, res) => {
  res.send('Serveur Express est opérationnel !');
});

// Route d'inscription
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;

  // Vérifier si email et mot de passe sont fournis
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Vérifier si l'email est déjà enregistré
    const checkUserQuery = 'SELECT * FROM users WHERE email = $1';
    const userExists = await pool.query(checkUserQuery, [email]);

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'This email is already registered.' });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer l'utilisateur dans la base de données
    const insertQuery = 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id';
    const result = await pool.query(insertQuery, [email, hashedPassword]);

    // Répondre avec succès et l'ID de l'utilisateur
    return res.status(201).json({ success: true, userId: result.rows[0].id });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'An error occurred.' });
  }
});

// Route de connexion (login)
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  // Vérifier si email et mot de passe sont fournis
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Vérifier si l'utilisateur existe
    const checkUserQuery = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(checkUserQuery, [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];

    // Comparer le mot de passe avec le hachage stocké
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Répondre avec succès si l'authentification est réussie
    return res.status(200).json({ success: true, userId: user.id, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'An error occurred during login.' });
  }
});

app.post('/areas', async (req, res) => {
  const { action, reactions } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO areas (action, reactions) VALUES ($1, $2) RETURNING *',
      [action, reactions]
    );
    res.status(201).json({ success: true, area: result.rows[0] });
  } catch (err) {
    console.error('Error adding area:', err);
    res.status(500).json({ error: 'Failed to add area' });
  }
});

// Exemple pour une erreur 404 personnalisée
app.use((req, res, next) => {
  const error = new NotFoundError('Resource not found');
  return next(error);
});

// Middleware pour la gestion des erreurs
app.use(errorHandler);

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
