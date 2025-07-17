🍽️ LemonHub Frontend

Interface React para o sistema de cardápio com autenticação JWT





📌 Tecnologias utilizadas

•
React

•
React Icons

•
CSS3

•
JavaScript ES6+





🚀 Como rodar

1.
Certifique-se de que o backend está rodando em http://localhost:3000

2.
Instale as dependências:

3.
Inicie o servidor de desenvolvimento:

O frontend estará disponível em http://localhost:3001





🔐 Sistema de Autenticação

Credenciais Padrão

•
Username: admin

•
Password: admin123

Funcionalidades de Autenticação

•
Login: Interface responsiva com validação

•
Logout: Limpeza de dados e redirecionamento

•
Persistência: Token armazenado no localStorage

•
Proteção: Operações CRUD requerem autenticação





🎨 Componentes

App.js

•
Componente principal da aplicação

•
Gerencia estado de autenticação

•
Controla exibição de login vs interface principal

•
Implementa requisições autenticadas

Login.js

•
Interface de login responsiva

•
Validação de formulário

•
Tratamento de erros

•
Comunicação com API de autenticação

Header.js

•
Cabeçalho da aplicação

•
Exibe informações do usuário logado

•
Botão de logout

•
Design responsivo





🔧 Funcionalidades

Públicas (sem autenticação)

•
Visualizar lista de pratos

•
Buscar pratos por nome ou categoria

Protegidas (requer autenticação)

•
Adicionar novo prato

•
Editar prato existente

•
Deletar prato





🎯 Fluxo de Uso

1.
Acesso Inicial: Usuário acessa a aplicação

2.
Verificação: Sistema verifica se há token válido no localStorage

3.
Login: Se não autenticado, exibe tela de login

4.
Autenticação: Usuário insere credenciais e faz login

5.
Interface Principal: Após login, acessa funcionalidades completas

6.
Operações: Pode realizar todas as operações CRUD

7.
Logout: Pode sair e retornar à tela de login





🔒 Segurança Frontend

Medidas Implementadas

•
Validação de Token: Verificação automática na inicialização

•
Headers Autenticados: Token incluído automaticamente nas requisições

•
Proteção de UI: Botões/formulários desabilitados sem autenticação

•
Limpeza de Dados: Logout remove todas as informações sensíveis

Tratamento de Erros

•
Token Expirado: Redirecionamento automático para login

•
Erro de Rede: Mensagens informativas para o usuário

•
Credenciais Inválidas: Feedback claro na tela de login





📱 Design Responsivo

A interface foi desenvolvida para funcionar em:

•
Desktop: Layout completo com duas colunas

•
Tablet: Adaptação automática dos formulários

•
Mobile: Layout empilhado e otimizado para toque





🎨 Estilo Visual

Paleta de Cores

•
Primária: Gradiente roxo/azul (#667eea → #764ba2)

•
Secundária: Dourado (#ffd700) para destaques

•
Fundo: Cinza claro (#f8f9fa)

•
Texto: Cinza escuro (#333)

Componentes Visuais

•
Botões: Gradientes com efeitos hover

•
Formulários: Bordas coloridas e transições suaves

•
Cards: Sombras sutis e bordas arredondadas

•
Header: Gradiente com informações do usuário





🔧 Estrutura de Arquivos

Plain Text


src/
├── App.js              # Componente principal
├── App.css             # Estilos principais
├── components/
│   ├── Login.js        # Componente de login
│   ├── Login.css       # Estilos do login
│   ├── Header.js       # Cabeçalho da aplicação
│   └── Header.css      # Estilos do cabeçalho
├── index.js            # Ponto de entrada
└── index.css           # Estilos globais






🚨 Troubleshooting

Problemas Comuns

Erro de CORS

•
Verifique se o backend está rodando

•
Backend configurado para aceitar requisições do frontend

Tela branca após login

•
Verifique o console do navegador

•
Confirme se o backend está respondendo

Botões não funcionam

•
Verifique se está logado

•
Token pode ter expirado (faça login novamente)

Estilos não carregam

•
Limpe o cache do navegador

•
Verifique se todos os arquivos CSS estão presentes





📈 Próximas Melhorias

•
Implementar loading states

•
Adicionar notificações toast

•
Melhorar acessibilidade (ARIA labels)

•
Implementar temas claro/escuro

•
Adicionar paginação para lista de pratos

•
Implementar upload de imagens para pratos

