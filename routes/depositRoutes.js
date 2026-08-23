const express = require('express');
const router = express.Router();
const depositController = require('../controller/depositController');
const { authenticateJWT, authenticateAdmin } = require('../middleware/auth');

// Protect all routes with JWT
router.use(authenticateJWT);

// Client Routes
router.get('/my', depositController.getMyDeposits);

// Admin Routes
router.get('/all', authenticateAdmin, depositController.getAllDeposits);
router.post('/', authenticateAdmin, depositController.addDeposit);

module.exports = router;
