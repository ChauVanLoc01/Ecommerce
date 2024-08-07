import { registerAs } from '@nestjs/config'

export default registerAs('app', () => ({
    env: process.env.NODE_ENV,

    port: Number(process.env.SERVICE_APP_PORT),

    access_token_expire_time: Number(process.env.ACCESS_TOKEN_EXPIRATION_TIME),

    access_token_secret_key: process.env.ACCESS_TOKEN_SECRET_KEY,

    refresh_token_expire_time: Number(process.env.REFRESH_TOKEN_EXPIRATION_TIME),

    refresh_token_secret_key: process.env.REFRESH_TOKEN_SECRET_KEY,

    limit_default: Number(process.env.TAKE_LIMTI_DEFAULT),

    aws_s3_bucket_name: process.env.AWS_S3_NAME,

    aws_s3_region: process.env.S3_REGION,

    aws_access_key_id: process.env.ACCESS_KEY_ID,

    aws_secret_access_key: process.env.SECRET_ACCESS_KEY,

    vnp_TmnCode: process.env.vnp_TmnCode,
    vnp_HashSecret: process.env.vnp_HashSecret,
    vnp_Url: process.env.vnp_Url,
    vnp_Api: process.env.vnp_Api,
    vnp_ReturnUrl: process.env.vnp_ReturnUrll
}))
