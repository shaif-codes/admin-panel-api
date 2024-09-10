const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcrypt');
// const { Op, Sequelize } = require('sequelize');
const { generateToken } = require('../utils/jwtUtils.js');

const signup = async (req, res) => {
    try {
        // Check if there's already an admin user
        const existingAdmin = await User.findOne({ where: { roleId: 'admin' } });
        if (existingAdmin) {
            return res.status(400).json({ error: 'Admin user already exists' });
        }

        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const role = await Role.findOne({ where: { name: 'Admin' } });

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            roleId: role.id 
        });

        const token = generateToken(newUser.id, role);

        res.status(201).json({
            message: 'Admin created successfully',
            user: newUser,
            token
        });
    } catch (error) {
        res.status(500).json({ error: 'Error creating admin user', message: error.message });
    }
};
const registerUser = async (req, res) => {
    try {
        const { username, email, password, roleType } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const role = await Role.findOne({ where: { name: roleType } });
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            roleId: role.id // Default role for new users
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: newUser
        });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user', message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ where: { username } });
        // console.log('user :', user);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const role = await Role.findOne({ where: { id: user.roleId } });
        console.log('role :', role); 
        const token = generateToken(user.id, role);
        res.cookie('token', token, {
            httpOnly: true, // Ensures the cookie is not accessible via JavaScript
            sameSite: 'Strict', // Prevents the cookie from being sent with cross-site requests
            maxAge: 60 * 60 * 1000, // 1 hour
        });
        res.status(200).json({
            message: 'Login successful',
            token
        });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in', message: error.message });
    }
};

module.exports = { signup, registerUser, login };
