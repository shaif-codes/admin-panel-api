const express = require('express');
const { signup, registerUser, login } = require('../controllers/authController');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public Routes
router.post('/signup', authenticateToken, isAdmin, signup); // Admin-only route for creating an Admin user
router.post('/register', authenticateToken, isAdmin, registerUser); // Admin-only route for registering new users
router.post('/login', login); // Public route for login

module.exports = router;
