FROM node:18-alpine AS builder

WORKDIR /app

# Copiar arquivos de configuração
COPY package.json package-lock.json* ./

# Instalar dependências
RUN npm ci

# Copiar código-fonte
COPY . .

# Buildar o aplicativo
RUN npm run build

# Imagem de produção
FROM node:18-alpine AS runner

WORKDIR /app

# Definir variáveis de ambiente para produção
ENV NODE_ENV=production
ENV PORT=3001

# Copiar as dependências e o build
COPY --from=builder /app/package.json .
COPY --from=builder /app/package-lock.json* .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

# Expor a porta
EXPOSE 3001

# Iniciar o aplicativo
CMD ["npm", "start"] 