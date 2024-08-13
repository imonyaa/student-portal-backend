import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  }],
});

const Announcement = mongoose.model('Announcement', announcementSchema);

export default Announcement;
