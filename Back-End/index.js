const express = require('express');
const app = express();
const PORT = 8080;

// Middleware de base
app.use(express.json());

// Route par défaut
app.get('/', (req, res) => {
    res.send('Serveur Express est opérationnel !');
});

// Route about.json
app.get('/about.json', (req, res) => {
    res.json({
      timestamp: Date.now(),
      services: ['server', 'client_web', 'database'],
    });
  });


// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

// Route exemple
const exampleRoute = require('./routes/example');
app.use('/api', exampleRoute);

// Middleware logger
const logger = require('./middlewares/logger');
app.use(logger);
