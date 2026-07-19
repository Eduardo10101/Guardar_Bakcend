# 🚀 Guardar Backend

API REST desenvolvida para o aplicativo mobile **Vamos Sair?**.

O backend é responsável pelo gerenciamento de usuários, autenticação, criação e consulta de convites, utilizando Node.js, Express, MySQL e autenticação JWT.

---

# 📌 Funcionalidades

## Usuários

✅ Cadastro de usuários  
✅ Validação de email  
✅ Validação de senha  
✅ Criptografia de senha utilizando bcrypt  
✅ Login com autenticação JWT  
✅ Controle de sessão através de token  

---

## Convites

✅ Criação de convites  
✅ Associação de convite ao usuário autenticado  
✅ Consulta de convites do usuário  
✅ Proteção de rotas utilizando JWT  

---

## Lugares

✅ Consulta de locais disponíveis  
✅ Controle de lugares ativos através do banco de dados  

---

# 🛠️ Tecnologias utilizadas

## Backend

- Node.js
- Express.js
- JavaScript
- API REST

## Banco de dados

- MySQL
- mysql2

## Segurança

- JSON Web Token (JWT)
- bcrypt

## Deploy

- Render (API)
- Railway (Banco de dados MySQL)

---

# 🏗️ Arquitetura do projeto

```
guardar_backend

│
├── database
│   └── db.js
│
├── middlewares
│   └── auth.js
│
├── routes
│   ├── usuarios.js
│   ├── convites.js
│   └── lugares.js
│
├── server.js
├── package.json
└── .env
```

---

# 🔐 Autenticação

A API utiliza autenticação baseada em JWT.

Fluxo:

```
Usuário
   |
Login
   |
API valida credenciais
   |
JWT é gerado
   |
Token enviado ao aplicativo
   |
Rotas protegidas liberadas
```

Exemplo de envio do token:

```
Authorization: Bearer TOKEN
```

---

# 🔌 Endpoints

## Usuários

### Cadastro

```
POST /usuarios/cadastro
```

Body:

```json
{
  "nome": "Eduardo",
  "email": "usuario@email.com",
  "senha": "12345678"
}
```

---

### Login

```
POST /usuarios/login
```

Body:

```json
{
  "email": "usuario@email.com",
  "senha": "12345678"
}
```

Resposta:

```json
{
  "id": 1,
  "nome": "Eduardo",
  "token": "jwt_token"
}
```

---

# Convites

## Criar convite

```
POST /convites
```

Requer autenticação JWT.

Body:

```json
{
  "lugar": "Cinema",
  "dia": "2026-07-20",
  "horario": "19:00",
  "observacao": "Vamos assistir um filme?"
}
```

---

## Buscar convites

```
GET /convites
```

Requer autenticação JWT.

---

# Lugares

## Buscar lugares disponíveis

```
GET /lugares
```

Retorna locais ativos cadastrados no banco.

---

# ⚙️ Como executar o projeto

## Pré-requisitos

- Node.js instalado
- MySQL instalado ou banco remoto configurado

---

Instale as dependências:

```bash
npm install
```

---

Configure as variáveis de ambiente criando um arquivo:

```
.env
```

Exemplo:

```env
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=

JWT_SECRET=

PORT=3000
```

---

Execute o servidor:

```bash
npm run dev
```

ou:

```bash
node server.js
```

---

# 🌐 Deploy

A API está preparada para hospedagem em ambiente de produção utilizando:

- Render para hospedagem do backend;
- Railway para banco de dados MySQL.

---

# 📚 Aprendizados

Durante o desenvolvimento foram aplicados conhecimentos de:

- Desenvolvimento de APIs REST
- Arquitetura backend com Node.js
- Banco de dados relacional
- Autenticação com JWT
- Criptografia de senhas
- Integração entre frontend e backend
- Deploy de aplicações

---

# 👨‍💻 Desenvolvedor

**Eduardo Lucas de Oliveira**

Estudante de Desenvolvimento de Sistemas

GitHub:
https://github.com/devEduLucas
