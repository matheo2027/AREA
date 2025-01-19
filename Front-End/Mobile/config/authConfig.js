export const AUTH_CONFIG = {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      redirectUri: 'com.arearapp:/oauth2redirect/google',
      scopes: ['openid', 'profile', 'email'],
      authEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID,
      redirectUri: 'com.areaapp:/oauth2redirect/discord',
      scopes: ['identify', 'email'],
      authEndpoint: 'https://discord.com/api/oauth2/authorize',
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      redirectUri: 'com.areaapp:/oauth2redirect/github',
      scopes: ['read:user', 'user:email'],
      authEndpoint: 'https://github.com/login/oauth/authorize',
    },
  };
