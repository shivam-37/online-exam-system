const express = require('express');
const router = express.Router();
const { 
  getMyReports, 
  getReport, 
  getAllReports,
  getExamStats 
} = require('../controllers/report.controller');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/my-reports', protect, getMyReports);
router.get('/:id', protect, getReport);
router.get('/', protect, authorize('admin', 'teacher'), getAllReports);
router.get('/exam/:examId/stats', protect, authorize('admin', 'teacher'), getExamStats);

module.exports = router;