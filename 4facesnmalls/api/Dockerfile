# Estágio de construção
FROM node:18-alpine AS build

WORKDIR /app

# Copiar arquivos de definição de pacotes
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Compilar aplicação
RUN npm run build

# Remover pacotes de desenvolvimento
RUN npm prune --production

# Estágio de produção
FROM node:18-alpine

WORKDIR /app

# Criar diretório para logs
RUN mkdir -p /app/logs

# Copiar arquivos de dependências e compilados do estágio de construção
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

# Expor porta
EXPOSE 3000

# Definir variáveis de ambiente
ENV NODE_ENV=production

# Usuário não-root para segurança
USER node

# Comando para iniciar a aplicação
CMD ["node", "dist/main.js"]