import Document from '../models/Document.js';
import BusinessProfile from '../models/BusinessProfile.js';
import { amountToWords } from '../utils/amountToWords.js';
import { generateDocNumber } from '../utils/docNumber.js';
import { deleteFromCloudinary } from '../middleware/upload.js';

export const createDocument = (type) => async (req, res, next) => {
  try {
    const { clientName, date, items } = req.body;
    const userId = req.user.id;

    if (!clientName || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Client name and at least one item are required.' });
    }

    // Get business profile for doc numbering + template
    const profile = await BusinessProfile.findOne({ userId });
    if (!profile) {
      return res.status(400).json({ success: false, message: 'Complete your business profile first.' });
    }

    // Auto-increment sequence
    if (!profile.docSequence) {
      profile.docSequence = { quotation: 0, proforma: 0, receipt: 0 };
    }
    profile.docSequence[type] = (profile.docSequence[type] || 0) + 1;
    await profile.save();

    const documentNumber = generateDocNumber(profile.businessName, type, profile.docSequence[type]);

    // Calculate totals
    const processedItems = items.map(item => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      return {
        description: item.description,
        quantity,
        unitPrice,
        amount: quantity * unitPrice,
      };
    });
    
    const totalAmount = processedItems.reduce((sum, i) => sum + i.amount, 0);
    const totalInWords = amountToWords(totalAmount);

    const doc = await Document.create({
      userId,
      documentType: type,
      documentNumber,
      clientName,
      date: date || new Date(),
      items: processedItems,
      totalAmount,
      totalInWords,
      template: profile.selectedTemplate || 'classic',
    });

    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
};

export const getDocuments = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { type, search, page = 1, limit = 10 } = req.query;

    const filter = { userId };
    
    if (type && ['quotation', 'proforma', 'receipt'].includes(type)) {
      filter.documentType = type;
    }

    if (search) {
      filter.$or = [
        { clientName: { $regex: search, $options: 'i' } },
        { documentNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const currentPage = Math.max(1, Number(page));
    const currentLimit = Math.max(1, Number(limit));
    const skip = (currentPage - 1) * currentLimit;

    const documents = await Document.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(currentLimit);

    const total = await Document.countDocuments(filter);

    res.json({
      success: true,
      data: documents,
      total,
      page: currentPage,
      pages: Math.ceil(total / currentLimit),
    });
  } catch (error) {
    next(error);
  }
};

export const getDocumentById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const docId = req.params.id;

    const document = await Document.findOne({ _id: docId, userId });
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found or unauthorized' });
    }

    res.json({ success: true, data: document });
  } catch (error) {
    next(error);
  }
};

export const deleteDocument = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const docId = req.params.id;

    const document = await Document.findOne({ _id: docId, userId });
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found or unauthorized' });
    }

    // Delete associated PDF from Cloudinary if it was generated
    if (document.pdfPublicId) {
      await deleteFromCloudinary(document.pdfPublicId);
    }

    await Document.deleteOne({ _id: docId });

    res.json({ success: true, message: 'Document and its PDF deleted successfully' });
  } catch (error) {
    next(error);
  }
};
