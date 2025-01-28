require('dotenv').config();
const { sendEmail } = require('./emailReaction');
const { Client, GatewayIntentBits } = require('discord.js');
const pool = require('../db');

// Configurer le client Discord
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages],
  partials: ['CHANNEL'],
});

// Connecter le bot Discord
client.login(process.env.DISCORD_BOT_TOKEN);

client.on('ready', () => {
});

// Fonction pour gérer les événements GitHub Star
async function handleGitHubStar() {
  try {
    // Récupérer toutes les actions githubStar et leurs réactions associées
    const query = `
      SELECT a.parameters AS repo_url, ar.reaction, u.email, r.username
      FROM actions a
      JOIN areas ar ON a.name = ar.action
      JOIN users u ON a.user_id = u.id
      LEFT JOIN reactions r ON ar.reaction = r.name AND a.user_id = r.user_id
      WHERE a.name = 'githubStar'
    `;
    const result = await pool.query(query);
    const actionsList = result.rows;

    for (const action of actionsList) {
      const { repo_url, reaction, username, email } = action;

      try {
        // Obtenir le nombre actuel d'étoiles du dépôt
        const currentStars = await getGitHubStars(repo_url);
        if (currentStars === null) {
          console.log(`[ERROR] Impossible de récupérer les étoiles pour ${repo_url}`);
          continue;
        }

        // Vérifier si une nouvelle étoile a été ajoutée
        const lastStarsQuery = `SELECT last_stars FROM star_tracking WHERE repo_url = $1 LIMIT 1`;
        const lastStarsResult = await pool.query(lastStarsQuery, [repo_url]);

        let lastStars = 0;
        if (lastStarsResult.rows.length > 0) {
          lastStars = lastStarsResult.rows[0].last_stars;
        }

        if (currentStars > lastStars) {
          console.log(`Nouvelle étoile détectée pour ${repo_url}`);

          // Réaction : sendEmail
          if (reaction === 'sendEmail') {
            await sendEmail(
              email,
              'New GitHub Star',
              `Your repository ${repo_url} just received a new star!`
            );
            console.log(`[REACTION] Email envoyé à ${email}`);
          }

          // Réaction : discordNotify
          if (reaction === 'discordNotify') {
            const targetUser = client.users.cache.find((u) => u.tag === username);

            if (!targetUser) {
              console.log(`[REACTION] Utilisateur Discord introuvable pour ${username}`);
              continue;
            }

            await targetUser.send(`Your repository ${repo_url} just received a new star!`);
            console.log(`[REACTION] DM Discord envoyé à ${username}`);
          }

          // Mettre à jour le dernier nombre d'étoiles
          const updateStarsQuery = `
            INSERT INTO star_tracking (repo_url, last_stars)
            VALUES ($1, $2)
            ON CONFLICT (repo_url)
            DO UPDATE SET last_stars = EXCLUDED.last_stars
          `;
          await pool.query(updateStarsQuery, [repo_url, currentStars]);
        }
      } catch (error) {
        console.error(`[ERROR] Erreur dans la réaction pour ${repo_url}`, error);
      }
    }
  } catch (error) {
    console.error('[ERROR] Erreur dans handleGitHubStar:', error);
  }
}

// Fonction pour récupérer le nombre d'étoiles d'un dépôt GitHub
async function getGitHubStars(repoUrl) {
  const axios = require('axios');
  try {
    const repoPath = repoUrl.replace('https://github.com/', '');

    // Appeler l'API GitHub pour récupérer le nombre d'étoiles
    const response = await axios.get(`https://api.github.com/repos/${repoPath}`, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    });

    return response.data.stargazers_count;
  } catch (error) {
    console.error('[ERROR] Erreur lors de la récupération des étoiles GitHub:', error);
    return null;
  }
}

// Lancer la surveillance périodique des dépôts GitHub
//setInterval(handleGitHubStar, 30000);

// Exporter la fonction si besoin
module.exports = { handleGitHubStar };
