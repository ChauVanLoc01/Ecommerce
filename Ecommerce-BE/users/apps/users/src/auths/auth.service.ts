import { PrismaService } from '@app/common/prisma/prisma.service'
import { InjectQueue } from '@nestjs/bull'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import {
    BadRequestException,
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { ClientProxy } from '@nestjs/microservices'
import { Account, User } from '@prisma/client'
import * as bcrypt from 'bcryptjs'
import { Queue } from 'bull'
import { Cache } from 'cache-manager'
import { BackgroundAction, BackgroundName } from 'common/constants/background-job.constant'
import { Role } from 'common/enums/role.enum'
import { Status } from 'common/enums/status.enum'
import { CurrentStoreType, CurrentUserType } from 'common/types/current.type'
import { Return } from 'common/types/result.type'
import { omit } from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import { ChangePasswordType } from '../dtos/change_password.dto'
import { RegisterDTO } from '../dtos/register.dto'
import { ResetPasswordType as ResetPasswordDTOType } from '../dtos/reset_password.dto'
import { ResetPasswordForEmployee } from '../dtos/reset_password_for_employee.dto'
import { SendOtpType } from '../dtos/sendOTP.dto'
import { EmailInfor, PasswordData, ResetPasswordType } from '../workers/mail.worker'

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
        @InjectQueue(BackgroundName.mail) private sendMailQueue: Queue,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        @Inject('STORE_SERVICE') private storeClient: ClientProxy
    ) {}

    createAccessToken(data: CurrentUserType | CurrentStoreType): Promise<string> {
        return this.jwtService.signAsync(data, {
            secret: this.configService.get<string>('app.access_token_secret_key'),
            expiresIn: this.configService.get<number>('app.access_token_expire_time')
        })
    }

    createRefreshToken(data: CurrentUserType | CurrentStoreType): Promise<string> {
        return this.jwtService.signAsync(data, {
            secret: this.configService.get<string>('app.refresh_token_secret_key'),
            expiresIn: this.configService.get<number>('app.refresh_token_expire_time')
        })
    }

    hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10)
    }

    comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash)
    }

    async verify(username: string, password: string): Promise<Account> {
        const accountExist = await this.prisma.account.findUnique({
            where: {
                username
            }
        })

        if (!accountExist) {
            throw new UnauthorizedException('Tài khoản không tồn tại')
        }

        const isTruePassword = await this.comparePassword(password, accountExist.password)

        if (!isTruePassword) {
            throw new UnauthorizedException('Mật khẩu không đúng')
        }
        return accountExist
    }

    async validateUser(
        username: string,
        password: string
    ): Promise<User & { storeRoleId: string }> {
        const { userId, storeRoleId } = await this.verify(username, password)

        const userExist = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (userExist.status === Status.BLOCK) {
            throw new UnauthorizedException('Tài khoản đã bị khóa')
        }

        if ([Role.EMPLOYEE, Role.ADMIN].includes(userExist.role as any)) {
            throw new UnauthorizedException('Tài khoản không được phép mua hàng')
        }

        return {
            ...userExist,
            storeRoleId
        }
    }

    async validateStore(username: string, password: string): Promise<CurrentStoreType> {
        const accountExist = await this.verify(username, password)

        if (!accountExist.storeRoleId) {
            throw new ForbiddenException('Tài khoản không có quyền truy cập tài nguyên')
        }

        const { storeId, id, role } = await this.prisma.storeRole.findUnique({
            where: {
                id: accountExist.storeRoleId
            }
        })

        if (!storeId) {
            throw new ForbiddenException('Không có quyền truy cập tài nguyên')
        }

        const [{ id: userId }, store] = await Promise.all([
            this.prisma.user.findUnique({
                where: {
                    id: accountExist.userId
                }
            }),
            this.prisma.store.findUnique({
                where: {
                    id: storeId
                }
            })
        ])

        if (!store) {
            throw new UnauthorizedException('Cửa hàng không tồn tại')
        }

        return {
            role,
            storeId,
            userId,
            storeRoleId: id
        }
    }

    async userLogin(user: CurrentUserType): Promise<Return> {
        const [access_token, refresh_token] = await Promise.all([
            this.createAccessToken(user),
            this.createRefreshToken(user)
        ])

        const userExist = await this.prisma.user.findUnique({
            where: {
                id: user.id
            }
        })

        return {
            msg: 'Đăng nhập thành công',
            result: {
                user: {
                    ...userExist,
                    storeRoleId: user.storeRoleId ?? undefined
                },
                access_token: `Bearer ${access_token}`,
                refresh_token: `Bearer ${refresh_token}`
            }
        }
    }

    async userRegister(registerDto: RegisterDTO): Promise<Return> {
        const { email, password, username, full_name } = registerDto

        const accountExist = await this.prisma.account.findUnique({
            where: {
                username
            }
        })

        if (accountExist) {
            throw new BadRequestException('User name đã tồn tại')
        }

        const [{ createdAt, status, ...rest }, { storeRoleId }] = await this.prisma.$transaction(
            async (tx) => {
                const userId = uuidv4()
                const [userCreated, accountCreated] = await Promise.all([
                    tx.user.create({
                        data: {
                            id: userId,
                            email,
                            role: Role.USER,
                            status: Status.ACTIVE,
                            full_name
                        }
                    }),
                    tx.account.create({
                        data: {
                            username,
                            password: await this.hashPassword(password),
                            userId: userId
                        }
                    })
                ])
                return [userCreated, accountCreated]
            }
        )

        const current_user = {
            id: rest.id,
            role: rest.role,
            storeRoleId
        } as CurrentUserType

        const [access_token, refresh_token] = await Promise.all([
            this.createAccessToken(current_user),
            this.createRefreshToken(current_user)
        ])

        this.sendMailQueue.add(
            BackgroundAction.register,
            {
                to: email,
                subject: 'Chúc mừng bạn đã đăng kí tài khoản thành công',
                html: `<p>Xin chào người dùng ${full_name}. Chúc bạn có trải nghiệm mua sắm thật tuyệt vời</p>`
            } as EmailInfor,
            {
                removeOnComplete: true
            }
        )

        return {
            msg: 'Đăng kí tài khoản thành công',
            result: {
                user: rest,
                access_token: `Bearer ${access_token}`,
                refresh_token: `Bearer ${refresh_token}`
            }
        }
    }

    async storeLogin(user: CurrentStoreType): Promise<Return> {
        const [access_token, refresh_token] = await Promise.all([
            this.createAccessToken(user),
            this.createRefreshToken(user)
        ])

        const [user_profile, store] = await Promise.all([
            this.prisma.user.findUnique({
                where: {
                    id: user.userId
                }
            }),
            this.prisma.store.findUnique({
                where: {
                    id: user.storeId
                }
            })
        ])

        return {
            msg: 'Đăng nhập cửa hàng thành công',
            result: {
                user,
                store: {
                    ...store,
                    role: user.role
                },
                access_token: `Bearer ${access_token}`,
                refresh_token: `Bearer ${refresh_token}`
            }
        }
    }

    async employeeRegister(currentStore: CurrentStoreType, body: RegisterDTO): Promise<Return> {
        try {
            const { email, full_name, password, username } = body

            const accountExist = await this.prisma.account.findUnique({
                where: {
                    username
                }
            })

            if (accountExist) {
                throw new BadRequestException('User name đã tồn tại')
            }

            const [createdUser, createdStoreRole, createdAccount] = await this.prisma.$transaction(
                async (tx) => {
                    const userId = uuidv4()
                    const storeRoleId = uuidv4()

                    const [createdUser, createdStoreRole, createdAccount] = await Promise.all([
                        tx.user.create({
                            data: {
                                email,
                                full_name,
                                id: userId,
                                role: Role.EMPLOYEE,
                                status: Status.ACTIVE
                            }
                        }),
                        tx.storeRole.create({
                            data: {
                                id: storeRoleId,
                                storeId: currentStore.storeId,
                                status: Status.ACTIVE,
                                role: Role.EMPLOYEE,
                                createdBy: currentStore.userId
                            }
                        }),
                        tx.account.create({
                            data: {
                                username,
                                password: await this.hashPassword(password),
                                userId: userId,
                                storeRoleId: storeRoleId,
                                createdBy: currentStore.userId
                            }
                        })
                    ])

                    return [createdUser, createdStoreRole, createdAccount]
                }
            )

            return {
                msg: 'Tạo tài khoản thành công',
                result: {
                    user: createdUser,
                    storeRole: createdStoreRole,
                    account: omit(createdAccount, ['password'])
                }
            }
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async resetPasswordForEmployee(
        store: CurrentStoreType,
        body: ResetPasswordForEmployee
    ): Promise<Return> {
        const employeeExist = await this.prisma.user.findUnique({
            where: {
                id: body.employeeId,
                role: Role.EMPLOYEE
            }
        })

        if (!employeeExist) {
            throw new NotFoundException('Nhân viên không tồn tại')
        }

        const accountExist = await this.prisma.account.findFirst({
            where: {
                userId: body.employeeId,
                StoreRole: {
                    storeId: store.storeId
                }
            }
        })

        if (!accountExist) {
            throw new NotFoundException('Tài khoản không tồn tại')
        }

        const updatedAccount = await this.prisma.account.update({
            where: {
                username: accountExist.username
            },
            data: {
                username: body.username,
                password: await this.hashPassword(body.password)
            }
        })

        return {
            msg: 'Reset mật khẩu thành công',
            result: omit(updatedAccount, ['password'])
        }
    }

    async changePassword(user: CurrentUserType, body: ChangePasswordType): Promise<Return> {
        const { current_password, new_password } = body

        if (current_password === new_password) {
            throw new BadRequestException('Mật khẩu mới phải khác mật khẩu cũ')
        }

        const accountExist = await this.prisma.account.findFirst({
            where: {
                userId: user.id
            }
        })

        if (!accountExist) throw new BadRequestException('Tải khoản không tồn tại')

        if (!(await this.comparePassword(current_password, accountExist.password))) {
            throw new BadRequestException('Mật khẩu hiện tại không đúng')
        }

        const { password, ...rest } = await this.prisma.account.update({
            where: {
                username: accountExist.username
            },
            data: {
                password: await this.hashPassword(new_password),
                updatedAt: new Date(),
                updatedBy: user.id
            }
        })

        return {
            msg: 'Thay đổi mật khẩu thành công',
            result: rest
        }
    }

    async sendOtp({ email, new_password }: SendOtpType): Promise<Return> {
        const userExist = await this.prisma.user.findFirst({
            where: {
                email
            },
            include: {
                Account_Account_userIdToUser: true
            }
        })

        if (!userExist) {
            throw new UnauthorizedException('Người dùng không tồn tại')
        }

        const code = Math.floor(100000 + Math.random() * 900000)

        const email_infor: EmailInfor = {
            html: `<div>Mã xác nhận làm mới mật khẩu của bạn là: <p style="color: red">${code}</p>. Vui lòng không cung cấp mã xác nhận cho bất kỳ ai.</div>`,
            subject: 'Thay đổi mật khẩu khẩn cấp',
            to: email
        }

        this.sendMailQueue.add(BackgroundAction.forgetPassword, {
            code,
            username: userExist.Account_Account_userIdToUser[0].username,
            new_password,
            email_infor
        } as ResetPasswordType)

        return {
            msg: 'Vui lòng kiểm tra email để nhận mã xác nhận',
            result: undefined
        }
    }

    async resetPassword({ code }: ResetPasswordDTOType): Promise<Return> {
        const { username, new_password }: PasswordData = await this.cacheManager.get(
            `${code}_RESET_PASSWORD`
        )

        if (!code) {
            throw new BadRequestException('Mã xác nhận không đúng hoặc đã hết hạn')
        }

        const { password, ...rest } = await this.prisma.account.update({
            where: {
                username
            },
            data: {
                password: await this.hashPassword(new_password),
                updatedAt: new Date().toISOString()
            }
        })

        return {
            msg: 'Thay đổi mật khẩu thành công',
            result: rest
        }
    }
}
