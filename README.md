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