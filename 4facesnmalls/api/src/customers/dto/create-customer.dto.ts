import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
  IsBoolean,
  IsDate,
  ValidateNested,
  IsArray,
  IsISO8601,
} from 'class-validator';
import { CustomerType } from '../schemas/customer.schema';

export class CreateAddressDto {
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

  @ApiProperty({ description: 'É o endereço principal?', required: false })
  @IsBoolean()
  @IsOptional()
  isMain?: boolean;
}

export class CreateCustomerDto {
  @ApiProperty({ description: 'Nome do cliente' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'E-mail do cliente', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'Telefone principal' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: 'Telefone alternativo', required: false })
  @IsString()
  @IsOptional()
  alternativePhone?: string;

  @ApiProperty({
    enum: CustomerType,
    description: 'Tipo de cliente',
    default: CustomerType.INDIVIDUAL,
    required: false,
  })
  @IsEnum(CustomerType)
  @IsOptional()
  type?: CustomerType;

  @ApiProperty({ description: 'CPF (cliente pessoa física)', required: false })
  @IsString()
  @IsOptional()
  cpf?: string;

  @ApiProperty({ description: 'CNPJ (cliente pessoa jurídica)', required: false })
  @IsString()
  @IsOptional()
  cnpj?: string;

  @ApiProperty({
    description: 'Endereços do cliente',
    type: [CreateAddressDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAddressDto)
  @IsOptional()
  addresses?: CreateAddressDto[];

  @ApiProperty({ description: 'Observações', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ description: 'Data de nascimento', required: false })
  @IsISO8601()
  @IsOptional()
  birthDate?: string;
} 