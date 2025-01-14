import mongoose from 'mongoose';

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
    ref: 'User',
    required: true,
  },
  materials: [
    {
      type: String,
      enum: ['pdf', 'video'],
      required: true,
    },
  ],
  files: [
    {
      fileName: String,
      fileType: String,
      description: String,
    },
  ],
});

const Course = mongoose.model('Course', CourseSchema);

export default Course;
