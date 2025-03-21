import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ProductDocument = Product & Document;

export enum ProductUnit {
  UNIT = 'unit',
  KG = 'kg',
  GRAM = 'gram',
  LITER = 'liter',
  ML = 'ml',
  BOX = 'box',
  PACKAGE = 'package',
}

@Schema()
export class ProductImage {
  @ApiProperty({ description: 'URL da imagem' })
  @Prop({ required: true })
  url: string;

  @ApiProperty({ description: 'É a imagem principal?' })
  @Prop({ default: false })
  isMain: boolean;

  @ApiProperty({ description: 'Nome do arquivo original' })
  @Prop()
  filename?: string;

  @ApiProperty({ description: 'Ordem de exibição' })
  @Prop({ default: 0 })
  order: number;
}

export const ProductImageSchema = SchemaFactory.createForClass(ProductImage);

@Schema({ timestamps: true })
export class Product {
  @ApiProperty({ description: 'Nome do produto' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: 'Descrição do produto' })
  @Prop()
  description?: string;

  @ApiProperty({ description: 'SKU (código) do produto' })
  @Prop({ unique: true, sparse: true })
  sku?: string;

  @ApiProperty({ description: 'Código de barras' })
  @Prop({ unique: true, sparse: true })
  barcode?: string;

  @ApiProperty({ description: 'Preço do produto' })
  @Prop({ required: true, min: 0 })
  price: number;

  @ApiProperty({ description: 'Preço promocional' })
  @Prop({ min: 0 })
  promotionalPrice?: number;

  @ApiProperty({ description: 'Preço de custo' })
  @Prop({ min: 0 })
  costPrice?: number;

  @ApiProperty({ description: 'Quantidade em estoque' })
  @Prop({ default: 0 })
  stockQuantity: number;

  @ApiProperty({ description: 'Estoque mínimo' })
  @Prop({ default: 0 })
  minStockQuantity: number;

  @ApiProperty({ enum: ProductUnit, description: 'Unidade de medida' })
  @Prop({ 
    type: String, 
    enum: ProductUnit, 
    default: ProductUnit.UNIT 
  })
  unit: ProductUnit;

  @ApiProperty({ description: 'Peso em gramas' })
  @Prop({ min: 0 })
  weight?: number;

  @ApiProperty({ description: 'Dimensões (cm): comprimento x largura x altura' })
  @Prop({ type: { length: Number, width: Number, height: Number } })
  dimensions?: { length: number; width: number; height: number };

  @ApiProperty({ description: 'Categorias do produto' })
  @Prop({ type: [String], default: [] })
  categories: string[];

  @ApiProperty({ description: 'Tags do produto' })
  @Prop({ type: [String], default: [] })
  tags: string[];

  @ApiProperty({ description: 'Imagens do produto', type: [ProductImage] })
  @Prop({ type: [ProductImageSchema], default: [] })
  images: ProductImage[];

  @ApiProperty({ description: 'Produto ativo?' })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Destaque/produto em promoção?' })
  @Prop({ default: false })
  isFeatured: boolean;

  @ApiProperty({ description: 'Data de início da promoção' })
  @Prop()
  promotionStartDate?: Date;

  @ApiProperty({ description: 'Data de fim da promoção' })
  @Prop()
  promotionEndDate?: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product); 