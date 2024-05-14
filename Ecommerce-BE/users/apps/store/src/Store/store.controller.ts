import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Request,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { checkStoreExist, getStoreDetail } from 'common/constants/event.constant'
import { CurrentUser } from 'common/decorators/current_user.decorator'
import { Public } from 'common/decorators/public.decorator'
import { Roles } from 'common/decorators/roles.decorator'
import { Role } from 'common/enums/role.enum'
import { JwtGuard } from 'common/guards/jwt.guard'
import { CurrentStoreType, CurrentUserType } from 'common/types/current.type'
import { CreateStoreDTO } from './dtos/create-store.dto'
import { UpdateStoreDTO } from './dtos/update-store.dto'
import { StoreService } from './store.service'

@UseGuards(JwtGuard)
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Public()
  @Post('upload-single-file')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        exceptionFactory(_) {
          throw new BadRequestException('File phải có kiểu là image/* và tối đa 5MB')
        },
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({ fileType: 'image/*' })
        ],
        fileIsRequired: true
      })
    )
    file: Express.Multer.File,
    @Request() req: Express.Request
  ) {
    return this.storeService.upload(file, req)
  }

  @Public()
  @Post('upload-multiple-file')
  @UseInterceptors(FilesInterceptor('files', 10))
  uploadMultipleFile(
    @UploadedFiles(
      new ParseFilePipe({
        exceptionFactory(_) {
          throw new BadRequestException('File phải có kiểu là image/* và tối đa 5MB')
        },
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({ fileType: 'image/*' })
        ],
        fileIsRequired: true
      })
    )
    files: Array<Express.Multer.File>,
    @Request() req: Express.Request
  ) {
    return this.storeService.uploadMultipleFile(files, req)
  }

  @UseInterceptors(FileInterceptor('image'))
  @Roles(Role.USER)
  @Post('register')
  registerStore(@CurrentUser() user: CurrentUserType, @Body() body: CreateStoreDTO) {
    return this.storeService.registerStore(user, body)
  }

  @UseInterceptors(FileInterceptor('image'))
  @Roles(Role.STORE_OWNER)
  @Put('update')
  updateStore(
    @CurrentUser() user: CurrentStoreType,
    @Body() body: UpdateStoreDTO,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'image/*' }),
          new MaxFileSizeValidator({ maxSize: 5000000 })
        ],
        exceptionFactory(error) {
          throw new BadRequestException(
            'File tải lên phải có kiểu image/* và dung lượng maxmimum 5MB'
          )
        },
        fileIsRequired: false
      })
    )
    file: Express.Multer.File
  ) {
    return this.storeService.updateStore(user, body, file?.filename)
  }

  @MessagePattern(checkStoreExist)
  @Public()
  checkStoreExist(@Payload() payload: string[]) {
    return this.storeService.checkStoreExist(payload)
  }

  @MessagePattern(getStoreDetail)
  @Public()
  getStoresDetailWithMP(@Payload() payload: string[]) {
    return this.storeService.getStoresDetail(payload)
  }

  @Get(':storeId')
  getStoreDetail(@Param('storeId') storeId: string) {
    return this.storeService.getStoreDetail(storeId)
  }
}
