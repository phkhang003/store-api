import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(RedisThrottleStorage.name);
  private isRedisConnected = false;

  constructor(private configService: ConfigService) {
    const redisConfig = {
      host: this.configService.get('REDIS_HOST'),
      port: Number(this.configService.get('REDIS_PORT')),
      password: this.configService.get('REDIS_PASSWORD'),
      username: this.configService.get('REDIS_USERNAME'),
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      enableReadyCheck: true,
      enableOfflineQueue: false,
      lazyConnect: true
    };

    // Chỉ khởi tạo Redis nếu có đủ thông tin config
    if (redisConfig.host && redisConfig.port) {
      this.initializeRedis(redisConfig);
    } else {
      this.logger.warn('Redis configuration is incomplete. Rate limiting will use in-memory storage.');
    }
  }

  private initializeRedis(config) {
    try {
      this.redis = new Redis(config);

      this.redis.on('error', (error) => {
        this.isRedisConnected = false;
        this.logger.error(`Redis connection error: ${error.message}`);
      });

      this.redis.on('connect', () => {
        this.isRedisConnected = true;
        this.logger.log('Redis connected successfully');
      });
    } catch (error) {
      this.logger.error(`Failed to initialize Redis: ${error.message}`);
    }
  }

  async increment(key: string, ttl: number): Promise<StorageRecord> {
    try {
      const multi = this.redis.multi();
      multi.incr(key);
      multi.expire(key, ttl);
      const results = await multi.exec();
      
      return {
        totalHits: results[0][1] as number,
        timeToExpire: ttl * 1000,
        isBlocked: false,
        timeToBlockExpire: 0
      };
    } catch (err) {
      this.logger.error(`Redis increment error: ${err.message}`);
      return {
        totalHits: 0,
        timeToExpire: 0,
        isBlocked: false,
        timeToBlockExpire: 0
      };
    }
  }

  async reset(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (err) {
      this.logger.error(`Redis reset error: ${err.message}`);
    }
  }

  async get(key: string): Promise<StorageRecord> {
    if (!this.isRedisConnected) {
      return null;
    }

    try {
      const value = await this.redis.get(key);
      if (!value) {
        return null;
      }

      const ttlRemaining = await this.redis.ttl(key);
      return {
        totalHits: parseInt(value, 10),
        timeToExpire: ttlRemaining,
        isBlocked: false,
        timeToBlockExpire: 0
      };
    } catch (error) {
      this.logger.error(`Redis get error: ${error.message}`);
      return null;
    }
  }

  async delete(key: string): Promise<boolean> {
    if (!this.isRedisConnected) {
      return false;
    }

    try {
      await this.redis.del(key);
      return true;
    } catch (error) {
      this.logger.error(`Redis delete error: ${error.message}`);
      return false;
    }
  }

  async onModuleDestroy() {
    if (this.redis && this.isRedisConnected) {
      await this.redis.quit();
      this.logger.log('Redis connection closed');
    }
  }
} 