import { applyDecorators, UseGuards, SetMetadata } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';
import { ApiKeyGuard } from '../guards/api-key.guard';
import { RateLimitGuard } from '../guards/rate-limit.guard';
import { Throttle } from '@nestjs/throttler';
import { UserRole } from '../enums/role.enum';

export function ApiKeyAuth(options?: { 
  limit?: number; 
  ttlSeconds?: number;
  roles?: UserRole[];
}) {
  return applyDecorators(
    SetMetadata('roles', options?.roles),
    UseGuards(ApiKeyGuard, RateLimitGuard),
    Throttle({
      default: {
        ttl: options?.ttlSeconds || 60,
        limit: options?.limit || 10
      }
    }),
    ApiHeader({
      name: 'x-api-key',
      description: 'API key để xác thực (chỉ dành cho admin)',
      required: true
    })
  );
} 