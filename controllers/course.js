import Course from '../models/Course.js';
import path from 'path';
import User from '../models/User.js';

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Teacher)
export const createCourse = async (req, res) => {
  const { title, description, materials, academicLevel, academicYear, major } = req.body;

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
      academicLevel,
      academicYear,
      major,
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
    if (req.user && req.user.role === 'teacher') {
      // For teachers, find courses where the teacher ID matches the logged-in user
      const courses = await Course.find({ teacher: req.user._id }).populate('teacher', 'firstName lastName');
      console.log('Courses:', req.user._id);
      return res.json(courses);
    } else if (req.user && req.user.role === 'student') {
      // For students, find courses based on academicLevel, academicYear, and major
      const courses = await Course.find({ 
        academicLevel: req.user.academicLevel, 
        academicYear: req.user.academicYear, 
        major: req.user.major 
      }).populate('teacher', 'firstName lastName profileImage');
      return res.json(courses);
    } else {
      // If the user is not logged in, return all courses (or handle differently if needed)
      const courses = await Course.find().populate('teacher', 'firstName lastName profileImage');
      return res.json(courses);
    }
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
    const course = await Course.findById(req.params.id).populate('teacher', 'firstName lastName profileImage');

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
  const { title, description, materials, academicLevel, academicYear, major } = req.body;
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
    course.academicLevel = academicLevel || course.academicLevel;
    course.academicYear = academicYear || course.academicYear;
    course.major = major || course.major;

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
    await course.deleteOne();
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
      // Print user token and role
      console.log('User Token:', req.user.token);
      console.log('User Role:', req.user.role);
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



// @desc    Get students for a specific course
// @route   GET /api/courses/:id/students
// @access  Private (Teacher)
export const getCourseStudents = async (req, res) => {
  try {
    // Find the course by ID
    const course = await Course.findById(req.params.id);

    // Check if the course exists
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if the requesting user is the teacher of the course
    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Find students who match the course's criteria
    const students = await User.find({
      role: 'student',
      academicLevel: course.academicLevel,
      academicYear: course.academicYear,
      major: course.major
    }).select('firstName lastName email group profileImage');

    // Return the list of students
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


