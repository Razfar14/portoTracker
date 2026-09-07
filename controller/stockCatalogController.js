const db = require('../models');
const { getLiveStockPriceMap, fetchLiveStockPrice } = require('./stockPriceService');
const { Op } = require('sequelize');

async function getAllStocks(req, res) {
  const { sector, search, sort = 'market_cap', order = 'DESC' } = req.query;

  try {
    const whereClause = {};

    // Search filter
    if (search && search.trim()) {
      const q = search.trim();
      whereClause[Op.or] = [
        { ticker: { [Op.iLike]: `%${q}%` } },
        { company_name: { [Op.iLike]: `%${q}%` } }
      ];
    }

    // Sector filter
    let sectorInclude = { model: db.StockSector, as: 'sector' };
    if (sector && sector !== 'all') {
      if (!isNaN(parseInt(sector))) {
        whereClause.sector_id = parseInt(sector);
      } else {
        sectorInclude = {
          model: db.StockSector,
          as: 'sector',
          where: { name: sector }
        };
      }
    }

    // Determine order
    let orderClause = [['market_cap', 'DESC']];
    const allowedSortFields = ['market_cap', 'ticker', 'last_price', 'per', 'pbv', 'dividend_yield', 'roe', 'revenue_growth'];
    if (allowedSortFields.includes(sort)) {
      orderClause = [[sort, order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC']];
    }

    const rawStocks = await db.FinancialAsset.findAll({
      where: whereClause,
      include: [sectorInclude],
      order: orderClause
    });

    const sectors = await db.StockSector.findAll({
      order: [['name', 'ASC']]
    });

    // Extract tickers and fetch live prices in parallel
    const tickers = rawStocks.map(s => s.ticker);
    const livePriceMap = await getLiveStockPriceMap(tickers);

    // Merge live prices & daily change stats
    const stocks = rawStocks.map(stock => {
      const tickerUpper = stock.ticker.toUpperCase();
      const liveData = livePriceMap[tickerUpper];
      const currentPrice = liveData?.price || stock.last_price;
      const dailyChangeIdr = liveData?.daily_change_idr !== undefined ? liveData.daily_change_idr : 0;
      const dailyChangePercent = liveData?.daily_change_percent !== undefined ? liveData.daily_change_percent : 0;
      const previousClose = liveData?.previous_close || stock.last_price;
      
      const json = stock.toJSON();
      return {
        ...json,
        current_price: currentPrice,
        previous_close: previousClose,
        daily_change_idr: dailyChangeIdr,
        daily_change_percent: dailyChangePercent,
        day_high: liveData?.day_high || currentPrice,
        day_low: liveData?.day_low || currentPrice,
        volume: liveData?.volume || 0
      };
    });

    return res.status(200).json({
      stocks,
      sectors,
      total: stocks.length
    });
  } catch (error) {
    console.error('Get All Stocks Error:', error);
    return res.status(500).json({ message: 'Internal server error: ' + error.message });
  }
}

async function getStockDetail(req, res) {
  const { ticker } = req.params;

  if (!ticker) {
    return res.status(400).json({ message: 'Ticker saham wajib ditentukan' });
  }

  try {
    const cleanTicker = ticker.toUpperCase().trim();
    const stock = await db.FinancialAsset.findOne({
      where: { ticker: cleanTicker },
      include: [{ model: db.StockSector, as: 'sector' }]
    });

    if (!stock) {
      return res.status(404).json({ message: `Saham dengan ticker ${cleanTicker} tidak ditemukan` });
    }

    const liveData = await fetchLiveStockPrice(cleanTicker);
    const currentPrice = liveData?.price || stock.last_price;
    const previousClose = liveData?.previous_close || stock.last_price;
    const dailyChangeIdr = liveData?.daily_change_idr !== undefined ? liveData.daily_change_idr : 0;
    const dailyChangePercent = liveData?.daily_change_percent !== undefined ? liveData.daily_change_percent : 0;

    return res.status(200).json({
      stock: {
        ...stock.toJSON(),
        current_price: currentPrice,
        previous_close: previousClose,
        daily_change_idr: dailyChangeIdr,
        daily_change_percent: dailyChangePercent,
        day_high: liveData?.day_high || currentPrice,
        day_low: liveData?.day_low || currentPrice,
        volume: liveData?.volume || 0
      }
    });
  } catch (error) {
    console.error('Get Stock Detail Error:', error);
    return res.status(500).json({ message: 'Internal server error: ' + error.message });
  }
}

module.exports = {
  getAllStocks,
  getStockDetail
};
