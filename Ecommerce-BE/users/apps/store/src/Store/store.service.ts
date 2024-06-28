import { PrismaService } from '@app/common/prisma/prisma.service'
import {
    BadRequestException,
    Inject,
    Injectable,
    InternalServerErrorException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxy } from '@nestjs/microservices'
import { Store } from '@prisma/client'
import { S3 } from 'aws-sdk'
import { updateStoreRoleId } from 'common/constants/event.constant'
import { Role } from 'common/enums/role.enum'
import { Status } from 'common/enums/status.enum'
import { CurrentStoreType, CurrentUserType } from 'common/types/current.type'
import { MessageReturn, Return } from 'common/types/result.type'
import { keyBy } from 'lodash'
import { firstValueFrom } from 'rxjs'
import { v4 as uuidv4 } from 'uuid'
import { CreateStoreDTO } from './dtos/create-store.dto'
import { StoreByUserDTO } from './dtos/store-by-user.dto'
import { UpdateStoreDTO } from './dtos/update-store.dto'

@Injectable()
export class StoreService {
    constructor(
        readonly config_service: ConfigService,
        readonly prisma: PrismaService,
        @Inject('USER_SERVICE') private userClient: ClientProxy
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
        const storeList = await Promise.all(
            storeIds.map((id) =>
                this.prisma.store.findUnique({
                    where: {
                        id
                    }
                })
            )
        )
        return keyBy(storeList, 'id')
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
}
