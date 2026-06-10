import express from 'express';
import {
  adminLogin,
  getStats,
  getAllUsers,
  updateUserPlan,
  deleteUser,
} from '../controllers/adminController.js';
import { verifyAdmin } from '../middleware/verifyAdmin.js';

const router = express.Router();

router.post('/auth/login', adminLogin);
router.get('/stats', verifyAdmin, getStats);
router.get('/users', verifyAdmin, getAllUsers);
router.patch('/users/:id/plan', verifyAdmin, updateUserPlan);
router.delete('/users/:id', verifyAdmin, deleteUser);

export default router;
