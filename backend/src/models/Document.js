import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    documentType: {
      type: String,
      enum: ['quotation', 'proforma', 'receipt'],
      required: true,
    },
    documentNumber: {
      type: String,
      required: true,
    },
    clientName: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    items: {
      type: [itemSchema],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    totalInWords: {
      type: String,
      required: true,
    },
    template: {
      type: String,
      enum: ['classic', 'modern', 'bold', 'minimal'],
      required: true,
    },
    pdfUrl: {
      type: String,
      default: '',
    },
    pdfPublicId: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['draft', 'generated'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
);

const Document = mongoose.model('Document', documentSchema);
export default Document;
