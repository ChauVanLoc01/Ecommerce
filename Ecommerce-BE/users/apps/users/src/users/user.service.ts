import { PrismaService } from '@app/common/prisma/prisma.service'
import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Prisma } from '@prisma/client'
import { UserType } from 'common/constants/user.constants'
import { Role } from 'common/enums/role.enum'
import { Status } from 'common/enums/status.enum'
import { CurrentStoreType, CurrentUserType } from 'common/types/current.type'
import { MessageReturn, Return } from 'common/types/result.type'
import { QueryAllUserProfileType } from '../dtos/all_user.dto'
import { UpdateStatusOfUserDTO } from '../dtos/update_status_of_user.dto'
import { UpdateUserProfileType } from '../dtos/update_user_profile.dto'

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService
    ) {}

    async findAllUserProfile(query: QueryAllUserProfileType): Promise<Return> {
        let { end_date, search_key, limit, page, role, start_date, status } = query

        let pre_page = page
        status = [Status.ACTIVE, Status.BLOCK].includes(status as any) ? status : undefined

        const take = limit || this.configService.get<number>('app.limit')
        page = (page || 1) - 1
        const skip = page * limit

        role = role || [UserType.STORE_OWNER, UserType.USER]

        const general_user_where: Prisma.UserWhereInput = {
            role: {
                in: role
            },
            status,
            createdAt: {
                gte: start_date,
                lte: end_date
            }
        }

        const where: Prisma.UserWhereInput = {
            OR: [
                {
                    full_name: {
                        contains: search_key
                    },
                    ...general_user_where
                },
                {
                    email: {
                        contains: search_key
                    },
                    ...general_user_where
                }
            ]
        }

        const [users, count] = await Promise.all([
            this.prisma.user.findMany({
                where,
                take,
                skip,
                omit: {
                    updatedAt: true,
                    rankId: true
                }
            }),
            this.prisma.user.count({ where })
        ])

        return {
            msg: 'ok',
            result: {
                data: users,
                query: {
                    ...query,
                    page: pre_page,
                    page_size: Math.ceil(count / limit)
                }
            }
        }
    }

    async profileDetail(user: CurrentUserType): Promise<Return> {
        const userExist = await this.prisma.user.findUnique({
            where: {
                id: user.id
            }
        })

        if (!userExist) throw new NotFoundException('Người dùng không tồn tại')

        return {
            msg: 'Lấy thông tin người thành công',
            result: userExist
        }
    }

    async profileStoreDetail(user: CurrentStoreType): Promise<Return> {
        const profileExist = await this.prisma.user.findUnique({
            where: {
                id: user.userId
            }
        })

        if (!profileExist) {
            throw new BadRequestException('User không tồn tại')
        }

        return {
            msg: 'Lấy thông tin thành cônng',
            result: profileExist
        }
    }

    async userUpdateProfile(user: CurrentUserType, body: UpdateUserProfileType): Promise<Return> {
        const { birthday, email, full_name, address, image } = body

        const updatedUser = await this.prisma.user.update({
            where: {
                id: user.id
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

    async userStoreUpdateProfile(
        user: CurrentStoreType,
        body: UpdateUserProfileType
    ): Promise<Return> {
        const { birthday, email, full_name, address } = body

        const updatedUser = await this.prisma.user.update({
            where: {
                id: user.userId
            },
            data: {
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

    async updateStoreRole(userId: string, storeRoleId: string) {
        try {
            const accountExist = await this.prisma.account.findFirst({
                where: {
                    userId
                }
            })

            if (!accountExist) {
                throw new Error('Tài khoản không tồn tại')
            }

            return await this.prisma.account.update({
                where: {
                    username: accountExist.username
                },
                data: {
                    storeRoleId
                }
            })
        } catch (error) {
            return error.message
        }
    }

    async getInfoUserInRating(payload: string[]) {
        try {
            const users = await Promise.all(
                payload.map((id) =>
                    this.prisma.user.findUnique({
                        where: {
                            id,
                            role: Role.USER
                        },
                        select: {
                            full_name: true,
                            image: true
                        }
                    })
                )
            )

            return {
                msg: 'ok',
                action: true,
                result: payload.reduce((acum, e, idx) => {
                    return {
                        ...acum,
                        [e]: { ...users[idx] }
                    }
                }, {})
            }
        } catch (err) {
            return {
                msg: 'ok',
                action: false,
                result: null
            }
        }
    }

    async getProfileUser(userId: string) {
        try {
            const userExist = await this.prisma.user.findUnique({
                where: {
                    id: userId
                }
            })

            if (!userExist) {
                throw new NotFoundException('Người dùng không tồn tại')
            }

            let { email, full_name, image, id } = userExist

            return {
                msg: 'ok',
                result: {
                    email,
                    full_name,
                    image,
                    id
                }
            }
        } catch (err) {
            throw new InternalServerErrorException('Lỗi Server')
        }
    }

    async countEmployee(storeId: string): Promise<MessageReturn> {
        try {
            const count = await this.prisma.storeRole.count({
                where: {
                    role: UserType.EMPLOYEE,
                    storeId
                }
            })

            return {
                msg: 'ok',
                action: true,
                result: count
            }
        } catch (err) {
            return {
                msg: 'ok',
                action: false,
                result: null
            }
        }
    }

    async updateStatusOfUser(userId: string, body: UpdateStatusOfUserDTO): Promise<Return> {
        let { status } = body
        console.log('userId', userId)
        try {
            await this.prisma.$transaction(async (tx) => {
                const accountExist = await tx.account.findFirst({
                    where: {
                        userId
                    },
                    select: {
                        storeRoleId: true
                    }
                })

                await Promise.all([
                    tx.user.update({
                        where: {
                            id: userId
                        },
                        data: {
                            status
                        }
                    }),
                    tx.storeRole.update({
                        where: {
                            id: accountExist.storeRoleId
                        },
                        data: {
                            status
                        }
                    })
                ])
            })

            return {
                msg: 'ok',
                result: undefined
            }
        } catch (err) {
            console.log('err', err)
            throw new InternalServerErrorException('Cập nhật trạng thái người dùng thất bại')
        }
    }
}
