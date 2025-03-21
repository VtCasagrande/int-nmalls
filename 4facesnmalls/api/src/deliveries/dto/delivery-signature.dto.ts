import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DeliverySignatureDto {
  @ApiProperty({ description: 'Base64 da assinatura' })
  @IsString()
  @IsNotEmpty()
  signature: string;

  @ApiProperty({ description: 'Nome de quem recebeu' })
  @IsString()
  @IsNotEmpty()
  receiverName: string;

  @ApiProperty({ description: 'Documento de quem recebeu', required: false })
  @IsString()
  @IsOptional()
  receiverDocument?: string;

  @ApiProperty({ description: 'Observações sobre a entrega', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ description: 'Foto do comprovante (URL)', required: false })
  @IsString()
  @IsOptional()
  proofPhoto?: string;
} 