import 'dotenv/config';
import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import Admin from './src/models/Admin.js';
import bcrypt from 'bcryptjs';

const PORT = process.env.PORT || 5000;

// Seed Admin if not exists

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Server
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
