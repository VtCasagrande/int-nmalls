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

# Criar uma versão modificada do arquivo com o problema
RUN cat > fix-schema.js << 'EOF'
const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'src/users/schemas/user.schema.ts');
let content = fs.readFileSync(schemaPath, 'utf8');

// Substituir o decorador problemático
content = content.replace(
  /@ApiProperty\(\{ description: ['"]Permissões do usuário['"], type: ['"]object['"] \}\)/g,
  '@ApiProperty({ description: \'Permissões do usuário\', type: \'object\', additionalProperties: true })'
);

fs.writeFileSync(schemaPath, content);
console.log('Schema file updated successfully!');
EOF

# Executar o script para corrigir o schema
RUN node fix-schema.js

# Criar um script de inicialização em um local específico
RUN echo '#!/bin/sh' > /usr/local/bin/start-app.sh && \
    echo 'export TS_NODE_TRANSPILE_ONLY=true' >> /usr/local/bin/start-app.sh && \
    echo 'exec npx ts-node -r tsconfig-paths/register src/main.ts' >> /usr/local/bin/start-app.sh && \
    chmod +x /usr/local/bin/start-app.sh

# Expor porta
EXPOSE 3000

# Definir variáveis de ambiente
ENV NODE_ENV=production
ENV TS_NODE_TRANSPILE_ONLY=true

# Comando para iniciar a aplicação com o script
CMD ["sh", "/usr/local/bin/start-app.sh"]