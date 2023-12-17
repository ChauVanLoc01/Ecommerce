import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { OrderMainModule } from './order_main.module'

async function bootstrap() {
  const app = await NestFactory.create(OrderMainModule)

  const configService = app.get(ConfigService)

  await app.listen(configService.get<number>('app.port'))
}
bootstrap()
