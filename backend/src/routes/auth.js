import express from 'express';
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  changePassword,
  deleteAccount,
} from '../controllers/authController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', verifyToken, getMe);
router.post('/change-password', verifyToken, changePassword);
router.delete('/delete-account', verifyToken, deleteAccount);

export default router;
