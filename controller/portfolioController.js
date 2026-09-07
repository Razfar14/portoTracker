const db = require('../models');
const { getLiveStockPriceMap } = require('./stockPriceService');

async function addStockPurchase(req, res) {
  const { user_id, ticker, buy_price, quantity } = req.body;
  const admin_id = req.user.id;

  if (!user_id || !ticker || !buy_price || !quantity) {
    return res.status(400).json({ message: 'Semua kolom wajib diisi (Klien, Ticker, Harga Beli, Kuantitas Lot)' });
  }

  const numericPrice = parseFloat(buy_price);
  const numericQty = parseInt(quantity);

  if (isNaN(numericPrice) || numericPrice <= 0 || isNaN(numericQty) || numericQty <= 0) {
    return res.status(400).json({ message: 'Harga beli dan kuantitas lot harus berupa nominal angka positif lebih dari 0' });
  }

  try {
    // 1. Verifikasi apakah klien adalah milik admin ini
    const client = await db.User.findOne({
      where: { id: user_id, role: 'client', admin_id }
    });

    if (!client) {
      return res.status(403).json({
        message: 'Akses Ditolak: Klien tidak ditemukan atau Anda tidak memiliki hak akses atas klien ini.'
      });
    }

    // 2. Hitung total biaya pembelian (1 lot = 100 lembar saham)
    const totalCost = numericPrice * numericQty * 100;

    // 3. Hitung saldo kas klien yang tersedia (Deposit - Withdrawal - StockPurchases)
    const allDeposits = await db.Deposit.findAll({ where: { user_id } });
    const existingPurchases = await db.PortfolioTransaction.findAll({ where: { user_id } });

    const totalInflow = allDeposits
      .filter(d => !d.type || d.type === 'deposit')
      .reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);

    const totalOutflow = allDeposits
      .filter(d => d.type === 'withdrawal')
      .reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);

    const totalSpent = existingPurchases.reduce(
      (sum, p) => sum + (parseFloat(p.buy_price || 0) * parseInt(p.quantity || 0) * 100),
      0
    );

    const availableBalance = totalInflow - totalOutflow - totalSpent;

    if (availableBalance < totalCost) {
      return res.status(400).json({
        message: `Saldo kas klien tidak mencukupi! Sisa saldo: Rp ${availableBalance.toLocaleString('id-ID')}, Dibutuhkan: Rp ${totalCost.toLocaleString('id-ID')}`
      });
    }

    // 4. Catat transaksi pembelian
    const transaction = await db.PortfolioTransaction.create({
      user_id,
      ticker: ticker.toUpperCase().trim(),
      buy_price: numericPrice,
      quantity: numericQty
    });

    const newBalance = availableBalance - totalCost;

    return res.status(201).json({
      message: 'Pembelian saham berhasil dicatat!',
      transaction,
      total_cost: totalCost,
      remaining_balance: newBalance
    });
  } catch (error) {
    console.error('Add Stock Error:', error);
    return res.status(500).json({ message: 'Internal server error: ' + error.message });
  }
}

