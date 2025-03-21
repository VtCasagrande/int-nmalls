import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type DeliveryDocument = Delivery & Document;

export enum DeliveryStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  RETURNED = 'returned',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  CASH = 'cash',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PIX = 'pix',
  BANK_TRANSFER = 'bank_transfer',
  ALREADY_PAID = 'already_paid',
}

@Schema()
export class DeliveryItem {
  @ApiProperty({ description: 'Nome do produto' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: 'Quantidade' })
  @Prop({ required: true, min: 1 })
  quantity: number;

  @ApiProperty({ description: 'Preço unitário' })
  @Prop({ required: true, min: 0 })
  price: number;

  @ApiProperty({ description: 'SKU ou código do produto' })
  @Prop()
  sku?: string;

  @ApiProperty({ description: 'Observações sobre o item' })
  @Prop()
  notes?: string;
}

export const DeliveryItemSchema = SchemaFactory.createForClass(DeliveryItem);

@Schema()
export class DeliverySignature {
  @ApiProperty({ description: 'Base64 da assinatura' })
  @Prop({ required: true })
  signature: string;

  @ApiProperty({ description: 'Nome de quem recebeu' })
  @Prop({ required: true })
  receiverName: string;

  @ApiProperty({ description: 'Documento de quem recebeu' })
  @Prop()
  receiverDocument?: string;

  @ApiProperty({ description: 'Data e hora da assinatura' })
  @Prop({ required: true, default: Date.now })
  signatureDate: Date;

  @ApiProperty({ description: 'Observações sobre a entrega' })
  @Prop()
  notes?: string;

  @ApiProperty({ description: 'Foto do comprovante (URL)' })
  @Prop()
  proofPhoto?: string;
}

export const DeliverySignatureSchema = SchemaFactory.createForClass(DeliverySignature);

@Schema({ timestamps: true })
export class Delivery {
  @ApiProperty({ description: 'Cliente relacionado à entrega' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer', required: true })
  customer: MongooseSchema.Types.ObjectId;

  @ApiProperty({ description: 'Entregador responsável' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  deliveryPerson?: MongooseSchema.Types.ObjectId;

  @ApiProperty({ enum: DeliveryStatus, description: 'Status da entrega' })
  @Prop({ 
    type: String, 
    enum: DeliveryStatus, 
    default: DeliveryStatus.PENDING 
  })
  status: DeliveryStatus;

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

  @ApiProperty({ description: 'Itens da entrega', type: [DeliveryItem] })
  @Prop({ type: [DeliveryItemSchema], default: [] })
  items: DeliveryItem[];

  @ApiProperty({ description: 'Data agendada para entrega' })
  @Prop()
  scheduledDate?: Date;

  @ApiProperty({ description: 'Data real da entrega' })
  @Prop()
  deliveredAt?: Date;

  @ApiProperty({ description: 'Valor total da entrega' })
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

  @ApiProperty({ description: 'Pagamento já foi realizado?' })
  @Prop({ default: false })
  isPaid: boolean;

  @ApiProperty({ description: 'Observações para a entrega' })
  @Prop()
  notes?: string;

  @ApiProperty({ description: 'Número de identificação externa (pedido)' })
  @Prop()
  externalOrderNumber?: string;

  @ApiProperty({ description: 'Assinatura de recebimento' })
  @Prop({ type: DeliverySignatureSchema })
  signature?: DeliverySignature;

  @ApiProperty({ description: 'Histórico de status', type: [Object] })
  @Prop({ type: [{ status: String, date: Date, by: String }], default: [] })
  statusHistory: { status: string; date: Date; by: string }[];

  @ApiProperty({ description: 'Coordenadas de última localização' })
  @Prop({ type: { lat: Number, lng: Number } })
  lastLocation?: { lat: number; lng: number };

  @ApiProperty({ description: 'ID da recorrência (se aplicável)' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Recurrency' })
  recurrencyId?: MongooseSchema.Types.ObjectId;
}

export const DeliverySchema = SchemaFactory.createForClass(Delivery); 