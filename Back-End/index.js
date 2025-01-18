// index.js
require('dotenv').config();
require('./discordBot');

const express = require('express');
const session = require('express-session');
const axios = require('axios');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const { handleGitHubStar } = require('./githubStar');
const { sendEmail } = require('./emailReaction'); // Assurez-vous que cette fonction existe
const passport = require('./auth');

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

// Routes pour les fournisseurs OAuth
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => res.redirect('/dashboard')
);

app.get('/auth/discord', passport.authenticate('discord', { scope: ['identify', 'email'] }));
app.get(
  '/auth/discord/callback',
  passport.authenticate('discord', { failureRedirect: '/login' }),
  (req, res) => res.redirect('/dashboard')
);

app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => res.redirect('/dashboard')
);


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

// Lancer la vérification périodique pour une ou plusieurs chaînes
const youtubeChannels = [
  { id: 'UCq-Fj5jknLsUf-MWSy4_brA', name: 'Chaîne T-Series' }, // Exemple
  { id: 'UCpEhnqL0y41EpW2TvWAHD7Q', name: 'Chaîne SET India' }, // Exemple
];

// Vérification périodique toutes les 5 minutes
setInterval(() => {
  youtubeChannels.forEach(({ id, name }) => checkNewYouTubeVideos(id, name));
}, 300000); // 300000 ms = 5 minutes

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
app.post('/webhooks/github', async (req, res) => {
  try {
    const payload = req.body;  // assure-toi d’avoir app.use(express.json()) activé
    if (payload.action === 'created') {
      // On sait qu’on vient de "starrer" le repo
      // => Ici, on exécute la logique pour la suite (réaction)
      console.log(`[ACTION] Nouveau star par ${payload.sender.login}`);
      await handleGitHubStar(payload);
      // ... On déclenche ensuite la réaction (envoyer un message Discord) ...
      // Soit directement, soit via un mécanisme d’AREA en base
    }
    res.status(200).send('OK');
  } catch (error) {
    console.error('GitHub webhook error:', error);
    res.status(500).send('Error');
  }
});

// Dans index.js (ou un fichier routes.js)
// On suppose que pool est déjà importé/configuré avec Pool from 'pg'
// et checkAuth est ton middleware d’authentification
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

    // 1) Récupérer la ligne dans la table "reactions"
    //    On suppose que "reactions" a un champ "id" (PRIMARY KEY)
    //    et qu'il y a username = "Pseudo#1234"
    const query = 'SELECT * FROM reactions WHERE id = $1';
    const result = await pool.query(query, [reactionId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reaction not found' });
    }

    const reaction = result.rows[0];
    // reaction.username => ex "Babssow29#1234"
    // reaction.name => "discordNotify" (selon ce que tu as stocké)
    // reaction.user_id => l'id de l'user dans ta base, etc.

    // (Optionnel) Vérifier que la reaction.user_id correspond à req.userId
    // si tu veux être sûr que c'est le "propriétaire" qui déclenche le DM
    if (reaction.user_id != req.userId) {
      return res.status(403).json({ error: 'You do not own this reaction' });
    }

    // 2) Trouver l'utilisateur dans le cache du bot via le tag
    const discordTag = reaction.username; // ex "Babssow29#1234"
    const targetUser = client.users.cache.find((u) => u.tag === discordTag);

    if (!targetUser) {
      return res
        .status(404)
        .json({ error: `Discord user not found in bot cache for tag: ${discordTag}` });
    }

    // 3) Envoyer le DM
    await targetUser.send(messageToSend);

    return res.status(200).json({ success: true, message: 'DM sent successfully' });
  } catch (error) {
    console.error('Error sending Discord DM:', error);
    res.status(500).json({ error: 'Failed to send DM' });
  }
});

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
