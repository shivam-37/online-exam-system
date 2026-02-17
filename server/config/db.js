const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Default MongoDB URI for development
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/online-exam-system';
    
    console.log('Connecting to MongoDB...');
    console.log(`Connection string: ${mongoURI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`); // Hide credentials
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`✅ Database: ${conn.connection.name}`);
    
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('Please make sure:');
    console.log('1. MongoDB is installed and running');
    console.log('2. The connection string in .env file is correct');
    console.log('3. You have permission to access the database');
    process.exit(1);
  }
};

module.exports = connectDB;