import { NestFactory } from '@nestjs/core'
import { UserModule } from './user.module'
import { ConfigService } from '@nestjs/config'
import * as cookieParser from 'cookie-parser'
import { MicroserviceOptions } from '@nestjs/microservices'
import { Transport } from '@nestjs/microservices/enums'

async function bootstrap() {
  try {
    const app = await NestFactory.create(UserModule)

    const configService = app.get(ConfigService)

    const username = configService.get('rabbitmq.user')
    const password = configService.get('rabbitmq.password')
    const hostname = configService.get('rabbitmq.host')
    const port = configService.get('rabbitmq.port')
    const queue = configService.get('rabbitmq.queue')

    app.use(cookieParser())

    await NestFactory.createMicroservice<MicroserviceOptions>(UserModule, {
      transport: Transport.RMQ,
      options: {
        urls: [
          {
            username,
            password,
            hostname,
            port
          }
        ],
        queue,
        queueOptions: {
          durable: false
        }
      }
    })

    app.startAllMicroservices()

    console.log(
      `App running with RMQ: rmq:${username}:${password}@${hostname}:${port}`
    )
  } catch (err) {
    console.log('Error:::', err.message)
  }
}
bootstrap()
