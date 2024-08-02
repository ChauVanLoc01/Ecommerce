import { PrismaService } from '@app/common/prisma/prisma.service'
import {
    BadRequestException,
    Inject,
    Injectable,
    InternalServerErrorException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxy } from '@nestjs/microservices'
import { Prisma, Store } from '@prisma/client'
import { S3 } from 'aws-sdk'
import {
    countEmployee,
    countProduct,
    updateStatusOfStore,
    updateStoreRoleId
} from 'common/constants/event.constant'
import { Role } from 'common/enums/role.enum'
import { Status } from 'common/enums/status.enum'
import { CurrentStoreType, CurrentUserType } from 'common/types/current.type'
import { MessageReturn, Return } from 'common/types/result.type'
import {
    eachDayOfInterval,
    eachMonthOfInterval,
    eachWeekOfInterval,
    endOfDay,
    endOfMonth,
    endOfWeek,
    sub
} from 'date-fns'
import { keyBy } from 'lodash'
import { firstValueFrom } from 'rxjs'
import { v4 as uuidv4 } from 'uuid'
import { AllStoreQueryDTO } from './dtos/all-store.dto'
import { CreateStoreDTO } from './dtos/create-store.dto'
import { StoreByUserDTO } from './dtos/store-by-user.dto'
import { UpdateStatusOfStoreDTO, UpdateStoreDTO } from './dtos/update-store.dto'
import { UserViewStoreDTO } from './dtos/view-store.dto'

@Injectable()
export class StoreService {
    constructor(
        readonly config_service: ConfigService,
        readonly prisma: PrismaService,
        @Inject('USER_SERVICE') private userClient: ClientProxy,
        @Inject('PRODUCT_SERVICE') private productClient: ClientProxy
    ) {}

    async upload(file: Express.Multer.File, req: Express.Request): Promise<Return> {
        try {
            const { originalname } = file
            const bucketS3 = this.config_service.get('app.aws_s3_bucket_name')
            const result = await this.uploadS3(
                req.file.buffer,
                bucketS3,
                `${uuidv4()}_${originalname}`
            )

            return {
                msg: 'Upload file thành công',
                result: result.Location
            }
        } catch (err) {
            console.log('uploadFileError', err)
            throw new BadRequestException('Lỗi upload file')
        }
    }
    async uploadMultipleFile(files: Express.Multer.File[], req: Express.Request): Promise<Return> {
        try {
            const bucketS3 = this.config_service.get('app.aws_s3_bucket_name')
            const result = await Promise.all(
                files.map((file) =>
                    this.uploadS3(file.buffer, bucketS3, `${uuidv4()}_${file.originalname}`)
                )
            )
            return {
                msg: 'Upload file thành công',
                result: result.map((e) => e.Location)
            }
        } catch (err) {
            throw new BadRequestException('Lỗi upload file')
        }
    }

    async uploadS3(file: Buffer, bucket: string, name: string) {
        const s3 = this.getS3()
        return s3
            .upload({
                Bucket: bucket,
                Key: name,
                Body: file
            })
            .promise()
    }

    getS3() {
        return new S3({
            accessKeyId: this.config_service.get('app.aws_access_key_id'),
            secretAccessKey: this.config_service.get('app.aws_secret_access_key'),
            region: this.config_service.get('app.aws_s3_region')
        })
    }

