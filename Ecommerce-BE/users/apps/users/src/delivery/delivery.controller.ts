import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { checkDeliveryInformationId } from 'common/constants/event.constant'
import { CurrentUser } from 'common/decorators/current_user.decorator'
import { Public } from 'common/decorators/public.decorator'
import { JwtGuard } from 'common/guards/jwt.guard'
import { CurrentUserType } from 'common/types/current.type'
import { CreateDeliveryDTO } from '../dtos/create_delivery.dto'
import { UpdateDeliveryDTO } from '../dtos/update_delivery.dto'
import { DeliveryService } from './delivery.service'
import { Roles } from 'common/decorators/roles.decorator'
import { Role } from 'common/enums/role.enum'

@Controller('delivery')
@Roles(Role.USER, Role.STORE_OWNER)
@UseGuards(JwtGuard)
export class DeliveryController {
    constructor(private readonly deliveryService: DeliveryService) {}

    @Get()
    getAllDelivery(@CurrentUser() user: CurrentUserType) {
        return this.deliveryService.getAllDelivery(user)
    }

    @Public()
    @MessagePattern(checkDeliveryInformationId)
    checkDeliveryInformationId(
        @Payload() payload: { userId: string; deliveryInformationId: string }
    ) {
        return this.deliveryService.checkDeliveryInformationId(
            payload.userId,
            payload.deliveryInformationId
        )
    }

    @Post()
    createDelivery(@CurrentUser() user: CurrentUserType, @Body() body: CreateDeliveryDTO) {
        return this.deliveryService.createDelivery(user, body)
    }

    @Put()
    updateDelivery(@CurrentUser() user: CurrentUserType, @Body() body: UpdateDeliveryDTO) {
        return this.deliveryService.updateDelivery(user, body)
    }

    @Delete(':id')
    deleteDelivery(@CurrentUser() user: CurrentUserType, @Param('id') id: string) {
        return this.deliveryService.deleteDelivery(user, id)
    }
}
