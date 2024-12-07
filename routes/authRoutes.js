const express = require('express');
const {
    register,
    login,
    refreshToken,
    logout
} = require('../controllers/authController');
const {
    authMiddleware
} = require('../middleware/authMiddleware');

const router = express.Router();

// Public Routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);

// Protected Routes
router.post('/logout', authMiddleware, logout);

module.exports = router;