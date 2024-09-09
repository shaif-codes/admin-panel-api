const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',  // Explicitly define the dialect here
  logging: false,  // Disable logging if you prefer
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to the database successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1); // Exit if unable to connect
  }
};

module.exports = { sequelize, connectDB };
