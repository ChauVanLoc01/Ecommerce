import { Injectable } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import {
  PostSearchBody,
  PostSearchResult
} from 'common/types/product-search.type'
import { CreateProductType } from './dtos/create-product.dto'
import { Product } from '@prisma/client'

@Injectable()
export class SearchProductService {
  index: 'products'

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async insertProduct(product: Product) {
    const { id, name, description } = product
    return this.elasticsearchService.index<PostSearchBody>({
      index: this.index,
      body: {
        id,
        name,
        description
      }
    })
  }

  async searchProduct(search: string) {
    const body = await this.elasticsearchService.search<PostSearchResult>({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query: search,
            fields: ['title', 'content']
          }
        }
      }
    })
    const hits = body.hits.hits
    return hits.map((item) => item._source)
  }

  // async update(post: Post) {
  //   const newBody: PostSearchBody = {
  //     id: post.id,
  //     title: post.title,
  //     content: post.content,
  //     authorId: post.author.id
  //   }

  //   const script = Object.entries(newBody).reduce((result, [key, value]) => {
  //     return `${result} ctx._source.${key}='${value}';`;
  //   }, '');

  //   return this.elasticsearchService.updateByQuery({
  //     index: this.index,
  //     body: {
  //       query: {
  //         match: {
  //           id: post.id,
  //         }
  //       },
  //       script: {
  //         inline: script
  //       }
  //     }
  //   })
  // }

  deleteProduct(productId: string) {
    this.elasticsearchService.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: productId
          }
        }
      }
    })
  }
}
