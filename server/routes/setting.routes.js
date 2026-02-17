const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/setting.controller');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
  .get(protect, authorize('admin'), getSettings)
  .put(protect, authorize('admin'), updateSettings);

module.exports = router;