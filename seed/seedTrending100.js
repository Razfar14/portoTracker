const db = require('../models');

const newSectors = [
  { name: 'Technology', description: 'Perusahaan teknologi, e-commerce, software, cloud infrastructure, dan platform digital.' },
  { name: 'Industrials', description: 'Manufaktur alat berat, komponen otomotif, perkabelan, dan produk industrial.' },
  { name: 'Transportation & Logistics', description: 'Pelayaran, ekspedisi kargo, transportasi penumpang, dan maskapai penerbangan.' }
];

const trendingStocks = [
  // Technology (10)
  { ticker: 'GOTO', company_name: 'GoTo Gojek Tokopedia Tbk', sector_name: 'Technology', market_cap: 65000000000000, last_price: 54, per: -12.4, pbv: 0.65, dividend_yield: 0.0, roe: -5.2, debt_to_equity: 0.12, revenue_growth: 18.5 },
  { ticker: 'BUKA', company_name: 'Bukalapak.com Tbk', sector_name: 'Technology', market_cap: 12500000000000, last_price: 122, per: -15.1, pbv: 0.48, dividend_yield: 0.0, roe: -3.1, debt_to_equity: 0.05, revenue_growth: 14.2 },
  { ticker: 'EMTK', company_name: 'Elang Mahkota Teknologi Tbk', sector_name: 'Technology', market_cap: 28000000000000, last_price: 456, per: 18.2, pbv: 0.95, dividend_yield: 1.2, roe: 5.4, debt_to_equity: 0.18, revenue_growth: 8.7 },
  { ticker: 'DCII', company_name: 'DCI Indonesia Tbk', sector_name: 'Technology', market_cap: 98000000000000, last_price: 41000, per: 85.0, pbv: 32.5, dividend_yield: 0.0, roe: 38.2, debt_to_equity: 0.25, revenue_growth: 35.6 },
  { ticker: 'MTDL', company_name: 'Metrodata Electronics Tbk', sector_name: 'Technology', market_cap: 8200000000000, last_price: 665, per: 11.8, pbv: 1.65, dividend_yield: 3.5, roe: 14.2, debt_to_equity: 0.38, revenue_growth: 11.2 },
  { ticker: 'WIRG', company_name: 'WIR Asia Tbk', sector_name: 'Technology', market_cap: 1200000000000, last_price: 102, per: 22.4, pbv: 1.85, dividend_yield: 0.0, roe: 8.5, debt_to_equity: 0.22, revenue_growth: 28.4 },
  { ticker: 'BELI', company_name: 'Global Digital Niaga Tbk (Blibli)', sector_name: 'Technology', market_cap: 54000000000000, last_price: 458, per: -18.5, pbv: 4.80, dividend_yield: 0.0, roe: -26.0, debt_to_equity: 0.45, revenue_growth: 16.8 },
  { ticker: 'MCAS', company_name: 'M Cash Integrasi Tbk', sector_name: 'Technology', market_cap: 1500000000000, last_price: 1720, per: 14.5, pbv: 1.15, dividend_yield: 0.0, roe: 8.1, debt_to_equity: 0.65, revenue_growth: 6.4 },
  { ticker: 'DMMX', company_name: 'Digital Mediatama Maxima Tbk', sector_name: 'Technology', market_cap: 950000000000, last_price: 124, per: -8.5, pbv: 0.72, dividend_yield: 0.0, roe: -8.5, debt_to_equity: 0.15, revenue_growth: 4.2 },
  { ticker: 'NFCX', company_name: 'NFC Indonesia Tbk', sector_name: 'Technology', market_cap: 1100000000000, last_price: 1650, per: 16.2, pbv: 1.28, dividend_yield: 0.0, roe: 7.9, debt_to_equity: 0.42, revenue_growth: 9.1 },

  // Industrials (10)
  { ticker: 'UNTR', company_name: 'United Tractors Tbk', sector_name: 'Industrials', market_cap: 98000000000000, last_price: 26500, per: 4.8, pbv: 1.12, dividend_yield: 9.8, roe: 23.5, debt_to_equity: 0.35, revenue_growth: -3.2 },
  { ticker: 'HEXA', company_name: 'Hexindo Adiperkasa Tbk', sector_name: 'Industrials', market_cap: 5800000000000, last_price: 6900, per: 7.2, pbv: 2.15, dividend_yield: 12.5, roe: 30.1, debt_to_equity: 0.48, revenue_growth: 5.4 },
  { ticker: 'MARK', company_name: 'Mark Dynamics Indonesia Tbk', sector_name: 'Industrials', market_cap: 3800000000000, last_price: 1010, per: 16.5, pbv: 4.20, dividend_yield: 4.8, roe: 25.8, debt_to_equity: 0.15, revenue_growth: 45.2 },
  { ticker: 'ARNA', company_name: 'Arwana Citramulia Tbk', sector_name: 'Industrials', market_cap: 5200000000000, last_price: 710, per: 12.4, pbv: 2.85, dividend_yield: 6.2, roe: 23.1, debt_to_equity: 0.28, revenue_growth: 4.8 },
  { ticker: 'KBLI', company_name: 'KMI Wire & Cable Tbk', sector_name: 'Industrials', market_cap: 1400000000000, last_price: 350, per: 8.5, pbv: 0.45, dividend_yield: 3.5, roe: 5.4, debt_to_equity: 0.22, revenue_growth: 8.5 },
  { ticker: 'IMPC', company_name: 'Impack Pratama Industri Tbk', sector_name: 'Industrials', market_cap: 19500000000000, last_price: 360, per: 38.5, pbv: 5.80, dividend_yield: 1.2, roe: 15.2, debt_to_equity: 0.65, revenue_growth: 14.8 },
  { ticker: 'CCSI', company_name: 'Communication Cable Systems Indonesia Tbk', sector_name: 'Industrials', market_cap: 850000000000, last_price: 590, per: 14.2, pbv: 1.75, dividend_yield: 2.8, roe: 12.4, debt_to_equity: 0.18, revenue_growth: 18.2 },
  { ticker: 'IKAI', company_name: 'Intikeramik Alamasri Industri Tbk', sector_name: 'Industrials', market_cap: 650000000000, last_price: 50, per: 28.5, pbv: 0.95, dividend_yield: 0.0, roe: 3.4, debt_to_equity: 0.82, revenue_growth: 6.1 },
  { ticker: 'SMSM', company_name: 'Selamat Sempurna Tbk', sector_name: 'Industrials', market_cap: 11200000000000, last_price: 1950, per: 11.2, pbv: 2.95, dividend_yield: 6.8, roe: 26.5, debt_to_equity: 0.18, revenue_growth: 7.2 },
  { ticker: 'AUTO', company_name: 'Astra Otoparts Tbk', sector_name: 'Industrials', market_cap: 10800000000000, last_price: 2240, per: 5.8, pbv: 0.78, dividend_yield: 7.5, roe: 13.5, debt_to_equity: 0.32, revenue_growth: 5.8 },

  // Transportation & Logistics (10)
  { ticker: 'SMDR', company_name: 'Samudera Indonesia Tbk', sector_name: 'Transportation & Logistics', market_cap: 5400000000000, last_price: 330, per: 5.2, pbv: 0.65, dividend_yield: 8.5, roe: 12.8, debt_to_equity: 0.58, revenue_growth: 12.4 },
  { ticker: 'TMAS', company_name: 'Temas Tbk', sector_name: 'Transportation & Logistics', market_cap: 8500000000000, last_price: 150, per: 9.8, pbv: 2.15, dividend_yield: 5.4, roe: 22.0, debt_to_equity: 0.42, revenue_growth: 8.9 },
  { ticker: 'BIRD', company_name: 'Blue Bird Tbk', sector_name: 'Transportation & Logistics', market_cap: 4800000000000, last_price: 1920, per: 9.5, pbv: 0.85, dividend_yield: 4.8, roe: 9.1, debt_to_equity: 0.28, revenue_growth: 14.5 },
  { ticker: 'ASSA', company_name: 'Adi Sarana Armada Tbk', sector_name: 'Transportation & Logistics', market_cap: 2800000000000, last_price: 760, per: 14.2, pbv: 1.15, dividend_yield: 2.8, roe: 8.2, debt_to_equity: 1.45, revenue_growth: 11.2 },
  { ticker: 'GIAA', company_name: 'Garuda Indonesia (Persero) Tbk', sector_name: 'Transportation & Logistics', market_cap: 5800000000000, last_price: 64, per: -4.5, pbv: -1.2, dividend_yield: 0.0, roe: -18.5, debt_to_equity: 4.85, revenue_growth: 28.5 },
  { ticker: 'WEHA', company_name: 'Panorama Transportasi Tbk', sector_name: 'Transportation & Logistics', market_cap: 210000000000, last_price: 142, per: 6.8, pbv: 0.88, dividend_yield: 3.8, roe: 13.2, debt_to_equity: 0.45, revenue_growth: 18.4 },
  { ticker: 'IPCM', company_name: 'Jasa Armada Indonesia Tbk', sector_name: 'Transportation & Logistics', market_cap: 1500000000000, last_price: 284, per: 9.2, pbv: 1.25, dividend_yield: 7.2, roe: 13.8, debt_to_equity: 0.18, revenue_growth: 8.5 },
  { ticker: 'HAIS', company_name: 'Hasnur Internasional Shipping Tbk', sector_name: 'Transportation & Logistics', market_cap: 620000000000, last_price: 236, per: 5.8, pbv: 0.95, dividend_yield: 6.5, roe: 16.5, debt_to_equity: 0.22, revenue_growth: 14.2 },
  { ticker: 'TNCA', company_name: 'Trimuda Nuansa Citra Tbk', sector_name: 'Transportation & Logistics', market_cap: 110000000000, last_price: 240, per: 18.5, pbv: 1.45, dividend_yield: 0.0, roe: 7.8, debt_to_equity: 0.38, revenue_growth: 5.2 },
  { ticker: 'PSSI', company_name: 'Pelita Samudera Shipping Tbk', sector_name: 'Transportation & Logistics', market_cap: 2400000000000, last_price: 444, per: 4.2, pbv: 0.72, dividend_yield: 9.2, roe: 17.5, debt_to_equity: 0.15, revenue_growth: 6.8 },

  // Energy & Mining (15)
  { ticker: 'BREN', company_name: 'Barito Renewables Energy Tbk', sector_name: 'Energy', market_cap: 1350000000000000, last_price: 10100, per: 420.0, pbv: 125.0, dividend_yield: 0.2, roe: 32.5, debt_to_equity: 3.85, revenue_growth: 12.8 },
  { ticker: 'CUAN', company_name: 'Petrindo Jaya Kreasi Tbk', sector_name: 'Energy', market_cap: 95000000000000, last_price: 8450, per: 185.0, pbv: 38.5, dividend_yield: 0.0, roe: 21.0, debt_to_equity: 1.15, revenue_growth: 65.4 },
  { ticker: 'PGEO', company_name: 'Pertamina Geothermal Energy Tbk', sector_name: 'Energy', market_cap: 48000000000000, last_price: 1160, per: 18.5, pbv: 1.55, dividend_yield: 3.5, roe: 8.5, debt_to_equity: 0.42, revenue_growth: 8.2 },
  { ticker: 'INDY', company_name: 'Indika Energy Tbk', sector_name: 'Energy', market_cap: 7800000000000, last_price: 1500, per: 6.2, pbv: 0.45, dividend_yield: 8.5, roe: 7.5, debt_to_equity: 1.12, revenue_growth: -12.4 },
  { ticker: 'DOID', company_name: 'Delta Dunia Makmur Tbk', sector_name: 'Energy', market_cap: 6200000000000, last_price: 720, per: 7.5, pbv: 1.15, dividend_yield: 4.5, roe: 15.4, debt_to_equity: 2.45, revenue_growth: 18.5 },
  { ticker: 'TOBA', company_name: 'TBS Energi Utama Tbk', sector_name: 'Energy', market_cap: 4500000000000, last_price: 555, per: 12.5, pbv: 0.72, dividend_yield: 2.5, roe: 5.8, debt_to_equity: 0.95, revenue_growth: 14.2 },
  { ticker: 'ENRG', company_name: 'Energi Mega Persada Tbk', sector_name: 'Energy', market_cap: 5800000000000, last_price: 236, per: 5.8, pbv: 0.65, dividend_yield: 0.0, roe: 11.5, debt_to_equity: 0.78, revenue_growth: 22.4 },
  { ticker: 'ELSA', company_name: 'Elnusa Tbk', sector_name: 'Energy', market_cap: 3500000000000, last_price: 480, per: 6.8, pbv: 0.78, dividend_yield: 5.8, roe: 11.8, debt_to_equity: 0.52, revenue_growth: 16.5 },
  { ticker: 'RAJA', company_name: 'Rukun Raharja Tbk', sector_name: 'Energy', market_cap: 5400000000000, last_price: 1280, per: 12.8, pbv: 2.15, dividend_yield: 3.2, roe: 17.2, debt_to_equity: 0.85, revenue_growth: 24.8 },
  { ticker: 'ABMM', company_name: 'ABM Investama Tbk', sector_name: 'Energy', market_cap: 10500000000000, last_price: 3820, per: 3.2, pbv: 1.05, dividend_yield: 14.5, roe: 34.5, debt_to_equity: 1.65, revenue_growth: -4.5 },
  { ticker: 'KKGI', company_name: 'Resource Alam Indonesia Tbk', sector_name: 'Energy', market_cap: 2200000000000, last_price: 440, per: 4.8, pbv: 0.88, dividend_yield: 10.2, roe: 18.5, debt_to_equity: 0.22, revenue_growth: 5.4 },
  { ticker: 'MBAP', company_name: 'Mitrabara Adiperdana Tbk', sector_name: 'Energy', market_cap: 4200000000000, last_price: 3450, per: 5.5, pbv: 1.45, dividend_yield: 18.5, roe: 26.8, debt_to_equity: 0.18, revenue_growth: -15.2 },
  { ticker: 'GEMS', company_name: 'Golden Energy Mines Tbk', sector_name: 'Energy', market_cap: 78000000000000, last_price: 13250, per: 7.2, pbv: 6.50, dividend_yield: 12.8, roe: 92.5, debt_to_equity: 0.45, revenue_growth: -2.8 },
  { ticker: 'DEWA', company_name: 'Darma Henwa Tbk', sector_name: 'Energy', market_cap: 2500000000000, last_price: 115, per: 35.0, pbv: 0.75, dividend_yield: 0.0, roe: 2.2, debt_to_equity: 1.15, revenue_growth: 14.8 },
  { ticker: 'BSSR', company_name: 'Baramulti Suksessarana Tbk', sector_name: 'Energy', market_cap: 10200000000000, last_price: 3900, per: 4.2, pbv: 2.15, dividend_yield: 19.5, roe: 52.0, debt_to_equity: 0.38, revenue_growth: -8.5 },

  // Basic Materials (15)
  { ticker: 'AMMN', company_name: 'Amman Mineral Internasional Tbk', sector_name: 'Basic Materials', market_cap: 680000000000000, last_price: 9400, per: 85.0, pbv: 9.80, dividend_yield: 0.0, roe: 12.5, debt_to_equity: 1.25, revenue_growth: 42.5 },
  { ticker: 'NCKL', company_name: 'Trimegah Bangun Persada Tbk (Harita Nickel)', sector_name: 'Basic Materials', market_cap: 58000000000000, last_price: 920, per: 10.5, pbv: 1.85, dividend_yield: 3.5, roe: 18.2, debt_to_equity: 0.65, revenue_growth: 32.5 },
  { ticker: 'MBMA', company_name: 'Merdeka Battery Materials Tbk', sector_name: 'Basic Materials', market_cap: 59000000000000, last_price: 550, per: 45.0, pbv: 1.95, dividend_yield: 0.0, roe: 4.5, debt_to_equity: 0.48, revenue_growth: 58.2 },
  { ticker: 'TINS', company_name: 'Timah Tbk', sector_name: 'Basic Materials', market_cap: 8200000000000, last_price: 1100, per: 11.2, pbv: 1.15, dividend_yield: 2.5, roe: 10.5, debt_to_equity: 0.85, revenue_growth: 14.8 },
  { ticker: 'NICL', company_name: 'PAM Mineral Tbk', sector_name: 'Basic Materials', market_cap: 2200000000000, last_price: 210, per: 8.5, pbv: 2.15, dividend_yield: 4.2, roe: 25.8, debt_to_equity: 0.12, revenue_growth: 28.5 },
  { ticker: 'CITA', company_name: 'Cita Mineral Investindo Tbk', sector_name: 'Basic Materials', market_cap: 11500000000000, last_price: 2900, per: 12.5, pbv: 2.45, dividend_yield: 3.8, roe: 19.8, debt_to_equity: 0.28, revenue_growth: 18.2 },
  { ticker: 'ESSA', company_name: 'Essa Industries Indonesia Tbk', sector_name: 'Basic Materials', market_cap: 15500000000000, last_price: 900, per: 14.8, pbv: 1.95, dividend_yield: 3.2, roe: 13.5, debt_to_equity: 0.35, revenue_growth: 15.4 },
  { ticker: 'BRPT', company_name: 'Barito Pacific Tbk', sector_name: 'Basic Materials', market_cap: 102000000000000, last_price: 1090, per: 85.0, pbv: 3.85, dividend_yield: 0.5, roe: 4.8, debt_to_equity: 1.15, revenue_growth: 8.5 },
  { ticker: 'AVIA', company_name: 'Avia Avian Tbk', sector_name: 'Basic Materials', market_cap: 31000000000000, last_price: 500, per: 18.5, pbv: 3.15, dividend_yield: 4.8, roe: 17.2, debt_to_equity: 0.12, revenue_growth: 6.8 },
  { ticker: 'SMBR', company_name: 'Semen Baturaja Tbk', sector_name: 'Basic Materials', market_cap: 2400000000000, last_price: 242, per: 18.2, pbv: 0.65, dividend_yield: 1.8, roe: 3.6, debt_to_equity: 0.62, revenue_growth: 4.5 },
  { ticker: 'INKP', company_name: 'Indah Kiat Pulp & Paper Tbk', sector_name: 'Basic Materials', market_cap: 45000000000000, last_price: 8225, per: 6.5, pbv: 0.48, dividend_yield: 1.2, roe: 7.5, debt_to_equity: 1.15, revenue_growth: 5.8 },
  { ticker: 'TKIM', company_name: 'Pabrik Kertas Tjiwi Kimia Tbk', sector_name: 'Basic Materials', market_cap: 22000000000000, last_price: 7075, per: 5.8, pbv: 0.55, dividend_yield: 0.8, roe: 9.8, debt_to_equity: 0.85, revenue_growth: 4.2 },
  { ticker: 'IFSH', company_name: 'Ifishdeco Tbk', sector_name: 'Basic Materials', market_cap: 1800000000000, last_price: 850, per: 7.8, pbv: 1.65, dividend_yield: 5.2, roe: 21.5, debt_to_equity: 0.25, revenue_growth: 16.4 },
  { ticker: 'KRAS', company_name: 'Krakatau Steel (Persero) Tbk', sector_name: 'Basic Materials', market_cap: 2800000000000, last_price: 145, per: -5.2, pbv: 0.52, dividend_yield: 0.0, roe: -10.2, debt_to_equity: 4.50, revenue_growth: 2.1 },
  { ticker: 'NSSS', company_name: 'Nusantara Sawit Sejahtera Tbk', sector_name: 'Basic Materials', market_cap: 3900000000000, last_price: 165, per: 24.5, pbv: 2.45, dividend_yield: 0.0, roe: 10.2, debt_to_equity: 1.25, revenue_growth: 32.5 },

  // Financials (14)
  { ticker: 'BRIS', company_name: 'Bank Syariah Indonesia Tbk', sector_name: 'Financials', market_cap: 138000000000000, last_price: 3000, per: 21.5, pbv: 3.25, dividend_yield: 0.8, roe: 16.8, debt_to_equity: 0.15, revenue_growth: 15.8 },
  { ticker: 'ARTO', company_name: 'Bank Jago Tbk', sector_name: 'Financials', market_cap: 35000000000000, last_price: 2520, per: 195.0, pbv: 4.15, dividend_yield: 0.0, roe: 2.2, debt_to_equity: 0.12, revenue_growth: 48.2 },
  { ticker: 'BBHI', company_name: 'Allo Bank Indonesia Tbk', sector_name: 'Financials', market_cap: 19500000000000, last_price: 895, per: 38.5, pbv: 2.85, dividend_yield: 0.5, roe: 7.5, debt_to_equity: 0.22, revenue_growth: 24.5 },
  { ticker: 'BJBR', company_name: 'Bank Pembangunan Daerah Jawa Barat dan Banten Tbk', sector_name: 'Financials', market_cap: 10200000000000, last_price: 980, per: 6.2, pbv: 0.72, dividend_yield: 10.5, roe: 11.8, debt_to_equity: 0.45, revenue_growth: 4.2 },
  { ticker: 'BJTM', company_name: 'Bank Pembangunan Daerah Jawa Timur Tbk', sector_name: 'Financials', market_cap: 8500000000000, last_price: 570, per: 5.8, pbv: 0.68, dividend_yield: 9.8, roe: 12.0, debt_to_equity: 0.38, revenue_growth: 5.1 },
  { ticker: 'BNGA', company_name: 'Bank CIMB Niaga Tbk', sector_name: 'Financials', market_cap: 45000000000000, last_price: 1800, per: 6.8, pbv: 0.85, dividend_yield: 6.8, roe: 13.5, debt_to_equity: 0.28, revenue_growth: 7.4 },
  { ticker: 'BNII', company_name: 'Bank Maybank Indonesia Tbk', sector_name: 'Financials', market_cap: 18000000000000, last_price: 236, per: 8.5, pbv: 0.65, dividend_yield: 4.2, roe: 7.8, debt_to_equity: 0.32, revenue_growth: 3.8 },
  { ticker: 'BTPN', company_name: 'Bank BTPN Tbk', sector_name: 'Financials', market_cap: 22000000000000, last_price: 2700, per: 8.2, pbv: 0.62, dividend_yield: 3.5, roe: 7.6, debt_to_equity: 0.35, revenue_growth: 6.2 },
  { ticker: 'PNBN', company_name: 'Bank Pan Indonesia Tbk', sector_name: 'Financials', market_cap: 31000000000000, last_price: 1300, per: 8.8, pbv: 0.65, dividend_yield: 1.5, roe: 7.5, debt_to_equity: 0.25, revenue_growth: 4.5 },
  { ticker: 'AGRO', company_name: 'Bank Raya Indonesia Tbk', sector_name: 'Financials', market_cap: 5800000000000, last_price: 250, per: 85.0, pbv: 1.85, dividend_yield: 0.0, roe: 2.1, debt_to_equity: 0.18, revenue_growth: 35.2 },
  { ticker: 'BFIN', company_name: 'BFI Finance Indonesia Tbk', sector_name: 'Financials', market_cap: 14500000000000, last_price: 960, per: 8.5, pbv: 1.45, dividend_yield: 6.5, roe: 17.5, debt_to_equity: 1.25, revenue_growth: 12.8 },
  { ticker: 'ADMF', company_name: 'Adira Dinamika Multi Finance Tbk', sector_name: 'Financials', market_cap: 10800000000000, last_price: 10800, per: 6.5, pbv: 1.15, dividend_yield: 9.2, roe: 18.2, debt_to_equity: 1.85, revenue_growth: 8.4 },
  { ticker: 'CFIN', company_name: 'Clipan Finance Indonesia Tbk', sector_name: 'Financials', market_cap: 1650000000000, last_price: 415, per: 4.8, pbv: 0.42, dividend_yield: 8.5, roe: 9.2, debt_to_equity: 0.85, revenue_growth: 6.5 },
  { ticker: 'WOMF', company_name: 'Wahana Ottomitra Multiartha Tbk', sector_name: 'Financials', market_cap: 1100000000000, last_price: 315, per: 5.2, pbv: 0.68, dividend_yield: 6.8, roe: 13.5, debt_to_equity: 1.95, revenue_growth: 7.8 },

  // Consumer Non-Cyclicals (13)
  { ticker: 'CMRY', company_name: 'Cisarua Mountain Dairy Tbk (Cimory)', sector_name: 'Consumer Non-Cyclicals', market_cap: 42000000000000, last_price: 5300, per: 28.5, pbv: 6.50, dividend_yield: 1.8, roe: 23.5, debt_to_equity: 0.15, revenue_growth: 21.5 },
  { ticker: 'CPIN', company_name: 'Charoen Pokphand Indonesia Tbk', sector_name: 'Consumer Non-Cyclicals', market_cap: 82000000000000, last_price: 5000, per: 26.5, pbv: 2.85, dividend_yield: 2.1, roe: 11.2, debt_to_equity: 0.45, revenue_growth: 8.5 },
  { ticker: 'JPFA', company_name: 'Japfa Comfeed Indonesia Tbk', sector_name: 'Consumer Non-Cyclicals', market_cap: 18500000000000, last_price: 1580, per: 12.8, pbv: 1.35, dividend_yield: 3.5, roe: 11.0, debt_to_equity: 0.95, revenue_growth: 9.2 },
  { ticker: 'MAIN', company_name: 'Malindo Feedmill Tbk', sector_name: 'Consumer Non-Cyclicals', market_cap: 1750000000000, last_price: 780, per: 8.5, pbv: 0.78, dividend_yield: 0.0, roe: 9.5, debt_to_equity: 1.15, revenue_growth: 14.8 },
  { ticker: 'AALI', company_name: 'Astra Agro Lestari Tbk', sector_name: 'Consumer Non-Cyclicals', market_cap: 12500000000000, last_price: 6500, per: 11.5, pbv: 0.58, dividend_yield: 4.8, roe: 5.2, debt_to_equity: 0.18, revenue_growth: 3.5 },
  { ticker: 'LSIP', company_name: 'PP London Sumatra Indonesia Tbk', sector_name: 'Consumer Non-Cyclicals', market_cap: 6800000000000, last_price: 1000, per: 8.5, pbv: 0.62, dividend_yield: 5.5, roe: 7.5, debt_to_equity: 0.12, revenue_growth: 4.8 },
  { ticker: 'SIMP', company_name: 'Salim Ivomas Pratama Tbk', sector_name: 'Consumer Non-Cyclicals', market_cap: 6200000000000, last_price: 395, per: 7.2, pbv: 0.32, dividend_yield: 3.8, roe: 4.5, debt_to_equity: 0.45, revenue_growth: 2.8 },
  { ticker: 'TAPG', company_name: 'Triputra Agro Persada Tbk', sector_name: 'Consumer Non-Cyclicals', market_cap: 17500000000000, last_price: 885, per: 8.2, pbv: 1.65, dividend_yield: 6.8, roe: 21.0, debt_to_equity: 0.25, revenue_growth: 18.5 },
  { ticker: 'STAA', company_name: 'Sumber Tani Agung Resources Tbk', sector_name: 'Consumer Non-Cyclicals', market_cap: 10500000000000, last_price: 960, per: 9.5, pbv: 1.85, dividend_yield: 4.5, roe: 20.1, debt_to_equity: 0.28, revenue_growth: 12.4 },
  { ticker: 'CLEO', company_name: 'Sariguna Primatirta Tbk', sector_name: 'Consumer Non-Cyclicals', market_cap: 14500000000000, last_price: 1205, per: 36.5, pbv: 7.85, dividend_yield: 0.8, roe: 22.5, debt_to_equity: 0.22, revenue_growth: 28.5 },
  { ticker: 'ROTI', company_name: 'Nippon Indosari Corpindo Tbk', sector_name: 'Consumer Non-Cyclicals', market_cap: 6100000000000, last_price: 1025, per: 16.5, pbv: 2.15, dividend_yield: 6.5, roe: 13.2, debt_to_equity: 0.42, revenue_growth: 5.4 },
  { ticker: 'ULTJ', company_name: 'Ultra Jaya Milk Industry Tbk', sector_name: 'Consumer Non-Cyclicals', market_cap: 18500000000000, last_price: 1780, per: 15.2, pbv: 2.75, dividend_yield: 2.5, roe: 18.5, debt_to_equity: 0.22, revenue_growth: 8.2 },
  { ticker: 'PANI', company_name: 'Pantai Indah Kapuk Dua Tbk', sector_name: 'Properties & Real Estate', market_cap: 185000000000000, last_price: 11500, per: 145.0, pbv: 9.50, dividend_yield: 0.0, roe: 6.8, debt_to_equity: 0.35, revenue_growth: 85.0 },

  // Consumer Cyclicals (9)
  { ticker: 'MNCN', company_name: 'Media Nusantara Citra Tbk', sector_name: 'Consumer Cyclicals', market_cap: 4800000000000, last_price: 320, per: 3.5, pbv: 0.25, dividend_yield: 0.0, roe: 7.2, debt_to_equity: 0.15, revenue_growth: -6.5 },
  { ticker: 'SCMA', company_name: 'Surya Citra Media Tbk', sector_name: 'Consumer Cyclicals', market_cap: 9800000000000, last_price: 132, per: 15.5, pbv: 1.15, dividend_yield: 3.5, roe: 7.5, debt_to_equity: 0.18, revenue_growth: 4.8 },
  { ticker: 'MDIA', company_name: 'Intermedia Capital Tbk', sector_name: 'Consumer Cyclicals', market_cap: 1950000000000, last_price: 50, per: 12.5, pbv: 0.45, dividend_yield: 0.0, roe: 3.5, debt_to_equity: 0.85, revenue_growth: 2.1 },
  { ticker: 'RALS', company_name: 'Ramayana Lestari Sentosa Tbk', sector_name: 'Consumer Cyclicals', market_cap: 2800000000000, last_price: 410, per: 9.8, pbv: 0.78, dividend_yield: 9.8, roe: 8.2, debt_to_equity: 0.32, revenue_growth: 1.8 },
  { ticker: 'LPPF', company_name: 'Matahari Department Store Tbk', sector_name: 'Consumer Cyclicals', market_cap: 3500000000000, last_price: 1540, per: 5.2, pbv: 8.50, dividend_yield: 14.5, roe: 165.0, debt_to_equity: 2.85, revenue_growth: 2.5 },
  { ticker: 'MAPB', company_name: 'MAP Boga Adiperkasa Tbk', sector_name: 'Consumer Cyclicals', market_cap: 4200000000000, last_price: 1930, per: 24.5, pbv: 3.25, dividend_yield: 1.2, roe: 13.5, debt_to_equity: 0.65, revenue_growth: 16.5 },
  { ticker: 'PZZA', company_name: 'Sarimelati Kencana Tbk (Pizza Hut)', sector_name: 'Consumer Cyclicals', market_cap: 850000000000, last_price: 282, per: -14.5, pbv: 0.85, dividend_yield: 0.0, roe: -5.8, debt_to_equity: 0.88, revenue_growth: 1.5 },
  { ticker: 'DRMA', company_name: 'Dharma Polimetal Tbk', sector_name: 'Consumer Cyclicals', market_cap: 4900000000000, last_price: 1040, per: 9.2, pbv: 2.15, dividend_yield: 4.8, roe: 24.5, debt_to_equity: 0.42, revenue_growth: 14.8 },
  { ticker: 'FILM', company_name: 'MD Pictures Tbk', sector_name: 'Consumer Cyclicals', market_cap: 38000000000000, last_price: 3990, per: 165.0, pbv: 24.5, dividend_yield: 0.2, roe: 15.2, debt_to_equity: 0.12, revenue_growth: 32.5 },

  // Healthcare (4)
  { ticker: 'KAEF', company_name: 'Kimia Farma Tbk', sector_name: 'Healthcare', market_cap: 3800000000000, last_price: 685, per: -8.5, pbv: 0.85, dividend_yield: 0.0, roe: -10.5, debt_to_equity: 1.85, revenue_growth: 4.5 },
  { ticker: 'INAF', company_name: 'Indofarma Tbk', sector_name: 'Healthcare', market_cap: 650000000000, last_price: 210, per: -4.2, pbv: -1.5, dividend_yield: 0.0, roe: -35.0, debt_to_equity: 3.50, revenue_growth: -12.4 },
  { ticker: 'TSPC', company_name: 'Tempo Scan Pacific Tbk', sector_name: 'Healthcare', market_cap: 11500000000000, last_price: 2550, per: 10.5, pbv: 1.45, dividend_yield: 4.5, roe: 14.2, debt_to_equity: 0.32, revenue_growth: 8.5 },
  { ticker: 'SAME', company_name: 'Sarana Meditama Metropolitan Tbk', sector_name: 'Healthcare', market_cap: 4800000000000, last_price: 280, per: 45.0, pbv: 1.85, dividend_yield: 0.0, roe: 4.2, debt_to_equity: 0.28, revenue_growth: 14.2 }
];

