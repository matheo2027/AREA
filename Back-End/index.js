// index.js
require('dotenv').config();
require('./discordBot');
require('./githubStar');

const crypto = require('crypto');
const express = require('express');
const session = require('express-session');
const axios = require('axios');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const { handleGitHubStar } = require('./githubStar');
const { sendEmail } = require('./emailReaction'); // Assurez-vous que cette fonction existe
const passport = require('passport');
const { Client, GatewayIntentBits } = require('discord.js');

// Erreurs & middlewares (hypothèses)
const { NotFoundError } = require('./errors');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./middlewares/logger');

// Bot Discord (si besoin) - en attendant, on peut le commenter si on veut
// const client = require('./discordBot');

// Middleware d'auth très simplifié
// - Ici on suppose que le front envoie un header x-user-id = 123 par exemple
function checkAuth(req, res, next) {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ message: 'Not authenticated (no user ID)' });
  }
  req.userId = userId;
  next();
}

const app = express();
const PORT = process.env.PORT || 8080;

// Configuration CORS
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-user-id'],
};
app.use(cors(corsOptions));

// Middlewares de base
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

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
  ],
  partials: ['CHANNEL'],
});

// Vérifier la connexion BDD
pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Connection error', err));

// ------------------- ROUTES -------------------

// Route par défaut (sanity check)
app.get('/', (req, res) => {
  res.send('Serveur Express est opérationnel !');
});

// ------------ AUTHENTIFICATION ------------

// Route Register
app.post('/auth/register', async (req, res) => {

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Vérifier si l'utilisateur existe déjà
    const checkUserQuery = 'SELECT * FROM users WHERE email = $1';
    const userExists = await pool.query(checkUserQuery, [email]);

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'This email is already registered.' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id';
    const result = await pool.query(insertQuery, [username, email, hashedPassword]);

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
    // Vérifier si l'utilisateur existe
    const checkUserQuery = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(checkUserQuery, [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];
    // Comparer le hash
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Ici, on pourrait générer un token JWT
    // Pour la démo, on renvoie juste success + userId
    return res.status(200).json({
      success: true,
      userId: user.id,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'An error occurred during login.' });
  }
});

// Middleware pour les sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Initialiser Passport
app.use(passport.initialize());
app.use(passport.session());

app.post("/api/save-user", async (req, res) => {
  const { email, token, connexion } = req.body;

  if (!email || !token || !connexion) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Vérifier si l'utilisateur existe déjà
    const checkUserQuery = 'SELECT id FROM users WHERE email = $1';
    const existingUser = await pool.query(checkUserQuery, [email]);

    let userId;

    if (existingUser.rows.length > 0) {
      // Si l'utilisateur existe, mettre à jour son token et sa connexion
      const updateUserQuery = `
        UPDATE users
        SET token = $2, connexion = $3
        WHERE email = $1
        RETURNING id;
      `;
      const result = await pool.query(updateUserQuery, [email, token, connexion]);
      userId = result.rows[0].id;
    } else {
      // Si l'utilisateur n'existe pas, l'insérer
      const insertUserQuery = `
        INSERT INTO users (email, token, connexion)
        VALUES ($1, $2, $3)
        RETURNING id;
      `;
      const result = await pool.query(insertUserQuery, [email, token, connexion]);
      userId = result.rows[0].id;
    }

    return res.status(201).json({
      success: true,
      user: {
        id: userId,
        email,
        token,
        connexion,
      },
    });
  } catch (error) {
    console.error("Error saving user:", error);
    return res.status(500).json({ message: "Failed to save user" });
  }
});


// ------------------- AREAS -------------------

