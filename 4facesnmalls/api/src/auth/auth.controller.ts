import { Controller, Post, UseGuards, Request, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Autenticar usuário' })
  @ApiResponse({ status: 200, description: 'Autenticação bem-sucedida.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'usuario@example.com' },
        password: { type: 'string', example: 'senha123' },
      },
      required: ['email', 'password'],
    },
  })
  @HttpCode(HttpStatus.OK)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Atualizar token de acesso' })
  @ApiResponse({ status: 200, description: 'Token atualizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Token de atualização inválido.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: { type: 'string' },
      },
      required: ['refreshToken'],
    },
  })
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }
} 