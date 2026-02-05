// server/models/LoginAttempt.js
const mongoose = require('mongoose');

const LoginAttemptSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: String,
  success: {
    type: Boolean,
    default: false
  },
  reason: {
    type: String,
    enum: ['WRONG_PASSWORD', 'USER_NOT_FOUND', 'ACCOUNT_LOCKED', null]
  },
  lockedUntil: Date,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // 24 hours
  }
});

module.exports = mongoose.model('LoginAttempt', LoginAttemptSchema);