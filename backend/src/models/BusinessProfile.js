import mongoose from 'mongoose';

const businessProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    tagline: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    logo: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    bankName: {
      type: String,
      default: '',
    },
    accountName: {
      type: String,
      default: '',
    },
    accountNumber: {
      type: String,
      default: '',
    },
    qrCode: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    selectedTemplate: {
      type: String,
      enum: ['classic', 'modern', 'bold', 'minimal'],
      default: 'classic',
    },
    docSequence: {
      quotation: { type: Number, default: 0 },
      proforma: { type: Number, default: 0 },
      receipt: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

const BusinessProfile = mongoose.model('BusinessProfile', businessProfileSchema);
export default BusinessProfile;
