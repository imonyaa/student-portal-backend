import express from 'express';
import { createCourse, getCourses, getCourse, updateCourse, deleteCourse, uploadFile, getCourseStudents} from '../controllers/course.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Course routes
router.route('/').post(protect, createCourse).get(protect, getCourses);
router.route('/:id').get(protect,getCourse).put(protect, updateCourse).delete(protect, deleteCourse);
router.route('/:id/upload').post(protect, upload.single('file'), uploadFile);
router.get('/:id/students', protect, getCourseStudents);

export default router;
