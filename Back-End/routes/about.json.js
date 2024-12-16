const express = require('express');
const router = express.Router();

// Route about.json
router.get('/about.json', (req, res) => {
    res.json({
        timestamp: Date.now(),
        services: ['server', 'client_web', 'database'],
    });
});

module.exports = router;