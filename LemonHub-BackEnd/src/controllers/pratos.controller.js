const db = require("../database/db");

// Função auxiliar para converter o valor para 1 ou 0
function toBooleanInt(value) {
  return (value === true || value === 'true' || value === 1 || value === '1') ? 1 : 0;
}

// ✅ Listar todos os pratos
exports.listarPratos = (req, res) => {
  db.all("SELECT * FROM pratos", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// ✅ Criar novo prato
exports.criarPrato = (req, res) => {
  let { nome, descricao, preco, categoria, disponivel } = req.body;

  disponivel = toBooleanInt(disponivel);

  db.run(
    "INSERT INTO pratos (nome, descricao, preco, categoria, disponivel) VALUES (?, ?, ?, ?, ?)",
    [nome, descricao, preco, categoria, disponivel],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({
        id: this.lastID,
        nome,
        descricao,
        preco,
        categoria,
        disponivel
      });
    }
  );
};

// ✅ Atualizar prato existente
exports.atualizarPrato = (req, res) => {
  const { id } = req.params;
  let { nome, descricao, preco, categoria, disponivel } = req.body;

  disponivel = toBooleanInt(disponivel);

  db.run(
    "UPDATE pratos SET nome = ?, descricao = ?, preco = ?, categoria = ?, disponivel = ? WHERE id = ?",
    [nome, descricao, preco, categoria, disponivel, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Prato atualizado com sucesso!" });
    }
  );
};

// ✅ Deletar prato
exports.deletarPrato = (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM pratos WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Prato deletado com sucesso!" });
  });
};

// ✅ Consultar prato por ID
exports.buscarPratoPorId = (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM pratos WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ message: "Prato não encontrado" });
    res.json(row);
  });
};

// ✅ Buscar por nome ou categoria
exports.buscarPratos = (req, res) => {
  const { nome, categoria } = req.query;
  let query = "SELECT * FROM pratos WHERE 1=1";
  let params = [];

  if (nome) {
    query += " AND nome LIKE ?";
    params.push(`%${nome}%`);
  }

  if (categoria) {
    query += " AND categoria = ?";
    params.push(categoria);
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};
