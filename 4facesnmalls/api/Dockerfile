# Imagem base
FROM node:20-alpine

WORKDIR /app

# Copiar arquivos de definição de pacotes
COPY package*.json ./

# Instalar todas as dependências
RUN npm install

# Copiar código fonte
COPY . .

# Criar diretório para logs
RUN mkdir -p /app/logs

# Expor porta
EXPOSE 3000

# Definir variáveis de ambiente
ENV NODE_ENV=production
ENV TS_NODE_TRANSPILE_ONLY=true

# Comando para iniciar a aplicação diretamente com ts-node
CMD ["npx", "ts-node", "-r", "tsconfig-paths/register", "src/main.ts"]