const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs/dbConfig');

const Project = sequelize.define('Project', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users', // Referencing the User table
            key: 'id',
        },
    },
    assignedTo: {
        type: DataTypes.ARRAY(DataTypes.UUID), // Array of User IDs
        allowNull: true,
    },
    deletedAt: {
        type: DataTypes.DATE, // For soft delete functionality
        allowNull: true,
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
    tableName: 'projects', // Table name in the database
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    paranoid: true, // Enables soft delete (sets deletedAt instead of hard delete)
});

module.exports = Project;
