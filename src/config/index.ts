import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  api: {
    prefix: '/api',
  },
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },
  port: process.env.PORT,
  mysql: {
    username: process.env.MYSQL_USER ?? '',
    password: process.env.MYSQL_PASSWORD ?? '',
    database: process.env.MYSQL_DATABASE ?? '',
    host: process.env.MYSQL_HOST ?? '',
    port: Number(process.env.MYSQL_PORT) ?? 3306,
  },
};
