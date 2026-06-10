import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import BusinessProfile from '../models/BusinessProfile.js';
import Document from '../models/Document.js';
import { deleteFromCloudinary } from '../middleware/upload.js';

// Generate User JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const register = async (req, res, next) => {
  try {
    const { businessName, email, password } = req.body;

    if (!businessName || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password with bcryptjs (rounds >= 12 as per security checklist)
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create User
    const user = await User.create({
      email,
      passwordHash,
      subscriptionPlan: 'free',
      isActive: true,
    });

    // Create empty BusinessProfile linked to user
    await BusinessProfile.create({
      userId: user._id,
      businessName,
      email,
      address: 'Update your business address',
      phone: 'Update your phone number',
    });

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        subscriptionPlan: user.subscriptionPlan,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    // Get business profile
    const profile = await BusinessProfile.findOne({ userId: user._id });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        subscriptionPlan: user.subscriptionPlan,
        businessName: profile ? profile.businessName : '',
      },
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Placeholder OK for MVP
    res.json({
      success: true,
      message: 'Password reset link sent (mocked for MVP).',
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ success: false, message: 'Token and new password are required' });
    }

    // Placeholder OK for MVP
    res.json({
      success: true,
      message: 'Password reset successful (mocked for MVP).',
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const profile = await BusinessProfile.findOne({ userId: user._id });

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        subscriptionPlan: user.subscriptionPlan,
        businessName: profile ? profile.businessName : '',
        profileCompleted: !!(profile && profile.address && profile.phone && profile.bankName),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new passwords are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect current password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    const salt = await bcrypt.genSalt(12);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Clean up PDFs from Cloudinary
    const docs = await Document.find({ userId });
    for (const doc of docs) {
      if (doc.pdfPublicId) {
        try {
          await deleteFromCloudinary(doc.pdfPublicId);
        } catch (err) {
          console.error(`Error deleting doc ${doc._id} PDF:`, err);
        }
      }
    }
    await Document.deleteMany({ userId });

    // Clean up profile images from Cloudinary
    const profile = await BusinessProfile.findOne({ userId });
    if (profile) {
      if (profile.logo?.publicId) await deleteFromCloudinary(profile.logo.publicId);
      if (profile.qrCode?.publicId) await deleteFromCloudinary(profile.qrCode.publicId);
      await BusinessProfile.deleteOne({ userId });
    }

    await User.findByIdAndDelete(userId);
    res.json({ success: true, message: 'Account and all associated business data deleted' });
  } catch (error) {
    next(error);
  }
};

