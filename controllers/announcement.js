import Announcement from "../models/Announcement.js";
import Course from "../models/Course.js";

// @desc    Create a new announcement
// @route   POST /api/announcements
// @access  Private (Teacher)
export const createAnnouncement = async (req, res) => {
  const { title, content, courses } = req.body;

  try {
    // Check if the user is a teacher
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Create new announcement
    const announcement = await Announcement.create({
      title,
      content,
      teacher: req.user._id,
      courses,
    });

    // Add announcement to the related courses
    await Course.updateMany(
      { _id: { $in: courses } },
      { $push: { announcements: announcement._id } }
    );

    res.status(201).json(announcement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all announcements for a course
// @route   GET /api/courses/:courseId/announcements
// @access  Public
export const getCourseAnnouncements = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).populate({
      path: "announcements",
      populate: {
        path: "teacher",
        select: "firstName lastName profileImage",
      },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const isEnrolledStudent =
      req.user.role === "student" &&
      req.user.academicLevel === course.academicLevel &&
      req.user.academicYear === course.academicYear;


     const isCourseTeacher = course.teacher !== req.user._id;


    // If the user is not an enrolled student, nor the course teacher, deny access
    if (!isEnrolledStudent && !isCourseTeacher) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(course.announcements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete an announcement
// @route   DELETE /api/announcements/:id
// @access  Private (Teacher)
export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    // Check if the teacher is the owner of the announcement
    if (announcement.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Remove the announcement from the associated courses
    await Course.updateMany(
      { _id: { $in: announcement.courses } },
      { $pull: { announcements: announcement._id } }
    );

    await announcement.deleteOne();

    res.status(200).json({ message: "Announcement deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// @desc    Update an announcement
// @route   PUT /api/announcements/:id
// @access  Private (Teacher)

export const updateAnnouncement = async (req, res) => {
    const { title, content, courses } = req.body;
    
    try {
        const announcement = await Announcement.findById(req.params.id);
    
        if (!announcement) {
        return res.status(404).json({ message: "Announcement not found" });
        }
    
        // Check if the teacher is the owner of the announcement
        if (announcement.teacher.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Access denied" });
        }
    
        announcement.title = title || announcement.title;
        announcement.content = content || announcement.content;
        announcement.courses = courses || announcement.courses;
    
        await announcement.save();
    
        res.status(200).json(announcement);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
    };