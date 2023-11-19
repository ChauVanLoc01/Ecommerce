import { NestFactory } from '@nestjs/core'
import { ProductsModule } from './products.module'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  const app = await NestFactory.create(ProductsModule)

  const config = app.get(ConfigService)

  const port = config.get('app.port')

  try {
    await app.listen(port)
    console.info(`App running at endpoint: http://localhost:${port}`)
    console.info(`App running file .env.${config.get('app.env')}`)
  } catch (err) {
    console.log('Error', err.message)
  }

  await app.listen(3000)
}
bootstrap()
