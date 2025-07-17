const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

// Conecta ao banco de dados
const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

// Cria a tabela de usuários se não existir
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Adiciona um usuário padrão para testes (admin/admin123)
  const defaultUsername = 'admin';
  const defaultPassword = 'admin123';
  
  db.get('SELECT * FROM users WHERE username = ?', [defaultUsername], (err, row) => {
    if (err) {
      console.error('Erro ao verificar usuário padrão:', err);
      return;
    }
    
    if (!row) {
      const hashedPassword = bcrypt.hashSync(defaultPassword, 10);
      db.run(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [defaultUsername, hashedPassword],
        function(err) {
          if (err) {
            console.error('Erro ao criar usuário padrão:', err);
          } else {
            console.log('Usuário padrão criado: admin/admin123');
          }
        }
      );
    }
  });
});

module.exports = db;

