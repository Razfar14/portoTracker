const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

const { authenticateJWT, authenticateAdmin } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

// Admin-only: Create Client & Get My Clients
router.post('/create-client', authenticateJWT, authenticateAdmin, authController.createClient);
router.get('/my-clients', authenticateJWT, authenticateAdmin, authController.getMyClients);

module.exports = router;
