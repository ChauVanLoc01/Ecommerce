import { registerAs } from '@nestjs/config'

export default registerAs('app', () => ({
  env: process.env.NODE_ENV,
  port: process.env.SERVICE_APP_PORT,
  access_token_expire_time: process.env.ACCESS_TOKEN_EXPIRATION_TIME,
  refresh_token_expire_time: process.env.REFRESH_TOKEN_EXPIRATION_TIME
}))
