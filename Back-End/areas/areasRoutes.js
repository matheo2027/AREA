// areas/areasRoutes.js
const express = require('express');
const pool = require('../db');
const { checkAuth } = require('../middlewares/checkAuth');

const router = express.Router();

/**
 * POST /areas
 * Create an AREA (e.g., "Discord - New Message" => "Send an Email")
 */
router.post('/', checkAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const { action, reaction } = req.body;

    if (!action || !reaction) {
      return res.status(400).json({ message: 'action and reaction are required.' });
    }

    const insertQuery = `
      INSERT INTO areas (user_id, action, reaction)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const { rows } = await pool.query(insertQuery, [userId, action, reaction]);
    res.status(201).json({ success: true, area: rows[0] });
  } catch (error) {
    console.error('Error creating AREA:', error);
    res.status(500).json({ error: 'Failed to create area' });
  }
});

/**
 * GET /areas
 * Get all AREAs for the authenticated user
 */
router.get('/', checkAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const query = 'SELECT * FROM areas WHERE user_id = $1';
    const { rows } = await pool.query(query, [userId]);
    res.status(200).json({ success: true, areas: rows });
  } catch (error) {
    console.error('Error fetching areas:', error);
    res.status(500).json({ message: 'Error fetching areas' });
  }
});

module.exports = router;
