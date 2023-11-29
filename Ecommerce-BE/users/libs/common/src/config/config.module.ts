import { Global, Module } from '@nestjs/common'
import { ConfigModule as NestConfigModule } from '@nestjs/config'
import appConfig from './data_configs/app.config'
import rabbitmqConfig from './data_configs/rabbitmq.config'

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, rabbitmqConfig],
      envFilePath: ['.env', '.env.rabbitmq', `.env.${process.env.NODE_ENV}`]
    })
  ]
})
export class ConfigModule {}
