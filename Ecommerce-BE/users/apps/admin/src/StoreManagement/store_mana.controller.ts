import { Controller, Get, Param, Put } from '@nestjs/common'
import { StoreManagementService } from './store_mana.service'
import { Roles } from 'common/decorators/roles.decorator'
import { Role } from 'common/enums/role.enum'

@Roles(Role.ADMIN)
@Controller()
export class StoreManagementController {
  constructor(
    private readonly storeManagementService: StoreManagementService
  ) {}

  @Get()
  analyticStore() {
    return this.storeManagementService.analyticStore()
  }

  @Put(':storeId')
  blockStore(@Param('storeId') storeId: string) {
    return this.storeManagementService.blockStore(storeId)
  }
}
