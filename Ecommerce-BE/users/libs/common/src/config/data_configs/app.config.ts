import { registerAs } from "@nestjs/config";

export default registerAs('app', () => ({
    user_port: process.env.DATABASE_USER_PORT || 30001,
    product_port: process.env.DATABASE_PRODUCT_PORT || 3002
  }));