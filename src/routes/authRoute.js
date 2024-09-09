const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models'); 
const { Role } = require('../models'); 

const router = express.Router();

// POST /auth/signup - Admin signup
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    // Find the role ID for 'admin'
    const role = await Role.findOne({ where: { name: 'admin' } });
    
    if (!role) {
      return res.status(400).json({ error: 'Admin role not found' });
    }

    // Hash the password and create the user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      username, 
      email, 
      password: hashedPassword, 
      roleId: role.id // Assign the correct roleId
    });
    
    res.status(201).json({ message: 'Admin created successfully', user });
  } catch (err) {
    res.status(500).json({ error: 'Error creating admin user', message: err });
  }
});


// POST /auth/register - Admin registers a user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  // Hash password and create user
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });
    
    res.status(201).json({ message: 'User created successfully', user });
  } catch (err) {
    res.status(500).json({ error: 'Error creating user' });
  }
});

// POST /auth/login - User login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
