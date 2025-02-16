import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../guards/api-key.guard';
import { RateLimitGuard } from '../guards/rate-limit.guard';
import { ApiHeader } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

export function ApiKeyAuth(options?: { limit?: number; ttl?: number }) {
  return applyDecorators(
    UseGuards(ApiKeyGuard, RateLimitGuard),
    Throttle({ default: { limit: options?.limit || 10, ttl: options?.ttl || 60 } }),
    ApiHeader({
      name: 'x-api-key',
      description: 'API key để xác thực',
      required: true,
    }),
  );
} 