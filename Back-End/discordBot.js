// discordBot.js

require('dotenv').config();
const { sendEmail } = require('./emailReaction');
const { Client, GatewayIntentBits } = require('discord.js');
const { Pool } = require('pg');

// 1. Configurer le pool PG
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// 2. Créer l’instance du bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    // si tu veux gérer des DMs : GatewayIntentBits.DirectMessages,
  ],
  partials: ['CHANNEL'], // si tu gères des DM
});

// 3. Se connecter avec le token
client.login(process.env.DISCORD_BOT_TOKEN);

// 4. Log quand le bot est prêt
client.on('ready', () => {
  // console.log(`Bot Discord connecté en tant que ${client.user.tag}`);
});

// 5. Logique "discordMsg" => "sendEmail" ou "discordNotify"
client.on('messageCreate', async (message) => {
  if (message.author.bot) return; // ignorer les messages du bot lui-même

  try {
    // Récupérer toutes les areas dont l'action = "discordMsg"
    const query = `
      SELECT a.*, u.email
      FROM areas a
      JOIN users u ON a.user_id = u.id
      WHERE a.action = 'discordMsg'
    `;
    const result = await pool.query(query);
    const areasList = result.rows;

    for (const area of areasList) {
      // 1) Si la reaction = "sendEmail", on envoie un mail
      if (area.reaction === 'sendEmail') {
        await sendEmail(
          area.email,
          'New Discord message',
          `Message from ${message.author.tag} : ${message.content}`
        );
        console.log(`[REACTION] Email envoyé à ${area.email}`);

      // 2) Si la reaction = "discordNotify", on envoie un DM (message privé)
      } else if (area.reaction === 'discordNotify') {
        // a) On suppose que la table "reactions" stocke le username (tag) 
        //    ex. "Babssow29#1234" pour user_id = area.user_id
        const reactionQuery = `
          SELECT username
          FROM reactions
          WHERE user_id = $1
            AND name = 'discordNotify'
          LIMIT 1
        `;
        const reactionRes = await pool.query(reactionQuery, [area.user_id]);
        if (reactionRes.rows.length === 0) {
          console.log(
            `[REACTION] Aucune entrée 'discordNotify' pour user_id=${area.user_id} dans la table reactions`
          );
          continue;
        }

        const discordTag = reactionRes.rows[0].username; // ex "Babssow29#1234"

        // b) Chercher l'utilisateur dans le cache du bot via le tag
        const targetUser = client.users.cache.find((u) => u.tag === discordTag);
        if (!targetUser) {
          console.log(`[REACTION] Impossible de trouver ${discordTag} dans le cache du bot`);
          continue;
        }

        // c) Envoyer le DM
        await targetUser.send(`Message from ${message.author.tag} : ${message.content}`);
        console.log(`[REACTION] DM Discord envoyé à ${discordTag}`);

      } // fin du else if
    }

    // Log console de l'action
    console.log(`[ACTION] Nouveau message Discord de ${message.author.tag}: ${message.content}`);
  } catch (err) {
    console.error('Error checking areas for discordMsg:', err);
  }
});

// Export si besoin
module.exports = client;
