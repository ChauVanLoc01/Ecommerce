import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { PrismaModule } from '@app/common/prisma/prisma.module'
import { ConfigModule } from '@app/common'
import { UserController } from './user.controller'

@Module({
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
