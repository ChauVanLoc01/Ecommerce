import { registerAs } from '@nestjs/config'

export default registerAs('rabbitmq', () => ({
  user: process.env.RABBITMQ_USER,
  password: process.env.RABBITMQ_PASSWORD,
  host: process.env.RABBITMQ_HOST,
  port: process.env.RABBITMQ_PORT,
  queue: process.env.RABBITMQ_QUEUE_NAME
}))
