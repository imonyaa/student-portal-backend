import express from 'express';
import { getUsers, getMe } from '../controllers/user.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getUsers);
router.route('/me').get(protect, getMe);

export default router;