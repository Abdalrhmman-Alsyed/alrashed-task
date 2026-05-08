import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class HttpInterceptor<T> implements NestInterceptor<
  T,
  { success: boolean; message: string; data: T }
> {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<{ success: boolean; message: string; data: T }> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        message: 'Request successful',
        data,
      })),
    );
  }
}
