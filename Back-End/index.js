const express = require('express');
const app = express();
const PORT = 8080;
const dotenv = require('dotenv');

// Charger les variables depuis le fichier .env
dotenv.config();

// Middleware de base
app.use(express.json());

// Route par défaut
app.get('/', (req, res) => {
    res.send('Serveur Express est opérationnel !');
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

// Route exemple
const exampleRoute = require('./routes/example');
app.use('/api', exampleRoute);

// Route about.js
const aboutjsonRoute = require('./routes/about.json');
app.use(aboutjsonRoute);

// Route config
const configRoute = require('./routes/config');
app.use(configRoute);

// Middleware logger
const logger = require('./middlewares/logger');
app.use(logger);
