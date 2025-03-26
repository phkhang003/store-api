import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';

@Injectable()
export class RateLimitGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    return req.headers['x-api-key'] || req.ip;
  }

  protected async handleRequest(requestProps: {
    context: ExecutionContext;
    limit: number;
    ttl: number;
  }): Promise<boolean> {
    const { context, limit, ttl } = requestProps;
    const req = context.switchToHttp().getRequest();
    const tracker = await this.getTracker(req);
    const key = this.generateKey(context, tracker, 'api-endpoint');

    const stored = await this.storageService.increment(
      key,
      ttl,
      limit,
      0,
      'api-endpoint'
    );

    if (stored.totalHits > limit) {
      throw new ThrottlerException();
    }

    return true;
  }
} 