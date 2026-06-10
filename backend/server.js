import 'dotenv/config';
import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import Admin from './src/models/Admin.js';
import bcrypt from 'bcryptjs';


