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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        uri: config.get('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    SecurityModule,
    UsersModule,
    AuthModule,
    AdminModule,
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 10,
    }])
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    }
  ],
})
export class AppModule {}
