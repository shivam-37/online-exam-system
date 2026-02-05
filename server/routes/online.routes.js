const express = require('express');
const router = express.Router();
const { 
  createExam, 
  getExams, 
  getExam, 
  updateExam, 
  deleteExam,
  startExam,
  submitExam 
} = require('../controllers/online.controller');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
  .get(protect, getExams)
  .post(protect, authorize('admin', 'teacher'), createExam);

router.route('/:id')
  .get(protect, getExam)
  .put(protect, authorize('admin', 'teacher'), updateExam)
  .delete(protect, authorize('admin', 'teacher'), deleteExam);

router.post('/:id/start', protect, startExam);
router.post('/:id/submit', protect, submitExam);

module.exports = router;