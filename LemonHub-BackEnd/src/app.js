const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

app.use(express.json());

// Importar rotas (vamos criar depois)
const pratosRoutes = require('./routes/pratos.routes');
app.use('/pratos', pratosRoutes);

// Porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
