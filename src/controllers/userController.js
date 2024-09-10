const User = require('../models/User');
const bcrypt = require('bcrypt');
const Role = require('../models/Role');

// Create User
const createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const roleData = await Role.findOne({ where: { name: role } });
    if(!roleData) return res.status(404).json({ message: 'Role not found' });

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      roleId: roleData.id,
    });

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ error: 'Error creating user', message: error.message });
  }
};

// Get All Users (excluding soft-deleted users)
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({ where: { isDeleted: false } });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users', message: error.message });
  }
};

// Get User by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.params.id, isDeleted: false } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user', message: error.message });
  }
};

// Update User
const updateUser = async (req, res) => {
  try {
    const { username, email, roleId } = req.body;
    const updatedUser = await User.update(
      { username, email, roleId },
      { where: { id: req.params.id, isDeleted: false } }
    );

    if (!updatedUser[0]) return res.status(404).json({ message: 'User not found or not updated' });

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating user', message: error.message });
  }
};

// Soft Delete User
const softDeleteUser = async (req, res) => {
  try {
    const user = await User.update(
      { isDeleted: true },
      { where: { id: req.params.id } }
    );

    if (!user[0]) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User soft deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error soft deleting user', message: error.message });
  }
};

// Restore User
const restoreUser = async (req, res) => {
  try {
    const user = await User.update(
      { isDeleted: false },
      { where: { id: req.params.id, isDeleted: true } }
    );

    if (!user[0]) return res.status(404).json({ message: 'User not found or not deleted' });

    res.status(200).json({ message: 'User restored successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error restoring user', message: error.message });
  }
};

// Permanently Delete User
const permanentlyDeleteUser = async (req, res) => {
  try {
    const user = await User.destroy({ where: { id: req.params.id } });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User permanently deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error permanently deleting user', message: error.message });
  }
};

// Assign Role to User
const assignRoleToUser = async (req, res) => {
    try {
      const { role } = req.body;
      const userId = req.params.id;
  
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const roleData = await Role.findOne({ where: { name: role } });
      await user.update({ roleId: roleData.id });
      res.status(200).json({ message: `Role assigned successfully to user with ID: ${userId}`, user });
    } catch (error) {
      res.status(500).json({ error: 'Error assigning role', message: error.message });
    }
  };
  
  // Revoke Role from User (Set roleId to 'user' or a default role)
  const revokeRoleFromUser = async (req, res) => {
    try {
      const userId = req.params.id;
      const defaultRole = 'User'; // You can adjust this to your default role
  
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const {id} = await Role.findOne({ where: { name: defaultRole } });
      await user.update({ roleId: id });
      res.status(200).json({ message: `Role revoked successfully from user with ID: ${userId}`, user });
    } catch (error) {
      res.status(500).json({ error: 'Error revoking role', message: error.message });
    }
  };

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  softDeleteUser,
  restoreUser,
  permanentlyDeleteUser,
  assignRoleToUser,
  revokeRoleFromUser,
};
