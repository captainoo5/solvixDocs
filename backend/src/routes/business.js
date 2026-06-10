import express from 'express';
import {
  getProfile,
  updateProfile,
  uploadLogoController,
  uploadQrCodeController,
} from '../controllers/businessController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { uploadLogo, uploadQrCode } from '../middleware/upload.js';

const router = express.Router();

router.get('/', verifyToken, getProfile);
router.put('/', verifyToken, updateProfile);
router.post('/logo', verifyToken, uploadLogo, uploadLogoController);
router.post('/qrcode', verifyToken, uploadQrCode, uploadQrCodeController);

export default router;
