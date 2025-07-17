const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth.middleware');

// Importa o controller (que vamos criar em seguida)
const pratosController = require('../controllers/pratos.controller');

// Rotas CRUD - algumas protegidas por autenticação
router.get('/', pratosController.listarPratos); // Pública - listar pratos
router.get('/search', pratosController.buscarPratos); // Pública - buscar pratos
router.post('/', authenticateToken, pratosController.criarPrato); // Protegida - criar prato
router.put('/:id', authenticateToken, pratosController.atualizarPrato); // Protegida - atualizar prato
router.delete('/:id', authenticateToken, pratosController.deletarPrato); // Protegida - deletar prato

module.exports = router;
