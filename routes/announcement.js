import express from 'express';
import {
  createAnnouncement,
  getCourseAnnouncements,
  deleteAnnouncement,
} from '../controllers/announcement.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create an announcement
router.post('/', protect, createAnnouncement);

// Get all announcements for a course
router.get('/courses/:courseId/announcements', protect, getCourseAnnouncements);

// Delete an announcement
router.delete('/:id', protect, deleteAnnouncement);

export default router;
