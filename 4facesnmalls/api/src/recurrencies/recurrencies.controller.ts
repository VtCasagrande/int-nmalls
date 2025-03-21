import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
  Request,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RecurrenciesService } from './recurrencies.service';
import { CreateRecurrencyDto } from './dto/create-recurrency.dto';
import { UpdateRecurrencyDto } from './dto/update-recurrency.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@ApiTags('recurrencies')
@Controller('recurrencies')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RecurrenciesController {
  constructor(private readonly recurrenciesService: RecurrenciesService) {}

  @Post()
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: 'recurrencies', action: 'create' })
  @ApiOperation({ summary: 'Criar uma nova recorrência' })
  @ApiResponse({ status: 201, description: 'Recorrência criada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createRecurrencyDto: CreateRecurrencyDto) {
    return this.recurrenciesService.create(createRecurrencyDto);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: 'recurrencies', action: 'read' })
  @ApiOperation({ summary: 'Listar todas as recorrências' })
  @ApiResponse({ status: 200, description: 'Lista de recorrências retornada com sucesso.' })
  @ApiQuery({ name: 'status', required: false, description: 'Filtrar por status' })
  @ApiQuery({ name: 'frequency', required: false, description: 'Filtrar por frequência' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limite de resultados' })
  @ApiQuery({ name: 'skip', required: false, description: 'Pular N resultados' })
  findAll(@Query() query) {
    return this.recurrenciesService.findAll(query);
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: 'recurrencies', action: 'read' })
  @ApiOperation({ summary: 'Buscar recorrência por ID' })
  @ApiResponse({ status: 200, description: 'Recorrência encontrada.' })
  @ApiResponse({ status: 404, description: 'Recorrência não encontrada.' })
  findOne(@Param('id') id: string) {
    return this.recurrenciesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: 'recurrencies', action: 'update' })
  @ApiOperation({ summary: 'Atualizar recorrência' })
  @ApiResponse({ status: 200, description: 'Recorrência atualizada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Recorrência não encontrada.' })
  update(@Param('id') id: string, @Body() updateRecurrencyDto: UpdateRecurrencyDto) {
    return this.recurrenciesService.update(id, updateRecurrencyDto);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: 'recurrencies', action: 'delete' })
  @ApiOperation({ summary: 'Remover recorrência' })
  @ApiResponse({ status: 200, description: 'Recorrência removida com sucesso.' })
  @ApiResponse({ status: 404, description: 'Recorrência não encontrada.' })
  remove(@Param('id') id: string) {
    return this.recurrenciesService.remove(id);
  }

  @Get('by-customer/:customerId')
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: 'recurrencies', action: 'read' })
  @ApiOperation({ summary: 'Listar recorrências de um cliente' })
  @ApiResponse({ status: 200, description: 'Lista de recorrências retornada com sucesso.' })
  getCustomerRecurrencies(@Param('customerId') customerId: string, @Query() query) {
    return this.recurrenciesService.getCustomerRecurrencies(customerId, query);
  }

  @Patch(':id/pause')
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: 'recurrencies', action: 'update' })
  @ApiOperation({ summary: 'Pausar recorrência' })
  @ApiResponse({ status: 200, description: 'Recorrência pausada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Recorrência não encontrada.' })
  pauseRecurrency(@Param('id') id: string) {
    return this.recurrenciesService.pauseRecurrency(id);
  }

  @Patch(':id/activate')
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: 'recurrencies', action: 'update' })
  @ApiOperation({ summary: 'Ativar recorrência' })
  @ApiResponse({ status: 200, description: 'Recorrência ativada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Recorrência não encontrada.' })
  activateRecurrency(@Param('id') id: string) {
    return this.recurrenciesService.activateRecurrency(id);
  }

  @Patch(':id/cancel')
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: 'recurrencies', action: 'update' })
  @ApiOperation({ summary: 'Cancelar recorrência' })
  @ApiResponse({ status: 200, description: 'Recorrência cancelada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Recorrência não encontrada.' })
  cancelRecurrency(@Param('id') id: string) {
    return this.recurrenciesService.cancelRecurrency(id);
  }

  @Post(':id/generate-delivery')
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: 'recurrencies', action: 'update' })
  @ApiOperation({ summary: 'Gerar entrega a partir de recorrência' })
  @ApiResponse({ status: 200, description: 'Entrega gerada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Recorrência não está ativa.' })
  @ApiResponse({ status: 404, description: 'Recorrência não encontrada.' })
  generateDelivery(@Param('id') id: string, @Request() req) {
    return this.recurrenciesService.generateDelivery(id, req.user.userId);
  }

  @Post('process-due-today')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Processar recorrências programadas para hoje' })
  @ApiResponse({ status: 200, description: 'Recorrências processadas com sucesso.' })
  processDueToday(@Request() req) {
    return this.recurrenciesService.processRecurrenciesDueToday(req.user.userId);
  }
} 