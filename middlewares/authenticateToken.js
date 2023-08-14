const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET; // Replace with your actual secret key

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401).json({ message: 'Missing token' }); // Unauthorized
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.sendStatus(403).json({ message: 'Invalid token' }); // Forbidden
    }
    req.user = user; // Attach user info to the request object
    next();
  });
};

module.exports = authenticateToken;
