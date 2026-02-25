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

// @desc    Get user-facing settings (non-admin safe subset)
// @route   GET /api/settings/user
// @access  Private
exports.getUserSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }

    // Return only safe, user-relevant fields
    res.json({
      systemName: settings.systemName,
      timezone: settings.timezone,
      showResultsImmediately: settings.showResultsImmediately,
      security: {
        preventCopyPaste: settings.security?.preventCopyPaste,
        preventTabSwitch: settings.security?.preventTabSwitch,
        fullScreenRequired: settings.security?.fullScreenRequired,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user preferences (placeholder)
// @route   PUT /api/settings/user
// @access  Private
exports.updateUserSettings = async (req, res) => {
  try {
    // For now, just acknowledge the request
    // In the future, this could store per-user preferences
    res.json({ success: true, message: 'User settings updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};