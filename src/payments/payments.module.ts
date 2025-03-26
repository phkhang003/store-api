import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PaymentLoggingInterceptor } from './interceptors/payment-logging.interceptor';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema }
    ]),
    EventEmitterModule.forRoot(),
    ConfigModule,
    forwardRef(() => OrdersModule),
  ],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: PaymentLoggingInterceptor,
    },
  ],
  exports: [PaymentsService]
})
export class PaymentsModule {}