import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, user } = request;
    const userEmail = user?.email;

    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: (data) => {
          this.logger.log(
            `${method} ${url} ${userEmail ? `[${userEmail}]` : ''} ${Date.now() - now}ms`,
            { body, response: data }
          );
        },
        error: (error) => {
          this.logger.error(
            `${method} ${url} ${userEmail ? `[${userEmail}]` : ''} ${Date.now() - now}ms`,
            { body, error: error.message }
          );
        },
      }),
    );
  }
} 