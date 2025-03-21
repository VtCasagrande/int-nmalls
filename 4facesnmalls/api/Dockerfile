# Imagem base
FROM node:20-alpine

WORKDIR /app

# Copiar arquivos de definição de pacotes
COPY package*.json ./

# Instalar todas as dependências, incluindo devDependencies
RUN npm install

# Copiar código fonte
COPY . .

# Criar diretório para logs
RUN mkdir -p /app/logs

# Expor porta
EXPOSE 3000

# Definir variáveis de ambiente
ENV NODE_ENV=production

# Comando para iniciar a aplicação com ts-node
CMD ["npx", "ts-node", "-r", "tsconfig-paths/register", "src/main.ts"]