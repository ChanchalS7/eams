@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    return next.handle();
  }
}
