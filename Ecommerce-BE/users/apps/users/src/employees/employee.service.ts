import { PrismaService } from '@app/common/prisma/prisma.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Role } from 'common/enums/role.enum'
import { CurrentStoreType } from 'common/types/current.type'
import { Return } from 'common/types/result.type'
import { isUndefined, omitBy } from 'lodash'
import { EmployeeQueryDTO } from '../dtos/employee_query.dto'
import { UpdateEmployee } from '../dtos/update_employee.dto'
import { UpdateUserProfileDTO } from '../dtos/update_user_profile.dto'

@Injectable()
export class EmployeeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  async profileDetail(userId: string) {
    return await this.prisma.user.findUnique({
      where: {
        id: userId
      }
    })
  }

  async getAll(store: CurrentStoreType, query: EmployeeQueryDTO): Promise<Return> {
    const { createdAt, end_date, limit, page, start_date, status } = query
    const take = limit | this.configService.get('app.limit_default')

    const [length, employees] = await Promise.all([
      this.prisma.account.count({
        where: {
          StoreRole: {
            storeId: store.storeId,
            role: Role.EMPLOYEE
          }
        }
      }),
      this.prisma.account.findMany({
        where: {
          StoreRole: {
            storeId: store.storeId,
            role: Role.EMPLOYEE,
            status
          },
          createdAt: {
            gte: start_date,
            lte: end_date
          }
        },
        orderBy: {
          createdAt
        },
        include: {
          StoreRole: true,
          User_Account_userIdToUser: true
        },
        take,
        skip: page && page > 1 ? (page - 1) * take : 0
      })
    ])

    return {
      msg: 'Lấy danh sách nhân viên thành công',
      result: {
        data: employees,
        query: omitBy(
          {
            ...query,
            page: page || 1,
            page_size: Math.ceil(length / take)
          },
          isUndefined
        )
      }
    }
  }

  async updateStatus(store: CurrentStoreType, body: UpdateEmployee): Promise<Return> {
    const { status, employeeId } = body

    const employeeExist = await this.prisma.user.findUnique({
      where: {
        id: employeeId
      }
    })

    if (!employeeExist) {
      throw new NotFoundException('Nhân viên không tồn tại')
    }

    const [updatedUser, _] = await this.prisma.$transaction([
      this.prisma.user.update({
        where: {
          id: employeeId
        },
        data: {
          status
        }
      }),
      this.prisma.storeRole.update({
        where: {
          id: store.storeRoleId
        },
        data: {
          status
        }
      })
    ])

    return {
      msg: 'Cập nhật trạng thái nhân viên thành công',
      result: updatedUser
    }
  }

  async employeeUpdateProfile(store: CurrentStoreType, body: UpdateUserProfileDTO) {
    const { birthday, email, full_name, address, image } = body

    const updatedUser = await this.prisma.user.update({
      where: {
        id: store.userId
      },
      data: {
        image,
        birthday,
        email,
        full_name,
        address
      }
    })

    return {
      msg: 'Cập nhật thành công',
      result: updatedUser
    }
  }
}