    async registerStore(user: CurrentUserType, body: CreateStoreDTO): Promise<Return> {
        const { id } = user

        const { name, description, location, image } = body

        const accountExist = await this.prisma.account.findFirst({
            where: {
                userId: id
            }
        })

        if (accountExist.storeRoleId) {
            throw new BadRequestException('Tối đa 1 cửa hàng cho 1 tài khoản')
        }

        const [createdStoreId, createdStoreRoleId] = [uuidv4(), uuidv4()]

        const [createdStore, createdStoreRole] = await this.prisma.$transaction(async (tx) => {
            return await Promise.all([
                tx.store.create({
                    data: {
                        id: createdStoreId,
                        image,
                        name,
                        location,
                        status: Status.ACTIVE,
                        createdBy: id,
                        description
                    }
                }),
                tx.storeRole.create({
                    data: {
                        id: createdStoreRoleId,
                        role: Role.STORE_OWNER,
                        status: Status.ACTIVE,
                        createdBy: id,
                        storeId: createdStoreId
                    }
                })
            ])
        })

        const resultUpdatedStoreRoleId = await firstValueFrom(
            this.userClient.send(updateStoreRoleId, {
                userId: id,
                storeRoleId: createdStoreRole.id
            })
        )

        if (typeof resultUpdatedStoreRoleId === 'string') {
            await Promise.all([
                this.prisma.store.delete({
                    where: {
                        id: createdStore.id
                    }
                }),
                this.prisma.storeRole.delete({
                    where: {
                        id: createdStoreRole.id
                    }
                })
            ])
            throw new InternalServerErrorException(resultUpdatedStoreRoleId)
        }

        return {
            msg: 'Tạo cửa hàng thành công',
            result: createdStore
        }
    }

    async viewStore(body: UserViewStoreDTO) {
        await this.prisma.userViewStore.create({
            data: {
                id: uuidv4(),
                userId: body.userId,
                storeId: body.storeId,
                createdAt: new Date()
            }
        })
    }

    async countUserViewStore(store: CurrentStoreType, type: string) {
        const { storeId } = store
        let time_wheres: Prisma.UserViewStoreWhereInput[] = []
        var end, start
        var times = []
        var tmp: { start: Date; end: Date }[] = []
        switch (type) {
            case 'day':
                end = new Date()
                start = sub(end, { days: 7 })
                times = eachDayOfInterval({ start, end })
                time_wheres = times.map((day) => {
                    let gte = day
                    let lte = endOfDay(day)
                    tmp.push({ start: gte, end: lte })
                    return {
                        createdAt: {
                            gte,
                            lte
                        }
                    }
                })
                break
            case 'week':
                end = new Date()
                start = sub(end, { weeks: 7 })
                times = eachWeekOfInterval({ start, end }, { weekStartsOn: 1 })
                time_wheres = times.map((day) => {
                    let gte = day
                    let lte = endOfWeek(day)
                    tmp.push({ start: gte, end: lte })
                    return {
                        createdAt: {
                            gte,
                            lte
                        }
                    }
                })
                break
            case 'month':
                end = new Date()
                start = sub(end, { months: 12 })
                times = eachMonthOfInterval({ start, end })
                time_wheres = times.map((day) => {
                    let gte = day
                    let lte = endOfMonth(day)
                    tmp.push({ start: gte, end: lte })
                    return {
                        createdAt: {
                            gte,
                            lte
                        }
                    }
                })
                break
            default:
                break
        }
        let result = await Promise.all(
            time_wheres.map(async (time_where, idx) => {
                let list = await this.prisma.userViewStore.findMany({
                    where: {
                        ...time_where,
                        storeId
                    },
                    select: {
                        userId: true
                    }
                })
                return { ...tmp[idx], list }
            })
        )
        return {
            msg: 'ok',
            result
        }
    }

    async updateStore(
        user: CurrentStoreType,
        body: UpdateStoreDTO,
        file_name: string
    ): Promise<Return> {
        const { storeId } = user

        const { name, description, location } = body

        const updatedStore = await this.prisma.store.update({
            where: {
                id: storeId
            },
            data: {
                name,
                description,
                location,
                image: file_name
            }
        })

        return {
            msg: 'Cập nhật cửa hàng thành công',
            result: updatedStore
        }
    }

    async checkStoreExist(storesId: string[]): Promise<MessageReturn> {
        const storeExist = await Promise.all(
            storesId.map((storeId) =>
                this.prisma.store.findUnique({
                    where: {
                        id: storeId
                    }
                })
            )
        )

        if (!storeExist.every(Boolean)) {
            return {
                msg: 'Cửa hàng không tồn tại',
                action: false,
                result: null
            }
        }

        return {
            msg: 'ok',
            action: true,
            result: null
        }
    }

