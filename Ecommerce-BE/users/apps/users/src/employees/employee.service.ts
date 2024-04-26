import { PrismaService } from '@app/common/prisma/prisma.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { Role } from 'common/enums/role.enum'
import { CurrentStoreType } from 'common/types/current.type'
import { Return } from 'common/types/result.type'
import { omit } from 'lodash'
import { UpdateEmployee } from '../dtos/update_employee.dto'
import { UpdateUserProfileDTO } from '../dtos/update_user_profile.dto'

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

  async getAll(store: CurrentStoreType): Promise<Return> {
    const employees = await this.prisma.account.findMany({
      where: {
        StoreRole: {
          storeId: store.storeId,
          role: Role.EMPLOYEE
        }
      },
      include: {
        User_Account_userIdToUser: true,
        StoreRole: true
      }
    })

    return {
      msg: 'Lấy danh sách nhân viên thành công',
      result: employees.map((emp) => {
        const { StoreRole, User_Account_userIdToUser, ...rest } = emp
        return {
          account: omit(rest, ['password']),
          profile: User_Account_userIdToUser,
          storeRole: StoreRole
        }
      })
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
