const express = require('express');
const router = express.Router();
const { loginValidation, registerValidation, validate } = require('../middleware/validation');
const { loginLimiter, createAccountLimiter } = require('../middleware/rateLimiter');
const authController = require('../controllers/authController');

// Auth routes
router.post('/login', loginLimiter, loginValidation, validate, authController.login);
router.post('/create-user', createAccountLimiter, registerValidation, validate, authController.createUser);

module.exports = router; 