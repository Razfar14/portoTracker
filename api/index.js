const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDatabase = require('../config/db');

const app = express();

// Apply Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Prevent caching on browser back/forward navigation
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// Configure EJS View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Serve static files from the public folder (CSS, images, etc)
app.use(express.static(path.join(__dirname, '../public')));

// Lazy Database Connection & Syncing (ideal for serverless cold-starts)
let databaseReady = false;
let databasePromise = null;

app.use(async (req, res, next) => {
  try {
    if (!databaseReady) {
      if (!databasePromise) {
        databasePromise = connectDatabase();
      }
      await databasePromise;
      databaseReady = true;
    }
    next();
  } catch (error) {
    console.error('Database connection failed in serverless lifecycle:', error);
    databasePromise = null; // Reset promise to retry on next request
    return res.status(500).json({
      message: 'Database initialization failed. Please contact administrator or check logs.'
    });
  }
});

// Mount routes
app.use('/api', require('../routes/api'));

// Favicon handler
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Dynamic Page Routing for EJS
app.get('/', (req, res) => {
  res.render('index');
});

// Serve .html pages as .ejs views (without extension)
app.get('/:page.html', (req, res, next) => {
  const page = req.params.page;
  if (!page || page.includes('.')) return next();
  res.render(page, (err, html) => {
    if (err) {
      return res.status(404).send('<!DOCTYPE html><html><body><h1>404 - Halaman Tidak Ditemukan</h1><a href="/">Kembali ke Login</a></body></html>');
    }
    res.send(html);
  });
});

// Fallback for paths without .html
app.get('/:page', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const page = req.params.page;
  if (!page || page.includes('.')) return next();
  res.render(page, (err, html) => {
    if (err) {
      return res.status(404).send('<!DOCTYPE html><html><body><h1>404 - Halaman Tidak Ditemukan</h1><a href="/">Kembali ke Login</a></body></html>');
    }
    res.send(html);
  });
});

// Handle 404 for API requests
app.use(/^\/api\/.*/, (req, res) => {
  res.status(404).json({
    message: `API endpoint '${req.originalUrl}' not found`
  });
});

// General 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err.message);
  res.status(500).json({
    message: 'An internal server error occurred: ' + err.message
  });
});

// Start server locally if run directly (e.g. node api/index.js)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`IDX SaaS API server running locally on http://localhost:${PORT}`);
  });
}

module.exports = app;
