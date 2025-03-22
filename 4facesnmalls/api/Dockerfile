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
RUN cat > src/users/schemas/user.schema.ts << 'EOL'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  DELIVERY = 'delivery',
}

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @ApiProperty({ description: 'Nome do usuário' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: 'E-mail do usuário' })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({ description: 'Senha do usuário (hash)' })
  @Prop({ required: true })
  password: string;

  @ApiProperty({ enum: UserRole, description: 'Papel do usuário no sistema' })
  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @ApiProperty({ description: 'Permissões do usuário', type: 'object', additionalProperties: true })
  @Prop({ type: Object, default: {} })
  permissions: Record<string, string[]>;
  
  @ApiProperty({ description: 'Status do usuário (ativo/inativo)' })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Número de telefone' })
  @Prop()
  phone?: string;
  
  @ApiProperty({ description: 'Último login do usuário' })
  @Prop()
  lastLogin?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
EOL

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