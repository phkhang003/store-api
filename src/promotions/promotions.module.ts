import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PromotionsController } from './promotions.controller';
import { PromotionsService } from './promotions.service';
import { Promotion, PromotionSchema } from './schemas/promotion.schema';
import { PromotionUsage, PromotionUsageSchema } from './schemas/promotion-usage.schema';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Promotion.name, schema: PromotionSchema },
      { name: PromotionUsage.name, schema: PromotionUsageSchema }
    ]),
    forwardRef(() => OrdersModule)
  ],
  controllers: [PromotionsController],
  providers: [PromotionsService],
  exports: [PromotionsService]
})
export class PromotionsModule {} 