    async getStoresDetail(storeIds: string[]) {
        try {
            const storeList = await Promise.all(
                storeIds.map((id) =>
                    this.prisma.store.findUnique({
                        where: {
                            id,
                            status: Status.ACTIVE
                        }
                    })
                )
            )
            return {
                msg: 'ok',
                action: true,
                result: keyBy(storeList, 'id')
            }
        } catch (err) {
            return {
                msg: 'Lỗi lấy data từ store',
                action: false,
                result: null
            }
        }
    }

    async getStoreDetail(storeId: string): Promise<Return> {
        return {
            msg: 'Lấy thông tin cửa hàng thành công',
            result: await this.prisma.store.findUnique({
                where: {
                    id: storeId
                }
            })
        }
    }

    async getStoreByUser(body: StoreByUserDTO): Promise<Return> {
        const stores = await Promise.all(body.storesId.map((id) => this.findStoreUnique(id)))

        return {
            msg: 'ok',
            result: body.storesId.reduce<Record<string, Store>>(
                (acum, storeId, idx) => ({ ...acum, [storeId]: stores[idx] }),
                {}
            )
        }
    }

    async findStoreUnique(id: string): Promise<Store> {
        try {
            const store = await this.prisma.store.findUnique({
                where: {
                    id,
                    status: Status.ACTIVE
                }
            })

            if (!store) {
                return undefined
            }

            return store
        } catch (err) {
            throw new BadRequestException('Lỗi Server')
        }
    }

    async getAllStore(query: AllStoreQueryDTO) {
        let { end_date, search_key, limit, page, start_date, status } = query

        let pre_page = page
        status = [Status.ACTIVE, Status.BLOCK].includes(status as any) ? status : undefined

        const take = limit || this.config_service.get<number>('app.limit')
        page = (page || 1) - 1
        const skip = page * limit

        const general_user_where: Prisma.StoreWhereInput = {
            createdAt: {
                gte: start_date,
                lte: end_date
            },
            status
        }

        const where: Prisma.StoreWhereInput = {
            OR: [
                {
                    name: {
                        contains: search_key
                    },
                    ...general_user_where
                },
                {
                    location: {
                        contains: search_key
                    },
                    ...general_user_where
                }
            ]
        }

        console.log('where', JSON.stringify(where))

        const [stores, count] = await Promise.all([
            this.prisma.store.findMany({
                where,
                take,
                skip
            }),
            this.prisma.store.count({ where })
        ])

        console.log('stores', stores)

        return {
            msg: 'ok',
            result: {
                data: stores,
                query: {
                    ...query,
                    page: pre_page,
                    page_size: Math.ceil(count / limit)
                }
            }
        }
    }

    async getStoreDetailByAdmin(storeId: string): Promise<Return> {
        const [employee_count, product_count] = await Promise.all([
            firstValueFrom(this.userClient.send<MessageReturn>(countEmployee, storeId)),
            firstValueFrom(this.productClient.send<MessageReturn>(countProduct, storeId))
        ])

        return {
            msg: 'ok',
            result: {
                employee_count: employee_count.result || 0,
                product_count: product_count.result || 0
            }
        }
    }

    async updateStatusOfStore(storeId: string, body: UpdateStatusOfStoreDTO): Promise<Return> {
        let { status } = body
        try {
            await this.prisma.$transaction(async (tx) => {
                const update_user = await firstValueFrom(
                    this.userClient.send<MessageReturn>(updateStatusOfStore, { storeId, status })
                )

                if (!update_user.action) {
                    throw new Error('Cập nhật phía người dùng thất bại')
                }

                await tx.store.update({
                    where: {
                        id: storeId
                    },
                    data: {
                        status
                    }
                })
            })
            return {
                msg: 'ok',
                result: undefined
            }
        } catch (err) {
            throw new BadRequestException('Cập nhật trạng thái thất bại')
        }
    }

    async isThereStore(userId: string): Promise<Return> {
        const store_exist = await this.prisma.store.findFirst({
            where: {
                createdBy: userId,
                status: Status.ACTIVE
            },
            select: {
                name: true,
                image: true,
                id: true,
                location: true
            }
        })

        return {
            msg: 'ok',
            result: store_exist
        }
    }
}
