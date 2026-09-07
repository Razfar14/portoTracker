const db = require('../models');

async function addDeposit(req, res) {
  const { user_id, amount, notes } = req.body;
  const admin_id = req.user.id;

  if (!user_id || !amount) {
    return res.status(400).json({ message: 'Klien dan nominal deposit wajib diisi' });
  }

  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({ message: 'Nominal deposit harus berupa angka positif (lebih besar dari 0)' });
  }

  try {
    const client = await db.User.findOne({
      where: { id: user_id, role: 'client', admin_id }
    });

    if (!client) {
      return res.status(403).json({
        message: 'Akses Ditolak: Klien tidak ditemukan atau bukan merupakan klien yang Anda kelola.'
      });
    }

    const deposit = await db.Deposit.create({
      user_id,
      amount: numericAmount,
      type: 'deposit',
      notes: notes || 'Setoran Dana Tunai'
    });

    return res.status(201).json({ message: 'Deposit berhasil dicatat', deposit });
  } catch (error) {
    console.error('Add Deposit Error:', error);
    return res.status(500).json({ message: 'Internal server error: ' + error.message });
  }
}

async function addWithdrawal(req, res) {
  const { user_id, amount, notes } = req.body;
  const admin_id = req.user.id;

  if (!user_id || !amount) {
    return res.status(400).json({ message: 'Klien dan nominal penarikan wajib diisi' });
  }

  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({ message: 'Nominal penarikan harus berupa angka positif (lebih besar dari 0)' });
  }

  try {
    const client = await db.User.findOne({
      where: { id: user_id, role: 'client', admin_id }
    });

    if (!client) {
      return res.status(403).json({
        message: 'Akses Ditolak: Klien tidak ditemukan atau bukan merupakan klien yang Anda kelola.'
      });
    }

    // Hitung saldo kas yang tersedia saat ini
    const allDeposits = await db.Deposit.findAll({ where: { user_id } });
    const allPurchases = await db.PortfolioTransaction.findAll({ where: { user_id } });

    const totalInflow = allDeposits
      .filter(d => !d.type || d.type === 'deposit')
      .reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);
    
    const totalOutflow = allDeposits
      .filter(d => d.type === 'withdrawal')
      .reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);

    const totalStockSpent = allPurchases.reduce(
      (sum, p) => sum + (parseFloat(p.buy_price || 0) * parseInt(p.quantity || 0) * 100),
      0
    );

    const availableCashBalance = totalInflow - totalOutflow - totalStockSpent;

    if (numericAmount > availableCashBalance) {
      return res.status(400).json({
        message: `Saldo kas klien tidak mencukupi untuk penarikan! Sisa saldo kas: Rp ${availableCashBalance.toLocaleString('id-ID')}, Diminta tarik: Rp ${numericAmount.toLocaleString('id-ID')}`
      });
    }

    const withdrawal = await db.Deposit.create({
      user_id,
      amount: numericAmount,
      type: 'withdrawal',
      notes: notes || 'Penarikan Dana Tunai (Withdrawal)'
    });

    const remainingCashBalance = availableCashBalance - numericAmount;

    return res.status(201).json({
      message: 'Penarikan dana berhasil diproses!',
      withdrawal,
      remaining_balance: remainingCashBalance
    });
  } catch (error) {
    console.error('Add Withdrawal Error:', error);
    return res.status(500).json({ message: 'Internal server error: ' + error.message });
  }
}

async function getMyDeposits(req, res) {
  const user_id = req.user.id;

  try {
    const deposits = await db.Deposit.findAll({
      where: { user_id },
      order: [['date', 'DESC']]
    });

    const portfolio = await db.PortfolioTransaction.findAll({ where: { user_id } });

    const totalDeposit = deposits
      .filter(d => !d.type || d.type === 'deposit')
      .reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);

    const totalWithdrawal = deposits
      .filter(d => d.type === 'withdrawal')
      .reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);

    const totalInvested = portfolio.reduce((sum, p) => sum + (parseFloat(p.buy_price || 0) * parseInt(p.quantity || 0) * 100), 0);
    const cashBalance = totalDeposit - totalWithdrawal - totalInvested;

    return res.status(200).json({
      deposits,
      summary: {
        total_deposit: totalDeposit,
        total_withdrawal: totalWithdrawal,
        total_invested: totalInvested,
        cash_balance: cashBalance
      }
    });
  } catch (error) {
    console.error('Get Deposits Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function getAllDeposits(req, res) {
  const admin_id = req.user.id;
  const targetUserId = req.query.user_id;

  try {
    const myClients = await db.User.findAll({
      where: { admin_id, role: 'client' },
      attributes: ['id', 'username']
    });

    const myClientIds = myClients.map(c => c.id);

    let whereClause = { user_id: myClientIds };
    if (targetUserId && targetUserId !== 'all') {
      const parsedId = parseInt(targetUserId);
      if (myClientIds.includes(parsedId)) {
        whereClause = { user_id: parsedId };
      } else {
        return res.status(403).json({ message: 'Akses ditolak untuk klien ini.' });
      }
    }

    const deposits = await db.Deposit.findAll({
      where: whereClause,
      include: [{ model: db.User, as: 'user', attributes: ['id', 'username'] }],
      order: [['date', 'DESC']]
    });

    return res.status(200).json({ deposits, clients: myClients });
  } catch (error) {
    console.error('Get All Deposits Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  addDeposit,
  addWithdrawal,
  getMyDeposits,
  getAllDeposits
};


