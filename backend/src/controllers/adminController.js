import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import User from '../models/User.js';
import Document from '../models/Document.js';
import BusinessProfile from '../models/BusinessProfile.js';

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.ADMIN_JWT_SECRET,
      { expiresIn: process.env.ADMIN_JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const freeUsers = await User.countDocuments({ subscriptionPlan: 'free' });
    const proUsers = await User.countDocuments({ subscriptionPlan: 'pro' });
    const totalDocs = await Document.countDocuments();

    // Documents generated today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const docsGeneratedToday = await Document.countDocuments({
      createdAt: { $gte: startOfToday },
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        freeUsers,
        proUsers,
        totalDocs,
        docsGeneratedToday,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { search, plan, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (plan && ['free', 'pro'].includes(plan)) {
      filter.subscriptionPlan = plan;
    }

    if (search) {
      filter.email = { $regex: search, $options: 'i' };
    }

    const currentPage = Math.max(1, Number(page));
    const currentLimit = Math.max(1, Number(limit));
    const skip = (currentPage - 1) * currentLimit;

    const users = await User.find(filter)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(currentLimit);

    // Attach doc counts and business names
    const enriched = await Promise.all(
      users.map(async u => {
        const count = await Document.countDocuments({ userId: u._id });
        const profile = await BusinessProfile.findOne({ userId: u._id }).select('businessName');
        return {
          ...u.toObject(),
          docCount: count,
          businessName: profile?.businessName || '—',
        };
      })
    );

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: enriched,
      total,
      page: currentPage,
      pages: Math.ceil(total / currentLimit),
    });
  } catch (err) {
    next(err);
  }
};

export const updateUserPlan = async (req, res, next) => {
  try {
    const { plan } = req.body; // 'free' or 'pro'
    if (!['free', 'pro'].includes(plan)) {
      return res.status(400).json({ success: false, message: 'Invalid plan' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { subscriptionPlan: plan },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: { plan: user.subscriptionPlan } });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Delete all user documents (clean from Cloudinary too)
    const docs = await Document.find({ userId });
    for (const doc of docs) {
      if (doc.pdfPublicId) {
        // We delete pdf from cloudinary
        try {
          await deleteFromCloudinary(doc.pdfPublicId);
        } catch (error) {
          console.error(`Error deleting doc ${doc._id} PDF:`, error);
        }
      }
    }

    await Document.deleteMany({ userId });

    // Delete business profile (with logo/qrcode cleanup)
    const profile = await BusinessProfile.findOne({ userId });
    if (profile) {
      if (profile.logo?.publicId) await deleteFromCloudinary(profile.logo.publicId);
      if (profile.qrCode?.publicId) await deleteFromCloudinary(profile.qrCode.publicId);
      await BusinessProfile.deleteOne({ userId });
    }

    // Delete user account
    await User.findByIdAndDelete(userId);

    res.json({ success: true, message: 'User and all related data deleted successfully' });
  } catch (err) {
    next(err);
  }
};
