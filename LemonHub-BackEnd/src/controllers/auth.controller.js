const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/users');

// Chave secreta para assinar os tokens JWT (em produção, use uma variável de ambiente)
const JWT_SECRET = 'lemonhub_secret_key_2024';

// Login do usuário
exports.login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ 
      error: 'Username e password são obrigatórios' 
    });
  }

  // Busca o usuário no banco de dados
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verifica a senha
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gera o token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });
  });
};

// Registro de novo usuário (opcional)
exports.register = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ 
      error: 'Username e password são obrigatórios' 
    });
  }

  if (password.length < 6) {
    return res.status(400).json({ 
      error: 'Password deve ter pelo menos 6 caracteres' 
    });
  }

  // Verifica se o usuário já existe
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, existingUser) => {
    if (err) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }

    if (existingUser) {
      return res.status(409).json({ error: 'Username já existe' });
    }

    // Hash da senha
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Insere o novo usuário
    db.run(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Erro ao criar usuário' });
        }

        res.status(201).json({
          message: 'Usuário criado com sucesso',
          user: {
            id: this.lastID,
            username
          }
        });
      }
    );
  });
};

// Verificar token (rota protegida de exemplo)
exports.verifyToken = (req, res) => {
  res.json({
    message: 'Token válido',
    user: req.user
  });
};

