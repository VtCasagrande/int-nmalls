FROM node:20-alpine

WORKDIR /app

# Instalar ferramentas de diagnóstico e nginx
RUN apk add --no-cache nginx curl iputils busybox-extras

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

# Configuração do Nginx - configuração mais simples e direta
RUN echo 'server {\n\
    listen 80 default_server;\n\
    server_name _;\n\
    \n\
    access_log /var/log/nginx/access.log;\n\
    error_log /var/log/nginx/error.log;\n\
    \n\
    location / {\n\
        proxy_pass http://127.0.0.1:3001;\n\
        proxy_http_version 1.1;\n\
        proxy_set_header Upgrade $http_upgrade;\n\
        proxy_set_header Connection "upgrade";\n\
        proxy_set_header Host $host;\n\
        proxy_set_header X-Real-IP $remote_addr;\n\
        proxy_read_timeout 300s;\n\
        proxy_connect_timeout 75s;\n\
    }\n\
}' > /etc/nginx/http.d/default.conf

# Criar diretórios de logs do Nginx
RUN mkdir -p /var/log/nginx && \
    touch /var/log/nginx/access.log && \
    touch /var/log/nginx/error.log

# Criar script de inicialização com verificações adicionais
RUN echo '#!/bin/sh\n\
# Verificar conectividade de rede\n\
echo "Verificando conectividade de rede..."\n\
ping -c 1 8.8.8.8 || echo "Sem conectividade externa!"\n\
ping -c 1 127.0.0.1 || echo "Loopback não está funcionando!"\n\
\n\
echo "Iniciando servidor Next.js..."\n\
npm run dev -- -H 0.0.0.0 &\n\
NEXT_PID=$!\n\
\n\
# Esperar o Next.js iniciar\n\
echo "Aguardando o Next.js inicializar..."\n\
sleep 8\n\
\n\
# Verificar se o Next.js está acessível\n\
echo "Verificando se o Next.js está acessível..."\n\
curl -v http://localhost:3001/ || echo "Não foi possível acessar o Next.js!"\n\
\n\
echo "Iniciando Nginx..."\n\
mkdir -p /run/nginx\n\
nginx &\n\
NGINX_PID=$!\n\
\n\
# Aguardar um pouco para o Nginx iniciar\n\
sleep 2\n\
\n\
# Verificar se o Nginx está rodando\n\
echo "Verificando o status do Nginx..."\n\
ps aux | grep nginx\n\
netstat -tulpn | grep 80 || echo "Nginx não está escutando na porta 80!"\n\
\n\
# Testar a conexão através do Nginx\n\
echo "Testando o proxy do Nginx..."\n\
curl -v http://localhost:80/ || echo "Não foi possível acessar o Nginx!"\n\
\n\
# Mostrar logs do Nginx periodicamente\n\
echo "Configuração completa. Mostrando logs do Nginx:"\n\
tail -f /var/log/nginx/error.log &\n\
\n\
# Esperar pelos processos em background\n\
wait $NEXT_PID\n\
' > /app/start.sh && chmod +x /app/start.sh

# Expor porta 80 para Nginx
EXPOSE 80

# Iniciar os serviços
CMD ["/app/start.sh"] 