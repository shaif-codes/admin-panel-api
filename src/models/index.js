// src/models/index.js

const User = require('./User');
const Role = require('./Role');

// Association (User -> Role)
User.belongsTo(Role, { foreignKey: 'roleId' });
Role.hasMany(User, { foreignKey: 'roleId' });

module.exports = { User, Role };
