const User = require('../models/User');
const bcrypt = require('bcrypt');
const Role = require('../models/Role');
const { createAuditLog } = require('./auditLogController');

// Create User
const createUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const roleData = await Role.findOne({ where: { name: role } });
        if (!roleData) {
            await createAuditLog('CREATE_USER', req.user.id, `Role with name: ${role} not found`, `${req.user.id}`);
            return res.status(404).json({ message: 'Role not found' });
        }

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            roleId: roleData.id,
        });

        await createAuditLog('CREATE_USER', newUser.id, `User with ID: ${newUser.id} created`, `${newUser.id}`);

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ error: 'Error creating user', message: error.message });
        await createAuditLog('CREATE_USER', req.user.id, 'Error creating user', `${req.user.id}`);
    }
};

// Get All Users (excluding soft-deleted users)
const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({ where: { isDeleted: false } });

        if (!users.length) {
            await createAuditLog("VIEW_ALL_USERS", req.user.id, 'No users found', "ALL_USERS");
            return res.status(404).json({ message: 'No users found' });
        }
        res.status(200).json(users);
        await createAuditLog("VIEW_ALL_USERS", req.user.id, 'User list fetched', "ALL_USERS");

    } catch (error) {
        res.status(500).json({ error: 'Error fetching users', message: error.message });
        await createAuditLog("VIEW_ALL_USERS", req.user.id, 'Error fetching users', "ALL_USERS");
    }
};

// Get User by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findOne({ where: { id: req.params.id, isDeleted: false } });
        if (!user) {
            await createAuditLog("VIEW_USER", req.user.id, `User with ID: ${req.params.id} not found`, `${req.params.id}`);
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);

        await createAuditLog("VIEW_USER", req.user.id, `User with ID: ${req.params.id} fetched`, `${req.params.id}`);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user', message: error.message });
        await createAuditLog("VIEW_USER", req.user.id, `Error fetching user with ID: ${req.params.id}`, `${req.params.id}`);
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

        if (!updatedUser[0]) {
            await createAuditLog("UPDATE_USER", req.user.id, `User with ID: ${req.params.id} not found or not updated`, `${req.params.id}`);
            return res.status(404).json({ message: 'User not found or not updated' });
        }

        res.status(200).json({ message: 'User updated successfully' });
        await createAuditLog("UPDATE_USER", req.user.id, `User with ID: ${req.params.id} updated`, `${req.params.id}`);
    } catch (error) {
        res.status(500).json({ error: 'Error updating user', message: error.message });
        await createAuditLog("UPDATE_USER", req.user.id, `Error updating user with ID: ${req.params.id}`, `${req.params.id}`);
    }
};

// Soft Delete User
const softDeleteUser = async (req, res) => {
    try {
        const user = await User.update(
            { isDeleted: true },
            { where: { id: req.params.id } }
        );

        if (!user[0]) {
            await createAuditLog("DELETE_USER", req.user.id, `User with ID: ${req.params.id} not found or not deleted`, `${req.params.id}`);
            return res.status(404).json({ message: 'User not found or not deleted' });
        }

        res.status(200).json({ message: 'User soft deleted successfully' });
        await createAuditLog("DELETE_USER", req.user.id, `User with ID: ${req.params.id} soft deleted`, `${req.params.id}`);
    } catch (error) {
        res.status(500).json({ error: 'Error soft deleting user', message: error.message });
        await createAuditLog("DELETE_USER", req.user.id, `Error soft deleting user with ID: ${req.params.id}`, `${req.params.id}`);
    }
};

// Restore User
const restoreUser = async (req, res) => {
    try {
        const user = await User.update(
            { isDeleted: false },
            { where: { id: req.params.id, isDeleted: true } }
        );

        if (!user[0]) {
            await createAuditLog("RESTORE_USER", req.user.id, `User with ID: ${req.params.id} not found or not restored`, `${req.params.id}`);
            return res.status(404).json({ message: 'User not found or not restored' });
        }

        res.status(200).json({ message: 'User restored successfully' });
        await createAuditLog("RESTORE_USER", req.user.id, `User with ID: ${req.params.id} restored`, `${req.params.id}`);

    } catch (error) {
        res.status(500).json({ error: 'Error restoring user', message: error.message });
        await createAuditLog("RESTORE_USER", req.user.id, `Error restoring user with ID: ${req.params.id}`, `${req.params.id}`);
    }
};

// Permanently Delete User
const permanentlyDeleteUser = async (req, res) => {
    try {
        const user = await User.destroy({ where: { id: req.params.id } });

        if (!user) {
            await createAuditLog("DELETE_USER", req.user.id, `User with ID: ${req.params.id} not found or not permanently deleted`, `${req.params.id}`);
            return res.status(404).json({ message: 'User not found or not permanently deleted' });
        }

        res.status(200).json({ message: 'User permanently deleted' });
        await createAuditLog("DELETE_USER", req.user.id, `User with ID: ${req.params.id} permanently deleted`, `${req.params.id}`);
    } catch (error) {
        res.status(500).json({ error: 'Error permanently deleting user', message: error.message });
        await createAuditLog("DELETE_USER", req.user.id, `Error permanently deleting user with ID: ${req.params.id}`, `${req.params.id}`);
    }
};

// Assign Role to User
const assignRoleToUser = async (req, res) => {
    try {
        const { role } = req.body;
        const userId = req.params.id;

        const user = await User.findByPk(userId);
        if (!user) {
            await createAuditLog("ASSIGN_ROLE", req.user.id, `User with ID: ${userId} not found`, `${userId}`);
            return res.status(404).json({ message: 'User not found' });
        }

        const roleData = await Role.findOne({ where: { name: role } });
        await user.update({ roleId: roleData.id });

        res.status(200).json({ message: `Role assigned successfully to user with ID: ${userId}`, user });
        await createAuditLog("ASSIGN_ROLE", req.user.id, `Role with name: ${role} assigned to user with ID: ${userId}`, `${userId}`);
    } catch (error) {
        res.status(500).json({ error: 'Error assigning role', message: error.message });
        await createAuditLog("ASSIGN_ROLE", req.user.id, `Error assigning role to user with ID: ${userId}`, `${userId}`);
    }
};

// Revoke Role from User (Set roleId to 'user' or a default role)
const revokeRoleFromUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const defaultRole = 'User'; // You can adjust this to your default role

        const user = await User.findByPk(userId);
        if (!user) {
            await createAuditLog("REVOKE_ROLE", req.user.id, `User with ID: ${userId} not found`, `${userId}`);
            return res.status(404).json({ message: 'User not found' });
        }
        const { id } = await Role.findOne({ where: { name: defaultRole } });
        await user.update({ roleId: id });

        res.status(200).json({ message: `Role revoked successfully from user with ID: ${userId}`, user });
        await createAuditLog("REVOKE_ROLE", req.user.id, `Role revoked from user with ID: ${userId}`, `${userId}`);
    } catch (error) {
        res.status(500).json({ error: 'Error revoking role', message: error.message });
        await createAuditLog("REVOKE_ROLE", req.user.id, `Error revoking role from user with ID: ${userId}`, `${userId}`);
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
