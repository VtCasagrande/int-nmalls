FROM node:20-alpine

WORKDIR /app

# Instalar ferramentas de diagnóstico
RUN apk add --no-cache curl iputils busybox-extras

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

# Criar script de inicialização simples
RUN echo '#!/bin/sh\n\
echo "Verificando conectividade de rede..."\n\
ping -c 1 8.8.8.8 || echo "Sem conectividade externa!"\n\
ping -c 1 127.0.0.1 || echo "Loopback não está funcionando!"\n\
\n\
echo "Iniciando servidor Next.js diretamente na porta 3000..."\n\
exec npm run dev -- -p 3000 -H 0.0.0.0\n\
' > /app/start.sh && chmod +x /app/start.sh

# Expor porta 3000 diretamente
EXPOSE 3000

# Iniciar o Next.js diretamente
CMD ["/app/start.sh"] 