import { ConfigModule } from '@app/common'
import { PrismaService } from '@app/common/prisma/prisma.service'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ElasticsearchModule } from '@nestjs/elasticsearch'
import { SearchController } from './search.controller'

@Module({
  imports: [
    ConfigModule,
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get<string>('elasticsearch.node'),
        auth: {
          username: configService.get<string>('elasticsearch.username'),
          password: configService.get<string>('elasticsearch.password')
        }
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [SearchController],
  providers: [PrismaService]
})
export class SearchModule {}
