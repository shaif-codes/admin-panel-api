const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');
const {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    softDeleteUser,
    restoreUser,
    permanentlyDeleteUser,
    assignRoleToUser,
    revokeRoleFromUser,
} = require('../controllers/userController');

// Only Admins and Managers can create users
router.post('/user', authenticateToken, checkPermission('create-users'), createUser);

// Admins and Managers can get users
router.get('/user', authenticateToken, checkPermission('view-users'), getUsers);

// Only Admins can get, update, or delete users by ID
router.get('/user/:id', authenticateToken, checkPermission('view-users'), getUserById);
router.put('/user/:id', authenticateToken, checkPermission('edit-users'), updateUser);
router.delete('/user/:id', authenticateToken, checkPermission('delete-users'), softDeleteUser);
router.patch('/user/restore/:id', authenticateToken, checkPermission('restore-users'), restoreUser);
router.delete('/user/permanent/:id', authenticateToken, checkPermission('delete-users'), permanentlyDeleteUser);
router.patch('/user/role/:id', authenticateToken, checkPermission('manage-roles'), assignRoleToUser);
router.patch('/user/revoke/:id', authenticateToken, checkPermission('manage-roles'), revokeRoleFromUser);

module.exports = router;
