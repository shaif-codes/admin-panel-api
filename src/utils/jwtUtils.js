const jwt = require('jsonwebtoken');

// Function to generate a JWT token
const generateToken = (userId, role) => {
    const payload = { id: userId, role: role };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Function to verify a JWT token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

module.exports = { generateToken, verifyToken };
