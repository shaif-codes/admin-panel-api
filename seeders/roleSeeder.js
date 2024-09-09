const { Role } = require('../models');

// Seed roles into the database
const seedRoles = async () => {
  await Role.bulkCreate([
    { roleName: 'admin' },
    { roleName: 'user' },
  ]);
  console.log('Roles seeded');
};

seedRoles();
