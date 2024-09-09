const express = require('express');
const dotenv = require('dotenv');
const { connectDB } = require('./src/configs/dbConfig');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoute = require('./src/routes/authRoute');

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});
  
app.use('/auth', authRoute); // Your auth routes

// Connect to the database and start the server
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
