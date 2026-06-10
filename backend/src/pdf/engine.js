import puppeteer from 'puppeteer';
import { uploadPdfToCloudinary } from '../middleware/upload.js';
import Document from '../models/Document.js';
import BusinessProfile from '../models/BusinessProfile.js';
import { getTemplate } from './templates/index.js';

export const generatePDF = async (req, res, next) => {
  try {
    const doc = await Document.findOne({ _id: req.params.id, userId: req.user.id });
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    const profile = await BusinessProfile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(400).json({ success: false, message: 'Complete your business profile first.' });
    }

    const html = getTemplate(doc.template || profile.selectedTemplate || 'classic', { doc, profile });

    // Launch headless browser (safe for Render/Railway with --no-sandbox)
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '15mm', bottom: '15mm', left: '15mm', right: '15mm' },
    });

    await browser.close();

    // Generate a secure publicId based on userId and documentNumber
    const sanitizedDocNumber = doc.documentNumber.replace(/[^a-zA-Z0-9-_]/g, '_');
    const publicId = `${req.user.id}_${sanitizedDocNumber}`;
    
    // Upload PDF buffer to Cloudinary
    const result = await uploadPdfToCloudinary(pdfBuffer, publicId);

    // Save URL back to document
    doc.pdfUrl = result.secure_url;
    doc.pdfPublicId = result.public_id;
    doc.status = 'generated';
    await doc.save();

    res.json({ success: true, pdfUrl: result.secure_url });
  } catch (err) {
    next(err);
  }
};
