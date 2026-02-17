const Setting = require('../models/Setting');

// @desc    Get system settings
// @route   GET /api/settings
// @access  Private/Admin
exports.getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    
    if (!settings) {
      settings = await Setting.create({});
    }
    
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update system settings
// @route   PUT /api/settings
// @access  Private/Admin
exports.updateSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    
    if (!settings) {
      settings = await Setting.create({
        ...req.body,
        updatedBy: req.user.id,
      });
    } else {
      settings = await Setting.findOneAndUpdate(
        {},
        {
          ...req.body,
          updatedBy: req.user.id,
          updatedAt: Date.now(),
        },
        { new: true }
      );
    }
    
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};