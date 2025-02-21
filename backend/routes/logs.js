const express = require('express');
const router = express.Router();
const logsController = require('../controllers/logsController');
const authMiddleware = require('../middleware/auth');

// Logs routes
router.get('/', authMiddleware.verifyToken, authMiddleware.isAdmin, logsController.getLogs);

module.exports = router; 