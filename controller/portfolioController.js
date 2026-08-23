const db = require('../models');

async function addStockPurchase(req, res) {
  const { user_id, ticker, buy_price, quantity } = req.body;

  if (!user_id || !ticker || !buy_price || !quantity) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const transaction = await db.PortfolioTransaction.create({
      user_id,
      ticker: ticker.toUpperCase(),
      buy_price,
      quantity
    });
    return res.status(201).json({ message: 'Stock purchase recorded', transaction });
  } catch (error) {
    console.error('Add Stock Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function getMyPortfolio(req, res) {
  const user_id = req.user.id;

  try {
    const portfolio = await db.PortfolioTransaction.findAll({
      where: { user_id },
      order: [['transaction_date', 'DESC']]
    });
    return res.status(200).json({ portfolio });
  } catch (error) {
    console.error('Get Portfolio Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function getAllPortfolios(req, res) {
  try {
    const portfolio = await db.PortfolioTransaction.findAll({
      include: [{ model: db.User, as: 'user', attributes: ['email'] }],
      order: [['transaction_date', 'DESC']]
    });
    return res.status(200).json({ portfolio });
  } catch (error) {
    console.error('Get All Portfolios Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  addStockPurchase,
  getMyPortfolio,
  getAllPortfolios
};
