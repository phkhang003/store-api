import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(err => {
        if (err instanceof HttpException) {
          return throwError(() => err);
        }
        return throwError(() => new HttpException(
          'Đã xảy ra lỗi, vui lòng thử lại sau',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ));
      }),
    );
  }
} 