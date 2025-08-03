import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Request...');

    const now = Date.now();

    return next
      .handle()
      .pipe(
        tap(() => console.log(`Response... ${Date.now() - now}ms`)),
      );
  }
}
