import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeliveriesService } from './deliveries.service';
import { DeliveriesController } from './deliveries.controller';
import { Delivery, DeliverySchema } from './schemas/delivery.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Delivery.name, schema: DeliverySchema }
    ]),
  ],
  controllers: [DeliveriesController],
  providers: [DeliveriesService],
  exports: [DeliveriesService],
})
export class DeliveriesModule {} 