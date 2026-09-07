const db = require('../models');

// In-memory cache for live stock prices (TTL in milliseconds)
const priceCache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds cache

/**
 * Fetch real-time market price & daily change stats for a single Indonesian stock ticker
 * @param {string} ticker
 * @returns {Promise<{ price: number, previous_close: number, daily_change_idr: number, daily_change_percent: number, day_high?: number, day_low?: number, volume?: number } | null>}
 */
async function fetchLiveStockPrice(ticker) {
  if (!ticker) return null;
  const cleanTicker = ticker.toUpperCase().trim().replace('.JK', '');

  // 1. Check cache
  const cached = priceCache.get(cleanTicker);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
    return cached.data;
  }

  // 2. Fetch from Yahoo Finance IDX endpoint
  try {
    const symbol = `${cleanTicker}.JK`;
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      },
      signal: AbortSignal.timeout(4000) // 4 seconds timeout
    });

    if (response.ok) {
      const data = await response.json();
      const meta = data?.chart?.result?.[0]?.meta;
      const livePrice = meta?.regularMarketPrice || meta?.previousClose;

      if (livePrice && !isNaN(livePrice) && livePrice > 0) {
        const currentPrice = parseFloat(livePrice);
        const previousClose = parseFloat(meta?.previousClose || meta?.chartPreviousClose || currentPrice);
        const dailyChangeIdr = currentPrice - previousClose;
        const dailyChangePercent = previousClose > 0 ? (dailyChangeIdr / previousClose) * 100 : 0;

        const priceData = {
          price: currentPrice,
          previous_close: previousClose,
          daily_change_idr: dailyChangeIdr,
          daily_change_percent: dailyChangePercent,
          day_high: meta?.regularMarketDayHigh ? parseFloat(meta.regularMarketDayHigh) : currentPrice,
          day_low: meta?.regularMarketDayLow ? parseFloat(meta.regularMarketDayLow) : currentPrice,
          volume: meta?.regularMarketVolume ? parseInt(meta.regularMarketVolume) : 0
        };

        priceCache.set(cleanTicker, {
          data: priceData,
          timestamp: Date.now()
        });

        // Async update DB last_price if record exists (non-blocking)
        db.FinancialAsset.update(
          { last_price: currentPrice },
          { where: { ticker: cleanTicker } }
        ).catch(() => {});

        return priceData;
      }
    }
  } catch (err) {
    console.warn(`[StockPriceService] Live price fetch failed for ${cleanTicker}: ${err.message}`);
  }

  // 3. Fallback to cached value if exists even if expired
  if (cached) {
    return cached.data;
  }

  // 4. Fallback to FinancialAsset in DB
  try {
    const asset = await db.FinancialAsset.findOne({ where: { ticker: cleanTicker } });
    if (asset && asset.last_price) {
      const fallbackPrice = parseFloat(asset.last_price);
      return {
        price: fallbackPrice,
        previous_close: fallbackPrice,
        daily_change_idr: 0,
        daily_change_percent: 0,
        day_high: fallbackPrice,
        day_low: fallbackPrice,
        volume: 0
      };
    }
  } catch (dbErr) {
    // Ignore
  }

  return null;
}

/**
 * Fetch real-time market prices & daily stats for multiple tickers
 * @param {string[]} tickers
 * @returns {Promise<Record<string, { price: number, previous_close: number, daily_change_idr: number, daily_change_percent: number }>>}
 */
async function getLiveStockPriceMap(tickers = []) {
  const uniqueTickers = [...new Set(tickers.map(t => t?.toUpperCase().trim()).filter(Boolean))];
  const priceMap = {};

  // Fetch in parallel
  await Promise.all(
    uniqueTickers.map(async (ticker) => {
      const data = await fetchLiveStockPrice(ticker);
      if (data && data.price) {
        priceMap[ticker] = data;
      }
    })
  );

  return priceMap;
}

module.exports = {
  fetchLiveStockPrice,
  getLiveStockPriceMap
};
