const express = require('express');
const dotenv = require('dotenv');
const { connectDB, sequelize } = require('./src/configs/dbConfig');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoute = require('./src/routes/authRoute');
const User = require('./src/models/User');
const cookieParser = require('cookie-parser');
const userRoute = require('./src/routes/userRoute');

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

require('./src/models/associations'); // Load models

// Middlewares
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});
  
app.use('/auth', authRoute); // Your auth routes
app.use('/users', userRoute); // Your user routes
 
// Connect to the database and start the server
sequelize.sync({ alter: true }).then(() => {
    console.log('Database synced');
    }).catch((err) => {
    console.log('An error occurred: ', err);
    }
);
// sequelize.sync({ force: true }).then(() => {
//   console.log('Database synced');
//   }).catch((err) => {
//   console.log('An error occurred: ', err);
//   }
// );

 
connectDB().then(() => {  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  
});



