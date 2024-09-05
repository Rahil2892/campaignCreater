const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDb = require('./db');
const router = require('./route');

const app = express();

// Connect to MongoDB
if (process.env.NODE_ENV !== 'test') {
  connectDb(); // Only connect to the real database outside of the test environment
}

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/saveCampaign', router);

module.exports = app; // Export the app for use in the test file

// If not in a test environment, start the server
if (process.env.NODE_ENV !== 'test') {
  app.listen(5000, () => {
    console.log('Server running on port 5000');
  });
}
