import { PrismaService } from '@app/common/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class EmployeeService {
  constructor(private readonly prisma: PrismaService) {}

  async profileDetail(userId: string) {
    return await this.prisma.user.findUnique({
      where: {
        id: userId
      }
    })
  }
}
