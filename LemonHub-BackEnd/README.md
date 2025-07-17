🍽️ Desafio Técnico - LemonHub

API REST simples para simular um cardápio com sistema de autenticação JWT





📌 Tecnologias utilizadas

•
Node.js

•
Express

•
SQLite3

•
JWT (JSON Web Tokens)

•
bcryptjs





🚀 Como rodar

1.
Clone o repositório:

2.
Instale as dependências:

3.
Inicie o servidor:

O servidor estará disponível em http://localhost:3000





🔐 Sistema de Autenticação

Usuário Padrão

•
Username: admin

•
Password: admin123

Rotas de Autenticação

POST /auth/login

•
Autentica usuário e retorna token JWT

•
Body: {"username": "admin", "password": "admin123"}

POST /auth/register

•
Registra novo usuário

•
Body: {"username": "novouser", "password": "senha123"}

GET /auth/verify

•
Verifica validade do token (rota protegida)

•
Header: Authorization: Bearer <token>

Rotas Protegidas

As seguintes rotas requerem autenticação (token JWT):

•
POST /pratos - Criar prato

•
PUT /pratos/:id - Atualizar prato

•
DELETE /pratos/:id - Deletar prato

Rotas Públicas

•
GET /pratos - Listar todos os pratos

•
GET /pratos/search - Buscar pratos por nome ou categoria





📝 Exemplos de Uso

Login

Bash


curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'


Criar Prato (com autenticação)

Bash


curl -X POST http://localhost:3000/pratos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"nome":"Prato Teste","descricao":"Descrição","preco":25.99,"categoria":"Teste"}'


Listar Pratos (público)

Bash


curl http://localhost:3000/pratos






🗄️ Estrutura do Banco de Dados

Tabela pratos

•
id (INTEGER PRIMARY KEY)

•
nome (TEXT)

•
descricao (TEXT)

•
preco (REAL)

•
categoria (TEXT)

Tabela users

•
id (INTEGER PRIMARY KEY)

•
username (TEXT UNIQUE)

•
password (TEXT - hash bcrypt)

•
created_at (DATETIME)





🔧 Estrutura do Projeto

Plain Text


src/
├── app.js                    # Arquivo principal
├── controllers/
│   ├── pratos.controller.js  # Controller dos pratos
│   └── auth.controller.js    # Controller de autenticação
├── database/
│   ├── db.js                # Configuração do banco (pratos)
│   ├── users.js             # Configuração do banco (usuários)
│   └── database.db          # Arquivo do banco SQLite
├── middleware/
│   └── auth.middleware.js   # Middleware de autenticação
└── routes/
    ├── pratos.routes.js     # Rotas dos pratos
    └── auth.routes.js       # Rotas de autenticação


