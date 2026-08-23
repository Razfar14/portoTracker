const express = require('express');
const router = express.Router();
const newsController = require('../controller/newsController');

router.get('/', newsController.getNews);

module.exports = router;
