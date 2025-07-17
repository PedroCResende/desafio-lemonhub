const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth.middleware");

// Importa o controller
const pratosController = require("../controllers/pratos.controller");

// Rotas CRUD - algumas protegidas por autenticação
router.get("/search", pratosController.buscarPratos); // Pública - buscar pratos
router.get("/:id", pratosController.buscarPratoPorId); // Pública - consultar prato por ID
router.get("/", pratosController.listarPratos); // Pública - listar pratos
router.post("/", authenticateToken, pratosController.criarPrato); // Protegida - criar prato
router.put("/:id", authenticateToken, pratosController.atualizarPrato); // Protegida - atualizar prato
router.delete("/:id", authenticateToken, pratosController.deletarPrato); // Protegida - deletar prato

module.exports = router;