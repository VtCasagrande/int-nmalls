# Imagem base
FROM node:20-alpine

WORKDIR /app

# Copiar arquivos de definição de pacotes
COPY package*.json ./

# Instalar todas as dependências, incluindo devDependencies
RUN npm install

# Copiar código fonte
COPY . .

# Criar diretório para logs
RUN mkdir -p /app/logs

# Corrigir o arquivo user.schema.ts
RUN sed -i 's/@ApiProperty({ description: '\''Permissões do usuário'\'', type: '\''object'\'' })/@ApiProperty({ description: '\''Permissões do usuário'\'', type: '\''object'\'', additionalProperties: true })/' src/users/schemas/user.schema.ts

# Criar script de inicialização
RUN echo '#!/bin/sh\n\nTS_NODE_TRANSPILE_ONLY=true npx ts-node -r tsconfig-paths/register src/main.ts' > start.sh && chmod +x start.sh

# Expor porta
EXPOSE 3000

# Definir variáveis de ambiente
ENV NODE_ENV=production
ENV TS_NODE_TRANSPILE_ONLY=true

# Comando para iniciar a aplicação com ts-node em modo transpile-only
CMD ["./start.sh"]