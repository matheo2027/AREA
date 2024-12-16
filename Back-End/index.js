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

dotenv.config();

// Middleware CORS for all routes
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions)); // Active CORS

// Middleware de base
app.use(express.json());
app.use(logger);

// Configuration PostgreSQL
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


// Route by défault
app.get('/', (req, res) => {
  res.send('Serveur Express est opérationnel !');
});

// Route register
app.post('/auth/register', async (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const checkUserQuery = 'SELECT * FROM users WHERE email = $1';
    const userExists = await pool.query(checkUserQuery, [email]);

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'This email is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery = 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id';
    const result = await pool.query(insertQuery, [email, hashedPassword]);

    return res.status(201).json({ success: true, userId: result.rows[0].id });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'An error occurred.' });
  }
});

// Route Login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const checkUserQuery = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(checkUserQuery, [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

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

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
