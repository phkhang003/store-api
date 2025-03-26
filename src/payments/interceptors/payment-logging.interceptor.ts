import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class PaymentLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('PaymentInterceptor');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, path, body } = request;

    return next.handle().pipe(
      tap({
        next: (data) => {
          this.logger.log(`Payment ${method} ${path} completed successfully`);
        },
        error: (error) => {
          this.logger.error(
            `Payment ${method} ${path} failed: ${error.message}`,
            error.stack
          );
        },
      }),
    );
  }
} 