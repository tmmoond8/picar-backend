import 'reflect-metadata';
import { createConnection } from 'typeorm';
import config from '../config';
import entities from '../entity';

export default async () =>
  await createConnection({
    ...config.db,
    entities,
    synchronize: true,
    extra: {
      charset: 'utf8mb4',
    },
  });
