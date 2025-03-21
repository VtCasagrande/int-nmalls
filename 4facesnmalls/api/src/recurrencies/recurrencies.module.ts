import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecurrenciesService } from './recurrencies.service';
import { RecurrenciesController } from './recurrencies.controller';
import { Recurrency, RecurrencySchema } from './schemas/recurrency.schema';
import { DeliveriesModule } from '../deliveries/deliveries.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Recurrency.name, schema: RecurrencySchema }
    ]),
    DeliveriesModule,
  ],
  controllers: [RecurrenciesController],
  providers: [RecurrenciesService],
  exports: [RecurrenciesService],
})
export class RecurrenciesModule {} 