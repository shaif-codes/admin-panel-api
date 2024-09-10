const {Role} = require('../models/associations');
const insertRoles = async () => {
    const roles = [
      {
        name: 'Admin',
        permissions: [
          "create-users",
          "edit-users",
          "delete-users",
          "restore-users",
          "view-users",
          "view-projects",
          "manage-roles",
          "manage-permissions"
        ],
      },
      {
        name: 'Manager',
        permissions: ['view-projects', 'edit-projects', 'manage-team'],
      },
      {
        name: 'Employee',
        permissions: ['view-projects', 'update-tasks'],
      },
    ];
  
    await Role.bulkCreate(roles);
  };
  
  insertRoles();
  