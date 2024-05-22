import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'common/decorators/current_user.decorator'
import { PaginationDTO } from 'common/decorators/pagination.dto'
import { Public } from 'common/decorators/public.decorator'
import { Roles } from 'common/decorators/roles.decorator'
import { Role } from 'common/enums/role.enum'
import { JwtGuard } from 'common/guards/jwt.guard'
import { CurrentStoreType, CurrentUserType } from 'common/types/current.type'
import { CreateRatingDto } from './dtos/create-rating.dto'
import { RatingQueryDTO } from './dtos/rating-query.dto'
import { RatingService } from './rating.service'
import { CreateReplyRatingDTO } from './dtos/reply-rating.dto'

@UseGuards(JwtGuard)
@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Roles(Role.USER)
  @Post()
  createNewRating(@CurrentUser() user: CurrentUserType, @Body() body: CreateRatingDto) {
    return this.ratingService.createNewRating(user, body)
  }

  @Roles(Role.STORE_OWNER, Role.EMPLOYEE)
  @Post('reply')
  updateRating(@CurrentUser() store: CurrentStoreType, @Body() body: CreateReplyRatingDTO) {
    return this.ratingService.replyRating(store, body)
  }

  @Roles(Role.STORE_OWNER, Role.EMPLOYEE)
  @Get('store-rating')
  getAllRatingByStore(@CurrentUser() store: CurrentStoreType, @Query() query: RatingQueryDTO) {
    return this.ratingService.getAllRatingByStore(store, query)
  }

  @Public()
  @Get('product-rating/:productId')
  getAllRatingByProduct(@Param('productId') productId: string, @Query() query: PaginationDTO) {
    return this.ratingService.getAllRatingByProduct(productId, query)
  }

  @Public()
  @Get(':ratingId')
  getDetail(@Param('ratingId') ratingId: string) {
    return this.ratingService.getDetail(ratingId)
  }
}
