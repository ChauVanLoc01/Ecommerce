import { registerAs } from '@nestjs/config'
import { concatEnv } from 'common/utils/helper'

const rabbitmq_key = 'rabbitmq'

const concatRabbitmmq = concatEnv(rabbitmq_key)

export default registerAs(rabbitmq_key, () => ({
  uri: process.env.RABBITMQ_URI,

  queue_name: process.env.QUEUE_NAME
}))

export const RabbitmqEnv = {
  uri: concatRabbitmmq('uri'),

  queue_name: concatRabbitmmq('queue_name')
}
