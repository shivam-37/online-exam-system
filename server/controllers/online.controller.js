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
    console.error('Create exam error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get all exams
// @route   GET /api/exams
// @access  Private
exports.getExams = async (req, res) => {
  try {
    let exams;
    if (req.user.role === 'student') {
      // Students see active exams. If dates exist, check them; if not, show anyway.
      exams = await Exam.find({ isActive: true }).populate('createdBy', 'name');
      const now = new Date();
      exams = exams.filter(exam => {
        // If no dates set, show the exam
        if (!exam.startDate && !exam.endDate) return true;
        // If only startDate, check it's past
        if (exam.startDate && !exam.endDate) return new Date(exam.startDate) <= now;
        // If only endDate, check it hasn't passed
        if (!exam.startDate && exam.endDate) return new Date(exam.endDate) >= now;
        // Both dates set, check range
        return new Date(exam.startDate) <= now && new Date(exam.endDate) >= now;
      });
    } else {
      exams = await Exam.find().populate('createdBy', 'name').sort({ createdAt: -1 });
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
    const exam = await Exam.findById(req.params.id).populate('createdBy', 'name email');
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
    // Also delete associated reports
    await Report.deleteMany({ exam: req.params.id });
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

    // Check exam date only if dates are set
    const now = new Date();
    if (exam.startDate && now < new Date(exam.startDate)) {
      return res.status(400).json({ message: 'Exam has not started yet' });
    }
    if (exam.endDate && now > new Date(exam.endDate)) {
      return res.status(400).json({ message: 'Exam has already ended' });
    }

    // Check max attempts
    if (exam.maxAttempts) {
      const attemptCount = await Report.countDocuments({
        user: req.user.id,
        exam: exam._id,
      });
      if (attemptCount >= exam.maxAttempts) {
        return res.status(400).json({ message: `Maximum attempts (${exam.maxAttempts}) reached` });
      }
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
    const processedAnswers = (answers || []).map((answer, index) => {
      const question = exam.questions[index];
      if (!question) return answer;

      totalMarks += question.points || 1;

      if (answer.selectedOption !== undefined && answer.selectedOption !== null) {
        const isCorrect = question.options[answer.selectedOption]?.isCorrect || false;
        if (isCorrect) {
          score += question.points || 1;
        }
        return { ...answer, isCorrect };
      }
      return { ...answer, isCorrect: false };
    });

    const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;
    const passed = exam.passingMarks
      ? percentage >= (exam.passingMarks / exam.totalMarks) * 100
      : percentage >= 50;

    // Create report
    const report = await Report.create({
      user: req.user.id,
      exam: exam._id,
      answers: processedAnswers,
      score,
      totalMarks,
      percentage,
      passed,
      timeTaken: timeTaken || 0,
      completedAt: new Date(),
      ipAddress: req.ip,
      deviceInfo: req.headers['user-agent'],
    });

    res.json({
      report,
      score,
      totalMarks,
      percentage,
      passed,
      timeTaken: timeTaken || 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};