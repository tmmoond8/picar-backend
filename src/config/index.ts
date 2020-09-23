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
};
