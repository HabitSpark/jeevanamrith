const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    updateUserProfile,
    uploadProfilePicture,
    removeProfilePicture,
} = require('../controllers/userController');

router.get('/:id', getUserProfile);
router.put('/:id', updateUserProfile);
router.put('/:id/picture', uploadProfilePicture);
router.delete('/:id/picture', removeProfilePicture);

module.exports = router;