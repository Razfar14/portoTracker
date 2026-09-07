const db = require('../models');

async function connectDatabase() {
  try {
    await db.sequelize.authenticate();
    console.log('Database connected successfully.');

    // Safe idempotent migration for schema updates
    try {
      const queryInterface = db.sequelize.getQueryInterface();
      
      // Ensure 'users.admin_id' exists
      const userTableDesc = await queryInterface.describeTable('users');
      if (!userTableDesc.admin_id) {
        await db.sequelize.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS admin_id INTEGER REFERENCES users(id) ON DELETE SET NULL;');
        console.log('Added admin_id column to users table.');
      }

      // Ensure 'deposits.type' exists
      const depositTableDesc = await queryInterface.describeTable('deposits');
      if (!depositTableDesc.type) {
        await db.sequelize.query("ALTER TABLE deposits ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'deposit';");
        await db.sequelize.query("UPDATE deposits SET type = 'deposit' WHERE type IS NULL;");
        console.log('Added type column to deposits table.');
      }
    } catch (migrationErr) {
      console.warn('Auto-migration warning (non-fatal):', migrationErr.message);
    }
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

module.exports = connectDatabase;
