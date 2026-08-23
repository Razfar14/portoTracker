const db = require('../models');

const sectorsData = [
  { id: 1, name: 'Financials', description: 'Banks, financial institutions, insurance providers, and holding companies.' },
  { id: 2, name: 'Infrastructures', description: 'Telecommunications, toll roads, utility providers, gas distribution, and construction.' },
  { id: 3, name: 'Consumer Non-Cyclicals', description: 'Essential consumer goods, food & beverage, personal care, pharmaceuticals, and tobacco.' },
  { id: 4, name: 'Basic Materials', description: 'Mining (metals, minerals), petrochemicals, cement, and chemical packaging.' },
  { id: 5, name: 'Energy', description: 'Coal mining, petroleum extraction, energy distribution, and logistics services.' },
  { id: 6, name: 'Consumer Cyclicals', description: 'Automobile manufacturers, retail shops, department stores, and apparel brands.' },
  { id: 7, name: 'Healthcare', description: 'Hospitals, medical diagnostics, clinics, and healthcare service providers.' },
  { id: 8, name: 'Properties & Real Estate', description: 'Housing developer projects, rental towers, hotels, and real estate agencies.' }
];

const stocksData = [
  // 1. Financials (8 stocks)
  { sector_id: 1, ticker: 'BBCA', company_name: 'Bank Central Asia Tbk', market_cap: '1220000000000000', last_price: 9900, per: 24.50, pbv: 4.80, dividend_yield: 2.20, roe: 20.10, debt_to_equity: 0.15, revenue_growth: 12.40 },
  { sector_id: 1, ticker: 'BBRI', company_name: 'Bank Rakyat Indonesia Tbk', market_cap: '715000000000000', last_price: 4720, per: 12.20, pbv: 2.10, dividend_yield: 6.50, roe: 17.80, debt_to_equity: 0.20, revenue_growth: 9.80 },
  { sector_id: 1, ticker: 'BMRI', company_name: 'Bank Mandiri Tbk', market_cap: '650000000000000', last_price: 7000, per: 11.80, pbv: 2.20, dividend_yield: 5.10, roe: 19.30, debt_to_equity: 0.18, revenue_growth: 11.20 },
  { sector_id: 1, ticker: 'BBNI', company_name: 'Bank Negara Indonesia Tbk', market_cap: '195000000000000', last_price: 5250, per: 9.50, pbv: 1.25, dividend_yield: 4.80, roe: 13.80, debt_to_equity: 0.22, revenue_growth: 8.50 },
  { sector_id: 1, ticker: 'BBTN', company_name: 'Bank Tabungan Negara Tbk', market_cap: '18000000000000', last_price: 1280, per: 5.60, pbv: 0.60, dividend_yield: 5.50, roe: 11.00, debt_to_equity: 0.35, revenue_growth: 6.20 },
  { sector_id: 1, ticker: 'MEGA', company_name: 'Bank Mega Tbk', market_cap: '58000000000000', last_price: 4950, per: 16.50, pbv: 3.10, dividend_yield: 4.20, roe: 18.50, debt_to_equity: 0.10, revenue_growth: 5.40 },
  { sector_id: 1, ticker: 'BDMN', company_name: 'Bank Danamon Indonesia Tbk', market_cap: '26000000000000', last_price: 2650, per: 7.20, pbv: 0.55, dividend_yield: 5.80, roe: 7.90, debt_to_equity: 0.25, revenue_growth: 4.80 },
  { sector_id: 1, ticker: 'PNLF', company_name: 'Panin Financial Tbk', market_cap: '11000000000000', last_price: 344, per: 6.80, pbv: 0.42, dividend_yield: 0.00, roe: 6.20, debt_to_equity: 0.12, revenue_growth: 3.50 },

  // 2. Infrastructures (7 stocks)
  { sector_id: 2, ticker: 'TLKM', company_name: 'Telkom Indonesia Tbk', market_cap: '340000000000000', last_price: 3430, per: 14.20, pbv: 2.40, dividend_yield: 4.90, roe: 17.20, debt_to_equity: 0.78, revenue_growth: 4.20 },
  { sector_id: 2, ticker: 'ISAT', company_name: 'Indosat Ooredoo Hutchison Tbk', market_cap: '82000000000000', last_price: 10200, per: 17.50, pbv: 2.80, dividend_yield: 3.10, roe: 16.00, debt_to_equity: 1.85, revenue_growth: 9.50 },
  { sector_id: 2, ticker: 'EXCL', company_name: 'XL Axiata Tbk', market_cap: '30000000000000', last_price: 2280, per: 23.40, pbv: 1.15, dividend_yield: 2.40, roe: 5.10, debt_to_equity: 1.72, revenue_growth: 7.80 },
  { sector_id: 2, ticker: 'TOWR', company_name: 'Sarana Menara Nusantara Tbk', market_cap: '41000000000000', last_price: 805, per: 12.80, pbv: 2.60, dividend_yield: 3.80, roe: 20.50, debt_to_equity: 2.45, revenue_growth: 8.20 },
  { sector_id: 2, ticker: 'JSMR', company_name: 'Jasa Marga Tbk', market_cap: '38000000000000', last_price: 5225, per: 14.80, pbv: 1.45, dividend_yield: 2.50, roe: 10.20, debt_to_equity: 1.95, revenue_growth: 10.40 },
  { sector_id: 2, ticker: 'PGAS', company_name: 'Perusahaan Gas Negara Tbk', market_cap: '37000000000000', last_price: 1520, per: 7.80, pbv: 0.78, dividend_yield: 8.20, roe: 10.50, debt_to_equity: 0.98, revenue_growth: 3.10 },
  { sector_id: 2, ticker: 'TBIG', company_name: 'Tower Bersama Infrastructure Tbk', market_cap: '40000000000000', last_price: 1770, per: 25.10, pbv: 4.10, dividend_yield: 2.10, roe: 16.40, debt_to_equity: 2.80, revenue_growth: 5.20 },

  // 3. Consumer Non-Cyclicals (8 stocks)
  { sector_id: 3, ticker: 'UNVR', company_name: 'Unilever Indonesia Tbk', market_cap: '95000000000000', last_price: 2490, per: 20.20, pbv: 28.50, dividend_yield: 5.80, roe: 135.00, debt_to_equity: 0.45, revenue_growth: -2.10 },
  { sector_id: 3, ticker: 'ICBP', company_name: 'Indofood CBP Sukses Makmur Tbk', market_cap: '130000000000000', last_price: 11150, per: 14.50, pbv: 2.60, dividend_yield: 2.80, roe: 18.20, debt_to_equity: 0.85, revenue_growth: 8.60 },
  { sector_id: 3, ticker: 'INDF', company_name: 'Indofood Sukses Makmur Tbk', market_cap: '60000000000000', last_price: 6850, per: 7.50, pbv: 0.95, dividend_yield: 4.10, roe: 12.80, debt_to_equity: 0.95, revenue_growth: 6.40 },
  { sector_id: 3, ticker: 'MYOR', company_name: 'Mayora Indah Tbk', market_cap: '58000000000000', last_price: 2590, per: 18.50, pbv: 3.20, dividend_yield: 1.80, roe: 17.50, debt_to_equity: 0.58, revenue_growth: 10.50 },
  { sector_id: 3, ticker: 'KLBF', company_name: 'Kalbe Farma Tbk', market_cap: '75000000000000', last_price: 1600, per: 22.80, pbv: 3.40, dividend_yield: 2.40, roe: 15.20, debt_to_equity: 0.22, revenue_growth: 5.80 },
  { sector_id: 3, ticker: 'SIDO', company_name: 'Industri Jamu Dan Farmasi Sido Muncul Tbk', market_cap: '21000000000000', last_price: 700, per: 19.50, pbv: 6.20, dividend_yield: 5.20, roe: 31.80, debt_to_equity: 0.11, revenue_growth: 7.20 },
  { sector_id: 3, ticker: 'GGRM', company_name: 'Gudang Garam Tbk', market_cap: '31000000000000', last_price: 16100, per: 8.20, pbv: 0.52, dividend_yield: 7.50, roe: 6.50, debt_to_equity: 0.48, revenue_growth: -5.40 },
  { sector_id: 3, ticker: 'HMSP', company_name: 'H.M. Sampoerna Tbk', market_cap: '81000000000000', last_price: 695, per: 10.50, pbv: 3.10, dividend_yield: 9.80, roe: 29.50, debt_to_equity: 0.38, revenue_growth: 1.80 },

  // 4. Basic Materials (7 stocks)
  { sector_id: 4, ticker: 'TPIA', company_name: 'Chandra Asri Petrochemical Tbk', market_cap: '720000000000000', last_price: 8300, per: 150.00, pbv: 11.20, dividend_yield: 0.00, roe: 0.80, debt_to_equity: 0.95, revenue_growth: -12.40 },
  { sector_id: 4, ticker: 'MDKA', company_name: 'Merdeka Copper Gold Tbk', market_cap: '57000000000000', last_price: 2360, per: -45.00, pbv: 3.80, dividend_yield: 0.00, roe: -8.50, debt_to_equity: 1.45, revenue_growth: 18.40 },
  { sector_id: 4, ticker: 'ANTM', company_name: 'Aneka Tambang Tbk', market_cap: '33000000000000', last_price: 1375, per: 10.20, pbv: 1.35, dividend_yield: 4.50, roe: 13.20, debt_to_equity: 0.35, revenue_growth: -2.50 },
  { sector_id: 4, ticker: 'INCO', company_name: 'Vale Indonesia Tbk', market_cap: '38000000000000', last_price: 3820, per: 12.50, pbv: 1.05, dividend_yield: 3.20, roe: 8.40, debt_to_equity: 0.15, revenue_growth: -4.80 },
  { sector_id: 4, ticker: 'BRMS', company_name: 'Bumi Resources Minerals Tbk', market_cap: '23000000000000', last_price: 162, per: 32.50, pbv: 1.45, dividend_yield: 0.00, roe: 4.50, debt_to_equity: 0.12, revenue_growth: 24.10 },
  { sector_id: 4, ticker: 'SMGR', company_name: 'Semen Indonesia (Persero) Tbk', market_cap: '25000000000000', last_price: 3750, per: 11.50, pbv: 0.52, dividend_yield: 6.20, roe: 4.50, debt_to_equity: 0.68, revenue_growth: -1.20 },
  { sector_id: 4, ticker: 'INTP', company_name: 'Indocement Tunggal Prakarsa Tbk', market_cap: '24000000000000', last_price: 7150, per: 12.80, pbv: 1.12, dividend_yield: 5.50, roe: 8.80, debt_to_equity: 0.32, revenue_growth: 2.10 },

  // 5. Energy (7 stocks)
  { sector_id: 5, ticker: 'ADRO', company_name: 'Adaro Energy Indonesia Tbk', market_cap: '108000000000000', last_price: 3380, per: 4.80, pbv: 0.92, dividend_yield: 11.50, roe: 19.20, debt_to_equity: 0.28, revenue_growth: -8.50 },
  { sector_id: 5, ticker: 'ITMG', company_name: 'Indo Tambangraya Megah Tbk', market_cap: '30000000000000', last_price: 26500, per: 4.50, pbv: 1.15, dividend_yield: 15.20, roe: 25.50, debt_to_equity: 0.22, revenue_growth: -14.20 },
  { sector_id: 5, ticker: 'PTBA', company_name: 'Bukit Asam Tbk', market_cap: '29000000000000', last_price: 2520, per: 5.20, pbv: 1.35, dividend_yield: 18.10, roe: 26.00, debt_to_equity: 0.38, revenue_growth: -6.40 },
  { sector_id: 5, ticker: 'HRUM', company_name: 'Harum Energy Tbk', market_cap: '16000000000000', last_price: 1180, per: 6.50, pbv: 1.12, dividend_yield: 4.80, roe: 17.20, debt_to_equity: 0.42, revenue_growth: 12.40 },
  { sector_id: 5, ticker: 'MEDC', company_name: 'Medco Energi Internasional Tbk', market_cap: '31000000000000', last_price: 1230, per: 7.20, pbv: 1.15, dividend_yield: 3.50, roe: 16.00, debt_to_equity: 2.15, revenue_growth: 5.20 },
  { sector_id: 5, ticker: 'AKRA', company_name: 'AKR Corporindo Tbk', market_cap: '32000000000000', last_price: 1600, per: 11.80, pbv: 2.40, dividend_yield: 4.80, roe: 20.30, debt_to_equity: 0.52, revenue_growth: 3.80 },
  { sector_id: 5, ticker: 'BUMI', company_name: 'Bumi Resources Tbk', market_cap: '34000000000000', last_price: 88, per: 18.50, pbv: 1.55, dividend_yield: 0.00, roe: 8.40, debt_to_equity: 1.25, revenue_growth: -10.50 },

  // 6. Consumer Cyclicals & Retail (6 stocks)
  { sector_id: 6, ticker: 'ASII', company_name: 'Astra International Tbk', market_cap: '190000000000000', last_price: 4700, per: 5.80, pbv: 0.95, dividend_yield: 8.80, roe: 16.40, debt_to_equity: 0.85, revenue_growth: 2.80 },
  { sector_id: 6, ticker: 'ACES', company_name: 'Aspirasi Hidup Indonesia Tbk', market_cap: '14000000000000', last_price: 820, per: 17.20, pbv: 2.40, dividend_yield: 3.50, roe: 14.00, debt_to_equity: 0.15, revenue_growth: 9.20 },
  { sector_id: 6, ticker: 'MAPI', company_name: 'Mitra Adiperkasa Tbk', market_cap: '23000000000000', last_price: 1385, per: 12.50, pbv: 2.20, dividend_yield: 0.80, roe: 17.60, debt_to_equity: 0.72, revenue_growth: 14.50 },
  { sector_id: 6, ticker: 'MAPA', company_name: 'MAP Aktif Adiperkasa Tbk', market_cap: '22000000000000', last_price: 770, per: 15.20, pbv: 3.50, dividend_yield: 1.10, roe: 23.00, debt_to_equity: 0.45, revenue_growth: 16.20 },
  { sector_id: 6, ticker: 'ERAA', company_name: 'Erajaya Swasembada Tbk', market_cap: '6800000000000', last_price: 425, per: 8.20, pbv: 0.82, dividend_yield: 4.20, roe: 10.00, debt_to_equity: 1.12, revenue_growth: 12.10 },
  { sector_id: 6, ticker: 'AMRT', company_name: 'Sumber Alfaria Trijaya Tbk', market_cap: '118000000000000', last_price: 2840, per: 33.50, pbv: 9.50, dividend_yield: 1.80, roe: 28.40, debt_to_equity: 1.35, revenue_growth: 10.80 },

  // 7. Healthcare (4 stocks)
  { sector_id: 7, ticker: 'MIKA', company_name: 'Mitra Keluarga Karyasehat Tbk', market_cap: '41000000000000', last_price: 2870, per: 38.50, pbv: 7.80, dividend_yield: 1.20, roe: 20.30, debt_to_equity: 0.08, revenue_growth: 6.80 },
  { sector_id: 7, ticker: 'HEAL', company_name: 'Medikaloka Hermina Tbk', market_cap: '19000000000000', last_price: 1270, per: 32.20, pbv: 4.20, dividend_yield: 0.80, roe: 13.00, debt_to_equity: 0.65, revenue_growth: 8.50 },
  { sector_id: 7, ticker: 'SILO', company_name: 'Siloam International Hospitals Tbk', market_cap: '34000000000000', last_price: 2610, per: 28.50, pbv: 3.80, dividend_yield: 1.50, roe: 13.30, debt_to_equity: 0.42, revenue_growth: 11.20 },
  { sector_id: 7, ticker: 'PRDA', company_name: 'Prodia Widyahusada Tbk', market_cap: '3500000000000', last_price: 3730, per: 14.20, pbv: 1.45, dividend_yield: 6.40, roe: 10.20, debt_to_equity: 0.12, revenue_growth: 3.20 },

  // 8. Property & Real Estate (3 stocks)
  { sector_id: 8, ticker: 'BSDE', company_name: 'Bumi Serpong Damai Tbk', market_cap: '20000000000000', last_price: 945, per: 8.80, pbv: 0.55, dividend_yield: 2.10, roe: 6.20, debt_to_equity: 0.58, revenue_growth: 4.20 },
  { sector_id: 8, ticker: 'PWON', company_name: 'Pakuwon Jati Tbk', market_cap: '19000000000000', last_price: 395, per: 10.20, pbv: 0.88, dividend_yield: 2.80, roe: 8.60, debt_to_equity: 0.45, revenue_growth: 5.40 },
  { sector_id: 8, ticker: 'CTRA', company_name: 'Ciputra Development Tbk', market_cap: '21000000000000', last_price: 1130, per: 11.50, pbv: 0.98, dividend_yield: 1.80, roe: 8.50, debt_to_equity: 0.78, revenue_growth: 6.50 }
];

