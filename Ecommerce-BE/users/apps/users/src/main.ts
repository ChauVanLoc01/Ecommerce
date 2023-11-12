import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);

  // const config = app.use(ConfigService)

  // const port = Number(config.get('app.user_port')) || 3000

  await app.listen(3000);
}
bootstrap()