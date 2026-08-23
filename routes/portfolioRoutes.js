const express = require('express');
const router = express.Router();
const portfolioController = require('../controller/portfolioController');
const { authenticateJWT, authenticateAdmin } = require('../middleware/auth');

// Protect all routes with JWT
router.use(authenticateJWT);

// Client Routes
router.get('/my', portfolioController.getMyPortfolio);

// Admin Routes
router.get('/all', authenticateAdmin, portfolioController.getAllPortfolios);
router.post('/', authenticateAdmin, portfolioController.addStockPurchase);

module.exports = router;
