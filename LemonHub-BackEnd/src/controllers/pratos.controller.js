const db = require('../database/db');

// Listar todos os pratos
exports.listarPratos = (req, res) => {
  db.all('SELECT * FROM pratos', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// Criar novo prato
exports.criarPrato = (req, res) => {
  const { nome, descricao, preco, categoria } = req.body;
  db.run(
    'INSERT INTO pratos (nome, descricao, preco, categoria) VALUES (?, ?, ?, ?)',
    [nome, descricao, preco, categoria],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({
        id: this.lastID,
        nome,
        descricao,
        preco,
        categoria
      });
    }
  );
};

// Atualizar prato existente
exports.atualizarPrato = (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco, categoria } = req.body;
  db.run(
    'UPDATE pratos SET nome = ?, descricao = ?, preco = ?, categoria = ? WHERE id = ?',
    [nome, descricao, preco, categoria, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Prato atualizado com sucesso!' });
    }
  );
};

// Deletar prato
exports.deletarPrato = (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM pratos WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Prato deletado com sucesso!' });
  });
};

// Buscar por nome ou categoria
exports.buscarPratos = (req, res) => {
  const { nome, categoria } = req.query;
  let query = 'SELECT * FROM pratos WHERE 1=1';
  let params = [];

  if (nome) {
    query += ' AND nome LIKE ?';
    params.push(`%${nome}%`);
  }

  if (categoria) {
    query += ' AND categoria = ?';
    params.push(categoria);
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};
