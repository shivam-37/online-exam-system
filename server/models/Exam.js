const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: [true, 'Please add question text'],
  },
  options: [
    {
      text: String,
      isCorrect: Boolean,
    },
  ],
  points: {
    type: Number,
    default: 1,
  },
  questionType: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'short-answer'],
    default: 'multiple-choice',
  },
  timeLimit: {
    type: Number, // in seconds
    default: 60,
  },
});

const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add exam title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add exam description'],
  },
  subject: {
    type: String,
    required: [true, 'Please add subject'],
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Please add exam duration'],
  },
  totalMarks: {
    type: Number,
    required: [true, 'Please add total marks'],
  },
  passingMarks: {
    type: Number,
    required: [true, 'Please add passing marks'],
  },
  questions: [questionSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  maxAttempts: {
    type: Number,
    default: 1,
  },
  instructions: {
    type: [String],
    default: [
      'Read all questions carefully',
      'Time management is important',
      'No cheating allowed',
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Exam', examSchema);