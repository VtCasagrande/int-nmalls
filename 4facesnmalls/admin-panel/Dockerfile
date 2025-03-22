FROM node:20-alpine

WORKDIR /app

# Instalar nginx para funcionar como proxy
RUN apk add --no-cache nginx

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

# Configuração do Nginx
RUN echo 'server {\n\
    listen 80;\n\
    server_name _;\n\
    \n\
    location / {\n\
        proxy_pass http://localhost:3001;\n\
        proxy_http_version 1.1;\n\
        proxy_set_header Upgrade $http_upgrade;\n\
        proxy_set_header Connection "upgrade";\n\
        proxy_set_header Host $host;\n\
        proxy_set_header X-Real-IP $remote_addr;\n\
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n\
        proxy_set_header X-Forwarded-Proto $scheme;\n\
    }\n\
}' > /etc/nginx/http.d/default.conf

# Criar script de inicialização
RUN echo '#!/bin/sh\n\
echo "Iniciando servidor Next.js..."\n\
npm run dev -- -H 0.0.0.0 &\n\
\n\
echo "Iniciando Nginx..."\n\
nginx -g "daemon off;" &\n\
\n\
# Esperar 10 segundos para o Next.js iniciar\n\
sleep 10\n\
\n\
# Executar healthcheck\n\
echo "Verificando se o servidor está acessível..."\n\
node health-check.js\n\
\n\
# Manter o container rodando\n\
wait\n\
' > /app/start-services.sh && chmod +x /app/start-services.sh

# Expor porta 80 para Nginx
EXPOSE 80

# Iniciar os serviços
CMD ["/app/start-services.sh"] 