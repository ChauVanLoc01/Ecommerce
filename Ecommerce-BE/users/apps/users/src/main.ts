import { NestFactory } from '@nestjs/core'
import { UserModule } from './user.module'
import { ConfigService } from '@nestjs/config'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(UserModule)

  const config = app.get(ConfigService)

  const port = config.get('app.port')

  app.use(cookieParser())

  try {
    await app.listen(port)
    console.info(`App running at endpoint: http://localhost:${port}`)
    console.info(`App running file .env.${config.get('app.env')}`)
  } catch (err) {
    console.log('Error', err.message)
  }
}
bootstrap()
