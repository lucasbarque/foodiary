# 🍽️ Foodiary API

Uma API serverless enterprise-grade para aplicativo de diário alimentar construída com Node.js, TypeScript e AWS Lambda.

## 📋 Sobre o Projeto

O Foodiary API é um backend altamente escalável desenvolvido para suportar um aplicativo de diário alimentar que permite aos usuários:

- Criar contas personalizadas com dados corporais e metas nutricionais
- Autenticação segura com hash bcrypt e validação rigorosa
- Gerenciar perfis de usuário com metas personalizadas de macronutrientes
- Cálculos automáticos de necessidades calóricas baseados em dados antropométricos

## 🏗️ Arquitetura

### Stack Principal

- **Runtime**: Node.js 22.x (ARM64) - Melhor performance e custo-benefício
- **Framework**: AWS Lambda com Serverless Framework v4
- **Database**: PostgreSQL via Neon Database (Serverless)
- **ORM**: Drizzle ORM - Type-safe, performance-first
- **Validação**: Zod - Runtime type checking
- **Criptografia**: bcryptjs - Industry standard password hashing
- **Cloud Provider**: AWS (us-east-1)

### Princípios Arquiteturais

- **Serverless-First**: Zero server management, auto-scaling
- **Type Safety**: TypeScript end-to-end
- **Security by Design**: Validação em múltiplas camadas
- **Cost Optimization**: ARM64 + efficient bundling

## 🚀 Tecnologias Utilizadas

### Dependências Principais

- `@neondatabase/serverless` ^1.0.1 - Cliente serverless otimizado para PostgreSQL
- `bcryptjs` ^3.0.2 - Hash seguro de senhas com salt rounds configuráveis
- `drizzle-orm` ^0.44.3 - ORM TypeScript-first com query builder type-safe
- `zod` ^4.0.5 - Schema validation com inferência de tipos

### Dependências de Desenvolvimento

- `typescript` ^5.8.3 - Linguagem de programação type-safe
- `serverless-offline` ^14.4.0 - Desenvolvimento local com hot reload
- `drizzle-kit` ^0.31.4 - Migrações e schema management
- `tsx` ^4.20.3 - TypeScript executor de alta performance
- `dotenv` ^17.2.0 - Gerenciamento de variáveis de ambiente

## 🔗 Endpoints da API

### Autenticação

#### `POST /signup`

**Descrição**: Criação de nova conta de usuário com validação completa.

**Headers Requeridos**:

```http
Content-Type: application/json
```

**Payload**:

```json
{
  "goal": "lose" | "maintain" | "gain",
  "gender": "male" | "female",
  "birthDate": "2024-01-01",
  "height": 170,
  "weight": 70,
  "activityLevel": 1-5,
  "account": {
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "minimo8chars"
  }
}
```

**Responses**:

```json
// 201 Created
{
  "userId": "uuid-v4-string"
}

// 400 Bad Request
{
  "errors": [
    {
      "code": "invalid_type",
      "path": ["account", "email"],
      "message": "Invalid email format"
    }
  ]
}

// 409 Conflict
{
  "error": "This email is already in use"
}
```

#### `POST /signin`

**Descrição**: Autenticação de usuário existente.

**Payload**:

```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Responses**:

```json
// 200 OK
{
  "userId": "uuid-v4-string",
  "token": "jwt-token"
}

// 401 Unauthorized
{
  "error": "Invalid credentials"
}
```

## 📊 Schema do Banco de Dados

### Tabela `users`

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL, -- bcrypt hash
  goal VARCHAR(8) NOT NULL CHECK (goal IN ('lose', 'maintain', 'gain')),
  gender VARCHAR(6) NOT NULL CHECK (gender IN ('male', 'female')),
  birth_date DATE NOT NULL,
  height INTEGER NOT NULL CHECK (height > 0),
  weight INTEGER NOT NULL CHECK (weight > 0),
  activity_level INTEGER NOT NULL CHECK (activity_level BETWEEN 1 AND 5),

  -- Metas calculadas de macronutrientes
  calories INTEGER NOT NULL DEFAULT 0,
  proteins INTEGER NOT NULL DEFAULT 0,
  carbohydrates INTEGER NOT NULL DEFAULT 0,
  fats INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
```

## ⚙️ Configuração Local

### 1. Pré-requisitos

- Node.js 22.x (recomendado via nvm)
- npm 10+ ou yarn 4+
- Conta no [Neon Database](https://neon.tech)
- AWS CLI configurado (para deploy)

### 2. Instalação

```bash
# Clone do repositório
git clone <repo-url>
cd foodiary-api

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
```

### 3. Variáveis de Ambiente

#### Desenvolvimento (`.env`)

```env
# Database
DATABASE_URL=postgresql://usuario:senha@host/database?sslmode=require

# JWT (desenvolvimento apenas)
JWT_SECRET=seu-jwt-secret-super-seguro-256-bits
```

### 4. Banco de Dados

```bash
# Gerar migrações
npx drizzle-kit generate

# Aplicar migrações
npx drizzle-kit push

# Verificar schema
npx drizzle-kit introspect
```

### 5. Desenvolvimento

```bash
# Iniciar servidor local (hot reload)
npm run dev

# Servidor estará disponível em http://localhost:3000
# Logs detalhados no terminal
```

## 🚀 Deploy e CI/CD

### Deploy Manual

```bash
# Deploy staging
serverless deploy --stage staging

# Deploy production
serverless deploy --stage production

# Deploy função específica
serverless deploy function --function signin --stage production
```

## 📁 Estrutura do Projeto

```
foodiary-api/
├── src/
│   ├── controllers/         # Business logic
│   │   ├── SignInController.ts
│   │   └── SignUpController.ts
│   ├── db/                 # Database layer
│   │   ├── index.ts        # Connection setup
│   │   ├── schema.ts       # Drizzle schema
│   │   └── migrations/     # DB migrations
│   ├── functions/          # Lambda handlers
│   │   ├── signin.ts
│   │   └── signup.ts
│   ├── middleware/         # Lambda middleware
│   │   ├── errorHandler.ts
│   │   ├── validation.ts
│   │   └── cors.ts
│   ├── services/           # External services
│   │   ├── emailService.ts
│   │   └── nutritionCalc.ts
│   ├── types/             # TypeScript definitions
│   │   ├── Http.ts
│   │   └── User.ts
│   └── utils/             # Helper utilities
│       ├── http.ts
│       ├── logger.ts
│       └── constants.ts
├── tests/                  # Test suites
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/                   # API documentation
├── scripts/               # Utility scripts
├── .github/               # CI/CD workflows
├── serverless.yml         # Serverless config
├── drizzle.config.ts      # DB config
└── tsconfig.json          # TypeScript config
```

## 🔒 Características de Segurança

### Implementado

- ✅ **Password Hashing**: bcrypt com 12 salt rounds
- ✅ **Input Validation**: Zod schema validation em todas as entradas
- ✅ **Email Uniqueness**: Constraint a nível de banco
- ✅ **SQL Injection Prevention**: Drizzle ORM parameterized queries
- ✅ **HTTPS Only**: SSL/TLS enforced via API Gateway
- ✅ **CORS**: Configuração restritiva por ambiente
