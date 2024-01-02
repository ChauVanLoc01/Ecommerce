import { registerAs } from '@nestjs/config'

export default registerAs('bullqueue', () => ({
  host: process.env.BULL_QUEUE_HOST,

  port: Number(process.env.BULL_QUEUE_PORT),

  my_mail: process.env.MY_MAIL,

  mail_password: process.env.MAIL_PASSWORD,

  mail_transport: process.env.MAIL_TRANSPORT,

  ttl: Number(process.env.BULL_QUEUE_TTL)
}))
