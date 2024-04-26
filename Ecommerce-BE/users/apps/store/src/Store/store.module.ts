import { ConfigModule } from '@app/common'
import { PrismaService } from '@app/common/prisma/prisma.service'
import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { MulterModule } from '@nestjs/platform-express'
import { StoreController } from './store.controller'
import { StoreService } from './store.service'

@Module({
  imports: [MulterModule, ConfigModule],
  controllers: [StoreController],
  providers: [JwtService, StoreService, PrismaService]
})
export class StoreModule {}
