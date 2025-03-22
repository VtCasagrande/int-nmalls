FROM node:20-alpine

WORKDIR /app

# Copiar arquivos de configuração
COPY package.json ./

# Instalar dependências
RUN npm install

# Copiar código-fonte
COPY . .

# Criar arquivo .env.local para desenvolvimento
RUN echo "NODE_ENV=development\nNEXT_PUBLIC_API_URL=https://nmallsinterno-int-back.op6qrj.easypanel.host/api\nNEXTAUTH_URL=https://nmallsinterno-inte-admin.op6qrj.easypanel.host\nNEXTAUTH_SECRET=development_secret_key\nNEXT_PUBLIC_UPLOAD_URL=https://nmallsinterno-int-back.op6qrj.easypanel.host/uploads" > .env.local

# Expor a porta
EXPOSE 3001

# Iniciar o aplicativo em modo de desenvolvimento, configurado para ouvir todas as interfaces de rede
CMD ["sh", "-c", "npm run dev -- -H 0.0.0.0"] 