import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerStorage } from '@nestjs/throttler';
import { PermissionGuard } from './auth/guards/permission.guard';
import { RedisThrottleStorage } from './config/redis-storage.service';
import { CommonModule } from './common/common.module';
import { SecurityModule } from './security/security.module';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { InventoryModule } from './inventory/inventory.module';
import { PromotionsModule } from './promotions/promotions.module';
import { ReviewsModule } from './reviews/reviews.module';
import { PaymentsModule } from './payments/payments.module';
import { BrandsModule } from './brands/brands.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ([{
        ttl: 60,
        limit: configService.get('NODE_ENV') === 'production' ? 10 : 100,
      }]),
      inject: [ConfigService],
    }),
    SecurityModule,
    UsersModule,
    AuthModule,
    AdminModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    InventoryModule,
    PromotionsModule,
    ReviewsModule,
    PaymentsModule,
    BrandsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
    {
      provide: ThrottlerStorage,
      useClass: RedisThrottleStorage,
    }
  ],
})
export class AppModule {}
