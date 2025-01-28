// routes/actionsRoutes.js
const express = require('express');
const router = express.Router();
const { checkAuth } = require('../middlewares/checkAuth');
const pool = require('../db');

router.post('/', checkAuth, async (req, res) => {
  try {
    const userId = req.userId; // from checkAuth
    const { name, parameters } = req.body;

    if (!name || !parameters) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const query = `
      INSERT INTO actions (user_id, name, parameters)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [userId, name, parameters];
    const result = await pool.query(query, values);

    return res.status(201).json({ success: true, action: result.rows[0] });
  } catch (error) {
    console.error('Error creating action:', error);
    return res.status(500).json({ message: 'Failed to create action' });
  }
});

module.exports = router;
