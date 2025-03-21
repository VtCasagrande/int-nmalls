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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { CreateAddressDto } from './dto/create-customer.dto';

@ApiTags('customers')
@Controller('customers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: 'customers', action: 'create' })
  @ApiOperation({ summary: 'Criar um novo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 409, description: 'E-mail/CPF/CNPJ já em uso.' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: 'customers', action: 'read' })
  @ApiOperation({ summary: 'Listar todos os clientes' })
  @ApiResponse({ status: 200, description: 'Lista de clientes retornada com sucesso.' })
  @ApiQuery({ name: 'name', required: false, description: 'Filtrar por nome' })
  @ApiQuery({ name: 'email', required: false, description: 'Filtrar por email' })
  @ApiQuery({ name: 'phone', required: false, description: 'Filtrar por telefone' })
  @ApiQuery({ name: 'type', required: false, description: 'Filtrar por tipo de cliente' })
  @ApiQuery({ name: 'cpf', required: false, description: 'Filtrar por CPF' })
  @ApiQuery({ name: 'cnpj', required: false, description: 'Filtrar por CNPJ' })
  @ApiQuery({ name: 'isActive', required: false, description: 'Filtrar por status' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limite de resultados' })
  @ApiQuery({ name: 'skip', required: false, description: 'Pular N resultados' })
  findAll(@Query() query) {
    return this.customersService.findAll(query);
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: 'customers', action: 'read' })
  @ApiOperation({ summary: 'Buscar cliente por ID' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado.' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado.' })
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Put(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: 'customers', action: 'update' })
  @ApiOperation({ summary: 'Atualizar cliente' })
  @ApiResponse({ status: 200, description: 'Cliente atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado.' })
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: 'customers', action: 'delete' })
  @ApiOperation({ summary: 'Remover cliente' })
  @ApiResponse({ status: 200, description: 'Cliente removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado.' })
  remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }

  @Post(':id/addresses')
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: 'customers', action: 'update' })
  @ApiOperation({ summary: 'Adicionar endereço ao cliente' })
  @ApiResponse({ status: 201, description: 'Endereço adicionado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado.' })
  @HttpCode(HttpStatus.CREATED)
  addAddress(@Param('id') id: string, @Body() addressData: CreateAddressDto) {
    return this.customersService.addAddress(id, addressData);
  }

  @Put(':id/addresses/:addressId')
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: 'customers', action: 'update' })
  @ApiOperation({ summary: 'Atualizar endereço do cliente' })
  @ApiResponse({ status: 200, description: 'Endereço atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Cliente ou endereço não encontrado.' })
  updateAddress(
    @Param('id') id: string,
    @Param('addressId') addressId: string,
    @Body() addressData: CreateAddressDto,
  ) {
    return this.customersService.updateAddress(id, addressId, addressData);
  }

  @Delete(':id/addresses/:addressId')
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: 'customers', action: 'update' })
  @ApiOperation({ summary: 'Remover endereço do cliente' })
  @ApiResponse({ status: 200, description: 'Endereço removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Cliente ou endereço não encontrado.' })
  removeAddress(@Param('id') id: string, @Param('addressId') addressId: string) {
    return this.customersService.removeAddress(id, addressId);
  }
} 