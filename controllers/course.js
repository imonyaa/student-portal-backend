import Course from '../models/Course.js';
import path from 'path';
import User from '../models/User.js';

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Teacher)
export const createCourse = async (req, res) => {
  const { title, description, materials } = req.body;

  try {
    // Check if the user is a teacher
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Create new course
    const course = await Course.create({
      title,
      description,
      teacher: req.user._id,
      materials,
    });

    res.status(201).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('teacher', 'firstName lastName');
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a single course
// @route   GET /api/courses/:id
// @access  Public
export const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('teacher', 'firstName lastName');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private (Teacher)
export const updateCourse = async (req, res) => {
  const { title, description, materials } = req.body;

  try {
    // Check if the user is a teacher
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if the teacher is the course owner
    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    course.title = title || course.title;
    course.description = description || course.description;
    course.materials = materials || course.materials;

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private (Teacher)
export const deleteCourse = async (req, res) => {
  try {
    // Check if the user is a teacher
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if the teacher is the course owner
    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await course.remove();
    res.json({ message: 'Course removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Upload a file for a course
// @route   POST /api/courses/:id/upload
// @access  Private (Teacher)
export const uploadFile = async (req, res) => {
    try {
      // Check if the user is a teacher
      if (req.user.role !== 'teacher') {
        return res.status(403).json({ message: 'Access denied' });
      }
  
      const course = await Course.findById(req.params.id);
  
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      // Check if the teacher is the course owner
      if (course.teacher.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
  
      // File details
      const file = {
        fileName: req.file.filename,
        fileType: req.file.mimetype,
        description: req.body.description,
      };
  
      course.files.push(file);
      await course.save();
  
      res.status(200).json({ message: 'File uploaded successfully', file });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
