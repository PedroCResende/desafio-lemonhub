const express = require('express');
const router = express.Router();

// Importa o controller (que vamos criar em seguida)
const pratosController = require('../controllers/pratos.controller');

// Rotas CRUD
router.get('/', pratosController.listarPratos);
router.post('/', pratosController.criarPrato);
router.put('/:id', pratosController.atualizarPrato);
router.delete('/:id', pratosController.deletarPrato);
router.get('/search', pratosController.buscarPratos);

module.exports = router;
