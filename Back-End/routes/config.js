const express = require('express');
const router = express.Router();

// Route Test accès à une variable
router.get('/config', (req, res) => {
    res.json({
        port: process.env.PORT,
        dbUser: process.env.DB_USER,
        jwtSecret: process.env.JWT_SECRET,
    });
});

module.exports = router;
