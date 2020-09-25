import 'reflect-metadata';
import { createConnection } from 'typeorm';
import config from '../config';
import entities from '../entity';

export default async () =>
  await createConnection({
    ...config.mysql,
    entities,
    type: 'mysql',
    synchronize: true,
  });
