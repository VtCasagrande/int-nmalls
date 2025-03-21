import { PartialType } from '@nestjs/swagger';
import { CreateRecurrencyDto } from './create-recurrency.dto';

export class UpdateRecurrencyDto extends PartialType(CreateRecurrencyDto) {} 