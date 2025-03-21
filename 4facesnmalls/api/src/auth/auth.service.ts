import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      return null;
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (isPasswordValid) {
      // Separar a senha do objeto retornado por segurança
      const { password, ...result } = user.toObject();
      return result;
    }
    
    return null;
  }

  async login(user: any) {
    // Atualizar o último login do usuário
    await this.usersService.updateLastLogin(user._id);
    
    // Payload do token JWT
    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    };

    // Criar tokens de acesso e refresh
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(
      { sub: user._id },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
      },
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      // Verificar se o refresh token é válido
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      
      // Buscar o usuário pelo ID
      const user = await this.usersService.findById(payload.sub);
      
      // Criar um novo token de acesso
      const newPayload = {
        sub: user._id,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
      };
      
      return {
        accessToken: this.jwtService.sign(newPayload),
      };
    } catch (error) {
      throw new UnauthorizedException('Token de atualização inválido');
    }
  }
} 