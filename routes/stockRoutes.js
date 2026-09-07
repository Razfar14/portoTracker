const express = require('express');
const router = express.Router();
const stockCatalogController = require('../controller/stockCatalogController');

// Public or Authenticated Stock Catalog Endpoints
router.get('/', stockCatalogController.getAllStocks);
router.get('/:ticker', stockCatalogController.getStockDetail);

module.exports = router;
