import { PrismaService } from '@app/common/prisma/prisma.service'
import { StoreController } from './store.controller'
import { StoreService } from './store.service'
import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { v4 as uuidv4 } from 'uuid'

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination(req, file, callback) {
          callback(null, process.cwd() + '/public/images')
        },
        filename(req, file, callback) {
          callback(null, `${Date.now()}${uuidv4()}${file.originalname}`)
        }
      })
    })
  ],
  controllers: [StoreController],
  providers: [JwtService, StoreService, PrismaService]
})
export class StoreModule {}
