FROM node:20-alpine

WORKDIR /app

# Copiar arquivos de configuração
COPY package.json ./

# Instalar dependências
RUN npm install

# Copiar código-fonte
COPY . .

# Criar arquivo .env.local para produção
RUN echo "NODE_ENV=production\nNEXT_PUBLIC_API_URL=https://nmallsinterno-int-back.op6qrj.easypanel.host/api\nNEXTAUTH_URL=https://nmallsinterno-inte-admin.op6qrj.easypanel.host\nNEXTAUTH_SECRET=production_secret_key_replace_this\nNEXT_PUBLIC_UPLOAD_URL=https://nmallsinterno-int-back.op6qrj.easypanel.host/uploads" > .env.local

# Build do aplicativo
RUN npm run build

# Expor a porta
EXPOSE 3001

# Iniciar o aplicativo em modo de produção
CMD ["npm", "run", "start"] 