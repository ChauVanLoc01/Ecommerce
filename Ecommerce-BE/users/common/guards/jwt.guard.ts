import {
  CanActivate,
  ExecutionContext,
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

    try {
      const payload: CurrentUserType = await this.jwtService.verifyAsync(
        token,
        {
          secret: this.configService.get<string>('app.access_token_secret_key')
        }
      )

      const { role } = payload

      const roles = this.reflector.getAllAndOverride<number[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass()
      ])

      if (roles.includes(role)) {
        return true
      }

      request['user'] = payload

      return true
    } catch (e) {
      throw new UnauthorizedException('Token không đúng')
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
