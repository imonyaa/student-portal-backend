import Course from "../models/Course.js";
import path from "path";
import User from "../models/User.js";
import course0 from "../assets/images/course0.png";
import course1 from "../assets/images/course1.png";
import course2 from "../assets/images/course2.png";
import course3 from "../assets/images/course3.png";
import course4 from "../assets/images/course4.png";
import course5 from "../assets/images/course5.png";
import course6 from "../assets/images/course6.png";
import course7 from "../assets/images/course7.png";

const randomImagePicker = () => {
  const images = [
    course0,
    course1,
    course2,
    course3,
    course4,
    course5,
    course6,
    course7,
  ];
  return images[Math.floor(Math.random() * images.length)];
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Teacher)
export const createCourse = async (req, res) => {
  const { title, description, materials, academicLevel, academicYear, major } =
    req.body;

  try {
    // Check if the user is a teacher
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Create new course
    const course = await Course.create({
      title,
      description,
      image: randomImagePicker(),
      teacher: req.user._id,
      academicLevel,
      academicYear,
      major,
      materials,
    });

    res.status(201).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req, res) => {
  try {
    if (req.user && req.user.role === "student") {
      const courses = await Course.find({
        academicLevel: req.user.academicLevel,
        academicYear: req.user.academicYear,
        major: req.user.major,
      });
      return res.json(courses);
    } else {
      const courses = await Course.find().populate(
        "teacher",
        "firstName lastName"
      );
      return res.json(courses);
    }
    // const courses = await Course.find().populate('teacher', 'firstName lastName');
    // res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get a single course
// @route   GET /api/courses/:id
// @access  Public
export const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "teacher",
      "firstName lastName"
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private (Teacher)
export const updateCourse = async (req, res) => {
  const { title, description, materials, academicLevel, academicYear, major } =
    req.body;
  try {
    // Check if the user is a teacher
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Access denied" });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the teacher is the course owner
    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
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
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private (Teacher)
export const deleteCourse = async (req, res) => {
  try {
    // Check if the user is a teacher
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Access denied" });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the teacher is the course owner
    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }
    await course.deleteOne();
    res.json({ message: "Course removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Upload a file for a course
// @route   POST /api/courses/:id/upload
// @access  Private (Teacher)
export const uploadFile = async (req, res) => {
  try {
    // Check if the user is a teacher
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Access denied" });
    }
    // Print user token and role
    console.log("User Token:", req.user.token);
    console.log("User Role:", req.user.role);
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the teacher is the course owner
    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    // File details
    const file = {
      fileName: req.file.filename,
      fileType: req.file.mimetype,
      description: req.body.description,
    };

    course.files.push(file);
    await course.save();

    res.status(200).json({ message: "File uploaded successfully", file });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
