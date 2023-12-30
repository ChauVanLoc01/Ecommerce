import { registerAs } from '@nestjs/config'

export default registerAs('app', () => ({
  env: process.env.NODE_ENV,

  port: Number(process.env.SERVICE_APP_PORT),

  access_token_expire_time: Number(process.env.ACCESS_TOKEN_EXPIRATION_TIME),

  access_token_secret_key: process.env.ACCESS_TOKEN_SECRET_KEY,

  refresh_token_expire_time: Number(process.env.REFRESH_TOKEN_EXPIRATION_TIME),

  refresh_token_secret_key: process.env.REFRESH_TOKEN_SECRET_KEY,

  limit_default: Number(process.env.TAKE_LIMTI_DEFAULT)
}))
