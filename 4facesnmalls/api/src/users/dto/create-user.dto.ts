import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../schemas/user.schema';

export class CreateUserDto {
  @ApiProperty({ description: 'Nome do usuário' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'E-mail do usuário' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Senha do usuário', minLength: 6 })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: UserRole, description: 'Papel do usuário no sistema' })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiProperty({ description: 'Permissões do usuário', type: 'object', required: false })
  @IsOptional()
  permissions?: Record<string, string[]>;

  @ApiProperty({ description: 'Número de telefone', required: false })
  @IsString()
  @IsOptional()
  phone?: string;
} 