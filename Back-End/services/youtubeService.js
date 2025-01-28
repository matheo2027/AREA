// services/youtubeService.js
const axios = require('axios');
const { sendEmail } = require('./emailReaction');
const pool = require('../db');
const { client } = require('./discordBot');

// In-memory record of last video seen per channel
const lastVideos = {};

async function checkNewYouTubeVideos(channelId, channelName, YOUTUBE_API_KEY) {
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
    if (!video) return; // No videos found

    const videoId = video.id.videoId;
    // If it's a new video
    if (lastVideos[channelId] !== videoId) {
      lastVideos[channelId] = videoId;
      console.log(`[YOUTUBE] New video on ${channelName}: ${video.snippet.title}`);
      await triggerReactions(video, channelName);
    }
  } catch (error) {
    console.error(`[YOUTUBE] Error checking videos for ${channelName}:`, error);
  }
}

async function triggerReactions(video, channelName) {
  const { title, description } = video.snippet;
  const videoUrl = `https://www.youtube.com/watch?v=${video.id.videoId}`;

  // Fetch areas in DB where action = 'youtubeNewVideo'
  const sql = `
    SELECT a.*, u.email
    FROM areas a
    JOIN users u ON a.user_id = u.id
    WHERE a.action = 'youtubeNewVideo'
  `;
  const { rows: areasList } = await pool.query(sql);

  // For each area with reaction = sendEmail or discordNotify
  for (const area of areasList) {
    if (area.reaction === 'sendEmail') {
      await sendEmail(
        area.email,
        `New video on ${channelName}`,
        `Title: ${title}\nDescription: ${description}\nLink: ${videoUrl}`
      );
      console.log(`[YOUTUBE -> EMAIL] Email sent to ${area.email}`);
    } else if (area.reaction === 'discordNotify') {
      // If you store the Discord user ID in the 'reactions' table, you can look that up:
      const reactionQuery = `
        SELECT username
        FROM reactions
        WHERE user_id = $1
          AND name = 'discordNotify'
        LIMIT 1
      `;
      const { rows: reactionRows } = await pool.query(reactionQuery, [area.user_id]);
      if (reactionRows.length === 0) {
        console.log(`[YOUTUBE -> DISCORD] No Discord user for user_id=${area.user_id}`);
        continue;
      }
      const discordTag = reactionRows[0].username;

      // If you need to find by tag in your client cache:
      const targetUser = client.users.cache.find((u) => u.tag === discordTag);
      if (!targetUser) {
        console.log(`[YOUTUBE -> DISCORD] Discord user not found: ${discordTag}`);
        continue;
      }
      await targetUser.send(`New video on ${channelName}: ${title}\n${videoUrl}`);
      console.log(`[YOUTUBE -> DISCORD] DM sent to ${discordTag}`);
    }
  }
}

async function getYouTubeChannelsFromDB() {
  try {
    const sql = `
      SELECT DISTINCT parameters AS channelId, name
      FROM actions
      WHERE name = 'youtubeNewVideo'
    `;
    const { rows } = await pool.query(sql);
    return rows;
  } catch (error) {
    console.error('[YOUTUBE] Error fetching channels from DB:', error);
    return [];
  }
}

function startYouTubeChecks() {
  getYouTubeChannelsFromDB()
    .then((channels) => {
      if (channels.length === 0) {
        console.log('[YOUTUBE] No channels to watch.');
        return;
      }
      console.log('[YOUTUBE] Watching channels:', channels);

      // Check every 5 minutes
      setInterval(() => {
        channels.forEach(({ channelid, name }) => {
          checkNewYouTubeVideos(channelid, name, process.env.YOUTUBE_API_KEY);
        });
      }, 30000);
    })
    .catch((error) => {
      console.error('[YOUTUBE] Initialization error:', error);
    });
}

// Export the start function
module.exports = {
  startYouTubeChecks,
};
