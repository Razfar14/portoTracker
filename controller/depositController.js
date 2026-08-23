const db = require('../models');

async function addDeposit(req, res) {
  const { user_id, amount, notes } = req.body;

  if (!user_id || !amount) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const deposit = await db.Deposit.create({
      user_id,
      amount,
      notes
    });
    return res.status(201).json({ message: 'Deposit recorded', deposit });
  } catch (error) {
    console.error('Add Deposit Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function getMyDeposits(req, res) {
  const user_id = req.user.id;

  try {
    const deposits = await db.Deposit.findAll({
      where: { user_id },
      order: [['date', 'DESC']]
    });
    return res.status(200).json({ deposits });
  } catch (error) {
    console.error('Get Deposits Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function getAllDeposits(req, res) {
  try {
    const deposits = await db.Deposit.findAll({
      include: [{ model: db.User, as: 'user', attributes: ['email'] }],
      order: [['date', 'DESC']]
    });
    return res.status(200).json({ deposits });
  } catch (error) {
    console.error('Get All Deposits Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  addDeposit,
  getMyDeposits,
  getAllDeposits
};
