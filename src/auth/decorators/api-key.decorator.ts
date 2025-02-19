import { applyDecorators, UseGuards, SetMetadata } from '@nestjs/common';
import { ApiKeyGuard } from '../guards/api-key.guard';
import { RateLimitGuard } from '../guards/rate-limit.guard';
import { ApiHeader } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { UserRole } from '../enums/role.enum';

export function ApiKeyAuth(options?: { 
  limit?: number; 
  ttl?: number;
  roles?: UserRole[];
}) {
  return applyDecorators(
    SetMetadata('roles', options?.roles),
    UseGuards(ApiKeyGuard, RateLimitGuard),
    Throttle({ default: { limit: options?.limit || 10, ttl: options?.ttl || 60 } }),
    ApiHeader({
      name: 'x-api-key',
      description: 'API key để xác thực (chỉ dành cho admin)',
      required: true,
    }),
  );
} 