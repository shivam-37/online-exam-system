const Report = require('../models/Report');
const Exam = require('../models/Exam');

// @desc    Get user's reports
// @route   GET /api/reports/my-reports
// @access  Private
exports.getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user.id })
      .populate('exam', 'title subject')
      .sort({ completedAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get report by ID
// @route   GET /api/reports/:id
// @access  Private
exports.getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('exam')
      .populate('user', 'name email');
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check if user is authorized to view this report
    if (req.user.role === 'student' && report.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all reports (admin)
// @route   GET /api/reports
// @access  Private/Admin
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('user', 'name email')
      .populate('exam', 'title')
      .sort({ completedAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get exam statistics
// @route   GET /api/reports/exam/:examId/stats
// @access  Private/Admin/Teacher
exports.getExamStats = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    const reports = await Report.find({ exam: req.params.examId });
    
    const stats = {
      totalAttempts: reports.length,
      averageScore: reports.reduce((acc, report) => acc + report.score, 0) / reports.length,
      highestScore: Math.max(...reports.map(r => r.score)),
      lowestScore: Math.min(...reports.map(r => r.score)),
      passRate: (reports.filter(r => r.passed).length / reports.length) * 100,
      averageTimeTaken: reports.reduce((acc, report) => acc + report.timeTaken, 0) / reports.length,
      scoreDistribution: {
        '90-100': reports.filter(r => r.percentage >= 90).length,
        '80-89': reports.filter(r => r.percentage >= 80 && r.percentage < 90).length,
        '70-79': reports.filter(r => r.percentage >= 70 && r.percentage < 80).length,
        '60-69': reports.filter(r => r.percentage >= 60 && r.percentage < 70).length,
        '0-59': reports.filter(r => r.percentage < 60).length,
      },
    };

    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};