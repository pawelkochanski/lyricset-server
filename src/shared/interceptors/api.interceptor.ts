import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ApiInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map(response => {
      switch (response.data.message.header.status_code) {
        case  200:
          return response.data.message.body;
        case 400:
          throw new HttpException('invalid request', HttpStatus.BAD_REQUEST);
        case 401:
          throw new HttpException('auth failed', HttpStatus.INTERNAL_SERVER_ERROR);
        case 402:
          throw new HttpException('usage limit', HttpStatus.PAYMENT_REQUIRED);
        case 404:
          throw new HttpException('resource not found', HttpStatus.NOT_FOUND);
        case 405:
          throw new HttpException('method not found', HttpStatus.NOT_FOUND);
        default:
          throw new HttpException('something were wrong', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }));
  }
}
