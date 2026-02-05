// server/models/AuditLog.js
const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: [
      'LOGIN_SUCCESS',
      'LOGIN_ATTEMPT',
      'LOGIN_ERROR',
      'LOGOUT',
      'REGISTER',
      'PASSWORD_RESET_REQUEST',
      'PASSWORD_RESET_SUCCESS',
      'PROFILE_UPDATE',
      'ROLE_CHANGE',
      'ACCOUNT_SUSPENSION',
      'ACCOUNT_DELETION'
    ]
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ipAddress: String,
  userAgent: String,
  details: mongoose.Schema.Types.Mixed,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 2592000 // 30 days
  }
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);