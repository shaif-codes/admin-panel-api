const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs/dbConfig');

const AuditLog = sequelize.define('AuditLog', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    performedBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users', // Assuming the User model is named 'Users'
            key: 'id',
        },
    },
    performedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    targetResource: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false, // Disable automatic createdAt and updatedAt
    tableName: 'audit_logs', // Table name in the database
});

module.exports = AuditLog;
