const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./src/database/database.db');

// Cria a tabela se não existir
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS pratos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      descricao TEXT,
      preco REAL,
      categoria TEXT
    )
  `);
});

module.exports = db;
