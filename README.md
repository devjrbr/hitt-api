# HITT API

API backend para o  HITT com autenticação passwordless e CRUD de usuários.

## Como Funciona

### Sistema de Usuários

O sistema permite cadastrar e gerenciar usuários de três tipos: **STARTUP**, **PARTNER** e **VISITOR**.

### Autenticação Passwordless

**Não usamos senhas.** O login funciona assim:

1. **Usuário solicita código** → enviamos código de 6 dígitos por email
2. **Usuário digita código** → validamos e retornamos token JWT
3. **Token é eterno** → não expira, usuário fica logado

### Serviços Utilizados

- **Banco de Dados**: PostgreSQL (Neon) - banco gratuito na nuvem
- **Email**: Mailgun SMTP - envio de códigos de verificação
- **Deploy**: Vercel - hospedagem serverless

## Rotas da API

### Autenticação

**1. Solicitar código de login**
```
POST /auth
{
  "email": "usuario@email.com"
}
```
*Resposta de sucesso:*
```json
{
  "message": "Verification code sent to email"
}
```
*Resposta de erro:*
```json
{
  "code": "USER_NOT_FOUND",
  "message": "User not found"
}
```

**2. Fazer login com código**
```
POST /auth/code
{
  "email": "usuario@email.com", 
  "code": "123456"
}
```
*Resposta de sucesso:*
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
*Resposta de erro:*
```json
{
  "code": "INVALID_TOKEN",
  "message": "Invalid verification code"
}
```

**3. Usar o token nas requisições autenticadas**

Para acessar rotas protegidas, envie o token no header `Authorization`:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Importante:** 
- Use exatamente `Bearer ` (com espaço) seguido do token
- O token não expira (válido permanentemente)

### Usuários

**Criar usuário**
```
POST /user
{
  "type": "STARTUP",
  "registration_code": "",
  "full_name": "João Silva",
  "email": "joao@email.com",
  "phone": "(11) 99999-9999",
  "cpf": "123.456.789-00",
  "birth_date": "1990-01-15",
  "gender": "MALE",
  "how_did_you_know": "SITE",
  "newsletter": true
}
```

**Listar todos usuários**
```
GET /user
```

**Buscar usuário por ID**
```
GET /user/1
```

**Atualizar usuário**
```
PUT /user/1
Authorization: Bearer {token}
```

**Deletar usuário**
```
DELETE /user/1
Authorization: Bearer {token}
```

**Ver perfil do usuário logado**
```
GET /user/profile
Authorization: Bearer {token}
```

**Atualizar perfil**
```
PATCH /user
Authorization: Bearer {token}
```

## Validações

- **Email**: formato válido e único
- **CPF**: formato válido e único  
- **Código de login**: 6 dígitos, expira em 10 minutos
- **Campos obrigatórios**: validados automaticamente

## Padrão de Erros

### Erros Simples
Formato padrão para a maioria dos erros:
```json
{
  "code": "EMAIL_ALREADY_EXISTS",
  "message": "This email is already registered"
}
```

### Erros de Validação
Quando há campos inválidos, retorna com `details`:
```json
{
  "code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "\"email\" must be a valid email",
      "code": "INVALID_EMAIL"
    }
  ]
}
```

### Códigos principais:
- `EMAIL_ALREADY_EXISTS` - Email já cadastrado
- `CPF_ALREADY_EXISTS` - CPF já cadastrado  
- `DUPLICATE_ENTRY` - Informação duplicada (genérico, não mapeado) 
- `USER_NOT_FOUND` - Usuário não encontrado
- `INVALID_TOKEN` - Código inválido ou expirado
- `EMAIL_FAILED` - Falha no envio de email
- `VALIDATION_ERROR` - Dados inválidos (com detalhes por campo)
- `INVALID_EMAIL` - Email inválido (dentro de details)
- `INVALID_CPF` - CPF inválido (dentro de details)
- `REQUIRED_FIELD` - Campo obrigatório (dentro de details)
- `INTERNAL_SERVER_ERROR` - Erro interno do servidor
- `CATEGORY_NOT_FOUND` - Categoria não encontrada
- `CATEGORY_NAME_ALREADY_EXISTS` - Nome da categoria já existe
- `FORBIDDEN` - Sem permissão para esta ação
- `TOKEN_REQUIRED` - Token de acesso obrigatório
- `UNAUTHORIZED` - Token inválido ou usuário sem permissão

