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
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeliveriesService } from './deliveries.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { DeliverySignatureDto } from './dto/delivery-signature.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/schemas/user.schema';

@ApiTags('deliveries')
@Controller('deliveries')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Post()
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: 'deliveries', action: 'create' })
  @ApiOperation({ summary: 'Criar uma nova entrega' })
  @ApiResponse({ status: 201, description: 'Entrega criada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDeliveryDto: CreateDeliveryDto, @Request() req) {
    return this.deliveriesService.create(createDeliveryDto, req.user.userId);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: 'deliveries', action: 'read' })
  @ApiOperation({ summary: 'Listar todas as entregas' })
  @ApiResponse({ status: 200, description: 'Lista de entregas retornada com sucesso.' })
  @ApiQuery({ name: 'status', required: false, description: 'Filtrar por status' })
  @ApiQuery({ name: 'scheduledDate', required: false, description: 'Filtrar por data agendada (YYYY-MM-DD)' })
  @ApiQuery({ name: 'deliveredAt', required: false, description: 'Filtrar por data de entrega (YYYY-MM-DD)' })
  @ApiQuery({ name: 'externalOrderNumber', required: false, description: 'Filtrar por número de pedido externo' })
  @ApiQuery({ name: 'paymentMethod', required: false, description: 'Filtrar por método de pagamento' })
  @ApiQuery({ name: 'isPaid', required: false, description: 'Filtrar por status de pagamento' })
  @ApiQuery({ name: 'recurrencyId', required: false, description: 'Filtrar por ID de recorrência' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limite de resultados' })
  @ApiQuery({ name: 'skip', required: false, description: 'Pular N resultados' })
  findAll(@Query() query) {
    return this.deliveriesService.findAll(query);
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: 'deliveries', action: 'read' })
  @ApiOperation({ summary: 'Buscar entrega por ID' })
  @ApiResponse({ status: 200, description: 'Entrega encontrada.' })
  @ApiResponse({ status: 404, description: 'Entrega não encontrada.' })
  findOne(@Param('id') id: string) {
    return this.deliveriesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: 'deliveries', action: 'update' })
  @ApiOperation({ summary: 'Atualizar entrega' })
  @ApiResponse({ status: 200, description: 'Entrega atualizada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Entrega não encontrada.' })
  update(
    @Param('id') id: string,
    @Body() updateDeliveryDto: UpdateDeliveryDto,
    @Request() req,
  ) {
    return this.deliveriesService.update(id, updateDeliveryDto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: 'deliveries', action: 'delete' })
  @ApiOperation({ summary: 'Remover entrega' })
  @ApiResponse({ status: 200, description: 'Entrega removida com sucesso.' })
  @ApiResponse({ status: 404, description: 'Entrega não encontrada.' })
  remove(@Param('id') id: string) {
    return this.deliveriesService.remove(id);
  }

  @Post(':id/signature')
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: 'deliveries', action: 'update' })
  @ApiOperation({ summary: 'Adicionar assinatura de recebimento' })
  @ApiResponse({ status: 200, description: 'Assinatura adicionada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Entrega já finalizada.' })
  @ApiResponse({ status: 404, description: 'Entrega não encontrada.' })
  addSignature(
    @Param('id') id: string,
    @Body() signatureDto: DeliverySignatureDto,
    @Request() req,
  ) {
    return this.deliveriesService.addSignature(id, signatureDto, req.user.userId);
  }

  @Post(':id/location')
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: 'deliveries', action: 'update' })
  @ApiOperation({ summary: 'Atualizar localização da entrega' })
  @ApiResponse({ status: 200, description: 'Localização atualizada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Entrega não encontrada.' })
  updateLocation(
    @Param('id') id: string,
    @Body() locationData: { lat: number; lng: number },
    @Request() req,
  ) {
    return this.deliveriesService.updateLocation(id, locationData, req.user.userId);
  }

  @Post(':id/assign/:deliveryPersonId')
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: 'deliveries', action: 'update' })
  @ApiOperation({ summary: 'Atribuir entregador à entrega' })
  @ApiResponse({ status: 200, description: 'Entregador atribuído com sucesso.' })
  @ApiResponse({ status: 404, description: 'Entrega não encontrada.' })
  assignDeliveryPerson(
    @Param('id') id: string,
    @Param('deliveryPersonId') deliveryPersonId: string,
    @Request() req,
  ) {
    return this.deliveriesService.assignDeliveryPerson(id, deliveryPersonId, req.user.userId);
  }

  @Get('by-delivery-person/:deliveryPersonId')
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: 'deliveries', action: 'read' })
  @ApiOperation({ summary: 'Listar entregas de um entregador' })
  @ApiResponse({ status: 200, description: 'Lista de entregas retornada com sucesso.' })
  getDeliveryPersonDeliveries(
    @Param('deliveryPersonId') deliveryPersonId: string,
    @Query() query,
  ) {
    return this.deliveriesService.getDeliveryPerson(deliveryPersonId, query);
  }

  @Get('by-customer/:customerId')
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: 'deliveries', action: 'read' })
  @ApiOperation({ summary: 'Listar entregas de um cliente' })
  @ApiResponse({ status: 200, description: 'Lista de entregas retornada com sucesso.' })
  getCustomerDeliveries(@Param('customerId') customerId: string, @Query() query) {
    return this.deliveriesService.getCustomerDeliveries(customerId, query);
  }

  // Endpoints específicos para o app de entregadores
  @Get('my-deliveries')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DELIVERY)
  @ApiOperation({ summary: 'Listar entregas do entregador logado' })
  @ApiResponse({ status: 200, description: 'Lista de entregas retornada com sucesso.' })
  getMyDeliveries(@Request() req, @Query() query) {
    return this.deliveriesService.getDeliveryPerson(req.user.userId, query);
  }
} 