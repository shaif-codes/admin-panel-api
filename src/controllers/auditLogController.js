const AuditLog = require('../models/AuditLog');

// Controller to fetch audit logs
const getAuditLogs = async (req, res) => {
    try {
        const auditLogs = await AuditLog.findAll({
            include: [
                {
                    association: 'performer', // Fetch the user who performed the action
                    attributes: ['id', 'username'], // Include relevant user info
                }
            ],
            order: [['createdAt', 'DESC']] // Order by most recent actions
        });
        res.status(200).json(auditLogs);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving audit logs', message: error.message });
    }
};

const createAuditLog = async (action, performedBy, targetResource) => {
    try {
      // Create a new audit log entry
      await AuditLog.create({
        action,
        performedBy, // UUID of the user performing the action
        targetResource, // UUID of the resource (e.g., user, project, etc.) being acted upon
      });
    } catch (error) {
      console.error('Error creating audit log:', error.message);
    }
};

module.exports = { getAuditLogs, createAuditLog };
