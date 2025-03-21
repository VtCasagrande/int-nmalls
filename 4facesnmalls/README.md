# Ecossistema Nmalls

Sistema completo para gerenciamento de entregas, clientes e estoque da Nmalls.

## Componentes do Sistema

- **API**: Backend centralizado que gerencia todo o ecossistema
- **Painel Administrativo**: Interface web para administradores e operadores
- **Aplicativo de Entregadores**: Aplicativo móvel para gestão de entregas
- **Extensão Chrome**: Integração com Tiny PDV e outras ferramentas

## Tecnologias Utilizadas

- **Backend**: Node.js, NestJS, TypeScript, MongoDB
- **Frontend**: Next.js, React, Chakra UI
- **Mobile**: React Native, Expo
- **Extensão**: React, TypeScript

## Requisitos

- Node.js 18+
- MongoDB 6+
- Docker e Docker Compose (opcional para desenvolvimento)

## Primeiros Passos

### Configuração do Ambiente

1. Clone o repositório:
```bash
git clone https://github.com/VtCasagrande/int-nmalls.git
cd int-nmalls
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

3. Inicie o sistema com Docker:
```bash
docker-compose up -d
```

## Desenvolvimento

### API (Backend)

```bash
cd api
npm install
npm run start:dev
```

A API estará disponível em http://localhost:3000
Documentação Swagger: http://localhost:3000/api/docs

## Estrutura do Projeto

```
/
├── api/                 # Backend/API central
├── admin-panel/         # Painel administrativo web
├── delivery-app/        # Aplicativo para entregadores
├── chrome-extension/    # Extensão para Chrome
├── database/            # Scripts e configurações do MongoDB
├── shared/              # Código compartilhado entre componentes
├── docker-compose.yml   # Configuração dos serviços Docker
└── .env                 # Variáveis de ambiente
```

## Funcionalidades Principais

- Gestão completa de entregas
- Sistema de recorrências
- Processamento de devoluções
- Gerenciamento de estoque
- Cadastro e histórico de clientes
- Relatórios e métricas
- Gerenciamento de promoções
- Autenticação e autorização com controle granular de permissões

## Documentação

Documentação detalhada está disponível na pasta `docs/`. 