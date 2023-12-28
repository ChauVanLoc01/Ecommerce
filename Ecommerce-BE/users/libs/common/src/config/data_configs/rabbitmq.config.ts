import { registerAs } from '@nestjs/config'

export default registerAs('rabbitmq', () => ({
  uri: process.env.RABBITMQ_URI,

  queue_name: process.env.QUEUE_NAME
}))
