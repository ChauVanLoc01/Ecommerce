import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    HttpException,
    Injectable,
    UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { PUBLIC_KEY } from 'common/decorators/public.decorator'
import { ROLES_KEY } from 'common/decorators/roles.decorator'
import { CurrentUserType } from 'common/types/current.type'
import { Request } from 'express'

@Injectable()
export class JwtGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector,
        private readonly configService: ConfigService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request = context.switchToHttp().getRequest()

            const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
                context.getHandler(),
                context.getClass()
            ])

            if (isPublic) {
                return true
            }

            const token = this.extractTokenFromHeader(request)

            if (!token) {
                throw new UnauthorizedException('Token không tồn tại')
            }

            const payload: CurrentUserType = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('app.access_token_secret_key')
            })

            const { role } = payload

            const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass()
            ])

            if (roles && !roles.includes(role)) {
                throw new ForbiddenException('Không có quyền truy cập tài nguyên')
            }

            request['user'] = payload

            return true
        } catch (err) {
            throw new HttpException(err.message, err.statusCode)
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? []
        return type === 'Bearer' ? token : undefined
    }
}
