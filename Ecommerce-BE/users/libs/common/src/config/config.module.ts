import { Global, Module } from '@nestjs/common'
import { ConfigModule as NestConfigModule } from '@nestjs/config'
import appConfig from './data_configs/app.config'
import rabbitmqConfig from './data_configs/rabbitmq.config'
import bullqueueConfig from './data_configs/bullqueue.config'
import elasticsearchConfig from './data_configs/elasticsearch.config'

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, rabbitmqConfig, bullqueueConfig, elasticsearchConfig],
      envFilePath: [
        '.env',
        '.env.aws',
        '.env.rabbitmq',
        '.env.bullqueue',
        '.env.elasticsearch',
        `.env.${process.env.NODE_ENV}`
      ]
    })
  ]
})
export class ConfigModule {}
