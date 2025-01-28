// routes/reactionsRoutes.js
const express = require('express');
const router = express.Router();
const { checkAuth } = require('../middlewares/checkAuth'); // Adjust path if needed
const pool = require('../db'); // same PG pool

/**
 * POST /reactions
 * Create a reaction
 */
router.post('/', checkAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const { name, username } = req.body;

    if (!name || !username) {
      return res.status(400).json({ error: 'Missing fields.' });
    }

    const query = `
      INSERT INTO reactions (user_id, name, username)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [userId, name, username];
    const result = await pool.query(query, values);

    return res.status(201).json({ success: true, reaction: result.rows[0] });
  } catch (error) {
    console.error('Error creating reaction:', error);
    return res.status(500).json({ error: 'Unable to create reaction.' });
  }
});

module.exports = router;
