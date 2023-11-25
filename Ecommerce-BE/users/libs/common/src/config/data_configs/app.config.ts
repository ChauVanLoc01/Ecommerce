import { registerAs } from '@nestjs/config'

export default registerAs('app', () => ({
  env: Number(process.env.NODE_ENV),
  port: Number(process.env.SERVICE_APP_PORT),
  access_token_expire_time: Number(process.env.ACCESS_TOKEN_EXPIRATION_TIME),
  access_token_secret_key: Number(process.env.ACCESS_TOKEN_EXPIRATION_TIME),
  refresh_token_expire_time: Number(process.env.REFRESH_TOKEN_EXPIRATION_TIME),
  refresh_token_secret_key: Number(process.env.REFRESH_TOKEN_EXPIRATION_TIME)
}))
