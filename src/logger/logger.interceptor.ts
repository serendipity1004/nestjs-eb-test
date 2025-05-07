import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Inject,
    LoggerService,
  } from '@nestjs/common';
  import { Observable, tap } from 'rxjs';
  import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
  
  @Injectable()
  export class LoggingInterceptor implements NestInterceptor {
    constructor(
      @Inject(WINSTON_MODULE_NEST_PROVIDER)
      private readonly logger: LoggerService,
    ) {}
  
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const req = context.switchToHttp().getRequest();
      const { method, originalUrl } = req;

      const now = Date.now();
  
      return next.handle().pipe(
        tap((responseData) => {
          const res = context.switchToHttp().getResponse();
          const statusCode = res.statusCode;
  
          this.logger.verbose(
            `[${method}] ${originalUrl} → ${statusCode} +${Date.now() - now}ms`,
          );
        }),
      );
    }
  }
  