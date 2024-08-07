import mongoose from "mongoose";

import {
  course0,
  course1,
  course2,
  course3,
  course4,
  course5,
  course6,
  course7,
} from "../assets/images";

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
    default: "course0.png",
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
