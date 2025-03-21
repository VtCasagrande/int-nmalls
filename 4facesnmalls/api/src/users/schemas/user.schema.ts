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

  @ApiProperty({ description: 'Permissões do usuário', type: 'object' })
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