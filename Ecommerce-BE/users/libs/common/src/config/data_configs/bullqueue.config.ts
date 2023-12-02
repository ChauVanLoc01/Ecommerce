import { registerAs } from '@nestjs/config'

export default registerAs('bullqueue', () => ({
  host: process.env.BULL_QUEUE_HOST,

  port: process.env.BULL_QUEUE_PORT
}))