async function runSeeder() {
  console.log('Starting Database Seeding process...');

  try {
    // 1. Authenticate DB connection
    await db.sequelize.authenticate();
    console.log('Database connected successfully.');

    // 2. Synchronize DB (will create tables if they do not exist)
    await db.sequelize.sync({ force: false, alter: true });
    console.log('Database tables verified/synced.');

    // 3. Clear existing stock data safely (to avoid duplicates, but preserve users/keys)
    console.log('Cleaning up existing stock-related records...');
    await db.FinancialAsset.destroy({ where: {} });
    await db.StockSector.destroy({ where: {} });
    console.log('Stock data cleaned up successfully.');

    // 4. Seed Stock Sectors
    console.log(`Inserting ${sectorsData.length} stock sectors...`);
    await db.StockSector.bulkCreate(sectorsData);
    console.log('Sectors inserted successfully.');

    // 5. Seed Stock Financial Assets
    console.log(`Inserting ${stocksData.length} stock financial assets...`);
    await db.FinancialAsset.bulkCreate(stocksData);
    console.log('Stock financial assets inserted successfully.');

    // 6. Seed Default Users
    console.log('Seeding default Admin and Client users...');
    const bcrypt = require('bcrypt');
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const clientPassword = await bcrypt.hash('client123', salt);

    await db.User.findOrCreate({
      where: { username: 'admin' },
      defaults: {
        password_hash: adminPassword,
        role: 'admin'
      }
    });

    await db.User.findOrCreate({
      where: { username: 'teman' },
      defaults: {
        password_hash: clientPassword,
        role: 'client'
      }
    });
    console.log('Default users created: admin and teman');

    console.log('=========================================');
    console.log('DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log(`- Created ${sectorsData.length} Sectors`);
    console.log(`- Created ${stocksData.length} Stocks with full fundamentals`);
    console.log(`- Created Admin and Client users`);
    console.log('=========================================');

    process.exit(0);
  } catch (error) {
    console.error('CRITICAL ERROR DURING DATABASE SEEDING:', error);
    process.exit(1);
  }
}

// Run seeder
runSeeder();
