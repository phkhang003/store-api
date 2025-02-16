import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ThrottlerStorage } from '@nestjs/throttler';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';

interface StorageRecord {
  totalHits: number;
  timeToExpire: number;
  isBlocked: boolean;
  timeToBlockExpire: number;
}

@Injectable()
export class RedisThrottleStorage implements ThrottlerStorage, OnModuleDestroy {
  private redis: Redis;

  constructor(private configService: ConfigService) {
    const redisConfig = {
      host: this.configService.get('REDIS_HOST') || 'localhost',
      port: Number(this.configService.get('REDIS_PORT')) || 6379,
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      enableOfflineQueue: false,
      lazyConnect: true
    };

    this.redis = new Redis(redisConfig);

    this.redis.on('error', (error) => {
      console.error('Redis connection error:', error);
    });

    this.redis.on('connect', () => {
      console.log('Redis connected successfully');
    });
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }

  async increment(
    key: string, 
    ttl: number,
    limit: number,
    blockDuration: number,
    throttlerName: string
  ): Promise<StorageRecord> {
    try {
      const count = await this.redis.incr(key);
      if (count === 1) {
        await this.redis.expire(key, ttl);
      }
      const ttlRemaining = await this.redis.ttl(key);
      
      return {
        totalHits: count,
        timeToExpire: ttlRemaining,
        isBlocked: count > limit,
        timeToBlockExpire: blockDuration
      };
    } catch (error) {
      console.error('Redis increment error:', error);
      return {
        totalHits: 1,
        timeToExpire: ttl,
        isBlocked: false,
        timeToBlockExpire: blockDuration
      };
    }
  }

  async get(key: string): Promise<StorageRecord> {
    try {
      const [count, ttl] = await Promise.all([
        this.redis.get(key),
        this.redis.ttl(key),
      ]);
      
      return {
        totalHits: count ? Number(count) : 0,
        timeToExpire: ttl,
        isBlocked: false,
        timeToBlockExpire: 0
      };
    } catch (error) {
      console.error('Redis get error:', error);
      return {
        totalHits: 0,
        timeToExpire: 0,
        isBlocked: false,
        timeToBlockExpire: 0
      };
    }
  }
} 