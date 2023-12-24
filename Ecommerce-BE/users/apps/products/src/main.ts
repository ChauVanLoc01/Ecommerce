import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { ProductModule } from './product/product.module'

async function bootstrap() {
  const app = await NestFactory.create(ProductModule)

  const configService = app.get(ConfigService)

  try {
    await app.listen(configService.get<number>('app.port'))

    console.info(`App running at endpoint: http://localhost:${3002}`)

    console.info(`App running file .env.${configService.get('app.env')}`)
  } catch (err) {
    console.log('Error', err.message)
  }
}
bootstrap()
