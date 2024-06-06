import { ConfigModule } from '@app/common'
import { Module } from '@nestjs/common'
import { ElasticsearchModule, ElasticsearchService } from '@nestjs/elasticsearch'
import { SearchController } from './search.controller'

@Module({
  imports: [ElasticsearchModule],
  controllers: [SearchController]
})
export class SearchModule {}
