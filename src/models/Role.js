const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs/dbConfig');

const Role = sequelize.define('Role', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.ENUM('Admin', 'Manager', 'Employee'),
        allowNull: false,
    },
    permissions: {
        type: DataTypes.ARRAY(DataTypes.STRING), // Array of permissions
        allowNull: false,
        defaultValue: [] // Empty array by default
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'roles', // Table name in the database
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

module.exports = Role;
