const express = require('express');
const { authenticateToken } = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');
const { getAuditLogs } = require('../controllers/auditLogController');
const router = express.Router();

// Route to get audit logs, only accessible by Admin
router.get('/audit-logs', authenticateToken, checkPermission('view_audit_logs'), getAuditLogs);

module.exports = router;
