const Exam = require('../models/Exam');
const Report = require('../models/Report');

// @desc    Create new exam
// @route   POST /api/exams
// @access  Private/Admin/Teacher
exports.createExam = async (req, res) => {
  try {
    const exam = await Exam.create({
      ...req.body,
      createdBy: req.user.id,
    });
    res.status(201).json(exam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all exams
// @route   GET /api/exams
// @access  Private
exports.getExams = async (req, res) => {
  try {
    let exams;
    if (req.user.role === 'student') {
      exams = await Exam.find({ 
        isActive: true,
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() }
      });
    } else {
      exams = await Exam.find();
    }
    res.json(exams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single exam
// @route   GET /api/exams/:id
// @access  Private
exports.getExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.json(exam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update exam
// @route   PUT /api/exams/:id
// @access  Private/Admin/Teacher
exports.updateExam = async (req, res) => {
  try {
    let exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Check if user is authorized to update
    if (req.user.role !== 'admin' && exam.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(exam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete exam
// @route   DELETE /api/exams/:id
// @access  Private/Admin/Teacher
exports.deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Check if user is authorized to delete
    if (req.user.role !== 'admin' && exam.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await exam.deleteOne();
    res.json({ message: 'Exam removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Start exam
// @route   POST /api/exams/:id/start
// @access  Private
exports.startExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Check if exam is active
    if (!exam.isActive) {
      return res.status(400).json({ message: 'Exam is not active' });
    }

    // Check exam date
    const now = new Date();
    if (now < exam.startDate || now > exam.endDate) {
      return res.status(400).json({ message: 'Exam is not available at this time' });
    }

    res.json({
      exam,
      startTime: now,
      duration: exam.duration,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Submit exam
// @route   POST /api/exams/:id/submit
// @access  Private
exports.submitExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    const { answers, timeTaken } = req.body;
    let score = 0;
    let totalMarks = 0;

    // Calculate score
    answers.forEach((answer, index) => {
      const question = exam.questions[index];
      totalMarks += question.points;
      
      if (answer.selectedOption !== undefined) {
        const isCorrect = question.options[answer.selectedOption]?.isCorrect || false;
        if (isCorrect) {
          score += question.points;
        }
        answer.isCorrect = isCorrect;
      }
    });

    const percentage = (score / totalMarks) * 100;
    const passed = percentage >= (exam.passingMarks / exam.totalMarks) * 100;

    // Create report
    const report = await Report.create({
      user: req.user.id,
      exam: exam._id,
      answers,
      score,
      totalMarks,
      percentage,
      passed,
      timeTaken,
      ipAddress: req.ip,
      deviceInfo: req.headers['user-agent'],
    });

    res.json({
      report,
      score,
      totalMarks,
      percentage,
      passed,
      timeTaken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};