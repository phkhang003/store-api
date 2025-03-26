import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderTrackingController } from './order-tracking.controller';
import { OrderTrackingService } from './order-tracking.service';
import { OrderTracking, OrderTrackingSchema } from './schemas/order-tracking.schema';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrderTracking.name, schema: OrderTrackingSchema }
    ]),
    OrdersModule
  ],
  controllers: [OrderTrackingController],
  providers: [OrderTrackingService],
  exports: [OrderTrackingService]
})
export class OrderTrackingModule {} 