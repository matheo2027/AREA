// discordBot.js

require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { sendEmail } = require('./emailReaction');
const pool = require('../db');

const { checkAuth } = require('../middlewares/checkAuth');

// Create the Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: ['CHANNEL'],
});

// 3. Login the client
client.login(process.env.DISCORD_BOT_TOKEN);

// 4. Event: Bot ready
client.on('ready', () => {
  console.log(`Bot Discord connecté en tant que ${client.user.tag}`);
});

// 5. Event: Handle incoming Discord messages
client.on('messageCreate', async (message) => {
  if (message.author.bot) return; // ignore bot messages

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
      // If area.reaction === 'sendEmail', send an email
      if (area.reaction === 'sendEmail') {
        await sendEmail(
          area.email,
          'New Discord message',
          `Message from ${message.author.tag} : ${message.content}`
        );
        console.log(`[REACTION] Email envoyé à ${area.email}`);

      // If area.reaction === 'discordNotify', send a Discord DM
      } else if (area.reaction === 'discordNotify') {
        const reactionQuery = `
          SELECT username
          FROM reactions
          WHERE user_id = $1
            AND name = 'discordNotify'
          LIMIT 1
        `;
        const reactionRes = await pool.query(reactionQuery, [area.user_id]);
        if (reactionRes.rows.length === 0) {
          console.log(`[REACTION] Aucun username Discord (discordNotify) pour user_id=${area.user_id}`);
          continue;
        }

        const discordTag = reactionRes.rows[0].username; // e.g. "Babssow29#1234"

        // Attempt to find the user in the bot's cache
        const targetUser = client.users.cache.find((u) => u.tag === discordTag);
        if (!targetUser) {
          console.log(`[REACTION] Impossible de trouver ${discordTag} dans le cache du bot`);
          continue;
        }

        // Send a DM
        await targetUser.send(`Message from ${message.author.tag} : ${message.content}`);
        console.log(`[REACTION] DM Discord envoyé à ${discordTag}`);
      }
    }

    console.log(`[ACTION] Nouveau message Discord de ${message.author.tag}: ${message.content}`);
  } catch (err) {
    console.error('Error checking areas for discordMsg:', err);
  }
});

// 6. Export a function to set up the Express route for /discord/dm
function setupDiscordRoutes(app, checkAuth) {
  // We'll define the POST /discord/dm route here
  app.post('/discord/dm', checkAuth, async (req, res) => {
    try {
      const userId = req.userId;
      const { reactionId, messageToSend } = req.body;

      if (!reactionId || !messageToSend) {
        return res.status(400).json({ error: 'Missing reactionId or messageToSend' });
      }

      // Find the reaction
      const query = 'SELECT * FROM reactions WHERE id = $1';
      const result = await pool.query(query, [reactionId]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Reaction not found' });
      }

      const reaction = result.rows[0];
      // Check ownership
      if (reaction.user_id !== userId) {
        return res.status(403).json({ error: 'You do not own this reaction' });
      }

      // Attempt to fetch the Discord user by ID
      try {
        const targetUser = await client.users.fetch(reaction.username);
        if (!targetUser) {
          return res.status(404).json({
            error: `Discord user not found for ID: ${reaction.username}`,
          });
        }

        // Send the DM
        await targetUser.send(messageToSend);
        return res.status(200).json({ success: true, message: 'DM sent successfully' });
      } catch (error) {
        // If user disabled DMs
        if (error.code === 50007) {
          return res.status(400).json({
            error: 'Cannot send DM. User might have disabled DMs from bots.',
          });
        }
        console.error('Error sending DM:', error);
        return res.status(500).json({ error: 'Failed to send DM' });
      }
    } catch (error) {
      console.error('Error in /discord/dm:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
}

// 7. Export the client (if other files need direct access) and the setup function
module.exports = {
  client,
  setupDiscordRoutes,
};
