const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    getProfile,
    updateUserProfile
} = require('../controllers/user.controller');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Profile routes (must be before /:id to avoid treating 'profile' as an id)
router.route('/profile')
    .get(protect, getProfile)
    .put(protect, updateUserProfile);

router.route('/')
    .get(protect, authorize('admin'), getUsers);

router.route('/:id')
    .get(protect, authorize('admin'), getUser)
    .put(protect, authorize('admin'), updateUser)
    .delete(protect, authorize('admin'), deleteUser);

module.exports = router;
