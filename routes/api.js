const express = require('express');
const router = express.Router();
const runSeeder = require('../seed/seedData');

// Mount endpoints under namespaces
router.use('/auth', require('./authRoutes'));
router.use('/portfolio', require('./portfolioRoutes'));
router.use('/deposits', require('./depositRoutes'));
router.use('/news', require('./newsRoutes'));

// Secure Seeder Endpoint: Requires secret key matching JWT_SECRET or SEED_SECRET
router.get('/seed', async (req, res) => {
  const secretParam = req.query.secret || req.headers['x-seed-secret'];
  const expectedSecret = process.env.JWT_SECRET || 'idx_financial_jwt_secret_key_2026_sdflkjdsf';

  if (!secretParam || secretParam !== expectedSecret) {
    return res.status(403).json({
      message: 'Access Denied: Invalid or missing seed secret key.'
    });
  }

  try {
    const result = await runSeeder();
    return res.status(200).json({
      message: 'Database seeded successfully on production/remote DB!',
      details: result
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to seed database',
      error: err.message
    });
  }
});

module.exports = router;
