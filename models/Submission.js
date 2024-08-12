import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  file: {
    type: String,  // This will store the file path or URL of the student's submission
  },
  notes: {
    type: String,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  mark: {
    type: Number,
  },
  markedAt: {
    type: Date,
  },
});

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;
