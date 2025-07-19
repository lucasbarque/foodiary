# 🍽️ Foodiary API

Uma API serverless para aplicativo de diário alimentar construída com Node.js, TypeScript e AWS Lambda.

## 📋 Sobre o Projeto

O Foodiary API é um backend desenvolvido para suportar um aplicativo de diário alimentar que permite aos usuários:

- Criar contas personalizadas com dados corporais e metas nutricionais
- Fazer login seguro com autenticação
- Gerenciar perfis de usuário com metas de calorias, proteínas, carboidratos e gorduras

## 🏗️ Arquitetura

- **Runtime**: Node.js 22.x (ARM64)
- **Framework**: AWS Lambda com Serverless Framework
- **Database**: PostgreSQL via Neon Database
- **ORM**: Drizzle ORM
- **Validação**: Zod
- **Criptografia**: bcryptjs
- **Cloud Provider**: AWS (us-east-1)

## 🚀 Tecnologias Utilizadas

### Dependências Principais

- `@neondatabase/serverless` - Cliente serverless para PostgreSQL
- `bcryptjs` - Hash de senhas
- `drizzle-orm` - ORM TypeScript-first
- `zod` - Validação de schema

### Dependências de Desenvolvimento

- `typescript` - Linguagem de programação
- `serverless-offline` - Desenvolvimento local
- `drizzle-kit` - Migrações do banco
- `tsx` - Executor TypeScript
- `dotenv` - Variáveis de ambiente

## 📊 Schema do Banco de Dados

### Tabela `users`

- `id` - UUID (Primary Key)
- `name` - Nome do usuário
- `email` - Email único
- `password` - Senha criptografada
- `goal` - Meta: "lose", "maintain", "gain"
- `gender` - Gênero: "male", "female"
- `birthDate` - Data de nascimento
- `height` - Altura (cm)
- `weight` - Peso (kg)
- `activityLevel` - Nível de atividade (1-5)
- `calories` - Meta de calorias diárias
- `proteins` - Meta de proteínas (g)
- `carbohydrates` - Meta de carboidratos (g)
- `fats` - Meta de gorduras (g)

## ⚙️ Configuração Local

### 1. Pré-requisitos

- Node.js 22.x
- npm ou yarn
- Conta no Neon Database

### 2. Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
```

### 3. Variáveis de Ambiente

Crie um arquivo `.env` com:

```env
DATABASE_URL=postgresql://usuario:senha@host/database?sslmode=require
```

### 4. Banco de Dados

```bash
# Executar migrações
npx drizzle-kit push
```

### 5. Desenvolvimento

```bash
# Iniciar servidor local
npm run dev
```

A API estará disponível em `http://localhost:3000`

## 🚀 Deploy

### Configuração do Serverless

```bash
# Instalar Serverless CLI globalmente
npm install -g serverless

# Configurar credenciais AWS
serverless config credentials --provider aws --key SEU_ACCESS_KEY --secret SUA_SECRET_KEY

# Deploy
serverless deploy
```

### Variáveis de Ambiente em Produção

Configure no AWS Lambda ou através do Serverless:

- `DATABASE_URL` - String de conexão do PostgreSQL

## 📁 Estrutura do Projeto

```
src/
├── controllers/         # Lógica de negócio
│   ├── SignInController.ts
│   └── SignUpController.ts
├── db/                 # Configuração do banco
│   ├── index.ts
│   └── schema.ts
├── functions/          # Handlers do Lambda
│   ├── signin.ts
│   └── signup.ts
├── types/             # Definições de tipos
└── utils/             # Utilitários HTTP
```

## 🧪 Características de Segurança

- ✅ Senhas criptografadas com bcryptjs
- ✅ Validação rigorosa de entrada com Zod
- ✅ Verificação de email único
- ✅ Arquitetura serverless segura

## 🏃‍♂️ Scripts Disponíveis

```bash
npm run dev        # Desenvolvimento local com hot reload
```

## 📝 Próximos Passos

Esta implementação inicial fornece a base para:

- Sistema de autenticação JWT
- CRUD de alimentos
- Registro de refeições
- Cálculo automático de macros
- Dashboard de progresso
- Integração com APIs de alimentos

## 🤝 Contribuição

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob licença ISC.
