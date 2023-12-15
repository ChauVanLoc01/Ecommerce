import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { map } from 'rxjs'

@Injectable()
export class ProductService {
  constructor(
    @Inject('USER_SERVICE') private readonly user_service: ClientProxy
  ) {}

  getHello() {
    return this.user_service
      .send('test', {})
      .pipe(map((res) => res + ' in here'))
  }
}
