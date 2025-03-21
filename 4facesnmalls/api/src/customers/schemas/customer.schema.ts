import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type CustomerDocument = Customer & Document;

export enum CustomerType {
  INDIVIDUAL = 'individual',
  COMPANY = 'company',
}

@Schema({ timestamps: true })
export class Address {
  @ApiProperty({ description: 'CEP' })
  @Prop({ required: true })
  zipCode: string;

  @ApiProperty({ description: 'Endereço' })
  @Prop({ required: true })
  street: string;

  @ApiProperty({ description: 'Número' })
  @Prop({ required: true })
  number: string;

  @ApiProperty({ description: 'Complemento' })
  @Prop()
  complement?: string;

  @ApiProperty({ description: 'Bairro' })
  @Prop({ required: true })
  neighborhood: string;

  @ApiProperty({ description: 'Cidade' })
  @Prop({ required: true })
  city: string;

  @ApiProperty({ description: 'Estado' })
  @Prop({ required: true })
  state: string;

  @ApiProperty({ description: 'Referência' })
  @Prop()
  reference?: string;

  @ApiProperty({ description: 'É o endereço principal?' })
  @Prop({ default: false })
  isMain: boolean;
}

export const AddressSchema = SchemaFactory.createForClass(Address);

@Schema({ timestamps: true })
export class Customer {
  @ApiProperty({ description: 'Nome do cliente' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: 'E-mail do cliente' })
  @Prop({ unique: true, sparse: true })
  email?: string;

  @ApiProperty({ description: 'Telefone principal' })
  @Prop({ required: true })
  phone: string;

  @ApiProperty({ description: 'Telefone alternativo' })
  @Prop()
  alternativePhone?: string;

  @ApiProperty({ enum: CustomerType, description: 'Tipo de cliente' })
  @Prop({ 
    type: String, 
    enum: CustomerType, 
    default: CustomerType.INDIVIDUAL 
  })
  type: CustomerType;

  @ApiProperty({ description: 'CPF (cliente pessoa física)' })
  @Prop()
  cpf?: string;

  @ApiProperty({ description: 'CNPJ (cliente pessoa jurídica)' })
  @Prop()
  cnpj?: string;

  @ApiProperty({ description: 'Endereços do cliente', type: [Address] })
  @Prop({ type: [AddressSchema], default: [] })
  addresses: Address[];

  @ApiProperty({ description: 'Cliente ativo?' })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Observações' })
  @Prop()
  notes?: string;

  @ApiProperty({ description: 'Data de nascimento' })
  @Prop()
  birthDate?: Date;

  @ApiProperty({ description: 'Histórico de compras/entregas (referência para outras collections)' })
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Delivery' }], default: [] })
  deliveries: MongooseSchema.Types.ObjectId[];
}

export const CustomerSchema = SchemaFactory.createForClass(Customer); 