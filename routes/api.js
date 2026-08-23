const express = require('express');
const router = express.Router();

// Mount endpoints under namespaces
router.use('/auth', require('./authRoutes'));
router.use('/portfolio', require('./portfolioRoutes'));
router.use('/deposits', require('./depositRoutes'));
router.use('/news', require('./newsRoutes'));

module.exports = router;
