const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'idx_financial_jwt_secret_key_2026_sdflkjdsf';

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Access Denied: Missing or malformed authorization token'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    return res.status(401).json({
      message: 'Access Denied: Invalid or expired authorization token'
    });
  }
}

function authenticateAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      message: 'Access Denied: Requires Admin Role'
    });
  }
}

module.exports = {
  authenticateJWT,
  authenticateAdmin
};
