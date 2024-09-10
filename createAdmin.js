const bcrypt = require('bcrypt');
const { User} = require('./src/models/User');
const { Role} = require('./src/models/Role');
const { sequelize } = require('./src/configs/dbConfig');

const createAdminUser = async () => {
  try {
    // await sequelize.authenticate();
    // await sequelize.sync(); // Sync models with the database

    // Find or create the admin role
    

    // Hash the admin password
    const hashedPassword = await bcrypt.hash('adminPassword', 10);
    console.log('hashedPassword :', hashedPassword);
    // Create the admin user
    // const adminUser = await User.create({
    //   username: 'adminUser',
    //   email: 'admin@example.com',
    //   password: hashedPassword,
    //   roleId: '550e8400-e29b-41d4-a716-446655440001',
    // });

    console.log('Admin user created successfully:', adminUser);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await sequelize.close();
  }
};

createAdminUser();
