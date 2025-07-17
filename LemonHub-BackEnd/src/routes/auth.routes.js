const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authenticateToken = require('../middleware/auth.middleware');

// Rota de login
router.post('/login', authController.login);

// Rota de registro (opcional)
router.post('/register', authController.register);

// Rota protegida para verificar token
router.get('/verify', authenticateToken, authController.verifyToken);

module.exports = router;

