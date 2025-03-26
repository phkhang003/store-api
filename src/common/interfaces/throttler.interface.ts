import { ExecutionContext } from '@nestjs/common';

export interface ThrottlerRequest {
  context: ExecutionContext;
  limit: number;
  ttl: number;
}

export interface ThrottlerStorageRecord {
  totalHits: number;
  timeToExpire: number;
  throttlerName: string;
} 