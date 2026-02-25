const express = require('express');
const router = express.Router();
const { getSettings, updateSettings, getUserSettings, updateUserSettings } = require('../controllers/setting.controller');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// User settings routes (any authenticated user)
router.route('/user')
  .get(protect, getUserSettings)
  .put(protect, updateUserSettings);

// Admin settings routes
router.route('/')
  .get(protect, authorize('admin'), getSettings)
  .put(protect, authorize('admin'), updateSettings);

module.exports = router;