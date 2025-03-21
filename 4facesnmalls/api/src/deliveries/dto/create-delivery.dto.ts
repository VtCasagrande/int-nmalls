import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsDate,
  ValidateNested,
  IsArray,
  IsMongoId,
  Min,
  IsISO8601,
  IsObject,
} from 'class-validator';
import { DeliveryStatus, PaymentMethod } from '../schemas/delivery.schema';

export class CreateDeliveryAddressDto {
  @ApiProperty({ description: 'CEP' })
  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @ApiProperty({ description: 'Endereço' })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ description: 'Número' })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty({ description: 'Complemento', required: false })
  @IsString()
  @IsOptional()
  complement?: string;

  @ApiProperty({ description: 'Bairro' })
  @IsString()
  @IsNotEmpty()
  neighborhood: string;

  @ApiProperty({ description: 'Cidade' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'Estado' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ description: 'Referência', required: false })
  @IsString()
  @IsOptional()
  reference?: string;
}

export class CreateDeliveryItemDto {
  @ApiProperty({ description: 'Nome do produto' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Quantidade' })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'Preço unitário' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'SKU ou código do produto', required: false })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiProperty({ description: 'Observações sobre o item', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateDeliveryDto {
  @ApiProperty({ description: 'ID do cliente' })
  @IsMongoId()
  @IsNotEmpty()
  customer: string;

  @ApiProperty({ description: 'ID do entregador', required: false })
  @IsMongoId()
  @IsOptional()
  deliveryPerson?: string;

  @ApiProperty({ enum: DeliveryStatus, description: 'Status da entrega', required: false })
  @IsEnum(DeliveryStatus)
  @IsOptional()
  status?: DeliveryStatus;

  @ApiProperty({ description: 'Endereço de entrega' })
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateDeliveryAddressDto)
  deliveryAddress: CreateDeliveryAddressDto;

  @ApiProperty({ description: 'Itens da entrega', type: [CreateDeliveryItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDeliveryItemDto)
  items: CreateDeliveryItemDto[];

  @ApiProperty({ description: 'Data agendada para entrega', required: false })
  @IsISO8601()
  @IsOptional()
  scheduledDate?: string;

  @ApiProperty({ description: 'Valor total da entrega', required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalValue?: number;

  @ApiProperty({ description: 'Taxa de entrega', required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  deliveryFee?: number;

  @ApiProperty({ enum: PaymentMethod, description: 'Método de pagamento', required: false })
  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @ApiProperty({ description: 'Pagamento já foi realizado?', required: false })
  @IsBoolean()
  @IsOptional()
  isPaid?: boolean;

  @ApiProperty({ description: 'Observações para a entrega', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ description: 'Número de identificação externa (pedido)', required: false })
  @IsString()
  @IsOptional()
  externalOrderNumber?: string;

  @ApiProperty({ description: 'ID da recorrência (se aplicável)', required: false })
  @IsMongoId()
  @IsOptional()
  recurrencyId?: string;
} 