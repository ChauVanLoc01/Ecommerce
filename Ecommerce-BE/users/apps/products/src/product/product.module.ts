import { Module } from '@nestjs/common'
import { ConfigModule, PrismaModule } from '@app/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config'
import { ProductService } from './product.service'
import { ProductController } from './product.controller'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { v4 as uuidv4 } from 'uuid'
import { SearchProductService } from './search-product.service'
import { ElasticsearchModule } from '@nestjs/elasticsearch'
import { JwtService } from '@nestjs/jwt'

@Module({
  imports: [
    ClientsModule.registerAsync({
      isGlobal: true,
      clients: [
        {
          name: 'USER_SERVICE',
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            transport: Transport.RMQ,
            options: {
              urls: [configService.get<string>('rabbitmq.uri')],
              queue: configService.get<string>('rabbitmq.user_queue'),
              queueOptions: {
                durable: true
              }
            }
          }),
          inject: [ConfigService]
        }
      ]
    }),
    MulterModule.register({
      storage: diskStorage({
        destination(req, file, callback) {
          callback(null, process.cwd() + '/public/images')
        },
        filename(req, file, callback) {
          callback(
            null,
            `${new Date().toISOString()}-${uuidv4()}-${file.originalname}`
          )
        }
      })
    }),
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get<string>('elasticsearch.node'),
        auth: {
          username: configService.get('elasticsearch.username'),
          password: configService.get('elasticsearch.password')
        }
      }),
      inject: [ConfigService]
    }),
    ConfigModule,
    PrismaModule
  ],

  controllers: [ProductController],
  providers: [ProductService, SearchProductService, JwtService]
})
export class ProductModule {}
