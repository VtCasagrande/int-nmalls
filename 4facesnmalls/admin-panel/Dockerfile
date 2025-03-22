FROM node:20-alpine

WORKDIR /app

# Copiar arquivos de configuração
COPY package.json ./

# Instalar dependências incluindo todas as dev dependencies
RUN npm install

# Copiar código-fonte
COPY . .

# Criar arquivo .env.local para desenvolvimento
RUN echo "NODE_ENV=development\nNEXT_PUBLIC_API_URL=https://nmallsinterno-int-back.op6qrj.easypanel.host/api\nNEXTAUTH_URL=https://nmallsinterno-inte-admin.op6qrj.easypanel.host\nNEXTAUTH_SECRET=development_secret_key\nNEXT_PUBLIC_UPLOAD_URL=https://nmallsinterno-int-back.op6qrj.easypanel.host/uploads" > .env.local

# Criar um script personalizado para iniciar o servidor
RUN echo "#!/bin/sh\nnode_modules/.bin/next dev -p 3001 -H 0.0.0.0" > start.sh && \
    chmod +x start.sh

# Expor a porta
EXPOSE 3001

# Iniciar o aplicativo com o script
CMD ["./start.sh"] 