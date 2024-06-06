import { Controller, Post, Query } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { Return } from 'common/types/result.type'
import { ProductSearchBody, ProductSearchResult } from 'common/types/search.type'
import { SearchProductQueryDTO } from './dtos/search.query.dto'

@Controller('search-product')
export class SearchController {
  index = 'product'
  constructor(private readonly searchService: ElasticsearchService) {}

  async markIndex(product: ProductSearchBody) {
    return await this.searchService.index<ProductSearchBody>({
      index: this.index,
      body: product
    })
  }

  @Post()
  async searchProductSearch(@Query() query: SearchProductQueryDTO): Promise<Return> {
    const { hits } = await this.searchService.search<ProductSearchResult>({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query: query.search,
            fields: ['name', 'description', 'shortname']
          }
        }
      }
    })

    return {
      msg: 'ok',
      result: hits.hits.map((e) => e._source)
    }
  }

  async updateProductSearch(product: ProductSearchBody) {
    const script = Object.entries(product).reduce((result, [key, value]) => {
      return `${result} ctx._source.${key}='${value}';`
    }, '')
    return await this.searchService.updateByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: product.id
          }
        },
        script: {
          source: script
        }
      }
    })
  }
}
