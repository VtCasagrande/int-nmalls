FROM node:20-alpine

WORKDIR /app

# Copiar arquivos de configuração
COPY package.json ./

# Instalar dependências
RUN npm install

# Copiar código-fonte
COPY . .

# Criar arquivo .env.local para desenvolvimento
RUN echo "NODE_ENV=development" > .env.local && \
    echo "NEXT_PUBLIC_API_URL=https://nmallsinterno-int-back.op6qrj.easypanel.host/api" >> .env.local && \
    echo "NEXTAUTH_URL=https://nmallsinterno-inte-admin.op6qrj.easypanel.host" >> .env.local && \
    echo "NEXTAUTH_SECRET=development_secret_key" >> .env.local && \
    echo "NEXT_PUBLIC_UPLOAD_URL=https://nmallsinterno-int-back.op6qrj.easypanel.host/uploads" >> .env.local

# Criar um script wrapper
RUN echo '#!/bin/sh\n\
echo "Iniciando servidor Next.js em todas as interfaces..."\n\
npm run dev -- -H 0.0.0.0 &\n\
SERVER_PID=$!\n\
# Esperar servidor iniciar\n\
sleep 10\n\
echo "Verificando se o servidor está acessível..."\n\
node health-check.js\n\
# Continuar executando o processo principal\n\
wait $SERVER_PID\n\
' > /app/start-server.sh && chmod +x /app/start-server.sh

# Expor a porta
EXPOSE 3001

# Iniciar o aplicativo usando o script wrapper
CMD ["/app/start-server.sh"] 