require('dotenv').config();
require('./services/discordBot');
require('./services/githubStar');

const express = require('express');
const session = require('express-session');
const cors = require('cors');

const pool = require('./db');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./middlewares/logger');

const authRoutes = require('./authentification/authRoutes');
const areasRoutes = require('./areas/areasRoutes');
const actionsRoutes = require('./areas/actionsRoutes');
const reactionsRoutes = require('./areas/reactionsRoutes');

const { setupDiscordRoutes } = require('./services/discordBot');
const { startYouTubeChecks } = require('./services/youtubeService');
const { startWeatherChecks } = require('./services/weatherService');
const { startGitHubStarCheck } = require('./services/githubService');

const { NotFoundError } = require('./errors');

// --------------------------------------------------
// MIDDLEWARE: CHECK AUTH
// --------------------------------------------------

function checkAuth(req, res, next) {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ message: 'Not authenticated (no user ID)' });
  }
  req.userId = userId;
  next();
}

// --------------------------------------------------
// APP SETUP
// --------------------------------------------------

const app = express();
const PORT = process.env.PORT || 8080;

// CORS : Autoriser les requêtes cross-origin depuis n’importe quel domaine.
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-user-id'],
}));

// Parser automatiquement le JSON dans le corps des requêtes.
app.use(express.json());

// Logger ou afficher des informations sur chaque requête pour faciliter le debug ou le suivi.
app.use(logger);


// Check connection
pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Connection error', err));

// --------------------------------------------------
// BASIC ROUTES
// --------------------------------------------------

app.get('/', (req, res) => {
  res.send('Serveur Express est opérationnel !');
});

app.get('/about.json', (req, res) => {
  res.sendFile(__dirname + '/about.json');
});

// --------------------------------------------------
// AUTHENTICATION ROUTES
// --------------------------------------------------

// All `/auth` routes (Register, Login, etc.)
app.use('/auth', authRoutes);

// --------------------------------------------------
// SESSION MIDDLEWARE
// --------------------------------------------------

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: true,
  })
);

// --------------------------------------------------
// AREAS ROUTES
// --------------------------------------------------


// All `/areas` routes
app.use('/areas', areasRoutes);

// --------------------------------------------------
// ACTIONS ROUTES
// --------------------------------------------------

app.use('/actions', actionsRoutes);     // for /actions


// --------------------------------------------------
// REACTIONS ROUTES
// --------------------------------------------------

app.use('/reactions', reactionsRoutes); // for /reactions

// --------------------------------------------------
// DISCORD SETUP
// --------------------------------------------------

setupDiscordRoutes(app, checkAuth);

// --------------------------------------------------
// YOUTUBE CHECKS
// --------------------------------------------------

startYouTubeChecks();

// --------------------------------------------------
// WEATHER CHECKS
// --------------------------------------------------

startWeatherChecks();

// --------------------------------------------------
// GITHUB CHECKS
// --------------------------------------------------

startGitHubStarCheck();

// --------------------------------------------------
// 404 & ERROR HANDLING
// --------------------------------------------------

// 404 if no route matched
app.use((req, res, next) => {
  throw new NotFoundError('Route not found');
});

// Central error handling
app.use(errorHandler);

// --------------------------------------------------
// START SERVER
// --------------------------------------------------

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
