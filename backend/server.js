import 'dotenv/config';
import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import Admin from './src/models/Admin.js';
import bcrypt from 'bcryptjs';

const PORT = process.env.PORT || 5000;

// Seed Admin if not exists
const seedAdmin = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const email = process.env.ADMIN_EMAIL || 'admin@solvixinnovations.com';
      const defaultPassword = 'AdminPassword123!';
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(defaultPassword, salt);

      await Admin.create({
        name: 'Solvix Super Admin',
        email,
        passwordHash,
        role: 'superadmin',
      });
      console.log('--------------------------------------------------');
      console.log('Seeded default admin successfully!');
      console.log(`Email: ${email}`);
      console.log(`Password: ${defaultPassword}`);
      console.log('--------------------------------------------------');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
};

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Auto-seed admin user
    await seedAdmin();

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
