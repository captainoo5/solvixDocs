import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  createDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
} from '../controllers/documentController.js';
import { generatePDF } from '../pdf/engine.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// Rate limiter for PDF generation (Puppeteer is expensive, 30 req/hr)
const pdfLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30,
  message: {
    success: false,
    message: 'Too many PDF generation requests. Please try again after an hour.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/quotation', verifyToken, createDocument('quotation'));
router.post('/proforma', verifyToken, createDocument('proforma'));
router.post('/receipt', verifyToken, createDocument('receipt'));

router.get('/', verifyToken, getDocuments);
router.get('/:id', verifyToken, getDocumentById);
router.delete('/:id', verifyToken, deleteDocument);

router.post('/:id/pdf', verifyToken, pdfLimiter, generatePDF);

export default router;
