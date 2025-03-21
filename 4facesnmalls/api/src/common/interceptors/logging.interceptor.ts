import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, user } = request;
    const userId = user ? user.userId : 'anonymous';
    const userRole = user ? user.role : 'none';
    
    const now = Date.now();
    const timestamp = new Date().toISOString();

    // Log da requisição
    this.logger.log(
      `[${timestamp}] ${userId} (${userRole}) - ${method} ${url}`,
    );

    // Dados sensíveis que não devem ser logados
    const sanitizedBody = { ...body };
    if (sanitizedBody.password) {
      sanitizedBody.password = '******';
    }

    // Log dos dados de entrada (exceto em produção)
    if (process.env.NODE_ENV !== 'production') {
      this.logger.debug(`Request Body: ${JSON.stringify(sanitizedBody)}`);
    }

    return next.handle().pipe(
      tap({
        next: (data) => {
          const response = context.switchToHttp().getResponse();
          
          // Resposta sanitizada para não logar dados sensíveis
          let sanitizedResponse = data;
          if (typeof data === 'object' && data !== null) {
            sanitizedResponse = { ...data };
            if (sanitizedResponse.accessToken) {
              sanitizedResponse.accessToken = '******';
            }
            if (sanitizedResponse.refreshToken) {
              sanitizedResponse.refreshToken = '******';
            }
          }
          
          // Log do tempo de resposta
          const delay = Date.now() - now;
          this.logger.log(
            `[${timestamp}] ${userId} - ${method} ${url} - ${response.statusCode} - ${delay}ms`,
          );
          
          // Log dos dados de saída (exceto em produção)
          if (process.env.NODE_ENV !== 'production') {
            this.logger.debug(
              `Response Body: ${JSON.stringify(sanitizedResponse)}`,
            );
          }
        },
        error: (error) => {
          const delay = Date.now() - now;
          this.logger.error(
            `[${timestamp}] ${userId} - ${method} ${url} - Error: ${error.message} - ${delay}ms`,
          );
        },
      }),
    );
  }
} 