async function getMyPortfolio(req, res) {
  const user_id = req.user.id;

  try {
    const rawPortfolio = await db.PortfolioTransaction.findAll({
      where: { user_id },
      order: [['transaction_date', 'DESC']]
    });

    const deposits = await db.Deposit.findAll({ where: { user_id } });
    
    // Fetch live market prices for client's holdings
    const tickers = rawPortfolio.map(p => p.ticker);
    const livePriceMap = await getLiveStockPriceMap(tickers);

    const financialAssets = await db.FinancialAsset.findAll();
    const assetPriceMap = {};
    financialAssets.forEach(a => {
      assetPriceMap[a.ticker.toUpperCase()] = parseFloat(a.last_price);
    });

    // Hitung PnL per saham menggunakan live price
    const enrichedPortfolio = rawPortfolio.map(p => {
      const buyPrice = parseFloat(p.buy_price || 0);
      const qty = parseInt(p.quantity || 0);
      const tickerUpper = p.ticker.toUpperCase();
      const currentPrice = livePriceMap[tickerUpper]?.price || (typeof livePriceMap[tickerUpper] === 'number' ? livePriceMap[tickerUpper] : (assetPriceMap[tickerUpper] || buyPrice));
      const buyTotal = buyPrice * qty * 100;
      const currentTotal = currentPrice * qty * 100;
      const pnlIdr = currentTotal - buyTotal;
      const pnlPercent = buyPrice > 0 ? ((currentPrice - buyPrice) / buyPrice) * 100 : 0;

      return {
        id: p.id,
        user_id: p.user_id,
        ticker: p.ticker,
        buy_price: buyPrice,
        current_price: currentPrice,
        quantity: qty,
        shares: qty * 100,
        buy_total: buyTotal,
        current_total: currentTotal,
        pnl_idr: pnlIdr,
        pnl_percent: pnlPercent,
        transaction_date: p.transaction_date,
        createdAt: p.createdAt
      };
    });

    const totalDeposit = deposits
      .filter(d => !d.type || d.type === 'deposit')
      .reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);

    const totalWithdrawal = deposits
      .filter(d => d.type === 'withdrawal')
      .reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);

    const totalInvested = enrichedPortfolio.reduce((sum, p) => sum + p.buy_total, 0);
    const totalCurrentValue = enrichedPortfolio.reduce((sum, p) => sum + p.current_total, 0);
    const cashBalance = totalDeposit - totalWithdrawal - totalInvested;

    const totalPnlIdr = totalCurrentValue - totalInvested;
    const totalPnlPercent = totalInvested > 0 ? (totalPnlIdr / totalInvested) * 100 : 0;
    const netAssetValue = cashBalance + totalCurrentValue;

    return res.status(200).json({
      portfolio: enrichedPortfolio,
      summary: {
        total_deposit: totalDeposit,
        total_withdrawal: totalWithdrawal,
        cash_balance: cashBalance,
        total_invested: totalInvested,
        total_current_value: totalCurrentValue,
        total_pnl_idr: totalPnlIdr,
        total_pnl_percent: totalPnlPercent,
        net_asset_value: netAssetValue
      }
    });
  } catch (error) {
    console.error('Get Portfolio Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function getAllPortfolios(req, res) {
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

    const rawPortfolio = await db.PortfolioTransaction.findAll({
      where: whereClause,
      include: [{ model: db.User, as: 'user', attributes: ['id', 'username'] }],
      order: [['transaction_date', 'DESC']]
    });

    // Fetch live market prices for all portfolio transactions
    const tickers = rawPortfolio.map(p => p.ticker);
    const livePriceMap = await getLiveStockPriceMap(tickers);

    const financialAssets = await db.FinancialAsset.findAll();
    const assetPriceMap = {};
    financialAssets.forEach(a => {
      assetPriceMap[a.ticker.toUpperCase()] = parseFloat(a.last_price);
    });

    const enrichedPortfolio = rawPortfolio.map(p => {
      const buyPrice = parseFloat(p.buy_price || 0);
      const qty = parseInt(p.quantity || 0);
      const tickerUpper = p.ticker.toUpperCase();
      const currentPrice = livePriceMap[tickerUpper]?.price || (typeof livePriceMap[tickerUpper] === 'number' ? livePriceMap[tickerUpper] : (assetPriceMap[tickerUpper] || buyPrice));
      const buyTotal = buyPrice * qty * 100;
      const currentTotal = currentPrice * qty * 100;
      const pnlIdr = currentTotal - buyTotal;
      const pnlPercent = buyPrice > 0 ? ((currentPrice - buyPrice) / buyPrice) * 100 : 0;

      return {
        id: p.id,
        user_id: p.user_id,
        user: p.user,
        ticker: p.ticker,
        buy_price: buyPrice,
        current_price: currentPrice,
        quantity: qty,
        shares: qty * 100,
        buy_total: buyTotal,
        current_total: currentTotal,
        pnl_idr: pnlIdr,
        pnl_percent: pnlPercent,
        transaction_date: p.transaction_date,
        createdAt: p.createdAt
      };
    });

    return res.status(200).json({ portfolio: enrichedPortfolio, clients: myClients });
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


