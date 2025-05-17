import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

interface DataBaseConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  type: any;
}

export default {
  api: {
    prefix: '/api',
  },
  version: '0.1.0',
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },
  port: process.env.PORT,
  db: {
    username: process.env.DB_USER ?? '',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_DATABASE ?? '',
    host: process.env.DB_HOST ?? '',
    port: Number(process.env.DB_PORT) ?? 3306,
    type: process.env.DB_TYPE ?? 'mysql',
  } as DataBaseConfig,
  isDev: process.env.NODE_ENV !== 'production',
  adminKey: process.env.ADMIN_KEY ?? '',
  auth: {
    naverClientId: process.env.NAVER_CLIENT_ID ?? '',
    naverClientSecret: process.env.NAVER_CLIENT_SECRET ?? '',
  },
};
