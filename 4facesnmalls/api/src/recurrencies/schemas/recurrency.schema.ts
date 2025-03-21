import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { DeliveryItem, DeliveryItemSchema } from '../../deliveries/schemas/delivery.schema';

export type RecurrencyDocument = Recurrency & Document;

export enum RecurrencyStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export enum RecurrencyFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  CUSTOM = 'custom',
}

export enum PaymentMethod {
  CASH = 'cash',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PIX = 'pix',
  BANK_TRANSFER = 'bank_transfer',
}

@Schema({ timestamps: true })
export class Recurrency {
  @ApiProperty({ description: 'Cliente relacionado à recorrência' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer', required: true })
  customer: MongooseSchema.Types.ObjectId;

  @ApiProperty({ description: 'Nome da recorrência' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ enum: RecurrencyStatus, description: 'Status da recorrência' })
  @Prop({ 
    type: String, 
    enum: RecurrencyStatus, 
    default: RecurrencyStatus.ACTIVE 
  })
  status: RecurrencyStatus;

  @ApiProperty({ enum: RecurrencyFrequency, description: 'Frequência da recorrência' })
  @Prop({ 
    type: String, 
    enum: RecurrencyFrequency, 
    required: true 
  })
  frequency: RecurrencyFrequency;

  @ApiProperty({ description: 'Dias específicos para entrega (aplicável para frequência customizada)' })
  @Prop({ type: [Number] })
  customDays?: number[];

  @ApiProperty({ description: 'Dia da semana para entregas semanais (0-6, onde 0=Domingo)' })
  @Prop({ min: 0, max: 6 })
  weekDay?: number;

  @ApiProperty({ description: 'Dia do mês para entregas mensais (1-31)' })
  @Prop({ min: 1, max: 31 })
  monthDay?: number;

  @ApiProperty({ description: 'Data de início da recorrência' })
  @Prop({ required: true })
  startDate: Date;

  @ApiProperty({ description: 'Data de término da recorrência (opcional)' })
  @Prop()
  endDate?: Date;

  @ApiProperty({ description: 'Próxima data de entrega' })
  @Prop()
  nextDeliveryDate?: Date;

  @ApiProperty({ description: 'Endereço de entrega' })
  @Prop({ required: true, type: Object })
  deliveryAddress: {
    zipCode: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    reference?: string;
  };

  @ApiProperty({ description: 'Itens da recorrência', type: [DeliveryItem] })
  @Prop({ type: [DeliveryItemSchema], default: [] })
  items: DeliveryItem[];

  @ApiProperty({ description: 'Valor total da recorrência' })
  @Prop({ min: 0, default: 0 })
  totalValue: number;

  @ApiProperty({ description: 'Taxa de entrega' })
  @Prop({ min: 0, default: 0 })
  deliveryFee: number;

  @ApiProperty({ enum: PaymentMethod, description: 'Método de pagamento' })
  @Prop({ 
    type: String, 
    enum: PaymentMethod,
    default: PaymentMethod.CASH
  })
  paymentMethod: PaymentMethod;

  @ApiProperty({ description: 'Observações para a recorrência' })
  @Prop()
  notes?: string;

  @ApiProperty({ description: 'Número total de entregas realizadas' })
  @Prop({ default: 0 })
  deliveriesCount: number;

  @ApiProperty({ description: 'Histórico de entregas (IDs)' })
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Delivery' }], default: [] })
  deliveries: MongooseSchema.Types.ObjectId[];

  @ApiProperty({ description: 'Notificar cliente antes da entrega?' })
  @Prop({ default: true })
  notifyCustomer: boolean;

  @ApiProperty({ description: 'Antecedência da notificação (horas)' })
  @Prop({ default: 24 })
  notificationHours: number;
}

export const RecurrencySchema = SchemaFactory.createForClass(Recurrency); 