// Route pour créer un AREA (ex. "Discord - New Message" => "Send an Email")
// Protégée par checkAuth => on récupère userId via le header x-user-id
app.post('/areas', checkAuth, async (req, res) => {
  try {
    const userId = req.userId; // récupéré depuis checkAuth
    const { action, reaction } = req.body;

    if (!action || !reaction) {
      return res.status(400).json({ message: 'action and reaction are required.' });
    }

    // Insertion dans la table "areas"
    // Table example:
    //   CREATE TABLE areas (
    //     id SERIAL PRIMARY KEY,
    //     user_id INT NOT NULL,
    //     action VARCHAR(100) NOT NULL,
    //     reaction VARCHAR(100) NOT NULL,
    //     created_at TIMESTAMP DEFAULT NOW()
    //   );
    const insertQuery = `
      INSERT INTO areas (user_id, action, reaction)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [userId, action, reaction];

    const result = await pool.query(insertQuery, values);

    res.status(201).json({
      success: true,
      area: result.rows[0],
    });
  } catch (err) {
    console.error('Error creating AREA:', err);
    res.status(500).json({ error: 'Failed to create area' });
  }
});

// API YouTube
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY; // Ajoute ta clé API dans .env

// Dernière vidéo détectée par chaîne (en mémoire)
const lastVideos = {};

// Fonction pour vérifier les nouvelles vidéos
async function checkNewYouTubeVideos(channelId, channelName) {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: YOUTUBE_API_KEY,
        channelId,
        part: 'snippet',
        order: 'date',
        type: 'video',
        maxResults: 1,
      },
    });

    const video = response.data.items[0];
    const videoId = video.id.videoId;

    // Vérifier si la vidéo est nouvelle
    if (lastVideos[channelId] !== videoId) {
      lastVideos[channelId] = videoId; // Mettre à jour la dernière vidéo
      console.log(`Nouvelle vidéo détectée sur ${channelName}: ${video.snippet.title}`);

      // Appeler les réactions pour cette vidéo
      await triggerReactions(video, channelName);
    } else {
      console.log(`Aucune nouvelle vidéo sur la chaîne ${channelName}`);
    }
  } catch (error) {
    console.error(`Erreur lors de la vérification des vidéos pour ${channelName}:`, error);
  }
}

// Fonction pour gérer les réactions
async function triggerReactions(video, channelName) {
  const { title, description, publishedAt } = video.snippet;
  const videoUrl = `https://www.youtube.com/watch?v=${video.id.videoId}`;

  // Récupérer les `areas` associées à cette action
  const query = `
    SELECT a.*, u.email
    FROM areas a
    JOIN users u ON a.user_id = u.id
    WHERE a.action = 'youtubeNewVideo'
  `;
  const result = await pool.query(query);
  const areasList = result.rows;

  for (const area of areasList) {
    // Réaction : sendEmail
    if (area.reaction === 'sendEmail') {
      await sendEmail(
        area.email,
        `Nouvelle vidéo publiée sur ${channelName}`,
        `Titre : ${title}\nDescription : ${description}\nLien : ${videoUrl}`
      );
      console.log(`[REACTION] Email envoyé à ${area.email}`);
    }

    // Réaction : discordNotify
    else if (area.reaction === 'discordNotify') {
      const reactionQuery = `
        SELECT username
        FROM reactions
        WHERE user_id = $1
          AND name = 'discordNotify'
        LIMIT 1
      `;
      const reactionRes = await pool.query(reactionQuery, [area.user_id]);
      if (reactionRes.rows.length === 0) {
        console.log(`[REACTION] Aucun username Discord trouvé pour user_id=${area.user_id}`);
        continue;
      }

      const discordTag = reactionRes.rows[0].username; // ex "Babssow29#1234"
      const targetUser = client.users.cache.find((u) => u.tag === discordTag);

      if (!targetUser) {
        console.log(`[REACTION] Utilisateur Discord introuvable pour ${discordTag}`);
        continue;
      }

      await targetUser.send(`Nouvelle vidéo sur ${channelName} : ${title}\n${videoUrl}`);
      console.log(`[REACTION] DM Discord envoyé à ${discordTag}`);
    }
  }
}

// Fonction pour récupérer les chaînes depuis la base de données
async function getYouTubeChannelsFromDB() {
  const query = `
    SELECT DISTINCT parameters AS channelId, name
    FROM actions
    WHERE name = 'youtubeNewVideo'
  `;
  try {
    const result = await pool.query(query);
    return result.rows; // Renvoie un tableau d'objets avec { channelId, name }
  } catch (error) {
    console.error('Erreur lors de la récupération des chaînes YouTube depuis la base :', error);
    return [];
  }
}

// Lancer la vérification périodique
async function startYouTubeChecks() {
  try {
    const youtubeChannels = await getYouTubeChannelsFromDB();
    if (youtubeChannels.length === 0) {
      return;
    }

    console.log('Chaînes YouTube détectées pour surveillance :', youtubeChannels);

    // Vérification périodique toutes les 5 minutes
    setInterval(() => {
      youtubeChannels.forEach(({ channelid, name }) => {
        checkNewYouTubeVideos(channelid, name);
      });
    }, 300000); // 300000 ms = 5 minutes
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des vérifications YouTube :', error);
  }
}

// Initialiser les vérifications YouTube
startYouTubeChecks();


// Toujours dans index.js (par exemple)
app.get('/areas', checkAuth, async (req, res) => {
  try {
    const userId = req.userId;

    // Récupérer les areas de l'utilisateur
    const query = 'SELECT * FROM areas WHERE user_id = $1';
    const values = [userId];
    const result = await pool.query(query, values);

    // Renvoyer la liste des areas
    res.status(200).json({
      success: true,
      areas: result.rows, // un tableau d'objets
    });
  } catch (error) {
    console.error('Error fetching areas:', error);
    res.status(500).json({ message: 'Error fetching areas' });
  }
});

// Dans index.js (ou routes.js), route dédiée au webhook GitHub
function verifyGitHubSignature(req) {
  const signature = req.headers['x-hub-signature-256'];
  const payload = JSON.stringify(req.body);
  const hmac = crypto.createHmac('sha256', process.env.GITHUB_SECRET);
  hmac.update(payload);
  const calculatedSignature = `sha256=${hmac.digest('hex')}`;

  return crypto.timingSafeEqual(
    Buffer.from(signature || '', 'utf8'),
    Buffer.from(calculatedSignature, 'utf8')
  );
}

app.post('/webhooks/github', async (req, res) => {
  try {
    // Vérifiez la signature (optionnel)
    if (!verifyGitHubSignature(req)) {
      return res.status(403).send('Signature GitHub invalide');
    }

    const eventType = req.headers['x-github-event'];
    if (eventType !== 'star') {
      return res.status(400).send('Type d\'événement invalide');
    }

    const payload = req.body;
    if (!payload.sender || !payload.repository) {
      return res.status(400).send('Payload invalide');
    }

    if (payload.action === 'created') {
      console.log(`[ACTION] Nouvelle étoile détectée pour ${payload.repository.full_name} par ${payload.sender.login}`);
      await handleGitHubStar(payload);
    }

    res.status(200).send('Webhook traité avec succès');
  } catch (error) {
    console.error('Erreur lors du traitement du Webhook GitHub :', error);
    res.status(500).send('Erreur interne du serveur');
  }
});

// Middleware pour les actions AREA (Exemple générique)
app.post('/actions', async (req, res) => {
  try {
    const { user_id, name, parameters } = req.body;

    if (!user_id || !name || !parameters) {
      return res.status(400).json({ message: 'Champs manquants' });
    }

    const query = `
      INSERT INTO actions (user_id, name, parameters)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [user_id, name, parameters];

    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      action: result.rows[0],
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'action :', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

// Middleware pour les réactions AREA
app.post('/reactions', async (req, res) => {
  try {
    const { user_id, name, username } = req.body;

    if (!user_id || !name) {
      return res.status(400).json({ message: 'Champs manquants' });
    }

    const query = `
      INSERT INTO reactions (user_id, name, username)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [user_id, name, username];

    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      reaction: result.rows[0],
    });
  } catch (error) {
    console.error('Erreur lors de la création de la réaction :', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

// Surveiller les dépôts GitHub périodiquement
setInterval(() => {
  handleGitHubStar()
    .catch((err) => console.error('Erreur lors de la vérification périodique :', err));
}, 30000); // 30 secondes pour tester

app.post('/actions', async (req, res) => {
  try {
    const { user_id, name, parameters } = req.body;

    if (!user_id || !name || !parameters) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const query = `
      INSERT INTO actions (user_id, name, parameters)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [user_id, name, parameters];

    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      action: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating action:', error);
    res.status(500).json({ message: 'Failed to create action' });
  }
});

// Dans index.js (ou un fichier routes.js)
app.post('/reactions', checkAuth, async (req, res) => {
  try {
    // user_id, name, username sont fournis dans le body
    const { user_id, name, username } = req.body;

    // Optionnel : vérifier que les champs sont présents
    if (!user_id || !name || !username) {
      return res.status(400).json({ error: 'Missing fields.' });
    }

    // Insérer en base
    const query = `
      INSERT INTO reactions (user_id, name, username)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [user_id, name, username];

    const result = await pool.query(query, values);

    // Retourner le nouvel enregistrement
    return res.status(201).json({
      success: true,
      reaction: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating reaction:', error);
    return res.status(500).json({ error: 'Unable to create reaction.' });
  }
});

app.post('/discord/dm', checkAuth, async (req, res) => {
  try {
    const { reactionId, messageToSend } = req.body;

    if (!reactionId || !messageToSend) {
      return res.status(400).json({ error: 'Missing reactionId or messageToSend' });
    }

    // Vérifier l'authentification
    if (!req.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Récupérer la réaction dans la table "reactions"
    const query = 'SELECT * FROM reactions WHERE id = $1';
    const result = await pool.query(query, [reactionId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reaction not found' });
    }

    const reaction = result.rows[0];

    // Vérifier si l'utilisateur est propriétaire de la réaction
    if (reaction.user_id !== req.userId) {
      return res.status(403).json({ error: 'You do not own this reaction' });
    }

    // Récupérer l'utilisateur Discord par ID
    try {
      const targetUser = await client.users.fetch(reaction.username); // Assurez-vous que `reaction.username` est un ID Discord

      if (!targetUser) {
        return res.status(404).json({ error: `Discord user not found for ID: ${reaction.username}` });
      }

      // Envoyer le message
      await targetUser.send(messageToSend);
      return res.status(200).json({ success: true, message: 'DM sent successfully' });
    } catch (error) {
      if (error.code === 50007) { // Cannot send messages to this user
        return res.status(400).json({ error: 'Cannot send DM. User might have disabled DMs from bots.' });
      }
      console.error('Error sending DM:', error);
      return res.status(500).json({ error: 'Failed to send DM' });
    }
  } catch (error) {
    console.error('Error in /discord/dm:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API pour ajouter une action météo
app.post('/actions/weather', checkAuth, async (req, res) => {
  try {
    const { city, user_id } = req.body;

    if (!city || !user_id) {
      return res.status(400).json({ message: 'Missing city or user ID.' });
    }

    const query = `
      INSERT INTO actions (user_id, name, parameters)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [user_id, 'weatherRain', city];

    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      action: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating weather action:', error);
    res.status(500).json({ message: 'Failed to create weather action' });
  }
});

// Fonction pour vérifier les prévisions météo
async function checkWeatherForecast() {
  try {
    // Récupérer toutes les actions météo
    const query = `
      SELECT a.*, u.email
      FROM actions a
      JOIN users u ON a.user_id = u.id
      WHERE a.name = 'weatherRain'
    `;
    const result = await pool.query(query);
    const actionsList = result.rows;

    for (const action of actionsList) {
      const city = action.parameters;
      const userEmail = action.email;

      // Appeler l'API météo
      const weatherResponse = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          q: city,
          appid: process.env.OPENWEATHER_API_KEY,
          units: 'metric',
        },
      });

      const weatherData = weatherResponse.data;
      const weatherCondition = weatherData.weather[0].main.toLowerCase();

      // Vérifier si la pluie est prévue
      if (weatherCondition.includes('rain')) {
        console.log(`Pluie détectée à ${city}`);

        // Envoyer un email
        await sendEmail(
          userEmail,
          `Pluie prévue à ${city}`,
          `La pluie est prévue aujourd'hui dans la région de ${city}. Préparez-vous !`
        );

        console.log(`[REACTION] Email envoyé à ${userEmail} pour la pluie à ${city}`);
      } else {
        console.log(`Aucune pluie détectée à ${city}`);
      }
    }
  } catch (error) {
    console.error('Error checking weather forecast:', error);
  }
}

// Lancer la vérification périodique toutes les 10 minutes
setInterval(checkWeatherForecast, 600000); // 600000 ms = 10 minutes


// ------------------- 404 & ERROR HANDLER -------------------

// Route 404 : si aucune route au-dessus ne match, on lance NotFoundError
app.use((req, res, next) => {
  throw new NotFoundError('Route not found');
});

// Middleware de gestion des erreurs
app.use(errorHandler);

// ------------------- SERVEUR -------------------
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
