import express from 'express';
import { createCourse, getCourses, getCourse, updateCourse, deleteCourse, uploadFile } from '../controllers/course.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Course routes
router.route('/').post(protect, createCourse).get(getCourses);
router.route('/:id').get(getCourse).put(protect, updateCourse).delete(protect, deleteCourse);
router.route('/:id/upload').post(protect, upload.single('file'), uploadFile);

export default router;
