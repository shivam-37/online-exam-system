const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  systemName: {
    type: String,
    default: 'Online Exam System',
  },
  timezone: {
    type: String,
    default: 'UTC',
  },
  maxExamDuration: {
    type: Number, // in minutes
    default: 180,
  },
  allowRetake: {
    type: Boolean,
    default: false,
  },
  showResultsImmediately: {
    type: Boolean,
    default: true,
  },
  security: {
    requireWebcam: {
      type: Boolean,
      default: false,
    },
    preventCopyPaste: {
      type: Boolean,
      default: true,
    },
    preventTabSwitch: {
      type: Boolean,
      default: true,
    },
    fullScreenRequired: {
      type: Boolean,
      default: false,
    },
  },
  emailNotifications: {
    type: Boolean,
    default: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Setting', settingSchema);