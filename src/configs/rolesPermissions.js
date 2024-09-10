const rolesPermissions = {
    employee: {
      read: ['profile', 'tasks', 'announcements'],
      write: ['profile', 'reports'],
      delete: [],
      admin: []
    },
    manager: {
      read: ['profile', 'tasks', 'reports', 'announcements'],
      write: ['profile', 'tasks', 'reports', 'announcements'],
      delete: ['tasks', 'reports'],
      admin: ['manageTeam']
    },
    admin: {
      read: ['profile', 'tasks', 'reports', 'announcements', 'users', 'roles', 'projects', 'auditLogs'],
      write: ['profile', 'tasks', 'reports', 'announcements', 'users', 'roles', 'projects', 'auditLogs'],
      delete: ['tasks', 'reports', 'users', 'roles', 'projects'],
      admin: ['manageSystem', 'manageUsers', 'manageRoles', 'manageProjects', 'viewAuditLogs']
    }
  };
  
module.exports = rolesPermissions;
  