import { 
  Controller, Get, Post, Body, Param, Put, Delete, 
  UseGuards, Query, HttpCode, HttpStatus
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserRole } from './schemas/user.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 409, description: 'E-mail já em uso.' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({ status: 200, description: 'Lista de usuários retornada com sucesso.' })
  @ApiBearerAuth()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ module: 'users', action: 'read' })
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  @ApiBearerAuth()
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ module: 'users', action: 'update' })
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<User>,
  ): Promise<User> {
    return this.usersService.update(id, updateData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Remover usuário' })
  @ApiResponse({ status: 200, description: 'Usuário removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  @ApiBearerAuth()
  async remove(@Param('id') id: string): Promise<User> {
    return this.usersService.remove(id);
  }
} 