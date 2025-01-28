// services/discordService.js
const { client } = require('./discordBot');

async function sendDiscordDM(discordUserId, message) {
  try {
    const user = await client.users.fetch(discordUserId);
    if (!user) {
      console.log(`[DISCORD] User not found (ID: ${discordUserId})`);
      return false;
    }
    await user.send(message);
    console.log(`[DISCORD] DM sent to user ID: ${discordUserId}`);
    return true;
  } catch (error) {
    console.error('[DISCORD] Error sending DM:', error);
    return false;
  }
}

module.exports = {
  sendDiscordDM,
};
