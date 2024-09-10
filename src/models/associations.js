const User = require('./User');
const Role = require('./Role');
const Project = require('./Project');
const AuditLog = require('./AuditLog');

// Association (User -> Role)
Role.hasMany(User, {
    foreignKey: 'roleId',
    as: 'users',
    onDelete: 'SET NULL', // If a role is deleted, set the roleId in User to NULL
  });
User.belongsTo(Role, {
    foreignKey: 'roleId',
    as: 'role',
  });


// User -> Project (One-to-Many for createdBy relationship)
User.hasMany(Project, {
    foreignKey: 'createdBy',
    as: 'createdProjects',
    onDelete: 'SET NULL', // If a user is deleted, set the createdBy field in Project to NULL
  });
  Project.belongsTo(User, {
    foreignKey: 'createdBy',
    as: 'creator',
});

// Project -> User (Many-to-Many for assignedTo relationship)
Project.belongsToMany(User, {
    through: 'UserProjects', // A junction table to represent many-to-many relationship
    as: 'assignedUsers',
    foreignKey: 'projectId',
  });
  User.belongsToMany(Project, {
    through: 'UserProjects', // A junction table to represent many-to-many relationship
    as: 'assignedProjects',
    foreignKey: 'userId',
});

// AuditLog -> User (One-to-Many)
User.hasMany(AuditLog, {
    foreignKey: 'performedBy',
    as: 'auditLogs',
    onDelete: 'SET NULL', // If a user is deleted, set the performedBy field in AuditLog to NULL
  });
  AuditLog.belongsTo(User, {
    foreignKey: 'performedBy',
    as: 'performer',
  });


// module.exports = { User, Role, Project};
module.exports = { User, Role, Project, AuditLog };