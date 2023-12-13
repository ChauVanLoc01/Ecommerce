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

    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.RMQ,
      options: {
        urls: [configService.get<string>('rabbitmq.uri')],
        queue: configService.get<string>('rabbitmq.user_queue'),
        queueOptions: {
          durable: true
        }
      }
    })
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

    app.startAllMicroservices()

    app.listen(configService.get('app.port'))

    console.log(
      `App running with RMQ: ${configService.get<string>('rabbitmq.uri')}`
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
