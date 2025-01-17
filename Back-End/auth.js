require('dotenv').config();
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { Strategy: DiscordStrategy } = require('passport-discord');
const { Strategy: GitHubStrategy } = require('passport-github2');
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Configuration pour Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:8080/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userQuery = `
          INSERT INTO users (id_oauth, provider, email, access_token, refresh_token)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (id_oauth, provider)
          DO UPDATE SET access_token = $4, refresh_token = $5, updated_at = NOW()
          RETURNING *;
        `;
        const result = await pool.query(userQuery, [
          profile.id,              // id_oauth
          'google',                // provider
          profile.emails[0].value, // email
          accessToken,             // access_token
          refreshToken,            // refresh_token
        ]);
        return done(null, result.rows[0]);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Configuration pour Discord OAuth
passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: 'http://localhost:8080/auth/discord/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userQuery = `
          INSERT INTO users (id_oauth, provider, email, access_token, refresh_token)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (id_oauth, provider)
          DO UPDATE SET access_token = $4, refresh_token = $5, updated_at = NOW()
          RETURNING *;
        `;
        const result = await pool.query(userQuery, [
          profile.id,        // id_oauth
          'discord',         // provider
          profile.email || null, // email (si disponible)
          accessToken,       // access_token
          refreshToken,      // refresh_token
        ]);
        return done(null, result.rows[0]);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Configuration pour GitHub OAuth
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:8080/auth/github/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userQuery = `
          INSERT INTO users (id_oauth, provider, email, access_token, refresh_token)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (id_oauth, provider)
          DO UPDATE SET access_token = $4, refresh_token = $5, updated_at = NOW()
          RETURNING *;
        `;
        const result = await pool.query(userQuery, [
          profile.id,                 // id_oauth
          'github',                   // provider
          profile.emails?.[0]?.value, // email (si disponible)
          accessToken,                // access_token
          refreshToken,               // refresh_token
        ]);
        return done(null, result.rows[0]);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Sérialisation et désérialisation des utilisateurs pour les sessions
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
