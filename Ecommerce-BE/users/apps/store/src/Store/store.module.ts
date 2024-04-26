import { PrismaService } from '@app/common/prisma/prisma.service'
import { StoreController } from './store.controller'
import { StoreService } from './store.service'
import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { MulterModule } from '@nestjs/platform-express'
import multer, { diskStorage } from 'multer'
import { v4 as uuidv4 } from 'uuid'
import { ConfigModule } from '@app/common'

@Module({
  imports: [MulterModule, ConfigModule],
  controllers: [StoreController],
  providers: [JwtService, StoreService, PrismaService]
})
export class StoreModule {}
