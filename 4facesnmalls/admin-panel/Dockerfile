FROM node:20-alpine

WORKDIR /app

# Copiar arquivos de configuração
COPY package.json ./

# Instalar dependências
RUN npm install

# Copiar código-fonte
COPY . .

# Criar arquivo .env.local para dev
RUN echo "NODE_ENV=development\nNEXT_PUBLIC_API_URL=http://int-back:3000/api\nNEXTAUTH_URL=http://inte-admin:3001\nNEXTAUTH_SECRET=development_secret_key\nNEXT_PUBLIC_UPLOAD_URL=http://int-back:3000/uploads" > .env.local

# Expor a porta
EXPOSE 3001

# Iniciar o aplicativo em modo de desenvolvimento
CMD ["npm", "run", "dev"] 