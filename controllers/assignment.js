import Assignment from '../models/Assignment.js';
import Submission from '../models/Submission.js';
import Course from '../models/Course.js';

// @desc    Create a new assignment
// @route   POST /api/assignments
// @access  Private (Teacher)
export const createAssignment = async (req, res) => {
  const { title, description, deadline, courseId } = req.body;
  const file = req.file ? req.file.path : null;

  try {
    // Check if the user is a teacher
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Create new assignment
    const assignment = await Assignment.create({
      title,
      description,
      file,
      deadline,
      course: courseId,
      teacher: req.user._id,
    });

    res.status(201).json(assignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all assignments for a course
// @route   GET /api/courses/:courseId/assignments
// @access  Public
export const getCourseAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId }).populate('teacher', 'firstName lastName');

    if (!assignments) {
      return res.status(404).json({ message: 'No assignments found' });
    }

    res.status(200).json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Submit an assignment
// @route   POST /api/assignments/:assignmentId/submissions
// @access  Private (Student)
export const submitAssignment = async (req, res) => {
  const {  notes } = req.body;
  const file = req.file ? req.file.path : null;

  try {
    // Check if the assignment exists
    const assignment = await Assignment.findById(req.params.assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if the user is a student
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Create new submission
    const submission = await Submission.create({
      assignment: req.params.assignmentId,
      student: req.user._id,
      file,
      notes,
    });

    res.status(201).json(submission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all submissions for an assignment
// @route   GET /api/assignments/:assignmentId/submissions
// @access  Private (Teacher)
export const getAssignmentSubmissions = async (req, res) => {
  try {
    // Check if the assignment exists
    const assignment = await Assignment.findById(req.params.assignmentId).populate('teacher', 'firstName lastName');
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if the teacher is the owner of the assignment
    if (assignment.teacher._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const submissions = await Submission.find({ assignment: req.params.assignmentId }).populate('student', 'firstName lastName email');

    res.status(200).json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Grade a submission
// @route   PUT /api/submissions/:submissionId/grade
// @access  Private (Teacher)
export const gradeSubmission = async (req, res) => {
  const { mark } = req.body;

  try {
    // Check if the submission exists
    const submission = await Submission.findById(req.params.submissionId).populate('assignment');
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Check if the teacher is the owner of the assignment
    if (submission.assignment.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update the submission with the mark
    submission.mark = mark;
    submission.markedAt = Date.now();

    await submission.save();

    res.status(200).json({ message: 'Submission graded', submission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a student's submission for an assignment
// @route   GET /api/assignments/:assignmentId/submissions/:studentId
// @access  Private (Student)
export const getStudentSubmission = async (req, res) => {
  try {
    const submission = await Submission.findOne({
      assignment: req.params.assignmentId,
      student: req.params.studentId,
    }).populate('assignment', 'title description deadline');

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.status(200).json(submission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
