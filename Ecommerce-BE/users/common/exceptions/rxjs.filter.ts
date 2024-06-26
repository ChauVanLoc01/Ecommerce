import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { defaultIfEmpty } from 'rxjs/operators'

@Injectable()
export class RxjsDefaultValue implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(defaultIfEmpty([]))
  }
}
