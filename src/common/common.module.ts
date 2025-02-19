import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerStorage } from '@nestjs/throttler';
import { RedisThrottleStorage } from '../config/redis-storage.service';

@Module({
  imports: [ConfigModule],
  providers: [
    RedisThrottleStorage,
    {
      provide: ThrottlerStorage,
      useClass: RedisThrottleStorage,
    }
  ],
  exports: [ConfigModule, RedisThrottleStorage]
})
export class CommonModule {} 