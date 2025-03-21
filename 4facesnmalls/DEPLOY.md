# Instruções para Implantação do Sistema Nmalls

Este documento contém instruções para implantar o sistema Nmalls, incluindo a API e o Painel Administrativo.

## Requisitos

- Docker e Docker Compose
- MongoDB (ou use a versão containerizada)
- Node.js 18+ (para desenvolvimento local)

## Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/VtCasagrande/int-nmalls.git
cd int-nmalls
```

### 2. Configure as variáveis de ambiente

Edite o arquivo `.env` na raiz do projeto com as configurações necessárias:

```bash
# Faça uma cópia do exemplo e edite conforme necessário
cp .env.example .env
```

**Importante:** Em produção, altere as senhas e chaves secretas para valores seguros.

### 3. Inicie o sistema com Docker

Para ambiente de desenvolvimento:

```bash
docker-compose up -d
```

Para ambiente de produção:

```bash
# Use o arquivo de configuração para produção
docker-compose -f docker-compose.prod.yml up -d
```

### 4. Verifique se os serviços estão funcionando

- API: http://localhost:3000/api/health
- Admin Panel: http://localhost:3001
- Documentação API: http://localhost:3000/api/docs

## Estrutura de Diretórios

```
/
├── api/                 # Backend/API central
├── admin-panel/         # Painel administrativo web
├── delivery-app/        # Aplicativo para entregadores (não incluído na versão mínima)
├── chrome-extension/    # Extensão para Chrome (não incluído na versão mínima)
├── database/            # Scripts e configurações do MongoDB
├── shared/              # Código compartilhado entre componentes
├── docker-compose.yml   # Configuração dos serviços Docker para desenvolvimento
└── .env                 # Variáveis de ambiente
```

## Acesso ao Sistema

### Painel Administrativo (Admin Panel)

- URL: http://localhost:3001
- Credenciais padrão:
  - Email: admin@nmalls.example.com
  - Senha: admin123 (altere após o primeiro login)

### API

- URL Base: http://localhost:3000/api
- Documentação: http://localhost:3000/api/docs

## Backup e Restauração

### Backup do MongoDB

```bash
docker exec -it nmalls-mongodb mongodump --authenticationDatabase admin \
    --username $MONGO_ROOT_USER --password $MONGO_ROOT_PASSWORD \
    --db nmalls --out /data/backup/
```

### Restauração do MongoDB

```bash
docker exec -it nmalls-mongodb mongorestore --authenticationDatabase admin \
    --username $MONGO_ROOT_USER --password $MONGO_ROOT_PASSWORD \
    --db nmalls /data/backup/nmalls/
```

## Solução de Problemas

1. **Os containers não iniciam corretamente:**
   - Verifique os logs: `docker-compose logs -f`
   - Certifique-se de que as portas 3000 e 3001 não estão em uso

2. **Problemas de conexão com o banco de dados:**
   - Verifique as credenciais no arquivo `.env`
   - Verifique se o container do MongoDB está em execução

3. **Erro na autenticação do painel administrativo:**
   - Verifique as variáveis NEXTAUTH_URL e NEXTAUTH_SECRET no arquivo `.env`
   - Verifique a conexão entre o admin-panel e a API

## Contato e Suporte

Para obter suporte ou reportar problemas, entre em contato com:
- Email: suporte@nmalls.example.com 