import express from 'express';
import { getUsers, getMe, updateUserProfile } from '../controllers/user.js';
import { protect } from '../middleware/authMiddleware.js';
import uploadMiddleware from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/').get(getUsers);
router.route('/me').get(protect, getMe);
router.route('/me').put(protect, uploadMiddleware.single('profileImage'), updateUserProfile);

export default router;