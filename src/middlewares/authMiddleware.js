const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const authenticateToken = (req, res, next) => {
  // Check for token in request headers or cookies
  const token = req.headers['x-auth-token'] || req.cookies.token;
  
  if (!token) return res.status(401).json({ message: 'Access Denied' });
  
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    console.log('verified :', verified);
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};

const isAdmin = (req, res, next) => {
  console.log('req.user :', req.user);
  if (req.user.role.name !== 'Admin') {
    return res.status(403).json({ message: 'Access Forbidden: Admins only' });
  }
  next();
};

module.exports = { authenticateToken, isAdmin };
