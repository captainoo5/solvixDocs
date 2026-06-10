import BusinessProfile from '../models/BusinessProfile.js';
import { deleteFromCloudinary } from '../middleware/upload.js';

export const getProfile = async (req, res, next) => {
  try {
    const profile = await BusinessProfile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Business profile not found.' });
    }
    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      businessName,
      tagline,
      address,
      phone,
      email,
      bankName,
      accountName,
      accountNumber,
      selectedTemplate,
    } = req.body;

    const profile = await BusinessProfile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Business profile not found.' });
    }

    // Update fields
    if (businessName) profile.businessName = businessName;
    if (tagline !== undefined) profile.tagline = tagline;
    if (address) profile.address = address;
    if (phone) profile.phone = phone;
    if (email) profile.email = email;
    if (bankName !== undefined) profile.bankName = bankName;
    if (accountName !== undefined) profile.accountName = accountName;
    if (accountNumber !== undefined) profile.accountNumber = accountNumber;
    if (selectedTemplate) profile.selectedTemplate = selectedTemplate;

    await profile.save();
    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

export const uploadLogoController = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No logo file provided or file type not allowed.' });
    }

    const userId = req.user.id;
    const profile = await BusinessProfile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Business profile not found.' });
    }

    // Delete old logo from Cloudinary if it exists
    if (profile.logo && profile.logo.publicId) {
      await deleteFromCloudinary(profile.logo.publicId);
    }

    // Save new logo info (path is URL, filename is public_id in multer-storage-cloudinary)
    profile.logo = {
      url: req.file.path,
      publicId: req.file.filename,
    };

    await profile.save();
    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

export const uploadQrCodeController = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No QR code file provided or file type not allowed.' });
    }

    const userId = req.user.id;
    const profile = await BusinessProfile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Business profile not found.' });
    }

    // Delete old QR code from Cloudinary if it exists
    if (profile.qrCode && profile.qrCode.publicId) {
      await deleteFromCloudinary(profile.qrCode.publicId);
    }

    // Save new QR code info
    profile.qrCode = {
      url: req.file.path,
      publicId: req.file.filename,
    };

    await profile.save();
    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};
