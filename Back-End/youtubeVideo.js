const axios = require('axios');
const { Pool } = require('pg'); // Si besoin de base PostgreSQL

const API_KEY = 'AIzaSyDlyrBlZ2zY5WApSf22Vn-IqaC8iFgc5FU'; // Remplace par ta clé API
const CHANNEL_ID = 'UC_x5XG1OV2P6uZZ5FSM9Ttw'; // L'ID de la chaîne que tu veux surveiller
let lastVideoId = null; // Pour éviter de répéter une notification

async function checkNewVideos() {
  try {
    // Requête à l'API YouTube
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: API_KEY,
        channelId: CHANNEL_ID,
        part: 'snippet',
        order: 'date',
        type: 'video',
        maxResults: 1,
      },
    });

    const video = response.data.items[0];
    const videoId = video.id.videoId;

    if (videoId !== lastVideoId) {
      // Nouvelle vidéo détectée
      const { title, description, publishedAt } = video.snippet;

      console.log(`Nouvelle vidéo détectée : ${title}`);
      console.log(`Description : ${description}`);
      console.log(`Publié le : ${publishedAt}`);

      // Appelle les réactions (email, Discord, etc.)
      await triggerReactions(video);

      // Met à jour l'ID de la dernière vidéo
      lastVideoId = videoId;
    } else {
      console.log('Aucune nouvelle vidéo détectée.');
    }
  } catch (error) {
    console.error('Erreur lors de la vérification des vidéos YouTube:', error);
  }
}

// Exemple de fonction de réaction
async function triggerReactions(video) {
  const { title, description, id } = video.snippet;

  // Exemple : Notification Discord
  console.log(`Réaction Discord : "Nouvelle vidéo publiée : ${title}"`);

  // Exemple : Envoi d'un email
  console.log(`Réaction Email : "Nouvelle vidéo publiée : ${title}"`);
}

// Lancer la vérification toutes les X minutes
setInterval(checkNewVideos, 300000); // 5 minutes
