import { NestFactory } from '@nestjs/core'
import { SocketModule } from './socket.module'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
    const app = await NestFactory.create(SocketModule)

    const configService = app.get(ConfigService)

    const port = configService.get<string>('app.socket_port')

    console.log(':::::::::::::Socker Service is running in port ', port)

    await app.listen(Number(port))
}
bootstrap()
