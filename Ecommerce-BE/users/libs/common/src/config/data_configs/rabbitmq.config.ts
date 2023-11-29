import { registerAs } from '@nestjs/config'

export default registerAs('rabbitmq', () => ({
  uri: process.env.RABBITMQ_URI,

  user_queue: process.env.USER_QUEUE_NAME,

  product_queue: process.env.PRODUCT_QUEUE_NAME
}))
