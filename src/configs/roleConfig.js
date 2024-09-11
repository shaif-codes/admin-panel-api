const { Role } = require('../models/associations');
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
        "view-users-by-id",
        "create-projects",
        "view-projects",
        "edit-projects",
        "delete-projects",
        "restore-projects",
        "manage-roles",
        "manage-permissions"
      ],
    },
    {
      name: 'Manager',
      permissions: ["view-projects", "view-users", "view-users-by-id"],
    },
    {
      name: 'Employee',
      permissions: ["view-projects", "update-tasks", "view-users-by-id"],
    },
    {
      name: 'User',
      permissions: []
    }
  ];

  await Role.bulkCreate(roles);
};

insertRoles();
