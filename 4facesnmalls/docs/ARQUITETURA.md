# Arquitetura do Sistema Nmalls

## Visão Geral

A arquitetura do sistema Nmalls é baseada em uma API RESTful central que serve como ponto de comunicação entre todos os componentes do ecossistema. O sistema utiliza MongoDB como banco de dados principal, oferecendo flexibilidade no armazenamento e consulta de dados.

## Componentes Principais

### 1. API (Backend)

- **Tecnologia**: NestJS com TypeScript
- **Função**: Centralizar todas as operações de negócio e fornecer endpoints para os outros componentes
- **Características**:
  - Arquitetura modular baseada em controllers, services e modules
  - Sistema de autenticação JWT com refresh tokens
  - Autorização baseada em roles e permissões granulares
  - Validação de dados com class-validator
  - Documentação automática com Swagger
  - Logging detalhado com Winston

#### Módulos Principais

- **Auth**: Gerenciamento de autenticação e autorização
- **Users**: Gerenciamento de usuários e permissões
- **Deliveries**: Controle de entregas e rotas
- **Customers**: Cadastro e histórico de clientes
- **Products**: Gerenciamento de produtos e estoque
- **Recurrencies**: Sistema de assinaturas e entregas recorrentes
- **Returns**: Processamento de devoluções
- **Promotions**: Gerenciamento de promoções

### 2. Banco de Dados

- **Tecnologia**: MongoDB
- **ORM**: Mongoose
- **Collections Principais**:
  - users
  - customers
  - products
  - deliveries
  - recurrencies
  - returns
  - promotions
  - logs
  - audit_trails

### 3. Painel Administrativo (Frontend)

- **Tecnologia**: Next.js, React, Chakra UI
- **Características**:
  - Server-side rendering para melhor SEO e performance
  - Gestão de estado com React Query
  - Interface responsiva e acessível
  - Dashboard personalizado por perfil de usuário
  - Visualização de dados em tempo real

### 4. Aplicativo de Entregadores

- **Tecnologia**: React Native com Expo
- **Características**:
  - Interface otimizada para dispositivos móveis
  - Funcionalidade offline para áreas com conectividade limitada
  - Geolocalização e mapeamento de rotas
  - Captura de assinatura e comprovantes
  - Notificações push

### 5. Extensão Chrome

- **Tecnologia**: React, TypeScript, Chrome Extension API
- **Características**:
  - Integração com Tiny PDV
  - Consulta rápida de dados de clientes e recorrências
  - Sincronização em tempo real com o sistema central

## Comunicação entre Componentes

- **API RESTful**: Todos os componentes se comunicam via API REST
- **WebSockets**: Para notificações em tempo real (entregas, atualizações)
- **JWT**: Para autenticação segura entre componentes

## Segurança

- **Autenticação**: JWT com refresh tokens
- **Autorização**: Sistema RBAC (Role-Based Access Control)
- **Permissões Granulares**: Controle de acesso por módulo e ação
- **Validação de Dados**: Validação rigorosa de todas as entradas
- **HTTPS**: Comunicação criptografada em todos os endpoints
- **Logs de Auditoria**: Registro detalhado de todas as ações dos usuários

## Escalabilidade

- **Arquitetura em Containers**: Facilita a escalabilidade horizontal
- **Microserviços Internos**: Módulos independentes podem ser escalados conforme necessidade
- **Cache Redis**: Para consultas frequentes (a ser implementado)
- **Balanceamento de Carga**: Via Nginx (a ser implementado)

## Implantação

- **Docker**: Containers para cada componente
- **EasyPanel**: Para gerenciamento e orquestração dos containers
- **CI/CD**: Integração contínua via GitHub Actions

## Monitoramento e Logs

- **Logs Centralizados**: Winston para logs estruturados
- **Monitoramento**: Métricas de sistema via Prometheus (a ser implementado)
- **Visualização**: Dashboard Grafana (a ser implementado) 