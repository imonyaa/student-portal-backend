import express from 'express';
import { createCourse, getCourses, getCourse, updateCourse, deleteCourse, uploadFile, getCourseStudents, markFileCompletion, getFileById, deleteFileById, getFileContentById} from '../controllers/course.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Course routes
router.route('/').post(protect, createCourse).get(protect, getCourses);
router.route('/:id').get(protect,getCourse).put(protect, updateCourse).delete(protect, deleteCourse);
router.route('/:id/upload').post(protect, upload.single('file'), uploadFile);
router.get('/:id/students', protect, getCourseStudents);
router.get('/:courseId/files/:fileId', protect, getFileById).delete('/:courseId/files/:fileId', protect, deleteFileById);
router.get('/:courseId/files/:fileId/content', protect, getFileContentById);
router.put('/:courseId/files/:fileId/mark-completion', protect, markFileCompletion);

export default router;
