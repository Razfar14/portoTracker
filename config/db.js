const db = require('../models');

async function connectDatabase() {
  try {
    await db.sequelize.authenticate();
    console.log('Database connected successfully.');

    // Sync database schemas (creates tables if they don't exist, modifies if altered)
    await db.sequelize.sync({ alter: true });
    console.log('Database schema synchronized successfully.');
  } catch (error) {
    console.error('Database connection or sync failed:', error);
    throw error;
  }
}

module.exports = connectDatabase;
