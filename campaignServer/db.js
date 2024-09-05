const mongoose = require('mongoose');
require('dotenv').config()

let isConnected = false; // Track the connection status

const connectDb = async () => {
  if (!isConnected) {
    try {
      await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      isConnected = true;
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  }
};

module.exports = connectDb;
