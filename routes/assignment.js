import express from 'express';
import {
  createAssignment,
  getCourseAssignments,
  submitAssignment,
  getAssignmentSubmissions,
  gradeSubmission,
  getStudentSubmission,
} from '../controllers/assignment.js';
import { protect } from '../middleware/authMiddleware.js';
import uploadAssignment from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Create a new assignment
router.post('/', protect,uploadAssignment.single('file'), createAssignment);

// Get all assignments for a course
router.get('/courses/:courseId/assignments', protect, getCourseAssignments);

// Submit an assignment
router.post('/:assignmentId/submissions', protect,uploadAssignment.single('file'),  submitAssignment);

// Get all submissions for an assignment
router.get('/:assignmentId/submissions', protect, getAssignmentSubmissions);

// Grade a submission
router.put('/submissions/:submissionId/grade', protect, gradeSubmission);

// Get a student's submission for an assignment
router.get('/:assignmentId/submissions/:studentId', protect, getStudentSubmission);

export default router;
