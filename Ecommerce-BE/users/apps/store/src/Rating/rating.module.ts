import { PrismaModule } from '@app/common'
import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { RatingController } from './rating.controller'
import { RatingService } from './rating.service'

@Module({
  imports: [PrismaModule],
  controllers: [RatingController],
  providers: [RatingService, JwtService]
})
export class RatingModule {}