## Configuração

Crie um arquivo `.env` com:

```env
DATABASE_URL=sua_url_do_neon_postgresql
JWT_SECRET=sua_chave_secreta_jwt
MAILGUN_DOMAIN=seu_dominio_mailgun
MAILGUN_SMTP_PASSWORD=sua_senha_smtp_mailgun
```

## Como Rodar

```bash
npm install
npm run dev
```

A API estará disponível em `http://localhost:3000`

## Teste Rápido

```bash
curl http://localhost:3000/ping
# Resposta: pong
```
### Categorias

**Listar categorias** (usuário autenticado)
```
GET /category
Authorization: Bearer {token}
```

**Buscar categoria por ID** (usuário autenticado)
```
GET /category/1
Authorization: Bearer {token}
```

**Criar categoria** (apenas ADMIN)
```
POST /category
Authorization: Bearer {token}
{
  "name": "edtech"
}
```

**Atualizar categoria** (apenas ADMIN)
```
PUT /category/1
Authorization: Bearer {token}
{
  "name": "fintech"
}
```

**Deletar categoria** (apenas ADMIN)
```
DELETE /category/1
Authorization: Bearer {token}
```

## Permissões

### Níveis de Acesso:

**VISITOR** - Acesso limitado:
- Ver próprio perfil
- Atualizar próprio perfil

**STARTUP/PARTNER** - Acesso intermediário:
- Todas as permissões de VISITOR
- Ver categorias
- Funcionalidades específicas do app

**ADMIN** - Acesso administrativo:
- Todas as permissões anteriores
- Gerenciar outros usuários (CRUD completo)
- Gerenciar categorias (CRUD completo)
- Promover/rebaixar outros usuários

### Rotas Públicas (sem autenticação):
- `POST /user` - Registro de usuário
- `POST /auth` - Solicitar código de login
- `POST /auth/code` - Fazer login

### Rotas Protegidas (requer autenticação):
- `GET /user/profile` - Ver próprio perfil
- `PATCH /user` - Atualizar próprio perfil (exceto role)
- `GET /category` - Listar categorias
- `GET /category/:id` - Ver categoria específica

### Rotas Administrativas (apenas ADMIN):
- `GET /user` - Listar todos usuários
- `GET /user/:id` - Ver usuário específico
- `PUT /user/:id` - Atualizar qualquer usuário (completo)
- `PATCH /user/:id` - Atualizar qualquer usuário (parcial, exceto role)
- `DELETE /user/:id` - Deletar usuário
- `PATCH /user/:id/promote` - Alterar role do usuário
- `POST /category` - Criar categoria
- `PUT /category/:id` - Atualizar categoria
- `DELETE /category/:id` - Deletar categoria


## Autenticação JWT

O sistema utiliza **JWT minimalista** contendo apenas o ID do usuário:

```json
{
  "id": 15,
  "iat": 1756120874,
  "iss": "hitt-api"
}
```

**Vantagens:**
- **Segurança máxima**: Dados sempre atuais do banco
- **Permissões em tempo real**: Admin rebaixado perde acesso imediatamente
- **Simplicidade**: JWT contém apenas o essencial
- **Flexibilidade**: Qualquer mudança no usuário reflete instantaneamente


## Sistema de Roles

### Implementação:
- Campo `role` na tabela users: `['USER', 'ADMIN']`
- Novos usuários: `role = 'USER'` (padrão)
- JWT contém apenas ID do usuário
- Permissões verificadas em tempo real no banco

### Criar primeiro ADMIN:
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@exemplo.com';
```

### Promover usuário (apenas ADMIN):
```
PATCH /user/:id/promote
Authorization: Bearer {token}
{
  "role": "ADMIN"
}
```

### Permissões:

**USER:**
- GET /user/profile
- PATCH /user

**ADMIN:**
- Todas as permissões de USER
- GET /user (listar todos)
- GET /user/:id
- PUT /user/:id (completo)
- PATCH /user/:id (parcial, exceto role)
- DELETE /user/:id
- PATCH /user/:id/promote (alterar role)
- POST /category
- PUT /category/:id
- DELETE /category/:id

**Público (sem auth):**
- POST /user (registro)
- POST /auth
- POST /auth/code

**Autenticado (qualquer role):**
- GET /category
- GET /category/:id
