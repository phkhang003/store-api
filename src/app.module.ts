import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerStorage } from '@nestjs/throttler';
import { PermissionGuard } from './auth/guards/permission.guard';
import { RedisThrottleStorage } from './config/redis-storage.service';
import { CommonModule } from './common/common.module';
import { SecurityModule } from './security/security.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { CartsModule } from './carts/carts.module';
import { OrdersModule } from './orders/orders.module';
import { BranchesModule } from './branches/branches.module';
import { VouchersModule } from './vouchers/vouchers.module';
import configuration from './config/configuration';
import { PaymentsModule } from './payments/payments.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI')
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot({
      throttlers: [{
        ttl: 60,
        limit: 10
      }]
    } as ThrottlerModuleOptions),
    SecurityModule,
    UsersModule,
    AuthModule,
    CommonModule,
    ProductsModule,
    CategoriesModule,
    CartsModule,
    OrdersModule,
    VouchersModule,
    BranchesModule,
    PaymentsModule,
    RouterModule.register([
      {
        path: 'api',
        module: AppModule,
      },
    ]),
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
