const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

app.use(express.json());

// Inicializar banco de dados de usuários
require('./database/users');

// Importar rotas
const pratosRoutes = require('./routes/pratos.routes');
const authRoutes = require('./routes/auth.routes');

app.use('/pratos', pratosRoutes);
app.use('/auth', authRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'LemonHub API com Autenticação' });
});

// Porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});