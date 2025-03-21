import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  ValidateNested,
  IsArray,
  IsMongoId,
  Min,
  IsISO8601,
  IsObject,
  Max,
  ArrayMinSize,
} from 'class-validator';
import { RecurrencyFrequency, RecurrencyStatus, PaymentMethod } from '../schemas/recurrency.schema';
import { CreateDeliveryItemDto, CreateDeliveryAddressDto } from '../../deliveries/dto/create-delivery.dto';

export class CreateRecurrencyDto {
  @ApiProperty({ description: 'ID do cliente' })
  @IsMongoId()
  @IsNotEmpty()
  customer: string;

  @ApiProperty({ description: 'Nome da recorrência' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: RecurrencyStatus, description: 'Status da recorrência', required: false })
  @IsEnum(RecurrencyStatus)
  @IsOptional()
  status?: RecurrencyStatus;

  @ApiProperty({ enum: RecurrencyFrequency, description: 'Frequência da recorrência' })
  @IsEnum(RecurrencyFrequency)
  @IsNotEmpty()
  frequency: RecurrencyFrequency;

  @ApiProperty({ description: 'Dias específicos para entrega (para frequência customizada)', required: false, type: [Number] })
  @IsArray()
  @IsOptional()
  customDays?: number[];

  @ApiProperty({ description: 'Dia da semana para entregas semanais (0-6, onde 0=Domingo)', required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(6)
  weekDay?: number;

  @ApiProperty({ description: 'Dia do mês para entregas mensais (1-31)', required: false })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(31)
  monthDay?: number;

  @ApiProperty({ description: 'Data de início da recorrência' })
  @IsISO8601()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ description: 'Data de término da recorrência (opcional)', required: false })
  @IsISO8601()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ description: 'Endereço de entrega' })
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateDeliveryAddressDto)
  deliveryAddress: CreateDeliveryAddressDto;

  @ApiProperty({ description: 'Itens da recorrência', type: [CreateDeliveryItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateDeliveryItemDto)
  items: CreateDeliveryItemDto[];

  @ApiProperty({ description: 'Valor total da recorrência', required: false })
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

  @ApiProperty({ description: 'Observações para a recorrência', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ description: 'Notificar cliente antes da entrega?', required: false })
  @IsBoolean()
  @IsOptional()
  notifyCustomer?: boolean;

  @ApiProperty({ description: 'Antecedência da notificação (horas)', required: false })
  @IsNumber()
  @Min(1)
  @IsOptional()
  notificationHours?: number;
} 