import { Global, Module } from '@nestjs/common'
import { ConfigModule as NestConfigModule } from '@nestjs/config'
import appConfig from './data_configs/app.config'

@Global()
@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: ['.env']
    })
  ]
})
export class ConfigModule {}
