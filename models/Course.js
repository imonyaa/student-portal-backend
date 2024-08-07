import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
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
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
},
{
  timestamps: true,
},);

const Course = mongoose.model("Course", CourseSchema);

export default Course;
