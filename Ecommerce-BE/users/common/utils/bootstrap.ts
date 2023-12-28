import { BadRequestException, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser'
import { ValidationError } from 'class-validator'

export async function bootstrap(mainModule: any) {
  try {
    const app = await NestFactory.create(mainModule)

    const configService = app.get(ConfigService)

    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.RMQ,
      options: {
        urls: [configService.get<string>('rabbitmq.uri')],
        queue: configService.get<string>('rabbitmq.queue_name'),
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
      `App running with RMQ: ${configService.get<string>(
        'rabbitmq.uri'
      )} with ${configService.get<string>('rabbitmq.queue_name')}`
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
