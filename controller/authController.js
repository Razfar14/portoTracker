const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const { getLiveStockPriceMap } = require('./stockPriceService');

const JWT_SECRET = process.env.JWT_SECRET || 'idx_financial_jwt_secret_key_2026_sdflkjdsf';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '1d';

async function register(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const existingUser = await db.User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Account with this username already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await db.User.create({
      username,
      password_hash: hashedPassword,
      role: 'client' // default role
    });

    return res.status(201).json({
      message: 'Account successfully registered',
      user: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
        created_at: newUser.createdAt
      }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ message: 'Internal server error during registration' });
  }
}

async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await db.User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Verify password with bcrypt hash or plain text fallback
    let isMatch = false;
    if (user.password_hash && (user.password_hash.startsWith('$2b$') || user.password_hash.startsWith('$2a$'))) {
      isMatch = await bcrypt.compare(password, user.password_hash);
    } else {
      isMatch = (password === user.password_hash);
    }

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Internal server error during login' });
  }
}

async function createClient(req, res) {
  const { username, password, initial_deposit } = req.body;
  const admin_id = req.user.id;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan password wajib diisi' });
  }

  try {
    const existingUser = await db.User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username klien sudah terdaftar' });
    }

    let depositAmount = 0;
    if (initial_deposit !== undefined && initial_deposit !== null && initial_deposit !== '') {
      depositAmount = parseFloat(initial_deposit);
      if (isNaN(depositAmount) || depositAmount < 0) {
        return res.status(400).json({ message: 'Nominal deposit awal tidak boleh bernilai minus' });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newClient = await db.User.create({
      username,
      password_hash: hashedPassword,
      role: 'client',
      admin_id
    });

    let initialDepositRecord = null;
    if (depositAmount > 0) {
      initialDepositRecord = await db.Deposit.create({
        user_id: newClient.id,
        amount: depositAmount,
        type: 'deposit',
        notes: 'Deposit Awal dari Admin'
      });
    }

    return res.status(201).json({
      message: 'Klien baru berhasil ditambahkan',
      client: {
        id: newClient.id,
        username: newClient.username,
        role: newClient.role,
        admin_id: newClient.admin_id,
        initial_deposit: initialDepositRecord ? initialDepositRecord.amount : 0,
        createdAt: newClient.createdAt
      }
    });
  } catch (error) {
    console.error('Create Client Error:', error);
    return res.status(500).json({ message: 'Gagal membuat akun klien: ' + error.message });
  }
}

async function getMyClients(req, res) {
  const admin_id = req.user.id;

  try {
    const clients = await db.User.findAll({
      where: { role: 'client', admin_id },
      include: [
        { model: db.Deposit, as: 'deposits' },
        { model: db.PortfolioTransaction, as: 'portfolio' }
      ],
      order: [['createdAt', 'DESC']]
    });

    const allTickers = [];
    clients.forEach(c => {
      (c.portfolio || []).forEach(p => {
        if (p.ticker) allTickers.push(p.ticker);
      });
    });

    const livePriceMap = await getLiveStockPriceMap(allTickers);

    const financialAssets = await db.FinancialAsset.findAll();
    const assetPriceMap = {};
    financialAssets.forEach(a => {
      assetPriceMap[a.ticker.toUpperCase()] = parseFloat(a.last_price);
    });

    const clientSummaries = clients.map(client => {
      const deposits = client.deposits || [];
      const portfolio = client.portfolio || [];

      const totalDeposit = deposits
        .filter(d => !d.type || d.type === 'deposit')
        .reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);

      const totalWithdrawal = deposits
        .filter(d => d.type === 'withdrawal')
        .reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);

      const totalInvested = portfolio.reduce(
        (sum, p) => sum + (parseFloat(p.buy_price || 0) * parseInt(p.quantity || 0) * 100),
        0
      );

      const totalCurrentValue = portfolio.reduce((sum, p) => {
        const tickerUpper = p.ticker.toUpperCase();
        const cp = livePriceMap[tickerUpper]?.price || (typeof livePriceMap[tickerUpper] === 'number' ? livePriceMap[tickerUpper] : (assetPriceMap[tickerUpper] || parseFloat(p.buy_price || 0)));
        return sum + (cp * parseInt(p.quantity || 0) * 100);
      }, 0);

      const cashBalance = totalDeposit - totalWithdrawal - totalInvested;
      const totalPnlIdr = totalCurrentValue - totalInvested;
      const totalPnlPercent = totalInvested > 0 ? (totalPnlIdr / totalInvested) * 100 : 0;
      const netAssetValue = cashBalance + totalCurrentValue;

      return {
        id: client.id,
        username: client.username,
        role: client.role,
        admin_id: client.admin_id,
        total_deposit: totalDeposit,
        total_withdrawal: totalWithdrawal,
        total_invested: totalInvested,
        total_current_value: totalCurrentValue,
        cash_balance: cashBalance,
        total_pnl_idr: totalPnlIdr,
        total_pnl_percent: totalPnlPercent,
        net_asset_value: netAssetValue,
        holdings_count: portfolio.length,
        deposits_count: deposits.length,
        portfolio,
        deposits,
        createdAt: client.createdAt
      };
    });

    return res.status(200).json({ clients: clientSummaries });
  } catch (error) {
    console.error('Get My Clients Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  register,
  login,
  createClient,
  getMyClients
};

