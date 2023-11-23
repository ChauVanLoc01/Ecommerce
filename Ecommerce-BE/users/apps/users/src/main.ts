import { NestFactory } from '@nestjs/core'
import { UserModule } from './users/user.module'
import { ConfigService } from '@nestjs/config'
import * as cookieParser from 'cookie-parser'
import { MicroserviceOptions } from '@nestjs/microservices'
import { Transport } from '@nestjs/microservices/enums'
import { BadRequestException, ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationError } from 'class-validator'
import { UserMainModule } from './user_main.module'

async function bootstrap() {
  try {
    const app = await NestFactory.create(UserMainModule)

    const configService = app.get(ConfigService)

    const username = configService.get('rabbitmq.user')
    const password = configService.get('rabbitmq.password')
    const hostname = configService.get('rabbitmq.host')
    const port = configService.get('rabbitmq.port')
    const queue = configService.get('rabbitmq.queue')

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

    app.enableCors()
    app.use(cookieParser())

    const config = new DocumentBuilder()
      .setTitle('Store Api')
      .setDescription('The api for store')
      .setVersion('1.0')
      .addBearerAuth()
      .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('docs', app, document)

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        exceptionFactory(errors: ValidationError[]) {
          const messages = Object.fromEntries(
            errors.map((err) => {
              return [err.property, Object.values(err.constraints)] as [
                string,
                string[]
              ]
            })
          )
          throw new BadRequestException({
            message: messages,
            error: 'Bad Request',
            statusCode: 400
          })
        }
      })
    )

    app.listen(configService.get('app.port'))

    console.log(
      `App running with RMQ: rmq:${username}:${password}@${hostname}:${port}`
    )
    console.log(
      `App running at endpoint: http://localhost:${configService.get(
        'app.port'
      )}`
    )
  } catch (err) {
    console.log('Error:::', err.message)
  }
}
bootstrap()