async function seedTrendingStocks() {
  console.log('=== SEEDING 100 TRENDING INDONESIAN STOCKS ===');

  try {
    // Sync postgres sequences
    try {
      await db.sequelize.query("SELECT setval('stock_sectors_id_seq', COALESCE((SELECT MAX(id) FROM stock_sectors), 1));");
      await db.sequelize.query("SELECT setval('financial_assets_id_seq', COALESCE((SELECT MAX(id) FROM financial_assets), 1));");
    } catch (seqErr) {
      // Ignore if not postgres or sequence doesn't exist
    }

    // 1. Ensure sectors exist
    const sectorMap = {};
    const existingSectors = await db.StockSector.findAll();
    existingSectors.forEach(s => {
      sectorMap[s.name] = s.id;
    });

    for (const sec of newSectors) {
      if (!sectorMap[sec.name]) {
        const created = await db.StockSector.create(sec);
        sectorMap[created.name] = created.id;
        console.log(` Created new sector: ${created.name} (ID: ${created.id})`);
      }
    }

    // 2. Insert or update the 100 trending stocks
    let insertedCount = 0;
    let updatedCount = 0;

    for (const item of trendingStocks) {
      const sectorId = sectorMap[item.sector_name] || 1;
      const [stock, created] = await db.FinancialAsset.findOrCreate({
        where: { ticker: item.ticker.toUpperCase().trim() },
        defaults: {
          ticker: item.ticker.toUpperCase().trim(),
          company_name: item.company_name,
          sector_id: sectorId,
          market_cap: item.market_cap,
          last_price: item.last_price,
          per: item.per,
          pbv: item.pbv,
          dividend_yield: item.dividend_yield,
          roe: item.roe,
          debt_to_equity: item.debt_to_equity,
          revenue_growth: item.revenue_growth
        }
      });

      if (created) {
        insertedCount++;
      } else {
        await stock.update({
          company_name: item.company_name,
          sector_id: sectorId,
          market_cap: item.market_cap,
          per: item.per,
          pbv: item.pbv,
          dividend_yield: item.dividend_yield,
          roe: item.roe,
          debt_to_equity: item.debt_to_equity,
          revenue_growth: item.revenue_growth
        });
        updatedCount++;
      }
    }

    const totalAssets = await db.FinancialAsset.count();
    console.log(`\n Successfully seeded! Added: ${insertedCount} new stocks, Updated: ${updatedCount} stocks.`);
    console.log(` Total Stocks now in Database: ${totalAssets} emiten.\n`);
  } catch (error) {
    console.error('Seeding error:', error);
  }
}

if (require.main === module) {
  seedTrendingStocks().then(() => process.exit(0));
}

module.exports = seedTrendingStocks;
