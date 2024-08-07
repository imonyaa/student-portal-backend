import mongoose from "mongoose";
import course0 from "../assets/images/course0.png";

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    default: "course0",
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  academicLevel: { type: String, enum: ["Licence", "master"], required: true },
  academicYear: { type: Number, required: true },
  major: {
    type: String,
    enum: ["Control", "Computer Engineering", "Power", "Telecommunications"],
    required: false,
  },
  materials: [
    {
      type: String,
      enum: ["pdf", "video"],
      required: true,
    },
  ],
  files: [
    {
      fileName: String,
      fileType: String,
      description: String,
      created_at: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Course = mongoose.model("Course", CourseSchema);

export default Course;
