const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true,
  },
  answers: [
    {
      questionId: mongoose.Schema.Types.ObjectId,
      selectedOption: Number,
      isCorrect: Boolean,
      timeTaken: Number, // in seconds
    },
  ],
  score: {
    type: Number,
    required: true,
  },
  totalMarks: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  passed: {
    type: Boolean,
    required: true,
  },
  timeTaken: {
    type: Number, // in seconds
    required: true,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
  attemptNumber: {
    type: Number,
    default: 1,
  },
  ipAddress: {
    type: String,
  },
  deviceInfo: {
    type: String,
  },
});

module.exports = mongoose.model('Report', reportSchema);